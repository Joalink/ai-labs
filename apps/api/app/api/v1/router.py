from app.api.v1.docs_assistant.chat import router as chat_router
from app.api.v1.docs_assistant.documents import router as documents_router
from app.api.v1.docs_assistant.session import router as session_router
from app.api.v1.health import router as health_router
from app.api.v1.meeting.summarize import router as summarize_router
from app.api.v1.meeting.transcribe import router as transcriber_router
from fastapi import APIRouter

api_router = APIRouter(prefix="/api/v1")


api_router.include_router(health_router, tags=["health"])
api_router.include_router(chat_router, tags=["documents"])
api_router.include_router(documents_router, tags=["documents"])
api_router.include_router(session_router, tags=["session"])
api_router.include_router(transcriber_router, tags=["transcriber"])
api_router.include_router(summarize_router, tags=["summarize"])
