"use client";

import AudioInput from "@/components/meeting-analyze/AudioInput";
import AudioSummarizer from "@/components/meeting-analyze/AudioSummarizer";
import DemoGuide from "@/components/DemoGuide";
import CaseStudyLink from "@/components/CaseStudyLink";
import { useMeeting } from "@/hooks/useMeeting";

export default function MeetingSummarizePage() {
  const { file, fileInputRef, isLoading, result, error, onFileChange, resetDemo, loadExample } =
    useMeeting();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">
        Audio intelligence
      </p>
      <h1 className="mb-2 text-2xl font-bold">Meeting Summarizer</h1>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        Turn a short recording into a summary, decisions, tasks and topics.
      </p>
      <div className="mb-4 flex items-center gap-3">
        <CaseStudyLink id="meeting-summarizer" />
        <button
          type="button"
          onClick={loadExample}
          disabled={isLoading}
          className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Load example
        </button>
      </div>
      <DemoGuide
        title="Meeting Summarizer"
        summary="The audio is prepared for transcription, transcribed, and then transformed into structured meeting insights."
        steps={[
          "Upload a supported audio or video recording.",
          "The recording is converted and transcribed.",
          "The transcript is analyzed for its summary, decisions, tasks and topics.",
        ]}
        note="Processing time depends on the recording duration. Use non-sensitive files for this public demo."
      />

      <AudioInput
        file={file}
        fileInputRef={fileInputRef}
        isLoading={isLoading}
        onFileChange={onFileChange}
        onReset={resetDemo}
      />

      {error && (
        <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

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
