from app.core.database import Base
from sqlalchemy import JSON, Column, DateTime, Float, Integer, String
from sqlalchemy.sql import func


class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    total_detections = Column(Integer, nullable=False)
    detections = Column(JSON, nullable=False)
    confidence_threshold = Column(Float, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
