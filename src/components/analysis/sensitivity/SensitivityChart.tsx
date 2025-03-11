
import { TornadoChart } from "../TornadoChart";
import { AnalysisVariable } from "../VariableControl";

interface SensitivityChartProps {
  filteredVariables: AnalysisVariable[];
  currentMetric: string;
  isLoading: boolean;
}

export function SensitivityChart({ 
  filteredVariables, 
  currentMetric, 
  isLoading 
}: SensitivityChartProps) {
  // Transform the variables data for the TornadoChart component
  const chartData = filteredVariables.map(variable => ({
    variable: variable.name,
    positiveDelta: variable.impact > 0 ? variable.impact : 0,
    negativeDelta: variable.impact < 0 ? variable.impact : 0,
    baseline: variable.baseValue
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="space-y-4 w-full max-w-md">
          <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
            <div className="h-full bg-primary animate-progress-loading rounded-full"></div>
          </div>
          <p className="text-center text-sm text-muted-foreground">Loading analysis data...</p>
        </div>
      </div>
    );
  }

  return (
    <TornadoChart 
      data={chartData}
      baseValue={0}
    />
  );
}
