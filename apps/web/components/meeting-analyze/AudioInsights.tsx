import { MeetingResult } from "@/types/meeting";

export default function AudioInsights(result: MeetingResult) {
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
        </div>
      )}
    </div>
  );
}
