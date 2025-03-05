
// Helper functions for Monte Carlo analysis

export function formatMetricValue(value: number, metric: string): string {
  if (metric === "npv") return `$${(value / 1000000).toFixed(2)}M`;
  if (metric === "irr") return `${(value * 100).toFixed(2)}%`;
  if (metric === "paybackPeriod") return `${value.toFixed(2)} years`;
  if (metric === "debtServiceCoverage") return value.toFixed(2);
  if (metric === "equityMultiple") return `${value.toFixed(2)}x`;
  return value.toFixed(2);
}

export function calculateMean(arr: number[]): number {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

export function calculateProbability(arr: number[], predicate: (val: number) => boolean): number {
  return arr.filter(predicate).length / arr.length;
}
