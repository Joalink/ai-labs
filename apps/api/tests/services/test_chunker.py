from app.services.docs_assistant.chunker import chunk_text


def test_chunk_test():
    text = "Hello world " * 100

    chunks = chunk_text(text)

    assert len(chunks) > 1
    assert isinstance(chunks, list)
