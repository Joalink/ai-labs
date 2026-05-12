from uuid import uuid4

from app.core.shared.pinecone_service import index
from app.services.docs_assistant.chunker import chunk_text
from app.services.docs_assistant.embedder import create_embedding
from pymupdf import Document


def ingest_pdf(file_path: str):

    reader = Document(file_path)

    text = ""

    for page in reader:
        text += page.get_text()

    chunks = chunk_text(text)

    embeddings = create_embedding(chunks)

    vectors = []

    for chunk, embedding in zip(chunks, embeddings):
        vectors.append(
            {
                "id": str(uuid4()),
                "values": embedding,
                "metadata": {"text": chunk},
            }
        )

    BATCH_SIZE = 100

    for i in range(0, len(vectors), BATCH_SIZE):
        batch = vectors[i : i + BATCH_SIZE]
        index.upsert(vectors=batch, namespace=file_path)

    return {"chunks": len(chunks)}
