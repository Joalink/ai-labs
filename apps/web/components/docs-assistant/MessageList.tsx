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
        messages.map((msg, index) => <MessageBubble key={index} msg={msg} />)
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
