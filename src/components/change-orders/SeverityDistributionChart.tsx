
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { SeverityDistribution, ChangeOrderSeverity } from "@/models/changeOrder";

interface SeverityDistributionChartProps {
  data: SeverityDistribution[];
  onSliceClick: (severity: ChangeOrderSeverity) => void;
}

export function SeverityDistributionChart({ data, onSliceClick }: SeverityDistributionChartProps) {
  // Colors for the severity levels
  const COLORS = {
    critical: "#ef4444", // red
    major: "#f97316",    // orange
    minor: "#3b82f6"     // blue
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { severity, count, percentage } = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-md shadow-md p-3 text-sm">
          <p className="font-medium capitalize">{severity} Impact</p>
          <p>Count: {count} change orders</p>
          <p>Percentage: {percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            paddingAngle={5}
            dataKey="count"
            nameKey="severity"
            className="cursor-pointer"
            onClick={(data) => onSliceClick(data.severity)}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.severity as keyof typeof COLORS]} 
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => {
              const entry = data.find(item => item.severity === value);
              return <span className="capitalize">{value} ({entry?.count})</span>;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
