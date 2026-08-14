export function estimateDailyEnergyCost(kwh: number, tariff: number): number {
  return kwh * tariff;
}
