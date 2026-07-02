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

  const handlePredict = async (requestData: HouseEnergyPredictRequest) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await HouseEnergyConsumption(requestData);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    handlePredict,
  };
}
