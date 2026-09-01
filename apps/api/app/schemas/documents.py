from pydantic import BaseModel


class ChatResponse(BaseModel):
    answer: str
    status: str
    sources: list["DocumentSource"]


class DocumentSource(BaseModel):
    filename: str | None
    snippet: str
    vector_score: float | None
    rerank_score: int


class DocumentUploadResponse(BaseModel):
    message: str
    namespace: str


class SessionCleanupResponse(BaseModel):
    message: str
