"use client";

import { useState, useRef } from "react";
import { MeetingResult } from "@/types/meeting";

export function useMeeting() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/meeting-analyze/summarize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to analyze the meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    file,
    setFile,
    fileInputRef,
    isLoading,
    result,
    error,
    clearFile,
    onFileChange,
  };
}
