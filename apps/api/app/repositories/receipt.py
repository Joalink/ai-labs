from app.models.receipt import Receipt
from sqlalchemy.orm import Session


def save_receipt(
    db: Session,
    filename: str,
    detections: list[dict],
    confidence: float,
) -> Receipt:
    record = Receipt(
        filename=filename,
        total_detections=len(detections),
        detections=detections,
        confidence_threshold=confidence,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_receipts(db: Session, limit: int = 10) -> list[Receipt]:
    return db.query(Receipt).order_by(Receipt.created_at.desc()).limit(limit).all()


def get_receipt_by_id(db: Session, receipt_id: int) -> Receipt | None:
    return db.query(Receipt).filter(Receipt.id == receipt_id).first()
