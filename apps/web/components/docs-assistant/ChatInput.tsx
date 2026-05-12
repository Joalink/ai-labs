import { RefObject } from "react";
import {
  XIcon,
  PaperPlaneRightIcon,
  PaperclipIcon,
} from "@phosphor-icons/react";

type Props = {
  input: string;
  setInput: (val: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  isLoading: boolean;
  onSend: () => void;
  clearFile: () => void;
  onFileChange: (file: File) => Promise<void>;
};

export default function ChatInput({
  input,
  setInput,
  file,
  fileInputRef,
  isLoading,
  onSend,
  clearFile,
  onFileChange,
}: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend();
  };

  return (
    <div className="flex flex-col gap-2">
      {file && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-2 rounded w-fit">
          <span>📎 {file.name}</span>
          <XIcon
            onClick={clearFile}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold ml-2"
            aria-label="Remove file"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) onFileChange(e.target.files[0]);
          }}
          accept=".pdf,.doc,.docx,.txt,.csv"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 w-12 h-12 rounded-lg transition-colors"
          title="Upload Document"
        >
          <PaperclipIcon size={24} />
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
          disabled={isLoading || (!input.trim() && !file)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 h-12 rounded-lg font-medium transition-colors"
        >
          <PaperPlaneRightIcon size={24} />
        </button>
      </form>
    </div>
  );
}
