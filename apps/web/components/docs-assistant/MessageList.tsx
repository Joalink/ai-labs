import { Message } from "@/types/chat";
import MessageBubble from "./MessageBubble";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

export default function MessageList({ messages, isLoading }: Props) {
  return (
    <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
      {messages.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
          Start a conversation or upload a document to begin.
        </p>
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
