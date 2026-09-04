from unittest.mock import Mock

from app.services.docs_assistant import retriever


def test_retrieve_queries_pinecone_with_a_flat_vector(monkeypatch):
    index = Mock()
    index.query.return_value = {
        "matches": [
            {
                "metadata": {
                    "text": "RAG retrieves context.",
                    "filename": "guide.pdf",
                    "document_id": "document-id-1",
                },
                "score": 0.9,
            }
        ]
    }
    monkeypatch.setattr(retriever, "create_embedding", lambda _: [[0.1, 0.2]])
    monkeypatch.setattr(retriever, "index", index)

    result = retriever.retrieve("What is RAG?", "session-123")

    index.query.assert_called_once_with(
        vector=[0.1, 0.2],
        top_k=(
            retriever.settings.TOP_K * retriever.settings.RERANK_CANDIDATE_MULTIPLIER
        ),
        include_metadata=True,
        namespace="session-123",
    )

    assert result == {
        "contexts": ["RAG retrieves context."],
        "filename": "guide.pdf",
        "sources": [
            {
                "document_id": "document-id-1",
                "filename": "guide.pdf",
                "text": "RAG retrieves context.",
                "vector_score": 0.9,
                "rerank_score": 1,
            }
        ],
    }


def test_rerank_promotes_lexically_relevant_candidates():
    matches = [
        {
            "metadata": {"text": "A generic overview.", "filename": "a.pdf"},
            "score": 0.9,
        },
        {
            "metadata": {
                "text": "Photosynthesis uses sunlight and water.",
                "filename": "b.pdf",
            },
            "score": 0.7,
        },
    ]

    reranked = retriever.rerank_matches("What does photosynthesis use?", matches)

    assert reranked[0]["metadata"]["filename"] == "b.pdf"


def test_retrieve_filters_to_selected_documents(monkeypatch):
    index = Mock()
    index.query.return_value = {"matches": []}
    monkeypatch.setattr(retriever, "create_embedding", lambda _: [[0.1, 0.2]])
    monkeypatch.setattr(retriever, "index", index)

    retriever.retrieve(
        "What is RAG?",
        "session-123",
        ["document-id-1", "document-id-2"],
    )

    assert index.query.call_args.kwargs["filter"] == {
        "document_id": {"$in": ["document-id-1", "document-id-2"]}
    }
