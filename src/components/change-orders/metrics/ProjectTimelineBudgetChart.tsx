
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

// Mock data - in a real app this would come from API or props
const data = [
  { phase: "Planning", planned: 100, actual: 110, budget: 2000, spent: 2200 },
  { phase: "Design", planned: 90, actual: 100, budget: 5000, spent: 5100 },
  { phase: "Procurement", planned: 120, actual: 115, budget: 10000, spent: 9500 },
  { phase: "Construction", planned: 300, actual: 270, budget: 30000, spent: 28000 },
  { phase: "Commissioning", planned: 60, actual: 40, budget: 3000, spent: 2000 },
];

export function ProjectTimelineBudgetChart() {
  const chartConfig = {
    planned: {
      label: "Planned",
      theme: {
        light: "#4f46e5",
        dark: "#6366f1",
      },
    },
    actual: {
      label: "Actual",
      theme: {
        light: "#1e40af",
        dark: "#3b82f6",
      },
    },
  };

  const [activeTab, setActiveTab] = React.useState<"timeline" | "budget">("timeline");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
          <p className="font-medium">{label}</p>
          {activeTab === "timeline" ? (
            <>
              <p className="text-[#6366f1]">Planned: {payload[0].value} days</p>
              <p className="text-[#3b82f6]">Actual: {payload[1].value} days</p>
              <p className="text-xs text-muted-foreground mt-1">
                {payload[1].value > payload[0].value 
                  ? `${payload[1].value - payload[0].value} days behind schedule` 
                  : `${payload[0].value - payload[1].value} days ahead of schedule`}
              </p>
            </>
          ) : (
            <>
              <p className="text-[#6366f1]">Budget: ${payload[0].value.toLocaleString()}</p>
              <p className="text-[#3b82f6]">Spent: ${payload[1].value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {payload[1].value > payload[0].value 
                  ? `$${(payload[1].value - payload[0].value).toLocaleString()} over budget` 
                  : `$${(payload[0].value - payload[1].value).toLocaleString()} under budget`}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[180px]">
      <div className="flex justify-center mb-2">
        <div className="inline-flex items-center rounded-md bg-muted p-1 text-xs">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`rounded px-2.5 py-1 ${
              activeTab === "timeline" ? "bg-background shadow-sm" : ""
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={`rounded px-2.5 py-1 ${
              activeTab === "budget" ? "bg-background shadow-sm" : ""
            }`}
          >
            Budget
          </button>
        </div>
      </div>
      
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            barCategoryGap={8}
          >
            <XAxis 
              dataKey="phase" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => activeTab === "timeline" ? `${value}d` : `$${value/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#666" />
            <Bar 
              dataKey={activeTab === "timeline" ? "planned" : "budget"} 
              fill="var(--color-planned)" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey={activeTab === "timeline" ? "actual" : "spent"} 
              fill="var(--color-actual)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
