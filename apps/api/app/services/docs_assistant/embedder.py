from app.core.config import settings
from app.core.shared.llm import client


def create_embedding(chunks: str | list[str]) -> list[list[float]]:
    response = client.embeddings.create(model=settings.EMBEDDING_MODEL, input=chunks)

    return [i.embedding for i in response.data]
