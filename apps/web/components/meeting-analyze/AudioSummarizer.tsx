import { MeetingResult } from "@/types/meeting";
import {
  SmileyIcon,
  SmileyMehIcon,
  SmileySadIcon,
} from "@phosphor-icons/react";

export default function AudioSummarizer(result: MeetingResult) {
  return (
    <div>
      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h2 className="font-semibold mb-2">Summary</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {result.insights.summary}
            </p>
          </div>

          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <summary className="cursor-pointer font-semibold">Transcript</summary>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {result.transcript.text}
            </p>
          </details>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h2 className="font-semibold mb-2">Decisions</h2>
            <ul className="space-y-1">
              {result.insights.decisions.map((d, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  • {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h2 className="font-semibold mb-2">Tasks</h2>
            <ul className="space-y-1">
              {result.insights.action_items.map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="font-medium">{i + 1}</span> — {item.task}
                  <span className="text-gray-400">
                    {" "}
                    (
                    {item.deadline && item.deadline !== "null"
                      ? item.deadline
                      : "not defined"}
                    )
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h2 className="font-semibold mb-2">Topics</h2>
            <div className="flex flex-wrap gap-2">
              {result.insights.topics.map((t, i) => (
                <span
                  key={i}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              The general mood during the meeting was{" "}
              {result.insights.sentiment}
            </p>
            {result.insights.sentiment === "positive" && (
              <SmileyIcon size={60} color="green" />
            )}
            {result.insights.sentiment === "neutral" && (
              <SmileyMehIcon size={60} color="gray" />
            )}
            {result.insights.sentiment === "negative" && (
              <SmileySadIcon size={60} color="orange" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
