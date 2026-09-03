"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Message, Document } from "@/types/chat";
import { getDocumentDemo, uploadDocument, sendChatMessage } from "@/lib/api";

export function useDocuments() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [namespace, setNamespace] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [demoAnswers, setDemoAnswers] = useState<Record<string, string> | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef(crypto.randomUUID());

  const clearSession = useCallback(async () => {
    if (documents.length === 0) {
      return;
    }

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
      const document = {
        document_id: "demo",
        filename: demo.filename,
      };

      setDocuments([document]);
      setSelectedDocuments([document]);
      setDemoAnswers(demo.answers);
      setFile(
        new File([], demo.filename, {
          type: "application/pdf",
        }),
      );

      setMessages([
        {
          role: "user",
          text: "",
          fileName: demo.filename,
        },
        {
          role: "assistant",
          text: "Example document loaded. Ask about botany or photosynthesis to see a precomputed answer.",
          fileName: null,
        },
      ]);
    } catch {
      setMessages([
        {
          role: "assistant",
          text: "Example data is unavailable. Please try again.",
          fileName: null,
        },
      ]);
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

      const document = {
        document_id: data.document_id,
        filename: data.filename,
      };

      setDocuments((current) =>
        current.some((doc) => doc.document_id === document.document_id)
          ? current
          : [...current, document],
      );

      setSelectedDocuments((current) =>
        current.some((doc) => doc.document_id === document.document_id)
          ? current
          : [...current, document],
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
            selectedDocuments.map((doc) => doc.document_id),
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
