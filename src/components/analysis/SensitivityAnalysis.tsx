
import { useState, useEffect } from "react";
import { VariableControl, type AnalysisVariable } from "./VariableControl";
import { DataPanel } from "@/components/ui/DataPanel";
import { SensitivityChart } from "./sensitivity/SensitivityChart";
import { SensitivitySummary } from "./sensitivity/SensitivitySummary";
import { SensitivityCoefficientTable } from "./sensitivity/SensitivityCoefficientTable";
import { useToast } from "@/components/ui/use-toast";
import { useInputs } from "@/hooks/use-inputs";
import { useOutputs } from "@/hooks/use-outputs";
import { Button } from "@/components/ui/button";
import { SaveIcon, RotateCcw, PlusCircle, X } from "lucide-react";
import { transformInputToAnalysisVariable, calculateLCOE, calculateLCOH } from "./sensitivity/SensitivityData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SensitivityAnalysis() {
  const [selectedVariables, setSelectedVariables] = useState<AnalysisVariable[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [chartMetric, setChartMetric] = useState("");
  const [tableMetric, setTableMetric] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [baseValue, setBaseValue] = useState(1000000); // Default base value for the analysis
  const [baseValues, setBaseValues] = useState<Record<string, number>>({});
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
  
  const lcoeValue = calculateLCOE(inputs);
  const lcohValue = calculateLCOH(inputs);
  
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
  
  const outputMetrics = getAllOutputs().map(output => output.name);
  
  const availableVariables = [
    ...inputs.map(input => transformInputToAnalysisVariable(input)),
    ...derivedMetricInputs.map(input => transformInputToAnalysisVariable(input))
  ];

  const handleVariableSelection = (variables: AnalysisVariable[]) => {
    setSelectedVariables(variables);
  };

  const handleMetricSelection = (metric: string) => {
    // If metric is already selected, don't add it again
    if (selectedMetrics.includes(metric)) return;
    
    // Limit to 5 metrics
    if (selectedMetrics.length >= 5) {
      toast({
        title: "Maximum metrics reached",
        description: "You can select up to 5 metrics for analysis.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedOutput = getAllOutputs().find(output => output.name === metric);
    
    if (selectedOutput) {
      setBaseValues(prev => ({
        ...prev,
        [metric]: selectedOutput.value
      }));
    } else {
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
      
      setBaseValues(prev => ({
        ...prev,
        [metric]: metricBaseValues[metric] || 0
      }));
    }

    // Add the metric to selected metrics
    setSelectedMetrics(prev => [...prev, metric]);
    
    // If no metric is currently active for the chart, set this as the chart metric
    if (!chartMetric) {
      setChartMetric(metric);
    }
    
    // If no metric is currently active for the table, set this as the table metric
    if (!tableMetric) {
      setTableMetric(metric);
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  const handleRemoveMetric = (metricToRemove: string) => {
    setSelectedMetrics(prev => prev.filter(metric => metric !== metricToRemove));
    
    // If removing the current chart metric, select another one if available
    if (chartMetric === metricToRemove) {
      const remainingMetrics = selectedMetrics.filter(metric => metric !== metricToRemove);
      if (remainingMetrics.length > 0) {
        setChartMetric(remainingMetrics[0]);
      } else {
        setChartMetric("");
      }
    }
    
    // If removing the current table metric, select another one if available
    if (tableMetric === metricToRemove) {
      const remainingMetrics = selectedMetrics.filter(metric => metric !== metricToRemove);
      if (remainingMetrics.length > 0) {
        setTableMetric(remainingMetrics[0]);
      } else {
        setTableMetric("");
      }
    }
  };

  const handleBaseValueChange = (newBaseValue: number, metric?: string) => {
    if (metric) {
      setBaseValues(prev => ({
        ...prev,
        [metric]: newBaseValue
      }));
    } else {
      setBaseValue(newBaseValue);
    }
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
    
    if (selectedMetrics.length === 0) {
      toast({
        title: "No metrics selected",
        description: "Please select at least one output metric to save this analysis.",
        variant: "destructive"
      });
      return;
    }
    
    const id = `analysis-${Date.now()}`;
    const newSavedAnalysis = {
      id,
      name: `${selectedMetrics.join(", ")} Analysis ${savedAnalyses.length + 1}`,
      metric: selectedMetrics.join(", "),
      variables: selectedVariables,
      baseValue: baseValues[chartMetric] || baseValue
    };
    
    setSavedAnalyses(prev => [...prev, newSavedAnalysis]);
    
    toast({
      title: "Analysis saved",
      description: `${selectedMetrics.join(", ")} analysis has been saved and can be accessed later.`
    });
  };
  
  const handleResetAnalysis = () => {
    setSelectedVariables([]);
    setSelectedMetrics([]);
    setChartMetric("");
    setTableMetric("");
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
      
      <div className="grid grid-cols-10 gap-6">
        <div className="col-span-4 space-y-6">
          <DataPanel>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Variable Selection</h3>
              <VariableControl
                availableVariables={availableVariables}
                onVariableSelection={handleVariableSelection}
                selectedVariables={selectedVariables}
                metrics={outputMetrics}
                onMetricChange={() => {}}
                currentMetric={chartMetric}
                baseValue={baseValue}
                onBaseValueChange={handleBaseValueChange}
                showBaseValueInput={false}
                hideMetricSelector={true}
              />
            </div>
          </DataPanel>
        </div>

        <div className="col-span-6 space-y-6">
          <DataPanel>
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold">Output Metrics</h3>
              <div className="flex items-center gap-2">
                <div className="w-full max-w-xs">
                  <Select value="" onValueChange={handleMetricSelection}>
                    <SelectTrigger id="metric-selector" className="w-full">
                      <SelectValue placeholder="Add metric (up to 5)" />
                    </SelectTrigger>
                    <SelectContent>
                      {outputMetrics
                        .filter(metric => !selectedMetrics.includes(metric))
                        .map(metric => (
                          <SelectItem key={metric} value={metric}>
                            {metric}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-muted-foreground">
                  {selectedMetrics.length}/5 metrics selected
                </span>
              </div>
              
              {selectedMetrics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMetrics.map(metric => (
                    <Badge 
                      key={metric}
                      variant="outline"
                      className="px-3 py-1 flex items-center gap-1 bg-secondary/30"
                    >
                      {metric}
                      <X 
                        className="h-3.5 w-3.5 ml-1 cursor-pointer hover:text-destructive" 
                        onClick={() => handleRemoveMetric(metric)} 
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </DataPanel>
        
          <SensitivityChart 
            selectedVariables={selectedVariables}
            currentMetric={chartMetric}
            selectedMetrics={selectedMetrics}
            onMetricChange={setChartMetric}
            isLoading={isLoading}
            baseValue={baseValues[chartMetric] || baseValue}
          />
          
          <DataPanel>
            <SensitivityCoefficientTable
              variables={selectedVariables}
              currentMetric={tableMetric}
              selectedMetrics={selectedMetrics}
              onMetricChange={setTableMetric}
              baseValue={baseValues[tableMetric] || baseValue}
            />
          </DataPanel>
          
          <SensitivitySummary 
            selectedVariables={selectedVariables}
            currentMetric={chartMetric}
            baseValue={baseValues[chartMetric] || baseValue}
          />
        </div>
      </div>
    </div>
  );
}
