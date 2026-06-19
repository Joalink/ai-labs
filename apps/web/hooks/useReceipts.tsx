import { useRef, useState } from "react"
import { PredictionResponse } from "@/types/receipt";
import { uploadReceipt } from "@/lib/api";

export function useReceipts(){
  const [file, setFile] = useState<File|null>(null)
  const [receipt, setReceipt] = useState<PredictionResponse|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const fileInputRef = useRef<HTMLInputElement|null>(null)
  const [preview, setPreview] = useState<string|null>(null)

  const handleReceiptChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setReceipt(null);
    setLoading(true);
    setError(null);
    setPreview(URL.createObjectURL(selectedFile))

    try{
      const data = await uploadReceipt(selectedFile);
      setReceipt(data);
    } catch (err){
      setError(err instanceof Error ? err.message : "Upload receipt failed");
    } finally {
      setLoading(false);
    }
  }

  return{
    file,
    receipt,
    loading,
    error,
    fileInputRef,
    preview,
    handleReceiptChange
  };
};
