import { useState } from "react";
import {
  HouseEnergyPredictRequest,
  HouseEnergyPredictResponse,
} from "@/types/house-energy";
import { HouseEnergyConsumption } from "@/lib/api";

export function useHouseEnergy() {
  const [data, setData] = useState<HouseEnergyPredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { input: HouseEnergyPredictRequest; output: HouseEnergyPredictResponse }[]
  >([]);

  const handlePredict = async (requestData: HouseEnergyPredictRequest) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await HouseEnergyConsumption(requestData);
      setData(response);
      setHistory((current) => [
        { input: requestData, output: response },
        ...current,
      ].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const resetDemo = () => {
    setData(null);
    setError(null);
    setHistory([]);
  };

  return {
    data,
    loading,
    error,
    handlePredict,
    resetDemo,
    history,
  };
}
