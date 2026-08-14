from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.receipt import MonthlyReceiptAnalytics, ReceiptRecord
from app.services.receipts.prediction import fetch_all, get_monthly_analytics

router = APIRouter()


@router.get("/receipts/predictions", response_model=list[ReceiptRecord])
def list_predictions(
    limit: int = 10,
    db: Session = Depends(get_db),  # noqa: B008
):
    try:
        return fetch_all(db, limit)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/receipts/analytics/monthly", response_model=MonthlyReceiptAnalytics)
def monthly_analytics(month: str, db: Session = Depends(get_db)):  # noqa: B008
    try:
        return get_monthly_analytics(db, month)
    except ValueError as error:
        raise HTTPException(status_code=400, detail="Invalid month") from error
