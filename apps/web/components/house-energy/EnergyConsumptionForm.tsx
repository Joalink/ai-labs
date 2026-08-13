import { useState } from "react";
import { HouseEnergyPredictRequest } from "@/types/house-energy";

const EXAMPLE_REQUEST: HouseEnergyPredictRequest = {
  household_size: 3,
  avg_temperature_c: 27,
  has_ac: true,
  peak_hours_usage_kwh: 4.5,
  month: 7,
  day_of_week: 3,
};

export default function EnergyConsumptionForm({loading, handlePredict}: {loading: boolean, handlePredict: (requestData: HouseEnergyPredictRequest) => void}) {

  const [formData, setFormData] = useState<HouseEnergyPredictRequest>({
    household_size: 1,
    avg_temperature_c: 20,
    has_ac: false,
    peak_hours_usage_kwh: 0,
    month: 1,
    day_of_week: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "has_ac" ? value === "true" : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePredict(formData);
  };

  return (
    <div className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Predict Energy Consumption</h2>
      <button
        type="button"
        onClick={() => setFormData(EXAMPLE_REQUEST)}
        disabled={loading}
        className="mb-4 text-sm font-medium text-indigo-700 underline underline-offset-4 hover:text-indigo-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-indigo-300 dark:hover:text-indigo-200"
      >
        Load example scenario
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="household_size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Household Size</label>
          <input
            type="number"
            name="household_size"
            id="household_size"
            value={formData.household_size}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            min={1}
          />
        </div>
        <div>
          <label htmlFor="avg_temperature_c" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Average Temperature (°C)</label>
          <input
            type="number"
            name="avg_temperature_c"
            id="avg_temperature_c"
            value={formData.avg_temperature_c}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="has_ac" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Has Air Conditioning</label>
          <select
            name="has_ac"
            id="has_ac"
            value={formData.has_ac.toString()}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div>
          <label htmlFor="peak_hours_usage_kwh" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Peak Hours Usage (kWh)</label>
          <input
            type="number"
            name="peak_hours_usage_kwh"
            id="peak_hours_usage_kwh"
            value={formData.peak_hours_usage_kwh}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Month</label>
          <select
            name="month"
            id="month"
            value={formData.month}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Day of the Week</label>
          <select
            name="day_of_week"
            id="day_of_week"
            value={formData.day_of_week}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {[...Array(7)].map((_, i) => (
              <option key={i + 1} value     ={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>
    </div>
  );
}
