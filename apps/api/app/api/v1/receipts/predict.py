import io

from app.core.database import get_db
from app.schemas.receipt import PredictionResponse
from app.services.receipts.prediction import process_image
from fastapi import APIRouter, Depends, File, Header, HTTPException, UploadFile
from PIL import Image
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/receipts/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(...),
    confidence: float = 0.5,
    db: Session = Depends(get_db),
    session_id: str = Header(alias="X-Session-ID"),
) -> PredictionResponse:

    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only JPEG and PNG supported")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        result = process_image(image, file.filename, confidence, db, session_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
