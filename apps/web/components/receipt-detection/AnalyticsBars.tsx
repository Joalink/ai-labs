type Props = {
  title: string;
  values: Record<string, number>;
  suffix?: string;
};

export default function AnalyticsBars({ title, values, suffix = "" }: Props) {
  const entries = Object.entries(values).sort(([, left], [, right]) => right - left).slice(0, 5);
  const maximum = Math.max(...entries.map(([, value]) => value), 1);

  return (
    <section>
      <h3 className="font-medium text-zinc-900 dark:text-white">{title}</h3>
      {entries.length === 0 ? <p className="mt-2 text-sm text-zinc-500">No data available.</p> : (
        <div className="mt-3 space-y-2">
          {entries.map(([label, value]) => (
            <div key={label} className="text-sm">
              <div className="mb-1 flex justify-between gap-3"><span className="truncate">{label}</span><span>{value.toFixed(2)}{suffix}</span></div>
              <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${(value / maximum) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
