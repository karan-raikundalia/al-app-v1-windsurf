
import { AnalysisVariable } from "../VariableControl";
import { InputValue } from "@/hooks/use-inputs";

// List of output metrics for the analysis
export const metrics = [
  "NPV", 
  "IRR", 
  "DSCR", 
  "LCOE", 
  "LCOH", 
  "Payback", 
  "Equity IRR", 
  "MOIC"
];

// Baseline values for different metrics (for demo purposes)
export const baselineValues: Record<string, number> = {
  "NPV": 1000000,
  "IRR": 12,
  "DSCR": 1.5,
  "LCOE": 45,
  "LCOH": 4.5,
  "Payback": 5,
  "Equity IRR": 15,
  "MOIC": 2.5
};

// Units for each metric
export const metricUnits: Record<string, string> = {
  "NPV": "$",
  "IRR": "%",
  "DSCR": "ratio",
  "LCOE": "$/MWh",
  "LCOH": "$/kg",
  "Payback": "years",
  "Equity IRR": "%",
  "MOIC": "x"
};

// Transform InputValue to AnalysisVariable
export function transformInputToAnalysisVariable(input: InputValue): AnalysisVariable {
  // For time series, use the average or first value as base value
  const baseValue = typeof input.value === "number" 
    ? input.value 
    : input.timeSeriesValues && input.timeSeriesValues.length > 0
      ? input.timeSeriesValues[0]
      : 0;
  
  // Calculate reasonable min/max values based on the data type
  const minValue = baseValue * 0.8; // 20% below base
  const maxValue = baseValue * 1.2; // 20% above base
  
  // Map expense type to a metric
  let metric: "cost" | "schedule" | "performance" | "revenue" | "other" = "other";
  
  if (input.expenseType === "capex" || input.expenseType === "opex") {
    metric = "cost";
  } else if (input.expenseType === "revenue") {
    metric = "revenue";
  }
  
  // Determine the impact based on the metric type
  // In a real application, this would come from a simulation
  // Here we'll use a simple heuristic
  const impact = baseValue * 0.1; // Default to 10% of base value
  
  return {
    id: input.id,
    name: input.name,
    baseValue: baseValue,
    minValue,
    maxValue,
    impact,
    category: input.categoryId,
    unit: input.unit,
    metric
  };
}

// Calculate the actual impact of a variable on a metric
export function calculateVariableImpact(
  variable: AnalysisVariable,
  targetMetric: string,
  baselineValue: number,
  percentageChange: number
): number {
  // Example implementation - in a real app, this would use your financial model
  let sensitivityFactor;
  
  // Determine sensitivity based on the variable category and target metric
  switch (targetMetric) {
    case "NPV":
      sensitivityFactor = variable.metric === "revenue" ? 1.5 : 0.8;
      break;
    case "IRR":
      sensitivityFactor = variable.metric === "cost" ? 1.2 : 0.6;
      break;
    case "DSCR":
      sensitivityFactor = variable.metric === "revenue" ? 0.7 : 0.4;
      break;
    default:
      sensitivityFactor = 1.0;
  }
  
  // Calculate impact based on the variable's base value, percentage change, and sensitivity factor
  return baselineValue * (percentageChange / 100) * sensitivityFactor;
}

// Generate detailed analysis results for a variable
export function generateVariableAnalysisData(
  variable: AnalysisVariable,
  metric: string
): {
  variable: string;
  positive: number;
  negative: number;
  positivePercentage: number;
  negativePercentage: number;
  baselineValue: number;
} {
  const baselineValue = baselineValues[metric] || 1000;
  
  // Calculate positive and negative impacts
  const positiveChange = calculateVariableImpact(variable, metric, baselineValue, 20);
  const negativeChange = calculateVariableImpact(variable, metric, baselineValue, -20);
  
  // Calculate percentage changes
  const positivePercentage = (positiveChange / baselineValue) * 100;
  const negativePercentage = (negativeChange / baselineValue) * 100;
  
  return {
    variable: variable.name,
    positive: positiveChange,
    negative: negativeChange,
    positivePercentage,
    negativePercentage,
    baselineValue
  };
}

// Format the value based on the metric type
export function formatMetricValue(value: number, metric: string): string {
  const unit = metricUnits[metric] || "";
  
  if (metric === "NPV") {
    return `${unit}${(value / 1000000).toFixed(2)}M`;
  } else if (metric === "IRR" || metric === "Equity IRR") {
    return `${value.toFixed(2)}${unit}`;
  } else if (metric === "LCOE") {
    return `${unit}${value.toFixed(2)}/MWh`;
  } else if (metric === "LCOH") {
    return `${unit}${value.toFixed(2)}/kg`;
  } else if (metric === "Payback") {
    return `${value.toFixed(1)} ${unit}`;
  } else if (metric === "MOIC") {
    return `${value.toFixed(2)}${unit}`;
  } else {
    return `${value.toFixed(2)}${unit}`;
  }
}
