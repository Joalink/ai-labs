from datetime import UTC, datetime
from pathlib import Path

from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.receipt import get_receipt_by_id

router = APIRouter()


@router.get("/receipts/{receipt_id}/image")
def preview_receipt_image(
    receipt_id: int,
    session_id: str = Header(alias="X-Session-ID"),
    db: Session = Depends(get_db),
):
    receipt = get_receipt_by_id(db, receipt_id)
    if not receipt or receipt.session_id != session_id or not receipt.image_path:
        raise HTTPException(status_code=404, detail="Receipt image not found")
    if receipt.image_expires_at and receipt.image_expires_at.replace(
        tzinfo=UTC
    ) <= datetime.now(UTC):
        Path(receipt.image_path).unlink(missing_ok=True)
        raise HTTPException(status_code=410, detail="Receipt image has expired")
    return FileResponse(receipt.image_path, media_type="image/jpeg")
