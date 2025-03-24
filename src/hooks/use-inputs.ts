
import { useState, useEffect } from "react";

// Define the input value types
export interface InputValue {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  unit: string;
  dataType: "constant" | "timeSeries";
  value?: string | number;
  timeSeriesValues?: number[];
  createdAt: Date;
  updatedAt: Date;
}

type AddInputParams = Omit<InputValue, "id" | "createdAt" | "updatedAt">;

// Sample data to initialize the inputs
const initialInputs: InputValue[] = [
  {
    id: "1",
    name: "Battery Capacity",
    description: "The total energy storage capacity of the battery system",
    categoryId: "bess",
    unit: "MWh",
    dataType: "constant",
    value: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Battery Round-Trip Efficiency",
    description: "The efficiency of the battery charge/discharge cycle",
    categoryId: "bess",
    unit: "%",
    dataType: "constant",
    value: 85,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Electrolyzer Capacity",
    description: "The hydrogen production capacity of the electrolyzer",
    categoryId: "hydrogen",
    unit: "MW",
    dataType: "constant",
    value: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Solar Production Profile",
    description: "Hourly solar production profile for a typical day",
    categoryId: "production",
    unit: "MWh",
    dataType: "timeSeries",
    timeSeriesValues: [0, 0, 0, 0, 0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0, 1.0, 0.9, 0.8, 0.7, 0.5, 0.3, 0.1, 0, 0, 0, 0, 0, 0],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Project Debt Ratio",
    description: "The percentage of the project financed with debt",
    categoryId: "project-financing",
    unit: "%",
    dataType: "constant",
    value: 70,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Investment Tax Credit",
    description: "Available investment tax credit percentage",
    categoryId: "tax-credits",
    unit: "%",
    dataType: "constant",
    value: 30,
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
