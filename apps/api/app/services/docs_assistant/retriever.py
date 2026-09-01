import re

from app.core.config import settings
from app.core.shared.pinecone_service import index
from app.services.docs_assistant.embedder import create_embedding


def lexical_score(query: str, text: str) -> int:
    query_terms = set(re.findall(r"[a-z0-9]+", query.casefold()))
    text_terms = re.findall(r"[a-z0-9]+", text.casefold())
    return sum(text_terms.count(term) for term in query_terms)


def rerank_matches(query: str, matches: list[dict]) -> list[dict]:
    return sorted(
        matches,
        key=lambda match: (
            -lexical_score(query, match["metadata"]["text"]),
            -match.get("score", 0),
        ),
    )


def retrieve(
    query: str, namespace: str, document_names: list[str] | None = None
) -> dict:
    vector = create_embedding(query)[0]

    query_options = {
        "vector": vector,
        "top_k": settings.TOP_K * settings.RERANK_CANDIDATE_MULTIPLIER,
        "include_metadata": True,
        "namespace": namespace,
    }
    if document_names:
        query_options["filter"] = {"filename": {"$in": document_names}}

    results = index.query(**query_options)
    matches = rerank_matches(query, results["matches"])[: settings.TOP_K]
    return {
        "contexts": [match["metadata"]["text"] for match in matches],
        "filename": (matches[0]["metadata"].get("filename") if matches else None),
        "sources": [
            {
                "filename": match["metadata"].get("filename"),
                "text": match["metadata"]["text"],
                "vector_score": match.get("score"),
                "rerank_score": lexical_score(query, match["metadata"]["text"]),
            }
            for match in matches
        ],
    }
