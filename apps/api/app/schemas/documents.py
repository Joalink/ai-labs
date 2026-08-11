from pydantic import BaseModel


class ChatResponse(BaseModel):
    answer: str


class DocumentUploadResponse(BaseModel):
    message: str
    namespace: str


class SessionCleanupResponse(BaseModel):
    message: str
