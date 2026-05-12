export type Role = "user" | "assistant";

export type Message = {
  role: Role;
  text: string;
  fileName?: string | null;
};

export type ApiResponse = {
  answer: string;
};

export type UploadResponse = {
  answer: string;
  namespace: string;
};
