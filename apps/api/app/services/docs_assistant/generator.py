from app.core.config import settings
from app.core.shared.llm import client
from app.services.docs_assistant.retriever import retrieve
from app.services.docs_assistant.session_store import (
    add_turn,
    cache_query,
    get_cached_query,
    get_memory,
)


def generate_response(
    query: str, namespace: str, document_ids: list[str] | None = None
) -> dict:
    cached = get_cached_query(namespace, query, document_ids)
    if cached:
        return cached

    result = retrieve(query, namespace, document_ids)
    contexts = result["contexts"]
    if not contexts:
        response = {
            "answer": "I could not find enough context in the selected documents to answer that.",
            "status": "insufficient_context",
            "sources": [],
        }
        cache_query(namespace, query, document_ids, response)
        return response

    context_text = "\n\n".join(contexts)
    history = "\n".join(
        f"Question: {previous_query}\nAnswer: {previous_answer}"
        for previous_query, previous_answer in get_memory(namespace)
    )

    prompt = f"""
    You are answering questions about selected documents.
    Answer the question using the context below.
    If the context does not support an answer, say so clearly.
    Recent conversation:
    {history or "No prior conversation."}
    Context:
    {context_text}
    Question:
    {query}
    """

    response = client.chat.completions.create(
        model=settings.LLM_MODEL,
        max_tokens=settings.MAX_TOKENS,
        messages=[{"role": "user", "content": prompt}],
    )

    result = {
        "answer": response.choices[0].message.content,
        "status": "grounded",
        "sources": [
            {
                "document_id": source["document_id"],
                "filename": source["filename"],
                "snippet": source["text"][:280],
                "vector_score": source["vector_score"],
                "rerank_score": source["rerank_score"],
            }
            for source in result["sources"]
        ],
    }
    add_turn(namespace, query, result["answer"])
    cache_query(namespace, query, document_ids, result)
    return result
