type Props = {
  title: string;
  summary: string;
  steps: string[];
  note?: string;
};

export default function DemoGuide({ title, summary, steps, note }: Props) {
  return (
    <details className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      <summary className="cursor-pointer font-semibold text-zinc-900 dark:text-zinc-100">
        How this demo works
      </summary>
      <div className="mt-3 space-y-3 text-zinc-600 dark:text-zinc-300">
        <p>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {title}:
          </span>{" "}
          {summary}
        </p>
        <ol className="list-decimal space-y-1 pl-5">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {note && <p className="text-xs text-zinc-500 dark:text-zinc-400">{note}</p>}
      </div>
    </details>
  );
}
