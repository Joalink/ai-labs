from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
SESSION_ID = "e76a3563-2d44-4bbc-bb5c-97b7d9c62a4c"


@patch("app.api.v1.session.clean.index.delete")
def test_clean_session_deletes_only_the_browser_session(mock_delete):
    response = client.request(
        "DELETE",
        "/api/v1/session/clean",
        json={"session_id": SESSION_ID},
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Session cleared"
    mock_delete.assert_called_once_with(
        delete_all=True, namespace=f"session-{SESSION_ID}"
    )


@patch("app.api.v1.session.clean.index.delete", side_effect=RuntimeError)
def test_clean_session_returns_an_error_when_pinecone_fails(mock_delete):
    client_without_server_exceptions = TestClient(app, raise_server_exceptions=False)

    response = client_without_server_exceptions.request(
        "DELETE",
        "/api/v1/session/clean",
        json={"session_id": SESSION_ID},
    )

    assert response.status_code == 502
    assert response.json() == {"detail": "Failed to clear document session"}
    mock_delete.assert_called_once_with(
        delete_all=True, namespace=f"session-{SESSION_ID}"
    )
