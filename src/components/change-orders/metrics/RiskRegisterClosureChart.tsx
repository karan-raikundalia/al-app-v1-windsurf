
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

// Mock data - in a real app this would come from API or props
const data = [
  { month: "Jan", identified: 12, mitigated: 5, closure: 41.7 },
  { month: "Feb", identified: 18, mitigated: 10, closure: 55.6 },
  { month: "Mar", identified: 15, mitigated: 9, closure: 60.0 },
  { month: "Apr", identified: 22, mitigated: 14, closure: 63.6 },
  { month: "May", identified: 14, mitigated: 10, closure: 71.4 },
  { month: "Jun", identified: 10, mitigated: 8, closure: 80.0 },
  { month: "Jul", identified: 9, mitigated: 8, closure: 88.9 },
];

export function RiskRegisterClosureChart() {
  const chartConfig = {
    identified: {
      label: "Identified",
      theme: {
        light: "#0ea5e9",
        dark: "#38bdf8",
      },
    },
    mitigated: {
      label: "Mitigated",
      theme: {
        light: "#22c55e",
        dark: "#4ade80",
      },
    },
    closure: {
      label: "Closure Rate",
      theme: {
        light: "#6366f1",
        dark: "#818cf8",
      },
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-[#38bdf8]">
            Risks Identified: {payload[0].value}
          </p>
          <p className="text-[#4ade80]">
            Risks Mitigated: {payload[1].value}
          </p>
          <p className="text-[#818cf8]">
            Closure Rate: {payload[2].value}%
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
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="identified"
              stroke="var(--color-identified)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="mitigated"
              stroke="var(--color-mitigated)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="closure"
              stroke="var(--color-closure)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
