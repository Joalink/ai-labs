from app.core.config import settings
from app.core.shared.llm import client


def create_embedding(chunks: list[str]):

    response = client.embeddings.create(model=settings.EMBEDDING_MODEL, input=chunks)

    return [item.embedding for item in response.data]
