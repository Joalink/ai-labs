from io import BytesIO

import httpx
from app.core.config import settings
from app.models.receipt import Receipt
from app.repositories.receipt import get_receipt_by_id, get_receipts, save_receipt
from app.schemas.receipt import PredictionResponse
from PIL import Image
from sqlalchemy.orm import Session

DETECTION_API_URL = settings.DETECTION_API_URL


def process_image(
    image: Image.Image,
    filename: str,
    confidence: float,
    db: Session,
) -> PredictionResponse:

    buffer = BytesIO()
    image.save(buffer, format="JPEG")
    buffer.seek(0)

    response = httpx.post(
        f"{DETECTION_API_URL}/predict",
        files={"file": (filename, buffer, "image/jpeg")},
        params={"confidence": confidence},
        timeout=30,
    )
    response.raise_for_status()
    result = response.json()

    save_receipt(db, filename, result["detections"], confidence)

    return PredictionResponse(
        success=True,
        total_detections=result["total_detections"],
        detections=result["detections"],
    )


def fetch_all(db: Session, limit: int) -> list[Receipt]:
    return get_receipts(db, limit)


def fetch_by_id(db: Session, receipt_id: int) -> Receipt | None:
    return get_receipt_by_id(db, receipt_id)
