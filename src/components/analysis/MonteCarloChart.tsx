
import { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Legend
} from "recharts";
import { formatNumber } from "@/lib/utils";
import { DataPanel } from "@/components/ui/DataPanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMetricValue } from "./utils/monteCarloUtils";

interface MonteCarloChartProps {
  results: any;
}

export function MonteCarloChart({ results }: MonteCarloChartProps) {
  const [metric, setMetric] = useState("npv");
  const [chartData, setChartData] = useState<any[]>([]);
  const [confidenceInterval, setConfidenceInterval] = useState<[number, number]>([0, 0]);
  const [metricSettings, setMetricSettings] = useState({
    title: "Net Present Value (NPV)",
    format: (val: number) => `$${formatNumber(val)}`,
    color: "#8B5CF6"
  });

  // Generate histogram data from simulation results
  useEffect(() => {
    if (!results) return;
    
    const metricData = results[metric];
    if (!metricData) return;
    
    // Get min and max values
    const min = Math.min(...metricData);
    const max = Math.max(...metricData);
    
    // Create bins for histogram
    const binCount = 50;
    const binWidth = (max - min) / binCount;
    
    // Create histogram data
    const histogram = Array(binCount).fill(0).map((_, i) => ({
      bin: min + (i * binWidth) + (binWidth / 2),
      frequency: 0,
      cumulative: 0
    }));
    
    // Fill histogram data
    metricData.forEach((value: number) => {
      const binIndex = Math.min(
        Math.floor((value - min) / binWidth),
        binCount - 1
      );
      if (binIndex >= 0 && binIndex < binCount) {
        histogram[binIndex].frequency += 1;
      }
    });
    
    // Calculate cumulative frequencies
    let cumulativeCount = 0;
    histogram.forEach((bin, i) => {
      cumulativeCount += bin.frequency;
      histogram[i].cumulative = cumulativeCount / metricData.length;
    });
    
    setChartData(histogram);
    setConfidenceInterval(results.confidenceIntervals[metric]);
    
    // Set metric-specific settings
    const metricDisplayConfig: Record<string, any> = {
      npv: {
        title: "Net Present Value (NPV)",
        format: (val: number) => `$${formatNumber(val)}`,
        color: "#8B5CF6"
      },
      irr: {
        title: "Internal Rate of Return (IRR)",
        format: (val: number) => `${(val * 100).toFixed(2)}%`,
        color: "#0EA5E9"
      },
      paybackPeriod: {
        title: "Payback Period",
        format: (val: number) => `${val.toFixed(1)} years`,
        color: "#F97316"
      },
      debtServiceCoverage: {
        title: "Debt Service Coverage Ratio",
        format: (val: number) => val.toFixed(2),
        color: "#10B981"
      },
      equityMultiple: {
        title: "Equity Multiple",
        format: (val: number) => val.toFixed(2) + "x",
        color: "#EC4899"
      }
    };
    
    setMetricSettings(metricDisplayConfig[metric]);
    
  }, [results, metric]);

  // Format tooltip values
  const formatTooltipValue = (value: number) => {
    return formatMetricValue(value, metric);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const binValue = formatTooltipValue(payload[0].payload.bin);
      const frequency = payload[0].payload.frequency;
      const cumulative = (payload[0].payload.cumulative * 100).toFixed(1);
      
      return (
        <div className="glassmorphism rounded-lg p-3 text-sm">
          <p className="font-medium">{binValue}</p>
          <p>Frequency: {frequency} simulations</p>
          <p>Cumulative: {cumulative}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{metricSettings.title} Distribution</h3>
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="npv">Net Present Value</SelectItem>
            <SelectItem value="irr">Internal Rate of Return</SelectItem>
            <SelectItem value="paybackPeriod">Payback Period</SelectItem>
            <SelectItem value="debtServiceCoverage">Debt Service Coverage</SelectItem>
            <SelectItem value="equityMultiple">Equity Multiple</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 40, bottom: 40 }}
          >
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metricSettings.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={metricSettings.color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="bin" 
              tickFormatter={(value) => formatTooltipValue(value)}
            >
              <Label 
                value={metricSettings.title} 
                position="bottom" 
                offset={-10}
                style={{ textAnchor: 'middle', fontSize: '0.8rem', fill: '#6B7280' }}
              />
            </XAxis>
            <YAxis 
              yAxisId="left"
              orientation="left"
            >
              <Label 
                value="Frequency" 
                angle={-90} 
                position="insideLeft" 
                style={{ textAnchor: 'middle', fontSize: '0.8rem', fill: '#6B7280' }}
              />
            </YAxis>
            <YAxis 
              yAxisId="right" 
              orientation="right"
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            >
              <Label 
                value="Cumulative %" 
                angle={90} 
                position="insideRight" 
                style={{ textAnchor: 'middle', fontSize: '0.8rem', fill: '#6B7280' }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="frequency" 
              stroke={metricSettings.color} 
              fillOpacity={1} 
              fill="url(#colorMetric)" 
              name="Frequency"
            />
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="cumulative" 
              stroke="#6B7280" 
              fill="none"
              name="Cumulative %"
            />
            {confidenceInterval && (
              <>
                <ReferenceLine 
                  yAxisId="left"
                  x={confidenceInterval[0]} 
                  stroke="#9CA3AF" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: '2.5%', 
                    position: 'top',
                    fill: '#6B7280',
                    fontSize: 12
                  }} 
                />
                <ReferenceLine 
                  yAxisId="left"
                  x={confidenceInterval[1]} 
                  stroke="#9CA3AF" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: '97.5%', 
                    position: 'top',
                    fill: '#6B7280',
                    fontSize: 12 
                  }} 
                />
              </>
            )}
            {metric === "npv" && (
              <ReferenceLine 
                yAxisId="left"
                x={0} 
                stroke="#EF4444" 
                label={{ 
                  value: 'Break Even', 
                  position: 'top',
                  fill: '#EF4444',
                  fontSize: 12
                }} 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
