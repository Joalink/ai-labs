"use client";

import AudioInput from "@/components/meeting-analyze/AudioInput";
import AudioInsights from "@/components/meeting-analyze/AudioInsights";
import SentimentSelection from "@/components/meeting-analyze/SentimentSelection";
import { useMeeting } from "@/hooks/useMeeting";

export default function MeetingSummarizePage() {
  const { file, fileInputRef, result, error, onFileChange } = useMeeting();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meeting Summarizer</h1>

      <AudioInput
        file={file}
        fileInputRef={fileInputRef}
        onFileChange={onFileChange}
      />

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {result && <AudioInsights {...result} />}

      {result && (
        <SentimentSelection
          sentiment={result.insights.sentiment}
          setSentiment={(_) => {}}
        />
      )}
    </div>
  );
}
