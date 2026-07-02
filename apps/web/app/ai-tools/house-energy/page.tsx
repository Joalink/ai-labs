"use client";

import HouseEnergyForm from "@/components/house-energy/EnergyConsumptionForm";
import HouseEnergyPrediction from "@/components/house-energy/EnergyConsumptionPrediction";
import { useHouseEnergy } from "@/hooks/useHouseEnergy";

export default function HouseEnergyPage() {

  const {
    data,
    loading,
    error,
    handlePredict,
  } = useHouseEnergy();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">House Energy Consumption Predictor</h1>

      <HouseEnergyForm
        loading={loading}
        handlePredict={handlePredict}
      />

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      {!loading && data && <HouseEnergyPrediction prediction={data} loading={loading} error={error} /> }

    </div>
  );
}
