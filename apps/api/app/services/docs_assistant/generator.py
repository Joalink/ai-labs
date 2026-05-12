from app.core.config import settings
from app.core.shared.llm import client
from app.services.docs_assistant.retriever import retrieve


def generate_response(query: str, namespace: str):
    contexts = retrieve(query, namespace)
    context_text = "\n\n".join(contexts)
    prompt = f"""
    Answer the question using the context below.

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

    return response.choices[0].message.content
