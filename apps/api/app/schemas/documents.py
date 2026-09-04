from pydantic import BaseModel


class ChatResponse(BaseModel):
    answer: str
    status: str
    sources: list["DocumentSource"]


class DocumentSource(BaseModel):
    document_id: str
    filename: str | None
    snippet: str
    vector_score: float | None
    rerank_score: int


class DocumentUploadResponse(BaseModel):
    message: str
    namespace: str
    document_id: str
    filename: str


class SessionCleanupResponse(BaseModel):
    message: str
