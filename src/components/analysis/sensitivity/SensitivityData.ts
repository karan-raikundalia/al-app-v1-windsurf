
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

// This function would calculate the actual impact in a real application
// Here we're just using placeholder logic
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
  return variable.baseValue * (percentageChange / 100) * sensitivityFactor;
}
