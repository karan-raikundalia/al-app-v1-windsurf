
import { useState, useEffect } from "react";
import { VariableControl, type AnalysisVariable } from "./VariableControl";
import { TornadoChart } from "./TornadoChart";
import { DataPanel } from "@/components/ui/DataPanel";

// Sample data for our analysis
const sampleVariables: AnalysisVariable[] = [
  {
    id: "1",
    name: "Labor Cost",
    baseValue: 250000,
    minValue: 200000,
    maxValue: 300000,
    impact: -27500,
    category: "Cost",
    metric: "cost",
  },
  {
    id: "2",
    name: "Materials",
    baseValue: 150000,
    minValue: 120000,
    maxValue: 180000,
    impact: -15000,
    category: "Cost",
    metric: "cost",
  },
  {
    id: "3",
    name: "Project Duration",
    baseValue: 180,
    minValue: 160,
    maxValue: 200,
    impact: -12500,
    category: "Schedule",
    metric: "cost",
  },
  {
    id: "4",
    name: "Revenue Growth",
    baseValue: 500000,
    minValue: 450000,
    maxValue: 600000,
    impact: 45000,
    category: "Revenue",
    metric: "cost",
  },
  {
    id: "5",
    name: "Market Penetration",
    baseValue: 15,
    minValue: 10,
    maxValue: 20,
    impact: 30000,
    category: "Market",
    metric: "cost",
  },
  {
    id: "6",
    name: "Customer Acquisition",
    baseValue: 2000,
    minValue: 1500,
    maxValue: 2500,
    impact: -8500,
    category: "Marketing",
    metric: "cost",
  },
  {
    id: "7",
    name: "Equipment Efficiency",
    baseValue: 85,
    minValue: 75,
    maxValue: 95,
    impact: 17500,
    category: "Operations",
    metric: "performance",
  },
  {
    id: "8",
    name: "Quality Control",
    baseValue: 92,
    minValue: 85,
    maxValue: 98,
    impact: 9500,
    category: "Quality",
    metric: "performance",
  },
  {
    id: "9",
    name: "Resource Allocation",
    baseValue: 150000,
    minValue: 130000,
    maxValue: 170000,
    impact: -11000,
    category: "Resources",
    metric: "schedule",
  },
  {
    id: "10",
    name: "Technology Implementation",
    baseValue: 200000,
    minValue: 180000,
    maxValue: 220000,
    impact: 22000,
    category: "Technology",
    metric: "performance",
  },
  {
    id: "11",
    name: "Supply Chain Delays",
    baseValue: 15,
    minValue: 5,
    maxValue: 25,
    impact: -19500,
    category: "Supply Chain",
    metric: "schedule",
  },
  {
    id: "12",
    name: "Staff Productivity",
    baseValue: 75,
    minValue: 65,
    maxValue: 85,
    impact: 14500,
    category: "Operations",
    metric: "performance",
  }
];

const metrics = ["Cost", "Schedule", "Performance"];

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
        and view their impact on cost, schedule, and performance.
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
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[500px]">
          <div className="space-y-4 w-full max-w-md">
            <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
              <div className="h-full bg-primary animate-progress-loading rounded-full"></div>
            </div>
            <p className="text-center text-sm text-muted-foreground">Loading analysis data...</p>
          </div>
        </div>
      ) : (
        <TornadoChart 
          variables={filteredVariables} 
          metric={currentMetric}
        />
      )}
      
      <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
        <DataPanel title="Key Insights" className="border-t-4 border-t-blue-500">
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
              <p>Revenue Growth has the highest positive impact on project outcomes</p>
            </li>
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
              <p>Labor Cost shows the most significant negative impact</p>
            </li>
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-500 mt-1.5 shrink-0"></div>
              <p>5 variables have high sensitivity, requiring close monitoring</p>
            </li>
          </ul>
        </DataPanel>
        
        <DataPanel title="Recommendations" className="border-t-4 border-t-green-500">
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <p>Focus on optimizing Revenue Growth strategies</p>
            </li>
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <p>Implement Labor Cost containment measures</p>
            </li>
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <p>Develop contingency plans for Supply Chain Delays</p>
            </li>
          </ul>
        </DataPanel>
        
        <DataPanel title="Project Status" className="border-t-4 border-t-amber-500">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Overall Risk Level</span>
                <span className="text-sm font-medium text-amber-500">Medium</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-amber-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Variables Analyzed</span>
                <span className="text-sm font-medium">{sampleVariables.length}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-full bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Analysis Confidence</span>
                <span className="text-sm font-medium text-green-500">High</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </DataPanel>
      </div>
    </div>
  );
}
