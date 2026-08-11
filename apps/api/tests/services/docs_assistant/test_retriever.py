from unittest.mock import Mock

from app.services.docs_assistant import retriever


def test_retrieve_queries_pinecone_with_a_flat_vector(monkeypatch):
    index = Mock()
    index.query.return_value = {
        "matches": [
            {"metadata": {"text": "RAG retrieves context.", "filename": "guide.pdf"}}
        ]
    }
    monkeypatch.setattr(retriever, "create_embedding", lambda _: [[0.1, 0.2]])
    monkeypatch.setattr(retriever, "index", index)

    result = retriever.retrieve("What is RAG?", "session-123")

    index.query.assert_called_once_with(
        vector=[0.1, 0.2],
        top_k=retriever.settings.TOP_K,
        include_metadata=True,
        namespace="session-123",
    )
    assert result == {
        "contexts": ["RAG retrieves context."],
        "filename": "guide.pdf",
    }
