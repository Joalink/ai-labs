from unittest.mock import patch

from app.services.docs_assistant import embedder


@patch("app.services.docs_assistant.embedder.client.embeddings.create")
def test_embedding(mock_create):
    embedder.embedding_cache.clear()
    mock_create.return_value.data = [type("obj", (), {"embedding": [0.1, 0.2]})]

    result = embedder.create_embedding("hello")

    assert result == [[0.1, 0.2]]


@patch("app.services.docs_assistant.embedder.client.embeddings.create")
def test_embedding_reuses_model_and_content_cache(mock_create):
    embedder.embedding_cache.clear()
    mock_create.return_value.data = [type("obj", (), {"embedding": [0.1, 0.2]})]

    embedder.create_embedding("hello")
    embedder.create_embedding("hello")

    mock_create.assert_called_once()
