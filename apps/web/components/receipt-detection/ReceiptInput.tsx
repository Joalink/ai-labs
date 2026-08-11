"use client";
import { UploadSimpleIcon } from "@phosphor-icons/react";
import React from "react";

type Props = {
  file: File | null;
  fileInputRef: React.RefObject<HTMLInputElement|null>;
  isLoading: boolean
  onFileChange: (file:File) => Promise<void>;
  onReset: () => void;
};

export default function ReceiptInput ({file, fileInputRef, isLoading, onFileChange, onReset}: Props){
  return(
    <div className="flex mt-6 justify-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={(e) =>{
          if (e.target.files?.[0]) onFileChange(e.target.files[0])
        }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="rounded-lg bg-blue-600 p-4 mb-4 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            Analyzing...
          </>
        ) : (
          <>
            <UploadSimpleIcon size={24} />
            {file ? file.name : "Upload Image"}
          </>
        )}
      </button>
      {file && !isLoading && (
        <button
          type="button"
          onClick={onReset}
          className="mb-4 ml-2 rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Reset
        </button>
      )}
    </div>
  )
}
