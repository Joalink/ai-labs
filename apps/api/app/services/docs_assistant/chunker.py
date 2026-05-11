from app.core.config import settings
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=settings.CHUNK_SIZE, chunk_overlap=settings.CHUNK_OVERLAP
)


def chunk_text(text: str):
    return splitter.split_text(text)
