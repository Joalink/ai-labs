"use client";

import AudioInput from "@/components/meeting-analyze/AudioInput";
import AudioSummarizer from "@/components/meeting-analyze/AudioSummarizer";
import { useMeeting } from "@/hooks/useMeeting";

export default function MeetingSummarizePage() {
  const { file, fileInputRef, isLoading, result, error, onFileChange } =
    useMeeting();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meeting Summarizer</h1>

      <AudioInput
        file={file}
        fileInputRef={fileInputRef}
        isLoading={isLoading}
        onFileChange={onFileChange}
      />

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {isLoading && (
        <div className="mt-6 flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Transcribing and analyzing your meeting...</p>
          <p className="text-xs text-gray-400">
            This may take a minute depending on file size.
          </p>
        </div>
      )}

      {!isLoading && result && <AudioSummarizer {...result} />}
    </div>
  );
}
