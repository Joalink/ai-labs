from app.core.shared.limiter import limiter
from app.services.docs_assistant.generator import generate_response
from fastapi import APIRouter, Request

router = APIRouter()


@router.post("/chat")
@limiter.limit("20/minute")
async def chat(request: Request, query: str):
    client_ip = request.client.host
    namespace = f"ip-{client_ip.replace('.', '-').replace(':', '-')}"
    print(query)
    print(namespace)
    answer = generate_response(query, namespace)

    return {"answer": answer}
