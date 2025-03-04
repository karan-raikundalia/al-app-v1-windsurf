
import { useEffect, useRef, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  ReferenceLine,
} from "recharts";
import { DataPanel } from "@/components/ui/DataPanel";
import type { AnalysisVariable } from "./VariableControl";
import { formatNumber } from "@/lib/utils";

interface TornadoChartProps {
  variables: AnalysisVariable[];
  metric: string;
}

export function TornadoChart({ variables, metric }: TornadoChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedVariable, setSelectedVariable] = useState<AnalysisVariable | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Prepare chart data
  useEffect(() => {
    // Sort variables by absolute impact
    const sortedVariables = [...variables].sort(
      (a, b) => Math.abs(b.impact) - Math.abs(a.impact)
    );

    // Convert to chart format and take top 10
    const data = sortedVariables.slice(0, 10).map((variable) => {
      const { impact } = variable;
      return {
        name: variable.name,
        positive: impact > 0 ? impact : 0,
        negative: impact < 0 ? impact : 0,
        variable,
      };
    });

    setChartData(data);
  }, [variables]);

  // Animation for chart entry
  useEffect(() => {
    if (chartRef.current) {
      const timeout = setTimeout(() => {
        chartRef.current?.classList.add("opacity-100");
        chartRef.current?.classList.remove("opacity-0", "translate-y-4");
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const variable = payload[0].payload.variable;
      return (
        <div className="glassmorphism rounded-lg p-3 text-sm">
          <p className="font-medium">{variable.name}</p>
          <p className="text-muted-foreground text-xs mb-1">
            Base value: {formatNumber(variable.baseValue)}
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <p className="text-xs">Min: {formatNumber(variable.minValue)}</p>
            <p className="text-xs">Max: {formatNumber(variable.maxValue)}</p>
            <p className="text-xs col-span-2 mt-1">
              Impact on {metric}: {' '}
              <span className={variable.impact > 0 ? "text-blue-500" : "text-red-500"}>
                {formatNumber(variable.impact)}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5">
      <div 
        ref={chartRef} 
        className="transition-all duration-500 opacity-0 translate-y-4"
      >
        <DataPanel title="Sensitivity Analysis" description={`Impact on ${metric}`}>
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 20, right: 30, left: 30, bottom: 10 }}
                barGap={0}
                barSize={20}
                onClick={(data) => data && setSelectedVariable(data.variable)}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => formatNumber(value)}
                  domain={['auto', 'auto']}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={150}
                  tickLine={false}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Legend />
                <ReferenceLine x={0} stroke="#666" />
                <Bar 
                  dataKey="positive" 
                  name="Positive Impact" 
                  fill="#3b82f6" 
                  className="tornado-bar tornado-bar-positive"
                  animationDuration={1000}
                  animationBegin={300}
                />
                <Bar 
                  dataKey="negative" 
                  name="Negative Impact" 
                  fill="#ef4444" 
                  className="tornado-bar tornado-bar-negative"
                  animationDuration={1000}
                  animationBegin={300}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DataPanel>
      </div>

      {selectedVariable && (
        <div className="animate-slide-in">
          <DataPanel title="Variable Details" className="border-l-4 border-l-primary">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-1">{selectedVariable.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Category: {selectedVariable.category}
                </p>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Base Value</p>
                      <p className="font-medium">{formatNumber(selectedVariable.baseValue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Impact on {metric}</p>
                      <p className={`font-medium ${selectedVariable.impact > 0 ? "text-blue-500" : "text-red-500"}`}>
                        {formatNumber(selectedVariable.impact)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Minimum Value</p>
                      <p className="font-medium">{formatNumber(selectedVariable.minValue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Maximum Value</p>
                      <p className="font-medium">{formatNumber(selectedVariable.maxValue)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Sensitivity</p>
                  <div className={`text-2xl font-bold ${selectedVariable.impact > 0 ? "text-blue-500" : "text-red-500"}`}>
                    {Math.abs(selectedVariable.impact) > (selectedVariable.baseValue * 0.1) 
                      ? "High" 
                      : Math.abs(selectedVariable.impact) > (selectedVariable.baseValue * 0.05)
                        ? "Medium"
                        : "Low"} Impact
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.abs(selectedVariable.impact) > (selectedVariable.baseValue * 0.1)
                      ? "This variable significantly affects results" 
                      : Math.abs(selectedVariable.impact) > (selectedVariable.baseValue * 0.05)
                        ? "This variable moderately affects results"
                        : "This variable has minimal impact on results"}
                  </p>
                </div>
              </div>
            </div>
          </DataPanel>
        </div>
      )}
    </div>
  );
}
