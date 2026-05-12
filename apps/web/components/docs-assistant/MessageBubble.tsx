import { Message } from "@/types/chat";

export default function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] p-3 rounded-lg text-sm ${
          isUser
            ? "bg-blue-100 text-blue-900 dark:bg-blue-600 dark:text-white rounded-br-none"
            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none"
        }`}
      >
        {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
        {msg.fileName && (
          <div className="mt-2 flex items-center gap-2 text-xs bg-black/10 dark:bg-white/10 p-2 rounded">
            <span>📄</span>
            <span className="truncate">{msg.fileName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
