from unittest.mock import Mock, patch

from app.services.docs_assistant import generator
from app.services.docs_assistant.session_store import clear_session_data


def mock_completion(answer: str) -> Mock:
    return Mock(choices=[Mock(message=Mock(content=answer))])


@patch("app.services.docs_assistant.generator.retrieve")
@patch("app.services.docs_assistant.generator.client.chat.completions.create")
def test_generator_returns_sources_and_caches_repeated_query(
    mock_create, mock_retrieve
):
    namespace = "session-test"
    clear_session_data(namespace)
    mock_retrieve.return_value = {
        "contexts": ["RAG retrieves relevant document context."],
        "sources": [
            {
                "document_id": "document-id-1",
                "filename": "guide.pdf",
                "text": "RAG retrieves relevant document context.",
                "vector_score": 0.9,
                "rerank_score": 2,
            }
        ],
    }
    mock_create.return_value = mock_completion("RAG retrieves context.")

    first = generator.generate_response("What is RAG?", namespace, ["document-id-1"])
    second = generator.generate_response("What is RAG?", namespace, ["document-id-1"])

    assert first == second
    assert first["sources"][0]["filename"] == "guide.pdf"
    mock_retrieve.assert_called_once()
    mock_create.assert_called_once()


@patch("app.services.docs_assistant.generator.retrieve")
def test_generator_returns_insufficient_context_without_calling_llm(mock_retrieve):
    namespace = "session-empty"
    clear_session_data(namespace)
    mock_retrieve.return_value = {"contexts": [], "sources": []}

    response = generator.generate_response("What is RAG?", namespace)

    assert response["status"] == "insufficient_context"
    assert response["sources"] == []


@patch("app.services.docs_assistant.generator.retrieve")
@patch("app.services.docs_assistant.generator.client.chat.completions.create")
def test_generator_includes_bounded_session_memory(mock_create, mock_retrieve):
    namespace = "session-memory"
    clear_session_data(namespace)
    mock_retrieve.return_value = {
        "contexts": ["Relevant context."],
        "sources": [],
    }
    mock_create.return_value = mock_completion("First answer")
    generator.generate_response("First question", namespace)
    mock_create.return_value = mock_completion("Second answer")

    generator.generate_response("Follow-up question", namespace)

    prompt = mock_create.call_args.kwargs["messages"][0]["content"]
    assert "Question: First question" in prompt
    assert "Answer: First answer" in prompt
