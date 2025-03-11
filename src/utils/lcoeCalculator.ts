
import { LCOEBreakdown, LCOEInputs } from "@/models/lcoe";

// Simple NPV calculation function
function calculateNPV(cashflows: number[], discountRate: number): number {
  return cashflows.reduce((npv, cf, year) => {
    return npv + cf / Math.pow(1 + discountRate, year);
  }, 0);
}

// Calculate total energy production over project lifetime
function calculateLifetimeEnergyProduction(inputs: LCOEInputs): number {
  const { capacityKW, capacityFactor, projectLifeYears, annualDegradation } = inputs;
  
  // Annual energy in MWh without degradation = capacity (kW) * capacity factor * hours in year / 1000
  const baseAnnualEnergyMWh = (capacityKW * capacityFactor * 8760) / 1000;
  
  let totalEnergyMWh = 0;
  for (let year = 0; year < projectLifeYears; year++) {
    // Apply degradation factor
    const yearlyOutput = baseAnnualEnergyMWh * Math.pow(1 - annualDegradation, year);
    totalEnergyMWh += yearlyOutput;
  }
  
  return totalEnergyMWh;
}

// Calculate annual costs
function calculateAnnualCosts(inputs: LCOEInputs): number[] {
  const { 
    initialInvestment, 
    annualOMCost, 
    fuelCost, 
    capacityKW,
    capacityFactor,
    annualDegradation,
    projectLifeYears,
    batteryReplacementYear,
    batteryReplacementCost,
    taxRate = 0,
    investmentTaxCredit = 0,
    productionTaxCredit = 0,
    carbonEmissionsFactor = 0,
    carbonPrice = 0
  } = inputs;
  
  const annualCosts: number[] = [];
  
  // Year 0: Initial investment minus investment tax credit
  annualCosts[0] = -initialInvestment * (1 - investmentTaxCredit);
  
  // Calculate costs for each year of the project
  for (let year = 1; year <= projectLifeYears; year++) {
    // Base annual energy in MWh = capacity (kW) * capacity factor * hours in year / 1000
    const baseAnnualEnergyMWh = (capacityKW * capacityFactor * 8760) / 1000;
    // Apply degradation
    const yearlyOutputMWh = baseAnnualEnergyMWh * Math.pow(1 - annualDegradation, year - 1);
    
    // Standard annual costs include O&M and fuel
    let yearCost = -(annualOMCost + (fuelCost * yearlyOutputMWh));
    
    // Add battery replacement cost if applicable
    if (batteryReplacementYear === year && batteryReplacementCost) {
      yearCost -= batteryReplacementCost;
    }
    
    // Apply production tax credit if available
    if (productionTaxCredit > 0) {
      yearCost += productionTaxCredit * yearlyOutputMWh;
    }
    
    // Apply carbon costs if applicable
    if (carbonEmissionsFactor > 0 && carbonPrice > 0) {
      const carbonCost = carbonEmissionsFactor * yearlyOutputMWh * carbonPrice;
      yearCost -= carbonCost;
    }
    
    // Apply simple tax impact on operational expenditures (not capital expenses)
    if (taxRate > 0) {
      // Only apply tax benefits to negative cash flows (costs)
      if (yearCost < 0) {
        yearCost *= (1 - taxRate);
      }
    }
    
    annualCosts.push(yearCost);
  }
  
  return annualCosts;
}

// Main LCOE calculation function
export function calculateLCOE(inputs: LCOEInputs): LCOEBreakdown {
  const { discountRate } = inputs;
  
  // Calculate lifetime energy production
  const lifetimeEnergy = calculateLifetimeEnergyProduction(inputs);
  
  // Calculate annual costs
  const annualCosts = calculateAnnualCosts(inputs);
  
  // Calculate NPV of all costs
  const npvCosts = calculateNPV(annualCosts, discountRate);
  
  // Calculate discounted energy production
  let discountedEnergy = 0;
  const baseAnnualEnergyMWh = (inputs.capacityKW * inputs.capacityFactor * 8760) / 1000;
  
  for (let year = 0; year < inputs.projectLifeYears; year++) {
    const yearlyOutput = baseAnnualEnergyMWh * Math.pow(1 - inputs.annualDegradation, year);
    discountedEnergy += yearlyOutput / Math.pow(1 + discountRate, year + 1);
  }
  
  // Calculate total LCOE ($ per MWh)
  const totalLCOE = Math.abs(npvCosts) / discountedEnergy;
  
  // Break down LCOE components
  const capitalComponent = Math.abs(annualCosts[0]) / discountedEnergy;
  
  let oAndMComponent = 0;
  let fuelComponent = 0;
  let taxComponent = 0;
  let incentiveComponent = 0;
  let carbonComponent = 0;
  
  // Calculate O&M and fuel components from years 1+
  oAndMComponent = inputs.annualOMCost * inputs.projectLifeYears / discountedEnergy;
  fuelComponent = inputs.fuelCost * lifetimeEnergy / discountedEnergy;
  
  // Calculate tax component
  if (inputs.taxRate) {
    taxComponent = -oAndMComponent * inputs.taxRate;
  }
  
  // Calculate incentive component
  if (inputs.investmentTaxCredit) {
    incentiveComponent = -capitalComponent * inputs.investmentTaxCredit;
  }
  if (inputs.productionTaxCredit) {
    incentiveComponent -= inputs.productionTaxCredit;
  }
  
  // Calculate carbon component
  if (inputs.carbonEmissionsFactor && inputs.carbonPrice) {
    carbonComponent = inputs.carbonEmissionsFactor * inputs.carbonPrice;
  }
  
  return {
    totalLCOE,
    capitalComponent,
    oAndMComponent,
    fuelComponent,
    taxComponent,
    incentiveComponent,
    carbonComponent
  };
}

// Get default inputs based on energy source
export function getDefaultInputs(energySource: "solar" | "wind" | "battery" | "hybrid"): LCOEInputs {
  const baseInputs: LCOEInputs = {
    name: `New ${energySource.charAt(0).toUpperCase() + energySource.slice(1)} Project`,
    energySource,
    initialInvestment: 1000000,
    capacityKW: 1000,
    projectLifeYears: 25,
    discountRate: 0.08,
    annualOMCost: 20000,
    fuelCost: 0,
    capacityFactor: 0.25,
    annualDegradation: 0.005,
    taxRate: 0.21,
    investmentTaxCredit: 0,
    productionTaxCredit: 0,
    carbonEmissionsFactor: 0,
    carbonPrice: 0
  };
  
  // Customize based on energy source
  switch (energySource) {
    case "solar":
      baseInputs.initialInvestment = 1000000;
      baseInputs.capacityKW = 1000;
      baseInputs.capacityFactor = 0.25;
      baseInputs.annualOMCost = 15000;
      baseInputs.investmentTaxCredit = 0.26;
      break;
      
    case "wind":
      baseInputs.initialInvestment = 1500000;
      baseInputs.capacityKW = 1000;
      baseInputs.capacityFactor = 0.35;
      baseInputs.annualOMCost = 30000;
      baseInputs.productionTaxCredit = 25; // $ per MWh
      break;
      
    case "battery":
      baseInputs.initialInvestment = 500000;
      baseInputs.capacityKW = 500;
      baseInputs.batteryCapacityKWh = 2000;
      baseInputs.batteryRoundTripEfficiency = 0.85;
      baseInputs.batteryReplacementYear = 10;
      baseInputs.batteryReplacementCost = 250000;
      baseInputs.capacityFactor = 0.15;
      baseInputs.investmentTaxCredit = 0.30;
      break;
      
    case "hybrid":
      baseInputs.initialInvestment = 1800000;
      baseInputs.capacityKW = 1500;
      baseInputs.batteryCapacityKWh = 1000;
      baseInputs.batteryRoundTripEfficiency = 0.85;
      baseInputs.batteryReplacementYear = 10;
      baseInputs.batteryReplacementCost = 125000;
      baseInputs.capacityFactor = 0.32;
      baseInputs.investmentTaxCredit = 0.26;
      break;
  }
  
  return baseInputs;
}
