
import { useState, useEffect } from "react";

// Define the input value types
export interface InputValue {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  unit: string;
  dataType: "constant" | "timeSeries";
  expenseType?: "capex" | "opex" | "revenue" | "other";
  value?: string | number;
  timeSeriesValues?: number[];
  createdAt: Date;
  updatedAt: Date;
}

type AddInputParams = Omit<InputValue, "id" | "createdAt" | "updatedAt">;

// Sample data to initialize the inputs
const initialInputs: InputValue[] = [
  // BESS Inputs
  {
    id: "bess-1",
    name: "Battery Capacity",
    description: "The total energy storage capacity of the battery system",
    categoryId: "bess",
    unit: "MWh",
    dataType: "constant",
    expenseType: "capex",
    value: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "bess-2",
    name: "Battery Round-Trip Efficiency",
    description: "The efficiency of the battery charge/discharge cycle",
    categoryId: "bess",
    unit: "%",
    dataType: "constant",
    expenseType: "other",
    value: 85,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "bess-3",
    name: "Depth of discharge",
    description: "Maximum depth of discharge for the battery system",
    categoryId: "bess",
    unit: "%",
    dataType: "constant",
    expenseType: "other",
    value: 80,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "bess-4",
    name: "BESS CAPEX",
    description: "Capital expenditure for battery energy storage system",
    categoryId: "bess",
    unit: "$/kWh",
    dataType: "constant",
    expenseType: "capex",
    value: 250,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "bess-5",
    name: "BESS fixed O&M costs",
    description: "Fixed operation and maintenance costs for the battery system",
    categoryId: "bess",
    unit: "$/kW-year",
    dataType: "constant",
    expenseType: "opex",
    value: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Solar Inputs
  {
    id: "solar-1",
    name: "Solar Capacity",
    description: "Total capacity of the solar installation",
    categoryId: "solar",
    unit: "MW DC",
    dataType: "constant",
    expenseType: "capex",
    value: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "solar-2",
    name: "Solar AC/DC ratio",
    description: "Ratio of AC to DC capacity in the solar plant",
    categoryId: "solar",
    unit: "ratio",
    dataType: "constant",
    expenseType: "other",
    value: 1.2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "solar-3",
    name: "Solar Production Profile",
    description: "Hourly solar production profile for a typical day",
    categoryId: "solar",
    unit: "MWh",
    dataType: "timeSeries",
    expenseType: "revenue",
    timeSeriesValues: [0, 0, 0, 0, 0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0, 1.0, 0.9, 0.8, 0.7, 0.5, 0.3, 0.1, 0, 0, 0, 0, 0, 0],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "solar-4",
    name: "Solar CAPEX",
    description: "Capital expenditure for solar plant",
    categoryId: "solar",
    unit: "$/kW installed",
    dataType: "constant",
    expenseType: "capex",
    value: 1100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "solar-5",
    name: "Solar fixed O&M costs",
    description: "Fixed operation and maintenance costs for solar plant",
    categoryId: "solar",
    unit: "$/kW-year",
    dataType: "constant",
    expenseType: "opex",
    value: 16,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Wind Inputs
  {
    id: "wind-1",
    name: "Wind Capacity",
    description: "Total capacity of the wind farm",
    categoryId: "wind",
    unit: "MW",
    dataType: "constant",
    expenseType: "capex",
    value: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "wind-2",
    name: "Wind Speed Data",
    description: "Hourly wind speed data for a typical day",
    categoryId: "wind",
    unit: "m/s",
    dataType: "timeSeries",
    expenseType: "other",
    timeSeriesValues: [5, 5.2, 5.5, 5.1, 4.9, 4.7, 4.6, 4.8, 5.0, 5.5, 6.0, 6.5, 7.0, 7.2, 7.0, 6.8, 6.5, 6.0, 5.8, 5.5, 5.2, 5.0, 4.8, 4.9],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "wind-3",
    name: "Wind CAPEX",
    description: "Capital expenditure for wind farm",
    categoryId: "wind",
    unit: "$/kW installed",
    dataType: "constant",
    expenseType: "capex",
    value: 1500,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Hydrogen System Inputs
  {
    id: "hydrogen-1",
    name: "Electrolyzer Capacity",
    description: "The hydrogen production capacity of the electrolyzer",
    categoryId: "hydrogen",
    unit: "MW",
    dataType: "constant",
    expenseType: "capex",
    value: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hydrogen-2",
    name: "Electrolyzer Efficiency",
    description: "Energy required to produce 1 kg of hydrogen",
    categoryId: "hydrogen",
    unit: "kWh/kg H₂",
    dataType: "constant",
    expenseType: "other",
    value: 55,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hydrogen-3",
    name: "Hydrogen Storage Capacity",
    description: "Total hydrogen storage capacity",
    categoryId: "hydrogen",
    unit: "kg",
    dataType: "constant",
    expenseType: "capex",
    value: 5000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Project Financing Inputs
  {
    id: "project-financing-1",
    name: "Project Debt Ratio",
    description: "The percentage of the project financed with debt",
    categoryId: "project-financing",
    unit: "%",
    dataType: "constant",
    expenseType: "other",
    value: 70,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "project-financing-2",
    name: "Project IRR Target",
    description: "Target internal rate of return for the project",
    categoryId: "project-financing",
    unit: "%",
    dataType: "constant",
    expenseType: "other",
    value: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // System Financing Inputs
  {
    id: "system-financing-1",
    name: "BESS WACC",
    description: "Weighted average cost of capital for BESS system",
    categoryId: "system-financing",
    unit: "%",
    dataType: "constant",
    expenseType: "other",
    value: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "system-financing-2",
    name: "Solar WACC",
    description: "Weighted average cost of capital for solar system",
    categoryId: "system-financing",
    unit: "%",
    dataType: "constant",
    expenseType: "other",
    value: 7.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Tax Credit Inputs
  {
    id: "tax-credits-1",
    name: "Investment Tax Credit",
    description: "Available investment tax credit percentage",
    categoryId: "tax-credits",
    unit: "%",
    dataType: "constant",
    expenseType: "revenue",
    value: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "tax-credits-2",
    name: "Clean Hydrogen PTC",
    description: "Production tax credit for clean hydrogen",
    categoryId: "tax-credits",
    unit: "$/kg H₂",
    dataType: "constant",
    expenseType: "revenue",
    value: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Production Assumptions
  {
    id: "production-1",
    name: "Hydrogen Production Profile",
    description: "Projected daily hydrogen production profile",
    categoryId: "production",
    unit: "kg/hour",
    dataType: "timeSeries",
    expenseType: "revenue",
    timeSeriesValues: [10, 10, 10, 10, 10, 15, 20, 25, 30, 35, 40, 40, 35, 30, 25, 20, 15, 10, 10, 10, 10, 10, 10, 10],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "production-2",
    name: "Hydrogen Selling Price",
    description: "Projected selling price for hydrogen",
    categoryId: "production",
    unit: "$/kg",
    dataType: "constant",
    expenseType: "revenue",
    value: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // OPEX Assumptions
  {
    id: "opex-1",
    name: "Water Consumption",
    description: "Water required for hydrogen production",
    categoryId: "opex",
    unit: "L/kg H₂",
    dataType: "constant",
    expenseType: "opex",
    value: 9,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "opex-2",
    name: "Staff Costs",
    description: "Annual staff costs for facility operation",
    categoryId: "opex",
    unit: "$/year",
    dataType: "constant",
    expenseType: "opex",
    value: 500000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Tax Assumptions
  {
    id: "tax-1",
    name: "Corporate Tax Rate",
    description: "Corporate income tax rate",
    categoryId: "tax",
    unit: "%",
    dataType: "constant",
    expenseType: "other",
    value: 21,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "tax-2",
    name: "Depreciation Schedule",
    description: "Asset depreciation schedule",
    categoryId: "tax",
    unit: "years",
    dataType: "constant",
    expenseType: "other",
    value: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Construction Assumptions
  {
    id: "construction-1",
    name: "Construction Period",
    description: "Total construction period for the project",
    categoryId: "construction",
    unit: "years",
    dataType: "constant",
    expenseType: "capex",
    value: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "construction-2",
    name: "Construction Loan Interest",
    description: "Interest rate for construction financing",
    categoryId: "construction",
    unit: "%",
    dataType: "constant",
    expenseType: "capex",
    value: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Create a hook to manage the inputs
export function useInputs() {
  const [inputs, setInputs] = useState<InputValue[]>([]);
  
  // Load inputs from localStorage on initial render
  useEffect(() => {
    const storedInputs = localStorage.getItem("energyProjectInputs");
    if (storedInputs) {
      try {
        const parsedInputs = JSON.parse(storedInputs);
        setInputs(parsedInputs);
      } catch (error) {
        console.error("Failed to parse stored inputs", error);
        setInputs(initialInputs);
      }
    } else {
      setInputs(initialInputs);
    }
  }, []);
  
  // Save inputs to localStorage whenever they change
  useEffect(() => {
    if (inputs.length > 0) {
      localStorage.setItem("energyProjectInputs", JSON.stringify(inputs));
    }
  }, [inputs]);
  
  // Function to add a new input
  const addInput = (input: AddInputParams) => {
    const newInput: InputValue = {
      ...input,
      id: `input-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setInputs((prevInputs) => [...prevInputs, newInput]);
  };
  
  // Function to update an existing input
  const updateInput = (id: string, updates: Partial<Omit<InputValue, "id" | "createdAt">>) => {
    setInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id
          ? { ...input, ...updates, updatedAt: new Date() }
          : input
      )
    );
  };
  
  // Function to delete an input
  const deleteInput = (id: string) => {
    setInputs((prevInputs) => prevInputs.filter((input) => input.id !== id));
  };
  
  return {
    inputs,
    addInput,
    updateInput,
    deleteInput,
  };
}
