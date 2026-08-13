"use client";

import { ReceiptRecord } from "@/types/receipt";

type Props = {
  records: ReceiptRecord[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
};

export default function ReceiptsTable({
  records,
  isLoading,
  error,
  onRefresh,
}: Props) {
  return (
    <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-zinc-900 dark:text-white">
            Recent receipt records
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Records returned by the current receipt history API.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Refresh
        </button>
      </div>

      {isLoading && (
        <p aria-live="polite" className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Loading receipt records...
        </p>
      )}

      {!isLoading && error && (
        <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {!isLoading && !error && records.length === 0 && (
        <p className="mt-4 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
          No stored receipt records are available yet.
        </p>
      )}

      {!isLoading && !error && records.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              <tr>
                <th className="px-3 py-2 font-medium">File</th>
                <th className="px-3 py-2 font-medium">Detections</th>
                <th className="px-3 py-2 font-medium">Threshold</th>
                <th className="px-3 py-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                  <td className="max-w-56 truncate px-3 py-3 font-medium text-zinc-800 dark:text-zinc-100">
                    {record.filename}
                  </td>
                  <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">
                    {record.total_detections}
                  </td>
                  <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">
                    {(record.confidence_threshold * 100).toFixed(0)}%
                  </td>
                  <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">
                    {new Date(record.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
