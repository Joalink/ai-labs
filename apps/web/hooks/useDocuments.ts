"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Message } from "@/types/chat";
import { uploadDocument, sendChatMessage } from "@/lib/api";

export function useDocuments() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [namespace, setNamespace] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearSession = useCallback(async () => {
    try {
      await fetch("/api/session/clean", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namespace }),
      });
    } catch (err) {
      console.error("Session cleanup failed.", err);
    }
  }, [namespace]);

  useEffect(() => {
    clearSession();
    return () => {
      clearSession();
    };
  }, []);

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: "", fileName: selectedFile.name },
    ]);
    clearFile();
    setIsLoading(true);

    try {
      const data = await uploadDocument(selectedFile);
      setNamespace(data.namespace);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `✅ ${selectedFile.name}' uploaded. You can now ask questions.`,
          fileName: null,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Upload failed. Please try again.",
          fileName: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!namespace) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Please upload a document first.",
          fileName: null,
        },
      ]);
      return;
    }

    const userMessage: Message = { role: "user", text: input, fileName: null };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await sendChatMessage(input);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer, fileName: null },
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
    namespace,
    sendMessage,
    handleFileChange,
    clearFile,
  };
}
