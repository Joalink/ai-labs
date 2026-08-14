from datetime import date

from sqlalchemy.orm import Session

from app.models.receipt import Receipt
from app.schemas.receipt import ReceiptStructuredData


def save_receipt(
    db: Session,
    filename: str,
    detections: list[dict],
    confidence: float,
    structured_data: ReceiptStructuredData | None = None,
    image_path: str | None = None,
    session_id: str | None = None,
    image_expires_at=None,
) -> Receipt:
    record = Receipt(
        filename=filename,
        total_detections=len(detections),
        detections=detections,
        confidence_threshold=confidence,
        merchant=structured_data.merchant if structured_data else None,
        receipt_date=structured_data.receipt_date if structured_data else None,
        line_items=(
            [item.model_dump() for item in structured_data.line_items]
            if structured_data and structured_data.line_items
            else None
        ),
        subtotal=structured_data.subtotal if structured_data else None,
        tax=structured_data.tax if structured_data else None,
        total=structured_data.total if structured_data else None,
        currency=structured_data.currency if structured_data else None,
        image_path=image_path,
        session_id=session_id,
        image_expires_at=image_expires_at,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_receipts(db: Session, limit: int = 10) -> list[Receipt]:
    return db.query(Receipt).order_by(Receipt.created_at.desc()).limit(limit).all()


def get_receipt_by_id(db: Session, receipt_id: int) -> Receipt | None:
    return db.query(Receipt).filter(Receipt.id == receipt_id).first()


def get_monthly_receipts(db: Session, start: date, end: date) -> list[Receipt]:
    return (
        db.query(Receipt)
        .filter(Receipt.receipt_date >= start, Receipt.receipt_date < end)
        .order_by(Receipt.receipt_date.desc())
        .all()
    )
