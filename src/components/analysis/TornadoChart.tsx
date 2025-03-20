
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { formatNumber } from "@/lib/utils";

export interface TornadoChartProps {
  data: {
    variable: string;
    positiveDelta: number;
    negativeDelta: number;
    baseline: number;
    category?: string;
    unit?: string;
    variableId?: string;
  }[];
  baseValue: number;
  sortBy?: "impact" | "alphabetical";
  onVariableClick?: (variableId: string) => void;
  chartHeight?: number | string;
}

// Custom tooltip component for the tornado chart
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = payload[0].dataKey === "positiveDelta";
    const value = isPositive ? data.positiveDelta : data.negativeDelta;
    const absValue = Math.abs(value);
    
    let percentageDisplay = "";
    if (typeof value === "number") {
      // If the value is already in percentage format
      if (data.unit === "%") {
        percentageDisplay = `${absValue.toFixed(1)}%`;
      } else {
        // Otherwise calculate the percentage from baseline
        const percentage = ((absValue / data.baseline) * 100).toFixed(1);
        percentageDisplay = `(${percentage}%)`;
      }
    }

    return (
      <div className="bg-background border border-border rounded-lg p-3 text-sm shadow-lg">
        <p className="font-medium">{data.variable}</p>
        <p className={`${isPositive ? "text-emerald-500" : "text-red-500"} font-medium`}>
          {isPositive ? "+" : "-"}
          {formatNumber(absValue)}
          {data.unit && data.unit !== "%" ? ` ${data.unit} ` : " "}
          {percentageDisplay}
        </p>
        {data.category && (
          <p className="text-xs text-muted-foreground mt-1">
            Category: {data.category}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-0.5">
          Baseline: {formatNumber(data.baseline)}
          {data.unit && data.unit !== "%" ? ` ${data.unit}` : ""}
        </p>
      </div>
    );
  }
  return null;
};

export function TornadoChart({
  data,
  baseValue,
  sortBy = "impact",
  onVariableClick,
  chartHeight = "100%",
}: TornadoChartProps) {
  // Sort data based on the sortBy prop
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === "alphabetical") {
      return a.variable.localeCompare(b.variable);
    }
    // Sort by impact (absolute value of max delta)
    const aImpact = Math.max(
      Math.abs(a.positiveDelta),
      Math.abs(a.negativeDelta)
    );
    const bImpact = Math.max(
      Math.abs(b.positiveDelta),
      Math.abs(b.negativeDelta)
    );
    return bImpact - aImpact;
  });

  // Handle clicking on a bar
  const handleClick = (data: any) => {
    if (onVariableClick && data && data.variableId) {
      onVariableClick(data.variableId);
    }
  };

  return (
    <div className="w-full" style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={sortedData}
          margin={{ top: 20, right: 30, bottom: 20, left: 120 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={formatNumber}
          />
          <YAxis
            dataKey="variable"
            type="category"
            width={120}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={baseValue} stroke="#888" />
          <Bar
            dataKey="positiveDelta"
            fill="#4ade80"
            onClick={handleClick}
            className="cursor-pointer"
          />
          <Bar
            dataKey="negativeDelta"
            fill="#f43f5e"
            onClick={handleClick}
            className="cursor-pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
