export type Role = "user" | "assistant";

export type Message = {
  role: Role;
  text: string;
  fileName?: string | null;
  sources?: DocumentSource[];
  status?: "grounded" | "insufficient_context";
};

export type DocumentSource = {
  document_id: string;
  filename: string | null;
  snippet: string;
  vector_score: number | null;
  rerank_score: number;
};

export type ApiResponse = {
  answer: string;
  status: "grounded" | "insufficient_context";
  sources: DocumentSource[];
};

export type UploadResponse = {
  message: string;
  namespace: string;
  document_id: string;
  filename: string;
};

export type Document = {
  document_id: string;
  filename: string;
};
