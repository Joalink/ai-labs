from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
SESSION_ID = "e76a3563-2d44-4bbc-bb5c-97b7d9c62a4c"


@patch("app.api.v1.docs_assistant.chat.generate_response", return_value="A RAG answer")
def test_chat_route_uses_the_browser_session(mock_generate_response):
    response = client.post(
        "/api/v1/documents/chat",
        params={"query": "What is RAG?"},
        headers={"X-Session-ID": SESSION_ID},
    )

    assert response.status_code == 200
    assert response.json() == {"answer": "A RAG answer"}
    mock_generate_response.assert_called_once_with(
        "What is RAG?", f"session-{SESSION_ID}"
    )
