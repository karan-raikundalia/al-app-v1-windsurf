
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

// Mock data - in a real app this would come from API or props
const data = [
  { phase: "Initial", estimate: 18500000, rangeLow: 16000000, rangeHigh: 21000000 },
  { phase: "Planning", estimate: 19200000, rangeLow: 17500000, rangeHigh: 21000000 },
  { phase: "30% Design", estimate: 19800000, rangeLow: 18700000, rangeHigh: 21000000 },
  { phase: "60% Design", estimate: 20100000, rangeLow: 19300000, rangeHigh: 20900000 },
  { phase: "90% Design", estimate: 20300000, rangeLow: 20000000, rangeHigh: 20700000 },
  { phase: "Final", estimate: 20400000, rangeLow: 20200000, rangeHigh: 20600000 },
];

export function CostEstimateRefinementChart() {
  const chartConfig = {
    estimate: {
      label: "Estimate",
      theme: {
        light: "#0ea5e9",
        dark: "#38bdf8",
      },
    },
    range: {
      label: "Range",
      theme: {
        light: "rgba(14, 165, 233, 0.2)",
        dark: "rgba(56, 189, 248, 0.2)",
      },
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-[#38bdf8]">
            Estimate: ${payload[1].value.toLocaleString()}
          </p>
          <p className="text-muted-foreground text-xs">
            Range: ${payload[0].value.toLocaleString()} - ${payload[2].value.toLocaleString()}
          </p>
          <p className="text-muted-foreground text-xs">
            Uncertainty: ±{Math.round(((payload[2].value - payload[0].value) / (2 * payload[1].value)) * 100)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[180px]">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 15, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="phase" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis 
              tickFormatter={(value) => `$${value/1000000}M`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 1000000', 'dataMax + 1000000']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="rangeLow" 
              stackId="1"
              stroke="transparent"
              fill="transparent" 
            />
            <Area 
              type="monotone" 
              dataKey="rangeHigh" 
              stackId="1" 
              stroke="transparent"
              fill="var(--color-range)"
            />
            <Line
              type="monotone"
              dataKey="estimate"
              stroke="var(--color-estimate)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="text-xs text-muted-foreground mt-1 text-center">
        Cost estimate refinement over project phases
      </div>
    </div>
  );
}
