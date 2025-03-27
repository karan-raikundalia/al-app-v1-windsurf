
import { useState, useEffect, createContext, useContext } from "react";
import { OutputValue, OutputCategory } from "@/models/outputs";

// Initial default outputs organized by stakeholder type
const initialOutputs: OutputCategory[] = [
  {
    id: "developer",
    name: "Project Developer",
    description: "Key financial and operational metrics for project developers",
    outputs: [
      {
        id: "irr",
        name: "Internal Rate of Return (IRR)",
        description: "The annualized rate of return on the project investment",
        value: 12.5,
        unit: "%",
        category: "developer",
        format: "percentage",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "npv",
        name: "Net Present Value (NPV)",
        description: "The present value of all future cash flows, discounted at the required rate of return",
        value: 15000000,
        unit: "$",
        category: "developer",
        format: "currency",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "payback",
        name: "Payback Period",
        description: "Time required to recover the initial investment",
        value: 5.2,
        unit: "years",
        category: "developer",
        format: "years",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "dev-costs",
        name: "Project Development Costs",
        description: "Total costs associated with project development phase",
        value: 2500000,
        unit: "$",
        category: "developer",
        format: "currency",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "construction-timeline",
        name: "Construction Timeline",
        description: "Expected duration of construction phase",
        value: 2.5,
        unit: "years",
        category: "developer",
        format: "years",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ebitda-margin",
        name: "EBITDA Margin",
        description: "Earnings before interest, taxes, depreciation, and amortization as percentage of revenue",
        value: 35,
        unit: "%",
        category: "developer",
        format: "percentage",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "lcoh",
        name: "Levelized Cost of Hydrogen (LCOH)",
        description: "The average cost per unit of hydrogen produced over the lifetime of the project",
        value: 4.5,
        unit: "$/kg",
        category: "developer",
        format: "currency",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "lcoe",
        name: "Levelized Cost of Energy (LCOE)",
        description: "The average cost per unit of electricity generated over the lifetime of the project",
        value: 45,
        unit: "$/MWh",
        category: "developer",
        format: "currency",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "system-efficiency",
        name: "System Integration Efficiency",
        description: "Overall efficiency of the integrated energy system",
        value: 68,
        unit: "%",
        category: "developer",
        format: "percentage",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "availability",
        name: "Plant Availability Factor",
        description: "Percentage of time the plant is available to produce energy",
        value: 92,
        unit: "%",
        category: "developer",
        format: "percentage",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "h2-production",
        name: "Hydrogen Production Volume",
        description: "Annual hydrogen production volume",
        value: 25000,
        unit: "tons/year",
        category: "developer",
        format: "number",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: "equity",
    name: "Equity Investors",
    description: "Key financial metrics for equity investors",
    outputs: [
      {
        id: "equity-irr",
        name: "Equity IRR",
        description: "The annualized rate of return on the equity investment",
        value: 15.8,
        unit: "%",
        category: "equity",
        format: "percentage",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "equity-npv",
        name: "Equity NPV",
        description: "The present value of all future equity cash flows, discounted at the required rate of return",
        value: 8500000,
        unit: "$",
        category: "equity",
        format: "currency",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "dividend-yield",
        name: "Dividend Yield",
        description: "Annual dividends as a percentage of equity investment",
        value: 6.5,
        unit: "%",
        category: "equity",
        format: "percentage",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cash-on-cash",
        name: "Cash-on-Cash Return",
        description: "Annual cash flow as a percentage of equity investment",
        value: 12.3,
        unit: "%",
        category: "equity",
        format: "percentage",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "moic",
        name: "MOIC (Multiple on Invested Capital)",
        description: "Ratio of total cash returned to total cash invested",
        value: 2.5,
        unit: "x",
        category: "equity",
        format: "ratio",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: "debt",
    name: "Debt Providers",
    description: "Key financial metrics for debt providers",
    outputs: [
      {
        id: "dscr",
        name: "Debt Service Coverage Ratio (DSCR)",
        description: "Ratio of operating income to debt servicing costs",
        value: 1.4,
        unit: "x",
        category: "debt",
        format: "ratio",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "llcr",
        name: "Loan Life Coverage Ratio (LLCR)",
        description: "Ratio of the NPV of cash flow available for debt service to outstanding debt",
        value: 1.8,
        unit: "x",
        category: "debt",
        format: "ratio",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "plcr",
        name: "Project Life Coverage Ratio (PLCR)",
        description: "Ratio of the NPV of cash flow over the project's lifetime to outstanding debt",
        value: 2.1,
        unit: "x",
        category: "debt",
        format: "ratio",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "interest-coverage",
        name: "Interest Coverage Ratio",
        description: "Ratio of operating income to interest expense",
        value: 3.5,
        unit: "x",
        category: "debt",
        format: "ratio",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "gearing",
        name: "Gearing Ratio (Debt-to-Equity)",
        description: "Ratio of debt to equity in the capital structure",
        value: 70,
        unit: "%",
        category: "debt",
        format: "percentage",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "debt-sizing",
        name: "Debt Sizing Capacity",
        description: "Maximum debt capacity based on project cash flows and ratios",
        value: 45000000,
        unit: "$",
        category: "debt",
        format: "currency",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  }
];

type OutputsContextType = {
  outputs: OutputCategory[];
  updateOutput: (id: string, value: number) => void;
  getAllOutputs: () => OutputValue[];
};

const OutputsContext = createContext<OutputsContextType>({
  outputs: [],
  updateOutput: () => {},
  getAllOutputs: () => [],
});

export const OutputsProvider = ({ children }: { children: React.ReactNode }) => {
  const [outputs, setOutputs] = useState<OutputCategory[]>(initialOutputs);
  
  // Update a specific output value
  const updateOutput = (id: string, value: number) => {
    setOutputs(prevOutputs => {
      return prevOutputs.map(category => {
        const updatedOutputs = category.outputs.map(output => {
          if (output.id === id) {
            return {
              ...output,
              value,
              updatedAt: new Date(),
            };
          }
          return output;
        });
        
        return {
          ...category,
          outputs: updatedOutputs,
        };
      });
    });
  };
  
  // Get a flat list of all outputs across categories
  const getAllOutputs = (): OutputValue[] => {
    return outputs.flatMap(category => category.outputs);
  };
  
  return (
    <OutputsContext.Provider value={{ outputs, updateOutput, getAllOutputs }}>
      {children}
    </OutputsContext.Provider>
  );
};

export const useOutputs = () => useContext(OutputsContext);
