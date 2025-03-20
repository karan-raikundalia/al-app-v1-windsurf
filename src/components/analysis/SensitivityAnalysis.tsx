
import { useState, useEffect } from "react";
import { VariableControl, type AnalysisVariable } from "./VariableControl";
import { DataPanel } from "@/components/ui/DataPanel";
import { SensitivityChart } from "./sensitivity/SensitivityChart";
import { SensitivitySummary } from "./sensitivity/SensitivitySummary";
import { sampleVariables, metrics } from "./sensitivity/SensitivityData";

export function SensitivityAnalysis() {
  const [filteredVariables, setFilteredVariables] = useState<AnalysisVariable[]>([]);
  const [currentMetric, setCurrentMetric] = useState("Cost");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setFilteredVariables(sampleVariables);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (variables: AnalysisVariable[]) => {
    setFilteredVariables(variables);
  };

  const handleMetricChange = (metric: string) => {
    setCurrentMetric(metric);
    
    // In a real application, we would fetch new data based on the metric
    // Here we'll just simulate it by setting isLoading briefly
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Sensitivity Analysis</h1>
      </div>
      <p className="text-muted-foreground max-w-4xl">
        Understand how different variables impact your project outcomes. Use the controls below to filter variables 
        and select metrics to view their sensitivities.
      </p>
      
      <DataPanel>
        <VariableControl
          variables={sampleVariables}
          onFilterChange={handleFilterChange}
          metrics={metrics}
          onMetricChange={handleMetricChange}
          currentMetric={currentMetric}
        />
      </DataPanel>
      
      <SensitivityChart 
        filteredVariables={filteredVariables}
        currentMetric={currentMetric}
        isLoading={isLoading}
      />
      
      <SensitivitySummary />
    </div>
  );
}
