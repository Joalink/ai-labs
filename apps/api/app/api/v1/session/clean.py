from app.core.shared.pinecone_service import index
from app.core.utils import get_client_ip, make_namespace
from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter()


class SessionDelete(BaseModel):
    namespace: str | None = None


@router.delete("/session")
async def clean_session(body: SessionDelete, request: Request):
    try:
        if body.namespace:
            namespace = body.namespace
        else:
            client_ip = get_client_ip(request)
            namespace = make_namespace(client_ip)

            index.delete(delete_all=True, namespace=namespace)
    except Exception:
        pass
    return {"message": "Session cleared"}
