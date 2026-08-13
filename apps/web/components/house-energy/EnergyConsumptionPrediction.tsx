import { HouseEnergyPredictResponse } from "@/types/house-energy";

type Props = {
  prediction: HouseEnergyPredictResponse;
};

export default function EnergyConsumptionPrediction({ prediction }: Props) {
  return (
    <div aria-live="polite" className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center dark:border-yellow-900/60 dark:bg-yellow-950/20">
      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Estimated daily consumption</p>
      <h2 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
        {prediction.energy_consumption_kwh.toFixed(2)} kWh
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        This is a model estimate, not a utility bill reading.
      </p>
    </div>
  );
}
