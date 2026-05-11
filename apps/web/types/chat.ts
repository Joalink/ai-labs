export type Role = "user" | "assistant";

export type Message = {
  role: Role;
  text: string;
  fileName?: string | null;
};

export type ApiResponse = {
  reply: string;
};
