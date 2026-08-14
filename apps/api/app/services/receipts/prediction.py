from datetime import date
from io import BytesIO

import httpx
from PIL import Image
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.receipt import Receipt
from app.repositories.receipt import (
    get_monthly_receipts,
    get_receipt_by_id,
    get_receipts,
    save_receipt,
)
from app.schemas.receipt import (
    MonthlyReceiptAnalytics,
    PredictionResponse,
    ReceiptStructuredData,
)

RECEIPT_DETECTION_API_URL = settings.RECEIPT_DETECTION_API_URL


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
        f"{RECEIPT_DETECTION_API_URL}/predict",
        files={"file": (filename, buffer, "image/jpeg")},
        params={"confidence": confidence},
        timeout=30,
    )
    response.raise_for_status()
    result = response.json()

    structured_data = ReceiptStructuredData.model_validate(
        result.get("structured_data", {})
    )
    prediction = PredictionResponse(
        success=True,
        total_detections=result["total_detections"],
        detections=result["detections"],
    )
    save_receipt(
        db,
        filename,
        [detection.model_dump() for detection in prediction.detections],
        confidence,
        structured_data,
    )
    return prediction


def fetch_all(db: Session, limit: int) -> list[Receipt]:
    return get_receipts(db, limit)


def fetch_by_id(db: Session, receipt_id: int) -> Receipt | None:
    return get_receipt_by_id(db, receipt_id)


def get_monthly_analytics(db: Session, month: str) -> MonthlyReceiptAnalytics:
    year, month_number = (int(part) for part in month.split("-"))
    start = date(year, month_number, 1)
    end = (
        date(year + 1, 1, 1) if month_number == 12 else date(year, month_number + 1, 1)
    )
    receipts = get_monthly_receipts(db, start, end)
    totals = [receipt.total for receipt in receipts if receipt.total is not None]
    category_totals: dict[str, float] = {}
    product_totals: dict[str, float] = {}
    product_quantities: dict[str, float] = {}
    purchase_days: dict[str, int] = {}

    for receipt in receipts:
        if receipt.receipt_date:
            day = receipt.receipt_date.isoformat()
            purchase_days[day] = purchase_days.get(day, 0) + 1
        for item in receipt.line_items or []:
            category = item.get("category") or "Uncategorized"
            amount = item.get("total_price")
            if amount is not None:
                category_totals[category] = category_totals.get(category, 0) + amount
            product = item.get("description")
            if product and amount is not None:
                product_totals[product] = product_totals.get(product, 0) + amount
            if product and item.get("quantity") is not None:
                product_quantities[product] = (
                    product_quantities.get(product, 0) + item["quantity"]
                )

    total_spend = sum(totals)
    return MonthlyReceiptAnalytics(
        month=month,
        total_spend=total_spend,
        purchase_count=len(receipts),
        average_receipt=total_spend / len(totals) if totals else 0,
        category_totals=category_totals,
        product_totals=product_totals,
        product_quantities=product_quantities,
        purchase_days=purchase_days,
    )
