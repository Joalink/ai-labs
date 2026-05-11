"use client";

import { useState, useRef } from "react";
import { Message } from "@/types/chat";
import { sendDocMessage } from "@/lib/api";

export function useDocsChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    const userMessage: Message = {
      role: "user",
      text: input,
      fileName: file?.name ?? null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    clearFile();
    setIsLoading(true);

    try {
      const reply = await sendDocMessage(input, file);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply, fileName: null },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong. Please try again.",
          fileName: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    file,
    setFile,
    fileInputRef,
    isLoading,
    sendMessage,
    clearFile,
  };
}
