from datetime import datetime

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


class ReceiptRecord(BaseModel):
    id: int
    filename: str
    total_detections: int
    detections: list[Detection]
    confidence_threshold: float
    created_at: datetime

    class ConfigDict:
        from_attributes = True
