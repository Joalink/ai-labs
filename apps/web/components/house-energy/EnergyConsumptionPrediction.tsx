import { HouseEnergyPredictResponse } from "@/types/house-energy";
import { estimateDailyEnergyCost } from "@/lib/energy";

type Props = {
  prediction: HouseEnergyPredictResponse;
  tariff: number;
};

export default function EnergyConsumptionPrediction({ prediction, tariff }: Props) {
  const dailyCost = estimateDailyEnergyCost(prediction.energy_consumption_kwh, tariff);
  return (
    <div aria-live="polite" className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center dark:border-yellow-900/60 dark:bg-yellow-950/20">
      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Estimated daily consumption</p>
      <h2 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
        {prediction.energy_consumption_kwh.toFixed(2)} kWh
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Estimated daily cost: ${dailyCost.toFixed(2)} USD at ${tariff.toFixed(3)}/kWh.
      </p>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        This is a model estimate, not a utility bill reading or tariff quote.
      </p>
    </div>
  );
}
