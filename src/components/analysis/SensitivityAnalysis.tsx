
import { useState, useEffect } from "react";
import { VariableControl, type AnalysisVariable } from "./VariableControl";
import { DataPanel } from "@/components/ui/DataPanel";
import { SensitivityChart } from "./sensitivity/SensitivityChart";
import { SensitivitySummary } from "./sensitivity/SensitivitySummary";
import { useToast } from "@/components/ui/use-toast";
import { useInputs } from "@/hooks/use-inputs";
import { useOutputs } from "@/hooks/use-outputs";
import { Button } from "@/components/ui/button";
import { SaveIcon, RotateCcw } from "lucide-react";
import { transformInputToAnalysisVariable, calculateLCOE, calculateLCOH } from "./sensitivity/SensitivityData";

export function SensitivityAnalysis() {
  const [selectedVariables, setSelectedVariables] = useState<AnalysisVariable[]>([]);
  const [currentMetric, setCurrentMetric] = useState("NPV");
  const [isLoading, setIsLoading] = useState(false);
  const [baseValue, setBaseValue] = useState(1000000); // Default base value for the analysis
  const [savedAnalyses, setSavedAnalyses] = useState<Array<{
    id: string;
    name: string;
    metric: string;
    variables: AnalysisVariable[];
    baseValue: number;
  }>>([]);
  
  const { inputs } = useInputs();
  const { getAllOutputs } = useOutputs();
  const { toast } = useToast();
  
  // Calculate derived metrics
  const lcoeValue = calculateLCOE(inputs);
  const lcohValue = calculateLCOH(inputs);
  
  // Add derived metrics to the available variables
  const derivedMetricInputs = [
    {
      id: "derived-lcoe",
      name: "Levelized Cost of Energy (LCOE)",
      description: "Calculated LCOE based on project inputs",
      categoryId: "production",
      unit: "$/MWh",
      dataType: "constant" as const,
      expenseType: "other" as const,
      value: lcoeValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "derived-lcoh",
      name: "Levelized Cost of Hydrogen (LCOH)",
      description: "Calculated LCOH based on project inputs",
      categoryId: "production",
      unit: "$/kg",
      dataType: "constant" as const,
      expenseType: "other" as const,
      value: lcohValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];
  
  // Get the list of output metrics from the outputs hook
  const outputMetrics = getAllOutputs().map(output => output.name);
  
  // Transform inputs to analysis variables whenever inputs change
  const availableVariables = [
    ...inputs.map(input => transformInputToAnalysisVariable(input)),
    ...derivedMetricInputs.map(input => transformInputToAnalysisVariable(input))
  ];

  const handleVariableSelection = (variables: AnalysisVariable[]) => {
    setSelectedVariables(variables);
  };

  const handleMetricChange = (metric: string) => {
    setCurrentMetric(metric);
    
    // Find the selected output to get its base value
    const selectedOutput = getAllOutputs().find(output => output.name === metric);
    
    // Update base value based on the selected metric
    if (selectedOutput) {
      setBaseValue(selectedOutput.value);
    } else {
      // Fallback to default values if not found in outputs
      const metricBaseValues: Record<string, number> = {
        "NPV": 1000000,
        "IRR": 12,
        "DSCR": 1.5,
        "LCOE": lcoeValue || 45,
        "LCOH": lcohValue || 4.5,
        "Payback": 5,
        "Equity IRR": 15,
        "MOIC": 2.5,
        "Dividend Yield": 6,
        "Cash-on-Cash Return": 12,
        "LLCR": 1.8,
        "PLCR": 2.0,
        "Interest Coverage Ratio": 3.5,
        "Gearing Ratio": 70
      };
      
      setBaseValue(metricBaseValues[metric] || 0);
    }
    
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  const handleBaseValueChange = (newBaseValue: number) => {
    setBaseValue(newBaseValue);
  };
  
  const handleSaveAnalysis = () => {
    if (selectedVariables.length === 0) {
      toast({
        title: "No variables selected",
        description: "Please select at least one variable to save this analysis.",
        variant: "destructive"
      });
      return;
    }
    
    const id = `analysis-${Date.now()}`;
    const newSavedAnalysis = {
      id,
      name: `${currentMetric} Analysis ${savedAnalyses.length + 1}`,
      metric: currentMetric,
      variables: selectedVariables,
      baseValue
    };
    
    setSavedAnalyses(prev => [...prev, newSavedAnalysis]);
    
    toast({
      title: "Analysis saved",
      description: `${currentMetric} analysis has been saved and can be accessed later.`
    });
  };
  
  const handleResetAnalysis = () => {
    setSelectedVariables([]);
    toast({
      description: "Analysis has been reset. You can now start a new analysis."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Sensitivity Analysis</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveAnalysis}
            className="flex items-center gap-1"
          >
            <SaveIcon className="h-4 w-4" />
            Save Analysis
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetAnalysis}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
      
      <p className="text-muted-foreground max-w-4xl">
        Understand how different variables impact your project outcomes. Select an output metric, 
        choose input variables to analyze, and visualize their impact with an interactive tornado chart.
      </p>
      
      <DataPanel>
        <VariableControl
          availableVariables={availableVariables}
          onVariableSelection={handleVariableSelection}
          selectedVariables={selectedVariables}
          metrics={outputMetrics}
          onMetricChange={handleMetricChange}
          currentMetric={currentMetric}
          baseValue={baseValue}
          onBaseValueChange={handleBaseValueChange}
          showBaseValueInput={true} // Set to true to show base value input
        />
      </DataPanel>
      
      {/* Fix the build error by properly passing props to SensitivityChart component */}
      <SensitivityChart 
        selectedVariables={selectedVariables}
        currentMetric={currentMetric}
        isLoading={isLoading}
        baseValue={baseValue}
      />
      
      <SensitivitySummary 
        selectedVariables={selectedVariables}
        currentMetric={currentMetric}
        baseValue={baseValue}
      />
    </div>
  );
}
