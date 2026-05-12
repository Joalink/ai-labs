from app.core.config import settings
from app.core.shared.pinecone_service import index
from app.services.docs_assistant.embedder import create_embedding


def retrieve(query: str, namespace: str):
    vector = create_embedding(query)

    results = index.query(
        vector=vector, top_k=settings.TOP_K, include_metadata=True, namespace=namespace
    )
    return [match["metadata"]["text"] for match in results["matches"]]
