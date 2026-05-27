from app.api.v1.docs_assistant.chat import router as documents_chat_router
from app.api.v1.docs_assistant.upload import router as documents_upload_router
from app.api.v1.health import router as health_router
from app.api.v1.meeting.analyze import router as meeting_analyze_router
from app.api.v1.session.clean import router as session_clean_router
from fastapi import APIRouter

api_router = APIRouter(prefix="/api/v1")


api_router.include_router(health_router, tags=["health"])
api_router.include_router(documents_chat_router, tags=["documents"])
api_router.include_router(documents_upload_router, tags=["documents"])
api_router.include_router(session_clean_router, tags=["session"])
api_router.include_router(meeting_analyze_router, tags=["meeting"])
