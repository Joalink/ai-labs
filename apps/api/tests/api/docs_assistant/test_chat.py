from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
SESSION_ID = "e76a3563-2d44-4bbc-bb5c-97b7d9c62a4c"


CHAT_RESPONSE = {
    "answer": "A RAG answer",
    "status": "grounded",
    "sources": [],
}


@patch(
    "app.api.v1.docs_assistant.chat.generate_response",
    return_value=CHAT_RESPONSE,
)
def test_chat_route_uses_the_browser_session(mock_generate_response):
    response = client.post(
        "/api/v1/documents/chat",
        params={"query": "What is RAG?"},
        headers={"X-Session-ID": SESSION_ID},
    )

    assert response.status_code == 200
    assert response.json() == CHAT_RESPONSE

    mock_generate_response.assert_called_once_with(
        "What is RAG?",
        f"session-{SESSION_ID}",
        None,
    )


@patch(
    "app.api.v1.docs_assistant.chat.generate_response",
    return_value=CHAT_RESPONSE,
)
def test_chat_route_passes_selected_documents(mock_generate_response):
    response = client.post(
        "/api/v1/documents/chat",
        params=[
            ("query", "What is RAG?"),
            ("document_ids", "document-id-1"),
            ("document_ids", "document-id-2"),
        ],
        headers={"X-Session-ID": SESSION_ID},
    )

    assert response.status_code == 200
    assert response.json() == CHAT_RESPONSE

    mock_generate_response.assert_called_once_with(
        "What is RAG?",
        f"session-{SESSION_ID}",
        ["document-id-1", "document-id-2"],
    )
