
import React from "react";
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { formatPercent } from "@/lib/utils";

// Mock data - in a real app this would come from API or props
const data = [
  { month: "Jan", ratio: 12.5 },
  { month: "Feb", ratio: 14.2 },
  { month: "Mar", ratio: 13.8 },
  { month: "Apr", ratio: 17.3 },
  { month: "May", ratio: 15.9 },
  { month: "Jun", ratio: 14.6 },
  { month: "Jul", ratio: 12.4 },
  { month: "Aug", ratio: 10.5 },
  { month: "Sep", ratio: 9.8 },
  { month: "Oct", ratio: 8.2 },
  { month: "Nov", ratio: 7.5 },
  { month: "Dec", ratio: 6.3 },
];

export function CapitalRiskRatioChart() {
  const chartConfig = {
    capitalRisk: {
      label: "Capital at Risk Ratio",
      theme: {
        light: "#0ea5e9",
        dark: "#38bdf8",
      },
    },
    target: {
      label: "Target Threshold",
      theme: {
        light: "#dc2626",
        dark: "#ef4444",
      },
    },
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-[#38bdf8]">
            Ratio: {formatPercent(payload[0].value / 100)}
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
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="ratio"
              stroke="var(--color-capitalRisk)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            {/* Target threshold line */}
            <Line
              type="monotone"
              dataKey={() => 10}
              stroke="var(--color-target)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="text-xs text-muted-foreground mt-1 text-center">
        Target: Maximum 10% of project capital at risk
      </div>
    </div>
  );
}
