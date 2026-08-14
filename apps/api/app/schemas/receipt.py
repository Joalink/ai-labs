from datetime import date, datetime

from pydantic import BaseModel


class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class Detection(BaseModel):
    class_id: int
    class_name: str
    confidence: float
    bbox: BoundingBox


class PredictionResponse(BaseModel):
    success: bool
    total_detections: int
    detections: list[Detection]


class ReceiptLineItem(BaseModel):
    description: str | None = None
    quantity: float | None = None
    unit_price: float | None = None
    total_price: float | None = None
    category: str | None = None
    confidence: float | None = None


class ReceiptStructuredData(BaseModel):
    merchant: str | None = None
    receipt_date: date | None = None
    line_items: list[ReceiptLineItem] | None = None
    subtotal: float | None = None
    tax: float | None = None
    total: float | None = None
    currency: str | None = None


class MonthlyReceiptAnalytics(BaseModel):
    month: str
    total_spend: float
    purchase_count: int
    average_receipt: float
    category_totals: dict[str, float]
    product_totals: dict[str, float]
    product_quantities: dict[str, float]
    purchase_days: dict[str, int]


class ReceiptRecord(BaseModel):
    id: int
    filename: str
    total_detections: int
    detections: list[Detection]
    confidence_threshold: float
    merchant: str | None = None
    receipt_date: date | None = None
    line_items: list[ReceiptLineItem] | None = None
    subtotal: float | None = None
    tax: float | None = None
    total: float | None = None
    currency: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
