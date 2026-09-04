import { Message } from "@/types/chat";
import MessageBubble from "@/components/docs-assistant/MessageBubble";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

export default function MessageList({ messages, isLoading }: Props) {
  return (
    <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
      {messages.length === 0 ? (
        <div className="text-center mt-10 space-y-2">
          <p className="text-gray-500 dark:text-gray-400">
            Upload a document to get started.
          </p>
          <p className="text-blue-500">ℹ️ The file max size is 4.5MB</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Then ask things like:
          </p>
          <ul className="text-sm text-gray-400 dark:text-gray-500 space-y-1">
            <li>→ &quot;What is this document about?&quot;</li>
            <li>→ &quot;Summarize the main topics&quot;</li>
            <li>→ &quot;Explain [concept from the doc]&quot;</li>
          </ul>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div key={index}>
            <MessageBubble msg={msg} />
            {msg.role === "assistant" && msg.status === "insufficient_context" && (
              <p className="mb-3 text-xs text-amber-700 dark:text-amber-300">
                Try selecting another document or asking a more specific question.
              </p>
            )}
            {msg.sources && msg.sources.length > 0 && (
              <details className="mb-3 ml-auto max-w-[85%] rounded-lg border border-zinc-200 p-2 text-xs dark:border-zinc-700">
                <summary className="cursor-pointer font-medium">Sources ({msg.sources.length})</summary>
                <div className="mt-2 space-y-2 text-zinc-600 dark:text-zinc-300">
                  {msg.sources.map((source, sourceIndex) => (
                    <p key={`${source.filename}-${sourceIndex}`}>
                      <span className="font-medium">{source.filename ?? "Document"}</span>: {source.snippet}
                    </p>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))
      )}
      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 p-3 rounded-lg rounded-bl-none text-sm">
            Thinking…
          </div>
        </div>
      )}
    </div>
  );
}
