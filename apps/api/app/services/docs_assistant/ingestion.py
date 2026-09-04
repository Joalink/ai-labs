import os
from uuid import uuid4

from pymupdf import Document

from app.core.shared.pinecone_service import index
from app.services.docs_assistant.chunker import chunk_text
from app.services.docs_assistant.embedder import create_embedding


def ingest_pdf(file_path: str, namespace: str):

    reader = Document(file_path)

    text = ""

    for p in reader:
        text += p.get_text()

    document_id = str(uuid4())
    filename = os.path.basename(file_path)
    chunks = chunk_text(text)
    embeddings = create_embedding(chunks)

    vectors = []
    for c, e in zip(chunks, embeddings):
        vectors.append(
            {
                "id": str(uuid4()),
                "values": e,
                "metadata": {
                    "text": c,
                    "filename": filename,
                    "document_id": document_id,
                },
            }
        )

    BATCH_SIZE = 100

    for i in range(0, len(vectors), BATCH_SIZE):
        batch = vectors[i : i + BATCH_SIZE]
        index.upsert(vectors=batch, namespace=namespace)

    return {
        "chunks": len(chunks),
        "namespace": namespace,
        "document_id": document_id,
        "filename": filename,
    }
