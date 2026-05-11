from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_chat_route():
    response = client.post("/api/v1/chat", params={"query": "What is RAG?"})

    assert response.status_code == 200
