from app.services.docs_assistant.retriever import retrieve


def test_retriever():
    results = retrieve("what is AI?")

    assert isinstance(results, list)
