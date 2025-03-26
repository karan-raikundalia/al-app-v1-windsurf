
import { useState, useEffect } from "react";
import { VariableControl, type AnalysisVariable } from "./VariableControl";
import { DataPanel } from "@/components/ui/DataPanel";
import { SensitivityChart } from "./sensitivity/SensitivityChart";
import { SensitivitySummary } from "./sensitivity/SensitivitySummary";
import { useToast } from "@/components/ui/use-toast";
import { useInputs } from "@/hooks/use-inputs";
import { Button } from "@/components/ui/button";
import { SaveIcon, RotateCcw } from "lucide-react";
import { 
  metrics, 
  transformInputToAnalysisVariable, 
  baselineValues 
} from "./sensitivity/SensitivityData";

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
  const { toast } = useToast();
  
  // Transform inputs to analysis variables whenever inputs change
  const availableVariables = inputs.map(input => 
    transformInputToAnalysisVariable(input)
  );

  useEffect(() => {
    // Update base value when metric changes
    setBaseValue(baselineValues[currentMetric] || 1000000);
  }, [currentMetric]);

  const handleVariableSelection = (variables: AnalysisVariable[]) => {
    setSelectedVariables(variables);
  };

  const handleMetricChange = (metric: string) => {
    setCurrentMetric(metric);
    
    // Update base value based on the selected metric
    setBaseValue(baselineValues[metric] || 1000000);
    
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
          metrics={metrics}
          onMetricChange={handleMetricChange}
          currentMetric={currentMetric}
          baseValue={baseValue}
          onBaseValueChange={handleBaseValueChange}
        />
      </DataPanel>
      
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
