import { HouseEnergyPredictRequest, HouseEnergyPredictResponse } from "@/types/house-energy";

type Scenario = {
  input: HouseEnergyPredictRequest;
  output: HouseEnergyPredictResponse;
};

export function EnergyTips({ input }: { input: HouseEnergyPredictRequest }) {
  const tips = [
    input.has_ac && "Your scenario includes air conditioning; review thermostat settings and filter maintenance.",
    input.peak_hours_usage_kwh > 0 && `Peak-hour use is ${input.peak_hours_usage_kwh} kWh; consider shifting flexible appliances outside peak times.`,
    input.avg_temperature_c >= 26 && `The ${input.avg_temperature_c}°C temperature may increase cooling demand; use shading and ventilation where practical.`,
    input.household_size >= 4 && "With a larger household, coordinate appliance use and review standby loads together.",
  ].filter((tip): tip is string => Boolean(tip));

  return (
    <section className="mt-6 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <h2 className="font-semibold">Scenario-aware ideas</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
        {tips.length ? tips.map((tip) => <li key={tip}>{tip}</li>) : <li>Review daily appliance use and standby loads for opportunities to reduce avoidable demand.</li>}
      </ul>
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">These are general suggestions, not an energy audit or guaranteed savings estimate.</p>
    </section>
  );
}

export function EnergyTrend({ history }: { history: Scenario[] }) {
  if (history.length < 2) {
    return <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">Run at least two scenarios to see a consumption trend.</p>;
  }

  const values = [...history].reverse().map((scenario) => scenario.output.energy_consumption_kwh);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = max === min ? 50 : 100 - ((value - min) / (max - min)) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <section className="mt-6 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-semibold">Consumption trend</h2>
        <span className="text-xs text-zinc-500">kWh/day</span>
      </div>
      <svg viewBox="0 0 100 100" role="img" aria-label="Recent predicted daily energy consumption trend" className="mt-4 h-36 w-full overflow-visible">
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" className="text-indigo-600 dark:text-indigo-400" />
      </svg>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Range: {min.toFixed(2)} to {max.toFixed(2)} kWh/day across {values.length} scenarios.</p>
    </section>
  );
}
