"use client";

import HouseEnergyForm from "@/components/house-energy/EnergyConsumptionForm";
import HouseEnergyPrediction from "@/components/house-energy/EnergyConsumptionPrediction";
import DemoGuide from "@/components/DemoGuide";
import CaseStudyLink from "@/components/CaseStudyLink";
import { useHouseEnergy } from "@/hooks/useHouseEnergy";

export default function HouseEnergyPage() {

  const {
    data,
    loading,
    error,
    handlePredict,
    resetDemo,
  } = useHouseEnergy();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-yellow-700 dark:text-yellow-400">
        Traditional prediction API
      </p>
      <div className="mb-2 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">House Energy Consumption Predictor</h1>
        {(data || error) && (
          <button
            type="button"
            onClick={resetDemo}
            disabled={loading}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Reset demo
          </button>
        )}
      </div>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        Explore how household and seasonal inputs influence estimated daily consumption.
      </p>
      <CaseStudyLink id="house-energy" />
      <DemoGuide
        title="Energy predictor"
        summary="A prediction API receives the household scenario and returns an estimated daily consumption value."
        steps={[
          "Use the example scenario or enter household conditions.",
          "Submit the form to request a model prediction.",
          "Compare scenarios by changing one input at a time.",
        ]}
        note="The result is illustrative and should not be used for billing or operational decisions."
      />

      <HouseEnergyForm
        loading={loading}
        handlePredict={handlePredict}
      />

      {loading && <p aria-live="polite" className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Running prediction...</p>}
      {error && <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</div>}
      {!loading && data && <HouseEnergyPrediction prediction={data} />}

    </div>
  );
}
