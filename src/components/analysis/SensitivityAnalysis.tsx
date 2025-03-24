
import { useState, useEffect } from "react";
import { Play, Save } from "lucide-react";
import { DataPanel } from "@/components/ui/DataPanel";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OutputMetricSelector, OutputMetric } from "./sensitivity/OutputMetricSelector";
import { VariableRangeSelector, VariableRange } from "./sensitivity/VariableRangeSelector";
import { SavedConfigurations, SensitivityConfig } from "./sensitivity/SavedConfigurations";
import { SensitivityResults, SensitivityResult } from "./sensitivity/SensitivityResults";
import { useInputs } from "@/hooks/use-inputs";
import { calculateLCOE } from "@/utils/lcoeCalculator";

export function SensitivityAnalysis() {
  const { inputs } = useInputs();
  const [selectedMetric, setSelectedMetric] = useState<OutputMetric | null>(null);
  const [variableRanges, setVariableRanges] = useState<VariableRange[]>([]);
  const [results, setResults] = useState<SensitivityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [baseOutputValue, setBaseOutputValue] = useState(0);

  // Generate more realistic results for the selected metric and variables
  const runAnalysis = () => {
    if (!selectedMetric) {
      toast.error("Please select an output metric");
      return;
    }

    if (variableRanges.length === 0) {
      toast.error("Please select at least one variable to test");
      return;
    }

    setIsLoading(true);

    // Simulate base value calculation
    // In a real implementation, this would use actual calculation logic
    let mockBaseValue = 0;

    if (selectedMetric.id === "lcoe") {
      // Use the LCOE calculator for more realistic results
      mockBaseValue = calculateLCOE({
        name: "Test Project",
        energySource: "solar",
        initialInvestment: 1000000,
        capacityKW: 1000,
        projectLifeYears: 25,
        discountRate: 0.08,
        annualOMCost: 20000,
        fuelCost: 0,
        capacityFactor: 0.25,
        annualDegradation: 0.005
      }).totalLCOE;
    } else {
      // For other metrics, generate a plausible value based on the metric
      switch (selectedMetric.id) {
        case "npv":
          mockBaseValue = 1250000;
          break;
        case "irr":
          mockBaseValue = 12.5;
          break;
        case "payback":
          mockBaseValue = 7.2;
          break;
        case "dscr":
          mockBaseValue = 1.35;
          break;
        case "lcoh":
          mockBaseValue = 4.2;
          break;
        default:
          mockBaseValue = 100 + Math.random() * 500;
      }
    }

    setBaseOutputValue(mockBaseValue);

    // Simulate API call with a timeout
    setTimeout(() => {
      const mockResults: SensitivityResult[] = variableRanges.map(range => {
        const variable = inputs.find(i => i.id === range.variableId);
        if (!variable) {
          return {
            variableId: range.variableId,
            variableName: "Unknown Variable",
            baseValue: 0,
            testValue: 0,
            outputValue: 0,
            percentChange: 0,
            absoluteChange: 0,
            unit: ""
          };
        }

        // Use the modified base value if provided
        const baseValue = range.modifiedBaseValue !== undefined ? 
          range.modifiedBaseValue : 
          (typeof variable.value === 'number' ? variable.value : 0);
          
        const testValue = range.maxValue; // Use the max value for testing
        
        // Generate a more realistic impact based on the variable and metric
        let impactFactor = 0;
        
        // Different variables have different impacts on different metrics
        if (variable.name.toLowerCase().includes("capex") || variable.name.toLowerCase().includes("investment")) {
          impactFactor = selectedMetric.id === "npv" ? -0.6 : 
            selectedMetric.id === "irr" ? -0.8 : 
            selectedMetric.id === "payback" ? 0.7 : 
            selectedMetric.id === "lcoe" ? 0.5 : 0.3;
        } else if (variable.name.toLowerCase().includes("capacity") || variable.name.toLowerCase().includes("production")) {
          impactFactor = selectedMetric.id === "npv" ? 0.7 : 
            selectedMetric.id === "irr" ? 0.6 : 
            selectedMetric.id === "payback" ? -0.5 : 
            selectedMetric.id === "lcoe" ? -0.7 : 0.2;
        } else if (variable.name.toLowerCase().includes("rate") || variable.name.toLowerCase().includes("discount")) {
          impactFactor = selectedMetric.id === "npv" ? -0.9 : 
            selectedMetric.id === "irr" ? -0.2 : 
            selectedMetric.id === "payback" ? 0.3 : 
            selectedMetric.id === "lcoe" ? 0.4 : 0.5;
        } else {
          // Add some variability for other variables
          impactFactor = (Math.random() * 0.8 - 0.4) * (Math.random() > 0.5 ? 1 : -1);
        }
        
        // Calculate the percentage change in the input variable
        const inputPercentChange = ((testValue - baseValue) / baseValue);
        
        // Calculate the impact on the output metric based on the input change
        const outputPercentChange = inputPercentChange * impactFactor;
        const absoluteChange = mockBaseValue * outputPercentChange;
        
        return {
          variableId: range.variableId,
          variableName: variable.name,
          baseValue: baseValue,
          testValue: testValue,
          outputValue: mockBaseValue + absoluteChange,
          percentChange: outputPercentChange * 100,
          absoluteChange: absoluteChange,
          unit: variable.unit || ""
        };
      });

      setResults(mockResults);
      setIsLoading(false);
      toast.success("Sensitivity analysis completed");
    }, 1500);
  };

  const handleLoadConfig = (config: SensitivityConfig) => {
    setSelectedMetric(config.outputMetric);
    setVariableRanges(config.variableRanges);
    toast.success(`Loaded configuration: ${config.name}`);
  };

  const handleReset = () => {
    setSelectedMetric(null);
    setVariableRanges([]);
    setResults([]);
    setBaseOutputValue(0);
  };

  // Derive selected variables from the ranges
  const selectedVariables = variableRanges.map(range => {
    const input = inputs.find(i => i.id === range.variableId);
    if (!input) return null;
    
    // Convert InputValue to AnalysisVariable
    return {
      id: input.id,
      name: input.name,
      baseValue: range.modifiedBaseValue !== undefined ? range.modifiedBaseValue : 
                (typeof input.value === 'number' ? input.value : 0),
      minValue: range.minValue,
      maxValue: range.maxValue,
      impact: 0, // Will be calculated during analysis
      category: input.categoryId,
      metric: "cost" // Default
    };
  }).filter(Boolean) as any[]; // Filter out nulls

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sensitivity Analysis</h1>
          <p className="text-muted-foreground">
            Analyze how changes in input variables affect your project's financial outcomes
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runAnalysis} disabled={!selectedMetric || variableRanges.length === 0}>
            <Play className="h-4 w-4 mr-2" />
            Run Analysis
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <DataPanel>
            <div className="space-y-6">
              <OutputMetricSelector 
                selectedMetric={selectedMetric}
                onMetricChange={setSelectedMetric}
              />
              
              <VariableRangeSelector
                selectedVariables={selectedVariables}
                ranges={variableRanges}
                onRangeChange={setVariableRanges}
              />
            </div>
          </DataPanel>
          
          <DataPanel>
            <SavedConfigurations
              currentConfig={{
                outputMetric: selectedMetric,
                variableRanges: variableRanges,
              }}
              onLoadConfig={handleLoadConfig}
              onReset={handleReset}
            />
          </DataPanel>
        </div>
        
        <div className="lg:col-span-2">
          <SensitivityResults
            outputMetric={selectedMetric}
            results={results}
            isLoading={isLoading}
            baseOutputValue={baseOutputValue}
          />
        </div>
      </div>
    </div>
  );
}
