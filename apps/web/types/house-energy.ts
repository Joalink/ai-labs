export interface HouseEnergyPredictResponse {
  energy_consumption_kwh: number;
}

export interface HouseEnergyPredictRequest {
  household_size: number;
  avg_temperature_c: number;
  has_ac: boolean;
  peak_hours_usage_kwh: number;
  month: number;
  day_of_week: number;
}
