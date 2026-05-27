from unittest.mock import patch

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


@patch("app.services.docs_assistant.ingestion.ingest_pdf")
def test_upload_document(mock_ingest):

    with open("tests/files/test.pdf", "rb") as file:
        response = client.post(
            "/api/v1/documents/upload",
            files={"file": ("test.pdf", file, "application/pdf")},
        )

    assert response.status_code == 200

    assert response.json() == {"message": "File uploaded"}

    mock_ingest.assert_called_once()
