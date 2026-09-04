from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
SESSION_ID = "e76a3563-2d44-4bbc-bb5c-97b7d9c62a4c"


@patch("app.api.v1.docs_assistant.upload.ingest_pdf")
def test_upload_document(mock_ingest):
    mock_ingest.return_value = {
        "chunks": 1,
        "namespace": f"session-{SESSION_ID}",
        "document_id": "test-document-id",
        "filename": "test.pdf",
    }

    response = client.post(
        "/api/v1/documents/upload",
        files={"file": ("test.pdf", b"%PDF-1.4", "application/pdf")},
        headers={"X-Session-ID": SESSION_ID},
    )

    assert response.status_code == 201
    assert response.json() == {
        "message": "File uploaded",
        "namespace": f"session-{SESSION_ID}",
        "document_id": "test-document-id",
        "filename": "test.pdf",
    }

    input_path, namespace = mock_ingest.call_args.args

    assert input_path.endswith("/test.pdf")
    assert namespace == f"session-{SESSION_ID}"
    assert not Path(input_path).exists()
    assert not Path(input_path).parent.exists()


@patch("app.api.v1.docs_assistant.upload.ingest_pdf")
def test_same_name_uploads_use_isolated_temporary_paths(mock_ingest):
    paths = []

    def capture_path(input_path, namespace):
        paths.append(input_path)
        return {
            "chunks": 1,
            "namespace": namespace,
            "document_id": "test-document-id",
            "filename": "document.pdf",
        }

    mock_ingest.side_effect = capture_path

    for session_id in (
        SESSION_ID,
        "f9cfb2ef-565c-45af-b963-b5b1bbf42635",
    ):
        response = client.post(
            "/api/v1/documents/upload",
            files={
                "file": (
                    "document.pdf",
                    b"%PDF-1.4",
                    "application/pdf",
                )
            },
            headers={"X-Session-ID": session_id},
        )

        assert response.status_code == 201

    assert len(paths) == 2
    assert paths[0] != paths[1]
    assert all(not Path(path).exists() for path in paths)


@patch(
    "app.api.v1.docs_assistant.upload.ingest_pdf",
    side_effect=RuntimeError("boom"),
)
def test_failed_upload_removes_its_temporary_file(mock_ingest):
    response = client.post(
        "/api/v1/documents/upload",
        files={"file": ("test.pdf", b"%PDF-1.4", "application/pdf")},
        headers={"X-Session-ID": SESSION_ID},
    )

    input_path = mock_ingest.call_args.args[0]

    assert response.status_code == 500
    assert not Path(input_path).exists()
    assert not Path(input_path).parent.exists()


def test_oversized_upload_is_rejected_before_creating_a_temporary_file():
    response = client.post(
        "/api/v1/documents/upload",
        files={
            "file": (
                "large.pdf",
                b"x" * (int(4.5 * 1024 * 1024) + 1),
                "application/pdf",
            )
        },
        headers={"X-Session-ID": SESSION_ID},
    )

    assert response.status_code == 413
    assert response.json() == {"detail": "File exceeds 4 MB limit"}
