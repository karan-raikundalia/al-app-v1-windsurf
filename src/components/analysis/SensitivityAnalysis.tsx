
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

export function SensitivityAnalysis() {
  const { inputs } = useInputs();
  const [selectedMetric, setSelectedMetric] = useState<OutputMetric | null>(null);
  const [variableRanges, setVariableRanges] = useState<VariableRange[]>([]);
  const [results, setResults] = useState<SensitivityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [baseOutputValue, setBaseOutputValue] = useState(0);

  // For demo purposes, calculate mock results
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

    // Generate a random base value for the selected metric
    const mockBaseValue = Math.random() * 1000;
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

        const baseValue = typeof variable.value === 'number' ? variable.value : 0;
        const testValue = range.maxValue; // Use the max value for testing
        
        // Generate a random impact between -20% and +20% of the base output value
        const randomImpact = (Math.random() * 0.4 - 0.2) * mockBaseValue;
        
        return {
          variableId: range.variableId,
          variableName: variable.name,
          baseValue: baseValue,
          testValue: testValue,
          outputValue: mockBaseValue + randomImpact,
          percentChange: (randomImpact / mockBaseValue) * 100,
          absoluteChange: randomImpact,
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

  // Derive selected variables from the ranges
  const selectedVariables = variableRanges.map(range => {
    const input = inputs.find(i => i.id === range.variableId);
    if (!input) return null;
    
    // Convert InputValue to AnalysisVariable
    return {
      id: input.id,
      name: input.name,
      baseValue: typeof input.value === 'number' ? input.value : 0,
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
