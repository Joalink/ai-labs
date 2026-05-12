"use client";

import MessageList from "@/components/docs-assistant/MessageList";
import ChatInput from "@/components/docs-assistant/ChatInput";
import { useDocsChat } from "@/hooks/useDocsChat";

export default function DocsAssistantPage() {
  const {
    messages,
    input,
    setInput,
    file,
    setFile,
    fileInputRef,
    isLoading,
    sendMessage,
    clearFile,
  } = useDocsChat();

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] max-w-3xl mx-auto">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        setInput={setInput}
        file={file}
        setFile={setFile}
        fileInputRef={fileInputRef}
        isLoading={isLoading}
        onSend={sendMessage}
        clearFile={clearFile}
      />
    </div>
  );
}
