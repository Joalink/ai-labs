import time

from app.core.config import settings
from app.core.shared.llm import client

EMBEDDING_CACHE_TTL_SECONDS = 3600
embedding_cache: dict[tuple[str, tuple[str, ...]], tuple[float, list[list[float]]]] = {}


def create_embedding(chunks: str | list[str]) -> list[list[float]]:
    inputs = (chunks,) if isinstance(chunks, str) else tuple(chunks)
    cache_key = (settings.EMBEDDING_MODEL, inputs)
    cached = embedding_cache.get(cache_key)
    if cached and cached[0] > time.monotonic():
        return cached[1]

    response = client.embeddings.create(model=settings.EMBEDDING_MODEL, input=chunks)
    embeddings = [item.embedding for item in response.data]
    embedding_cache[cache_key] = (
        time.monotonic() + EMBEDDING_CACHE_TTL_SECONDS,
        embeddings,
    )

    return embeddings
