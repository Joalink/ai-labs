"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Message } from "@/types/chat";
import { getDocumentDemo, uploadDocument, sendChatMessage } from "@/lib/api";

export function useDocuments() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [namespace, setNamespace] = useState<string | null>(null);
  const [documents, setDocuments] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [demoAnswers, setDemoAnswers] = useState<Record<string, string> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef(crypto.randomUUID());

  const clearSession = useCallback(async () => {
    try {
      const response = await fetch("/api/session/clean", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current }),
      });
      if (!response.ok) throw new Error("Session cleanup failed");
    } catch (err) {
      console.error("Session cleanup failed.", err);
    }
  }, []);

  useEffect(() => {
    return () => {
      void clearSession();
    };
  }, [clearSession]);

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetDemo = async () => {
    await clearSession();
    setMessages([]);
    setInput("");
    setNamespace(null);
    setDocuments([]);
    setSelectedDocuments([]);
    setDemoAnswers(null);
    sessionIdRef.current = crypto.randomUUID();
    clearFile();
  };

  const loadExample = async () => {
    setIsLoading(true);
    try {
      const demo = await getDocumentDemo();
      setNamespace("demo");
      setDocuments([demo.file_name]);
      setSelectedDocuments([demo.file_name]);
      setDemoAnswers(demo.answers);
      setFile(new File([], demo.file_name, { type: "application/pdf" }));
      setMessages([
        { role: "user", text: "", fileName: demo.file_name },
        {
          role: "assistant",
          text: "Example document loaded. Ask about botany or photosynthesis to see a precomputed answer.",
          fileName: null,
        },
      ]);
    } catch {
      setMessages([{ role: "assistant", text: "Example data is unavailable. Please try again.", fileName: null }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setDemoAnswers(null);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: "", fileName: selectedFile.name },
    ]);
    clearFile();
    setIsLoading(true);

    try {
      const data = await uploadDocument(selectedFile, sessionIdRef.current);
      setNamespace(data.namespace);
      setDocuments((current) =>
        current.includes(selectedFile.name) ? current : [...current, selectedFile.name],
      );
      setSelectedDocuments((current) =>
        current.includes(selectedFile.name) ? current : [...current, selectedFile.name],
      );
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
      const normalizedInput = input.trim().toLowerCase();
      const data = demoAnswers
        ? {
            answer:
              demoAnswers[normalizedInput] ??
              "This precomputed example covers botany, plant parts and photosynthesis. Try one of those topics.",
          }
        : await sendChatMessage(
            input,
            sessionIdRef.current,
            selectedDocuments,
          );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
          fileName: null,
          sources: "sources" in data ? data.sources : [],
          status: "status" in data ? data.status : "grounded",
        },
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
    documents,
    selectedDocuments,
    setSelectedDocuments,
    sendMessage,
    handleFileChange,
    clearFile,
    resetDemo,
    loadExample,
  };
}
