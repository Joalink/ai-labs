from app.core.shared.limiter import limiter
from app.core.utils import get_client_ip, make_namespace
from app.services.docs_assistant.generator import generate_response
from fastapi import APIRouter, Request

router = APIRouter()


@router.post("/documents/chat")
@limiter.limit("20/minute")
async def chat(request: Request, query: str):
    client_ip = get_client_ip(request)
    namespace = make_namespace(client_ip)
    answer = generate_response(query, namespace)

    return {"answer": answer}
