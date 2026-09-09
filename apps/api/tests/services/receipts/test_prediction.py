from pathlib import Path
from unittest.mock import Mock, patch

from PIL import Image
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.models.receipt import Receipt
from app.services.receipts.prediction import process_image


def make_session():
    engine = create_engine("sqlite://")
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine)()


@patch("app.services.receipts.prediction.httpx.post")
def test_prediction_persists_provider_structured_data(mock_post, tmp_path, monkeypatch):
    mock_response = Mock()
    mock_response.json.return_value = {
        "total_detections": 1,
        "detections": [
            {
                "class_id": 7,
                "class_name": "TotalPrice",
                "confidence": 0.99,
                "bbox": {"x1": 1, "y1": 1, "x2": 2, "y2": 2},
            }
        ],
        "structured_data": {
            "merchant": "Corner Store",
            "receipt_date": "2026-08-13",
            "line_items": [{"description": "Coffee", "quantity": 2}],
            "total": 7.7,
            "currency": "USD",
        },
    }
    mock_post.return_value = mock_response
    session = make_session()
    monkeypatch.chdir(tmp_path)

    prediction = process_image(
        Image.new("RGB", (1, 1)), "receipt.jpg", 0.5, session, "session-test"
    )

    saved_receipt = session.query(Receipt).one()
    assert prediction.total_detections == 1
    assert saved_receipt.merchant == "Corner Store"
    assert saved_receipt.line_items == [
        {
            "description": "Coffee",
            "quantity": 2,
            "unit_price": None,
            "total_price": None,
            "category": None,
            "confidence": None,
        }
    ]
    assert saved_receipt.total == 7.7
    assert saved_receipt.session_id == "session-test"
    assert saved_receipt.image_expires_at is not None
    assert Path(saved_receipt.image_path).is_file()
