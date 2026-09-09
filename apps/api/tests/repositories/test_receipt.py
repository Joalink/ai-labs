from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.repositories.receipt import get_receipts, save_receipt
from app.schemas.receipt import ReceiptLineItem, ReceiptStructuredData
from app.services.receipts.prediction import get_monthly_analytics


def make_session():
    engine = create_engine("sqlite://")
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine)()


def test_save_receipt_persists_optional_structured_fields():
    session = make_session()
    structured_data = ReceiptStructuredData(
        merchant="Corner Store",
        receipt_date="2026-08-13",
        line_items=[
            ReceiptLineItem(
                description="Coffee", quantity=2, unit_price=3.5, total_price=7
            )
        ],
        subtotal=7,
        tax=0.7,
        total=7.7,
        currency="USD",
    )

    receipt = save_receipt(
        session,
        "receipt.jpg",
        [{"class_name": "TotalPrice"}],
        0.5,
        structured_data,
    )

    assert receipt.merchant == "Corner Store"
    assert receipt.line_items == [
        {
            "description": "Coffee",
            "quantity": 2,
            "unit_price": 3.5,
            "total_price": 7,
            "category": None,
            "confidence": None,
        }
    ]
    assert get_receipts(session) == [receipt]


def test_save_receipt_keeps_structured_fields_empty_when_not_extracted():
    session = make_session()

    receipt = save_receipt(session, "receipt.jpg", [{"class_name": "Title"}], 0.5)

    assert receipt.merchant is None
    assert receipt.line_items is None
    assert receipt.total is None


def test_monthly_analytics_aggregates_totals_and_categories():
    session = make_session()
    save_receipt(
        session,
        "first.jpg",
        [],
        0.5,
        ReceiptStructuredData(
            receipt_date="2026-08-01",
            total=10,
            line_items=[
                ReceiptLineItem(
                    description="Coffee", category="Food", quantity=2, total_price=10
                )
            ],
        ),
    )
    save_receipt(
        session,
        "second.jpg",
        [],
        0.5,
        ReceiptStructuredData(
            receipt_date="2026-08-15",
            total=20,
            line_items=[
                ReceiptLineItem(
                    description="Coffee", category="Food", quantity=1, total_price=5
                ),
                ReceiptLineItem(
                    description="Soap", category="Home", quantity=3, total_price=15
                ),
            ],
        ),
    )

    analytics = get_monthly_analytics(session, "2026-08")

    assert analytics.total_spend == 30
    assert analytics.purchase_count == 2
    assert analytics.average_receipt == 15
    assert analytics.category_totals == {"Food": 15, "Home": 15}
    assert analytics.product_totals == {"Coffee": 15, "Soap": 15}
    assert analytics.product_quantities == {"Coffee": 3, "Soap": 3}
    assert analytics.purchase_days == {"2026-08-01": 1, "2026-08-15": 1}
