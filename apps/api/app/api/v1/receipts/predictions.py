from app.core.database import get_db
from app.schemas.receipt import ReceiptRecord
from app.services.receipts.prediction import fetch_all
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/predictions", response_model=list[ReceiptRecord])
def list_predictions(
    limit: int = 10,
    db: Session = Depends(get_db),
):
    try:
        return fetch_all(db, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
