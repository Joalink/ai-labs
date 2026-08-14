"use client";

import MessageList from "@/components/docs-assistant/MessageList";
import ChatInput from "@/components/docs-assistant/ChatInput";
import DemoGuide from "@/components/DemoGuide";
import CaseStudyLink from "@/components/CaseStudyLink";
import { useDocuments } from "@/hooks/useDocuments";

export default function DocsAssistantPage() {
  const {
    messages,
    input,
    setInput,
    file,
    fileInputRef,
    isLoading,
    sendMessage,
    clearFile,
    handleFileChange,
    resetDemo,
    loadExample,
    documents,
    selectedDocuments,
    setSelectedDocuments,
  } = useDocuments();

  return (
    <div className="flex h-[calc(100vh-7.5rem)] max-w-3xl flex-col mx-auto px-4 py-2">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Retrieval augmented generation
          </p>
          <h1 className="text-2xl font-bold">Document Assistant</h1>
        </div>
        <div className="flex items-center gap-3">
          <CaseStudyLink id="docs-assistant" />
          <button
            type="button"
            onClick={loadExample}
            disabled={isLoading}
            className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Load example
          </button>
          <button
            type="button"
            onClick={resetDemo}
            disabled={isLoading}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Reset demo
          </button>
        </div>
      </div>
      <DemoGuide
        title="Document Assistant"
        summary="Your PDF is split into text chunks, searched semantically, and the most relevant context is used to answer your question."
        steps={[
          "Upload a PDF to create a temporary document session.",
          "Ask a focused question about the uploaded content.",
          "The assistant retrieves relevant passages before generating its answer.",
        ]}
        note="Use non-sensitive files for this public demo. Resetting the demo clears the current client session."
      />
      {documents.length > 0 && (
        <fieldset className="mb-4 rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-800">
          <legend className="px-1 font-medium text-zinc-900 dark:text-zinc-100">Search documents</legend>
          <div className="flex flex-wrap gap-3">
            {documents.map((document) => (
              <label key={document} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={selectedDocuments.includes(document)}
                  onChange={(event) => setSelectedDocuments((current) => event.target.checked ? [...current, document] : current.filter((name) => name !== document))}
                />
                {document}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        setInput={setInput}
        file={file}
        fileInputRef={fileInputRef}
        isLoading={isLoading}
        onSend={sendMessage}
        clearFile={clearFile}
        onFileChange={handleFileChange}
      />
    </div>
  );
}
