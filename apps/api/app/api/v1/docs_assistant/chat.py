from fastapi import APIRouter, Header, HTTPException, Request

from app.core.shared.limiter import limiter
from app.core.utils import make_namespace
from app.schemas.documents import ChatResponse
from app.services.docs_assistant.generator import generate_response

router = APIRouter()


@router.post("/documents/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat(
    request: Request,
    query: str,
    session_id: str = Header(alias="X-Session-ID"),
):
    try:
        namespace = make_namespace(session_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail="Invalid session ID") from error
    answer = generate_response(query, namespace)

    return {"answer": answer}
