from unittest.mock import patch

from app.services.docs_assistant.embedder import create_embedding


@patch("app.services.docs_assistant.embedder.client.embeddings.create")
def test_embedding(mock_create):

    mock_create.return_value.data = [type("obj", (), {"embedding": [0.1, 0.2]})]

    result = create_embedding("hello")

    assert result == [[0.1, 0.2]]
