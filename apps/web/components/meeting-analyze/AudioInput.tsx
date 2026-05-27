"use client";

import { FileAudioIcon, UploadSimpleIcon } from "@phosphor-icons/react";

type Props = {
  file: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (file: File) => Promise<void>;
};

export default function AudioInput({
  file,
  fileInputRef,
  onFileChange,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
      <div>
        <FileAudioIcon size={48} color="#1a7e5f" className="mx-auto" />
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
          Upload or drag a audio/video here.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
          Max 500mb file size.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
          Supported formats: mp3, wav, ogg, opus, flac, aac, mp4, m4a, mkv.
        </p>
        <br />
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          *note: the language of the audio is automatically detected, but is
          recommended to be in English for best results.
        </p>

        <div className="flex mt-6 justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) onFileChange(e.target.files[0]);
            }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-blue-600 p-4 mb-4 text-white flex items-center gap-2"
          >
            <UploadSimpleIcon size={24} />
            {file ? file.name : "Upload Audio"}
          </button>
        </div>
      </div>
    </div>
  );
}
