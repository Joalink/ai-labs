from app.core.config import settings
from app.core.shared.pinecone_service import index
from app.services.docs_assistant.embedder import create_embedding


def retrieve(query: str, namespace: str) -> dict:
    vector = create_embedding(query)[0]

    results = index.query(
        vector=vector, top_k=settings.TOP_K, include_metadata=True, namespace=namespace
    )
    return {
        "contexts": [m["metadata"]["text"] for m in results["matches"]],
        "filename": (
            results["matches"][0]["metadata"].get("filename")
            if results["matches"]
            else None
        ),
    }
