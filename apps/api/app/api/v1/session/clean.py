import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.shared.pinecone_service import index
from app.core.utils import make_namespace
from app.schemas.documents import SessionCleanupResponse
from app.services.docs_assistant.session_store import clear_session_data

router = APIRouter()
logger = logging.getLogger(__name__)


class SessionDelete(BaseModel):
    session_id: str


@router.delete("/session/clean", response_model=SessionCleanupResponse)
async def clean_session(body: SessionDelete):
    try:
        namespace = make_namespace(body.session_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail="Invalid session ID") from error

    try:
        index.delete(delete_all=True, namespace=namespace)
    except Exception as error:
        logger.exception("Failed to clear document session %s", namespace)
        raise HTTPException(
            status_code=502, detail="Failed to clear document session"
        ) from error

    clear_session_data(namespace)
    return {"message": "Session cleared"}
