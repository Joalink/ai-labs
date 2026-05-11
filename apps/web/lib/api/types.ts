export type DocumentResponse = {
  id: string;
  filename: string;
  chunks: number;
};

export type ChatMessage = {
  id: string;
  role: "user | assistant";
  content: string;
};
