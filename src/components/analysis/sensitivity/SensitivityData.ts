
import { AnalysisVariable } from "../VariableControl";
import { InputValue } from "@/hooks/use-inputs";

// List of output metrics for the analysis - no longer needed here as we get from outputs hook
export const metrics = [
  "NPV", 
  "IRR", 
  "DSCR", 
  "LCOE", 
  "LCOH", 
  "Payback", 
  "Equity IRR", 
  "MOIC",
  "Dividend Yield",
  "Cash-on-Cash Return",
  "LLCR",
  "PLCR",
  "Interest Coverage Ratio",
  "Gearing Ratio"
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
    case "LCOE":
      sensitivityFactor = variable.category === "solar" || variable.category === "wind" ? 1.8 : 0.9;
      break;
    case "LCOH":
      sensitivityFactor = variable.category === "hydrogen" ? 2.0 : 0.7;
      break;
    case "Equity IRR":
      sensitivityFactor = variable.metric === "revenue" ? 1.7 : 0.9;
      break;
    case "Dividend Yield":
      sensitivityFactor = variable.metric === "revenue" ? 1.4 : 0.6;
      break;
    case "MOIC":
      sensitivityFactor = variable.metric === "cost" ? 1.3 : 0.8;
      break;
    default:
      sensitivityFactor = 1.0;
  }
  
  // Calculate impact based on the variable's base value, percentage change, and sensitivity factor
  const impact = variable.baseValue * (percentageChange / 100) * sensitivityFactor;
  
  // For certain metrics like IRR and yield rates, the impact should be proportionally smaller
  const proportionalMetrics = ["IRR", "Equity IRR", "Dividend Yield", "DSCR", "LLCR", "PLCR"];
  if (proportionalMetrics.includes(targetMetric)) {
    return impact * 0.1; // Scale down for percentage-based metrics
  }
  
  return impact;
}

// Simulated LCOE calculation based on inputs
export function calculateLCOE(inputs: InputValue[]): number {
  // Basic LCOE calculation for renewable energy projects
  
  // Find key inputs
  const totalCapex = inputs.find(i => i.name === "Solar CAPEX" || i.name === "Wind CAPEX")?.value as number || 1100;
  const capacityFactor = inputs.find(i => i.name.includes("Capacity Factor"))?.value as number || 0.25;
  const opexCost = inputs.find(i => i.name.includes("O&M"))?.value as number || 20;
  const discountRate = inputs.find(i => i.name.includes("WACC"))?.value as number || 0.08;
  const projectLife = inputs.find(i => i.name.includes("Project Life"))?.value as number || 25;
  
  // Simple LCOE formula: (Total CAPEX + NPV of OPEX) / (Annual Energy Production × Project Life × Discount Factor)
  const annualProduction = 8760 * capacityFactor; // hours × capacity factor
  const opexNPV = opexCost * ((1 - Math.pow(1 + discountRate, -projectLife)) / discountRate);
  
  const lcoe = (totalCapex + opexNPV) / (annualProduction * projectLife);
  return lcoe;
}

// Simulated LCOH calculation based on inputs
export function calculateLCOH(inputs: InputValue[]): number {
  // Find key hydrogen-related inputs
  const electrolyzerCapex = inputs.find(i => i.name === "Electrolyzer Capacity")?.value as number || 800;
  const electrolyzerEfficiency = inputs.find(i => i.name === "Electrolyzer Efficiency")?.value as number || 55;
  const electricityPrice = inputs.find(i => i.name === "Hydrogen Selling Price")?.value as number || 50;
  const utilizationRate = 0.7; // Default 70% utilization
  const opexPct = 0.03; // Default 3% of CAPEX for annual OPEX
  
  // Simple LCOH calculation
  const electricityCost = (electrolyzerEfficiency * electricityPrice) / 1000; // Convert to $ per kg
  const capitalRecoveryFactor = 0.1; // Simplified factor
  const capexPerKg = (electrolyzerCapex * capitalRecoveryFactor) / (365 * 24 * utilizationRate);
  const opexPerKg = capexPerKg * opexPct;
  
  return electricityCost + capexPerKg + opexPerKg;
}
