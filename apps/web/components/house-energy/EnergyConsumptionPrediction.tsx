import { HouseEnergyPredictResponse } from "@/types/house-energy";

type Props = {
  prediction?: HouseEnergyPredictResponse ;
  loading: boolean;
  error: string | null;
};

export default function EnergyConsumptionPrediction({prediction, loading, error}: Props) {

  if(loading) {
    return <p>Predicting...</p>;
  }

  if (prediction === undefined) {
    return <p>No prediction yet.</p>;
  }
  return (
    <div className="flex flex-col items-center justify-center mt-8">
    <h2 className="text-xl font-bold mb-4">Prediction</h2>
      <h1 className="text-3xl font-bold">⚡{prediction.energy_consumption_kwh.toFixed(2)} kWh</h1>
      <p className="text-gray-600">Estimated daily energy consumption.</p>
    </div>
  );

}
