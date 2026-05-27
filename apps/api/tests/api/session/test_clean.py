from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_clean_session():
    response = client.request(
        "DELETE",
        "/api/v1/session/clean",
        json={"namespace": "test-session"},
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Session cleared"
