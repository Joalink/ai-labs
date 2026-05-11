from app.api.v1.docs_assistant.chat import router as chat_router
from app.api.v1.docs_assistant.documents import router as documents_router
from app.api.v1.health import router as health_router
from fastapi import APIRouter

api_router = APIRouter(prefix="/api/v1")


api_router.include_router(health_router, tags=["health"])
api_router.include_router(chat_router, tags=["documents"])
api_router.include_router(documents_router, tags=["documents"])
