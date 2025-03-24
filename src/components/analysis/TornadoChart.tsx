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
    unit?: string;
  }[];
  baseValue: number;
  sortBy?: "impact" | "alphabetical";
  onVariableClick?: (variable: string) => void;
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
    const percentage = ((Math.abs(value) / data.baseline) * 100).toFixed(1);

    return (
      <div className="glassmorphism rounded-lg p-3 text-sm">
        <p className="font-medium">{data.variable}</p>
        <p className={`text-${isPositive ? "blue" : "red"}-500 font-medium`}>
          {isPositive ? "+" : "-"}
          {formatNumber(Math.abs(value))}
          {data.unit && ` ${data.unit}`} ({percentage}%)
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Baseline: {formatNumber(data.baseline)}
          {data.unit && ` ${data.unit}`}
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
  const handleClick = (data: any, index: number, event: React.MouseEvent) => {
    if (onVariableClick && data && data.variable) {
      onVariableClick(data.variable);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={60 * data.length}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 120 }}
        onClick={(state: any) => {
          if (state && state.activePayload && state.activePayload[0]) {
            const payload = state.activePayload[0].payload;
            if (payload && payload.variable && onVariableClick) {
              onVariableClick(payload.variable);
            }
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          domain={["auto", "auto"]}
          tickFormatter={formatNumber}
        />
        <YAxis
          dataKey="variable"
          type="category"
          scale="band"
          width={110}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine x={baseValue} stroke="#888" />
        <Bar
          dataKey="positiveDelta"
          className="tornado-bar tornado-bar-positive"
          onClick={handleClick}
        />
        <Bar
          dataKey="negativeDelta"
          className="tornado-bar tornado-bar-negative"
          onClick={handleClick}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
