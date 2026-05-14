from app.core.shared.pinecone_service import index
from fastapi import APIRouter, Request

router = APIRouter()


@router.delete("/session")
async def clear_session(request: Request):
    client_ip = request.client.host
    namespace = f"ip-{client_ip.replace('.', '-').replace(':', '-')}"
    try:
        index.delete(delete_all=True, namespace=namespace)
    except Exception:
        pass
    return {"message": "Session cleared"}
