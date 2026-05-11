from app.services.docs_assistant.generator import generate_response
from fastapi import APIRouter

router = APIRouter()


@router.post("/chat")
async def chat(query: str):
    answer = generate_response(query)

    return {"answer": answer}
