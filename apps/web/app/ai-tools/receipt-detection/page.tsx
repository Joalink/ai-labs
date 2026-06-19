"use client";

import { useReceipts } from "@/hooks/useReceipts";
import ReceiptInput from "@/components/receipt-detection/ReceiptInput";
import ReceiptsCompare from "@/components/receipt-detection/ReceiptsCompare";

export default function ReceiptImage(){
  const {
    file,
    receipt,
    loading,
    error,
    fileInputRef,
    preview,
    handleReceiptChange
  } = useReceipts();

  return(
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Receipt Detection</h1>
      <ReceiptInput
        file={file}
        fileInputRef={fileInputRef}
        isLoading={loading}
        onFileChange={handleReceiptChange}
      />
      {error && <p className="flex flex-col items-center text-red-500 text-sm mt-4">{error}</p>}
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
    </div>
  );
}
