"use client";

import { useReceipts } from "@/hooks/useReceipts";
import ReceiptInput from "@/components/receipt-detection/ReceiptInput";
import ReceiptsCompare from "@/components/receipt-detection/ReceiptsCompare";
import ReceiptsTable from "@/components/receipt-detection/ReceiptsTable";
import DemoGuide from "@/components/DemoGuide";
import CaseStudyLink from "@/components/CaseStudyLink";
import MonthlyAnalytics from "@/components/receipt-detection/MonthlyAnalytics";

export default function ReceiptImage(){
  const {
    file,
    receipt,
    loading,
    error,
    fileInputRef,
    preview,
    records,
    isHistoryLoading,
    historyError,
    handleReceiptChange,
    loadHistory,
    resetDemo,
    loadExample,
    analytics,
    analyticsError,
    loadAnalytics,
  } = useReceipts();

  return(
    <div className="max-w-3xl mx-auto p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
        Computer vision
      </p>
      <h1 className="mb-2 text-2xl font-bold">Receipt Detection</h1>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        Detect visual receipt fields and inspect the model output on your image.
      </p>
      <div className="mb-4 flex items-center gap-3">
        <CaseStudyLink id="receipt-detection" />
        <button
          type="button"
          onClick={loadExample}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Load example
        </button>
      </div>
      <DemoGuide
        title="Receipt Detection"
        summary="Your image is sent to a detection service that identifies receipt regions and returns bounding boxes with confidence scores."
        steps={[
          "Upload a PNG or JPEG receipt image.",
          "The detection service identifies visible receipt fields.",
          "Compare the original image with the detected regions and confidence scores.",
        ]}
        note="Use non-sensitive images for this public demo. New detections are displayed in the current session."
      />
      <ReceiptInput
        file={file}
        fileInputRef={fileInputRef}
        isLoading={loading}
        onFileChange={handleReceiptChange}
        onReset={resetDemo}
      />
      {error && <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</div>}
      {loading && (
        <div className="mt-6 flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Analyzing the image...</p>
          <p className="text-xs text-gray-400">
            This may take a minute depending on file size.
          </p>
        </div>
      )}
      {!loading && receipt && <ReceiptsCompare receipt={receipt} preview={preview}/>}
      <ReceiptsTable
        records={records}
        isLoading={isHistoryLoading}
        error={historyError}
        onRefresh={loadHistory}
      />
      <MonthlyAnalytics analytics={analytics} error={analyticsError} onMonthChange={loadAnalytics} />
    </div>
  );
}
