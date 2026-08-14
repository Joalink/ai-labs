from sqlalchemy import JSON, Column, Date, DateTime, Float, Integer, String
from sqlalchemy.sql import func

from app.core.database import Base


class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    total_detections = Column(Integer, nullable=False)
    detections = Column(JSON, nullable=False)
    confidence_threshold = Column(Float, nullable=False)
    merchant = Column(String, nullable=True)
    receipt_date = Column(Date, nullable=True)
    line_items = Column(JSON, nullable=True)
    subtotal = Column(Float, nullable=True)
    tax = Column(Float, nullable=True)
    total = Column(Float, nullable=True)
    currency = Column(String(3), nullable=True)
    image_path = Column(String, nullable=True)
    session_id = Column(String, nullable=True, index=True)
    image_expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
