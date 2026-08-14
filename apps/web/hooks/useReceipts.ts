import { useCallback, useEffect, useRef, useState } from "react";
import {
  MonthlyReceiptAnalytics,
  PredictionResponse,
  ReceiptRecord,
} from "@/types/receipt";
import {
  getMonthlyReceiptAnalytics,
  getReceiptDemo,
  getReceiptHistory,
  uploadReceipt,
} from "@/lib/api";

export function useReceipts() {
  const [file, setFile] = useState<File | null>(null);
  const [receipt, setReceipt] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const sessionIdRef = useRef(crypto.randomUUID());
  const [records, setRecords] = useState<ReceiptRecord[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyRequestId, setHistoryRequestId] = useState(0);
  const [analytics, setAnalytics] = useState<MonthlyReceiptAnalytics | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const loadAnalytics = async (month: string) => {
    setAnalyticsError(null);
    try {
      setAnalytics(await getMonthlyReceiptAnalytics(month));
    } catch (err) {
      setAnalyticsError(err instanceof Error ? err.message : "Analytics are unavailable");
    }
  };

  const loadHistory = useCallback(() => {
    setIsHistoryLoading(true);
    setHistoryError(null);
    setHistoryRequestId((current) => current + 1);
  }, []);

  useEffect(() => {
    let isCurrent = true;

    void getReceiptHistory()
      .then((history) => {
        if (isCurrent) setRecords(history);
      })
      .catch((err) => {
        if (isCurrent) {
          setHistoryError(
            err instanceof Error ? err.message : "Could not load receipt history",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsHistoryLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [historyRequestId]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const resetDemo = () => {
    setFile(null);
    setReceipt(null);
    setError(null);
    setPreview(null);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReceiptChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setReceipt(null);
    setLoading(true);
    setError(null);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const nextPreview = URL.createObjectURL(selectedFile);
    previewUrlRef.current = nextPreview;
    setPreview(nextPreview);

    try {
      const data = await uploadReceipt(selectedFile, sessionIdRef.current);
      setReceipt(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload receipt failed");
    } finally {
      setLoading(false);
    }
  };

  const loadExample = async () => {
    setLoading(true);
    setError(null);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    try {
      const demo = await getReceiptDemo();
      setFile(new File([], demo.file_name, { type: "image/jpeg" }));
      setPreview(demo.image_url);
      setReceipt(demo.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Example data is unavailable");
    } finally {
      setLoading(false);
    }
  };

  return {
    file,
    receipt,
    loading,
    error,
    fileInputRef,
    preview,
    records,
    isHistoryLoading,
    historyError,
    analytics,
    analyticsError,
    sessionId: sessionIdRef.current,
    loadAnalytics,
    handleReceiptChange,
    loadHistory,
    resetDemo,
    loadExample,
  };
}
