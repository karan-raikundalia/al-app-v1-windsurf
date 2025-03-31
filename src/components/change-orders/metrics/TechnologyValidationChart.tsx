
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

// Mock data - in a real app this would come from API or props
const data = [
  { component: "Module A", validationScore: 95, target: 90 },
  { component: "Module B", validationScore: 88, target: 90 },
  { component: "Interface C", validationScore: 92, target: 90 },
  { component: "System D", validationScore: 79, target: 90 },
  { component: "Component E", validationScore: 85, target: 90 },
];

export function TechnologyValidationChart() {
  const chartConfig = {
    good: {
      label: "Above Target",
      theme: {
        light: "#22c55e",
        dark: "#4ade80",
      },
    },
    warn: {
      label: "Near Target",
      theme: {
        light: "#eab308",
        dark: "#facc15",
      },
    },
    critical: {
      label: "Below Target",
      theme: {
        light: "#ef4444",
        dark: "#f87171",
      },
    },
  };

  const getBarColor = (score: number, target: number) => {
    if (score >= target) return "var(--color-good)";
    if (score >= target - 5) return "var(--color-warn)";
    return "var(--color-critical)";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const score = payload[0].value;
      const target = payload[0].payload.target;
      
      return (
        <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
          <p className="font-medium">{label}</p>
          <p>Validation Score: {score}%</p>
          <p>Target: {target}%</p>
          <p className={`text-xs font-medium ${
            score >= target ? "text-green-500" : 
            score >= target - 5 ? "text-amber-500" : "text-red-500"
          }`}>
            {score >= target ? "Above target ✓" : 
             score >= target - 5 ? "Near target ⚠️" : "Below target ✗"}
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
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            barCategoryGap={10}
            layout="vertical"
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              dataKey="component"
              type="category"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={90} stroke="#666" strokeDasharray="3 3" label={{ value: 'Target', position: 'top', fill: '#666', fontSize: 10 }} />
            <Bar 
              dataKey="validationScore" 
              radius={[0, 4, 4, 0]}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.validationScore, entry.target)} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
