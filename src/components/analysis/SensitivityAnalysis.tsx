
import { useState, useEffect } from "react";
import { VariableControl, type AnalysisVariable } from "./VariableControl";
import { DataPanel } from "@/components/ui/DataPanel";
import { SensitivityChart } from "./sensitivity/SensitivityChart";
import { SensitivitySummary } from "./sensitivity/SensitivitySummary";
import { OutputMetricSensitivity, OutputMetric } from "./sensitivity/OutputMetricSensitivity";
import { sampleVariables, metrics } from "./sensitivity/SensitivityData";

// Sample output metrics for demonstration
const outputMetrics: OutputMetric[] = [
  { id: "lcoe", name: "LCOE", unit: "$/MWh", description: "Levelized Cost of Energy", baseValue: 45.23 },
  { id: "irr", name: "IRR", unit: "%", description: "Internal Rate of Return", baseValue: 12.5 },
  { id: "npv", name: "NPV", unit: "$", description: "Net Present Value", baseValue: 10500000 },
  { id: "payback", name: "Payback Period", unit: "years", description: "Time to recoup investment", baseValue: 6.3 },
  { id: "lcoh", name: "LCOH", unit: "$/kg", description: "Levelized Cost of Hydrogen", baseValue: 3.78 },
  { id: "capex", name: "Total CAPEX", unit: "$", description: "Capital Expenditure", baseValue: 52000000 },
];

export function SensitivityAnalysis() {
  const [filteredVariables, setFilteredVariables] = useState<AnalysisVariable[]>([]);
  const [currentMetric, setCurrentMetric] = useState("Cost");
  const [currentOutputMetric, setCurrentOutputMetric] = useState<string>(outputMetrics[0].id);
  const [showOutputMetricAnalysis, setShowOutputMetricAnalysis] = useState(false);
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
  
  const handleOutputMetricChange = (metricId: string) => {
    setCurrentOutputMetric(metricId);
    setShowOutputMetricAnalysis(true);
    
    // Simulate loading new analysis for the selected output metric
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  const selectedOutputMetric = outputMetrics.find(metric => metric.id === currentOutputMetric) || outputMetrics[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Sensitivity Analysis</h1>
      </div>
      <p className="text-muted-foreground max-w-4xl">
        Understand how different variables impact your project outcomes. Use the controls below to filter variables, 
        select output metrics, and view their sensitivity to different parameters.
      </p>
      
      <DataPanel>
        <VariableControl
          variables={sampleVariables}
          onFilterChange={handleFilterChange}
          metrics={metrics}
          onMetricChange={handleMetricChange}
          currentMetric={currentMetric}
          outputMetrics={outputMetrics}
          onOutputMetricChange={handleOutputMetricChange}
          currentOutputMetric={currentOutputMetric}
        />
      </DataPanel>
      
      {showOutputMetricAnalysis ? (
        <OutputMetricSensitivity 
          outputMetric={selectedOutputMetric}
          variables={filteredVariables}
          maxInfluentialCount={10}
        />
      ) : (
        <>
          <SensitivityChart 
            filteredVariables={filteredVariables}
            currentMetric={currentMetric}
            isLoading={isLoading}
          />
          
          <SensitivitySummary />
        </>
      )}
    </div>
  );
}
