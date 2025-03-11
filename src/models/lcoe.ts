
export interface LCOEInputs {
  id?: string;
  name: string;
  energySource: "solar" | "wind" | "battery" | "hybrid";
  
  // Capital costs
  initialInvestment: number; // $ total investment
  capacityKW: number; // KW
  projectLifeYears: number; // years
  discountRate: number; // % as decimal (e.g., 0.08 for 8%)
  
  // Operation costs
  annualOMCost: number; // $ per year
  fuelCost: number; // $ per MWh (applicable for some sources)
  
  // Performance parameters
  capacityFactor: number; // % as decimal (e.g., 0.25 for 25%)
  annualDegradation: number; // % as decimal (e.g., 0.005 for 0.5% per year)
  
  // Battery specific (optional)
  batteryCapacityKWh?: number; // KWh
  batteryRoundTripEfficiency?: number; // % as decimal
  batteryReplacementYear?: number; // year number when replacement occurs
  batteryReplacementCost?: number; // $ cost for replacement
  
  // Tax and incentives
  taxRate?: number; // % as decimal
  investmentTaxCredit?: number; // % as decimal
  productionTaxCredit?: number; // $ per MWh
  
  // Carbon impact
  carbonEmissionsFactor?: number; // tons CO2 per MWh
  carbonPrice?: number; // $ per ton CO2
  
  // Timestamp
  createdAt?: string;
}

export interface LCOEBreakdown {
  totalLCOE: number; // $ per MWh
  capitalComponent: number; // $ per MWh
  oAndMComponent: number; // $ per MWh
  fuelComponent: number; // $ per MWh
  taxComponent: number; // $ per MWh
  incentiveComponent: number; // $ per MWh
  carbonComponent: number; // $ per MWh
}

export interface LCOEResult {
  inputs: LCOEInputs;
  breakdown: LCOEBreakdown;
}
