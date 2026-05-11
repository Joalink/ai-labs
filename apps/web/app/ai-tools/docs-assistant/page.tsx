"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

export default function DocsAssistant() {
  const { resolvedTheme } = useTheme();

  const [messages, setMessages] = useState<
    { role: string; text: string; fileName: string | null }[]
  >([]);

  const [input, setInput] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    const newMessage = {
      role: "user",
      text: input,
      fileName: file ? file.name : null,
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setFile(null);

    // Add your fetch request to the Next.js API route here
  };

  return (
    <div className="flex flex-col min-h-screen max-w-3xl mx-auto p-4 font-sans">
      <div
        className={`flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
      >
        {messages.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
            Start a conversation or upload a document to begin.
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-600 dark:text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none"
                }`}
              >
                {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                {msg.fileName && (
                  <div className="mt-2 flex items-center gap-2 text-sm bg-black/20 dark:bg-white/10 p-2 rounded">
                    <span>📄</span>
                    <span className="truncate">{msg.fileName}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-2">
        {file && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-2 rounded w-fit">
            <span>📎 {file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.csv"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 w-12 h-12 rounded-lg transition-colors"
            title="Upload Document"
          >
            📎
          </label>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your document..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={!input.trim() && !file}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-300 text-white px-6 h-12 rounded-lg font-medium transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
