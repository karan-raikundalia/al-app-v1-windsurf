
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Line, 
  ComposedChart 
} from "recharts";
import { MonthlyChangeOrderData } from "@/models/changeOrder";
import { formatCurrency } from "@/lib/utils";

interface MonthlyChangeOrderChartProps {
  data: MonthlyChangeOrderData[];
  timelineValue: number;
  forecastedCount: number;
  budgetAmount: number;
  onBarClick: (changeOrderId: string) => void;
}

export function MonthlyChangeOrderChart({ 
  data, 
  timelineValue,
  forecastedCount,
  budgetAmount,
  onBarClick 
}: MonthlyChangeOrderChartProps) {
  // Slice the data based on the timeline value
  const slicedData = data.slice(0, timelineValue + 1);
  
  // Check if showing all months
  const isFullTimeline = timelineValue === data.length - 1;
  
  // Calculate if any bar exceeds forecast and if cumulative cost exceeds budget threshold
  const exceededForecast = slicedData.some(item => item.changeOrderCount > forecastedCount * 1.2);
  const exceededBudget = slicedData.some(item => item.cumulativeCostImpact > budgetAmount * 0.1);
  
  // Calculate the latest cumulative impact percentage of budget
  const latestImpactPercentage = slicedData.length > 0 
    ? (slicedData[slicedData.length - 1].cumulativeCostImpact / budgetAmount) * 100 
    : 0;
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-md shadow-md p-3 text-sm">
          <p className="font-bold">{label}</p>
          <p className="text-blue-500">
            Count: {payload[0].value} change orders
            {payload[0].value > forecastedCount * 1.2 && (
              <span className="text-red-500 font-bold ml-2">
                ⚠️ {Math.round((payload[0].value / forecastedCount - 1) * 100)}% above forecast
              </span>
            )}
          </p>
          <p className="text-green-600">
            Monthly Impact: {formatCurrency(payload[1].payload.costImpact)}
          </p>
          <p className="text-red-600">
            Cumulative Impact: {formatCurrency(payload[2].value)}
            {payload[2].value > budgetAmount * 0.1 && (
              <span className="text-red-500 font-bold ml-2">
                ⚠️ {latestImpactPercentage.toFixed(1)}% of total budget
              </span>
            )}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full h-[300px]">
      {exceededForecast && (
        <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
          ⚠️ Monthly change order count exceeds 120% of forecast in one or more periods.
        </div>
      )}
      
      {exceededBudget && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          ⚠️ Cumulative financial impact exceeds 10% of project budget ({latestImpactPercentage.toFixed(1)}%).
        </div>
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={slicedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onClick={() => onBarClick("CO-2024-001")} // Simplified for demo
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            tick={{ fontSize: 12 }} 
            label={{ value: 'Change Order Count', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tick={{ fontSize: 12 }} 
            label={{ value: 'Cumulative Impact ($)', angle: -90, position: 'insideRight' }}
            domain={[0, 'dataMax']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            yAxisId="left" 
            dataKey="changeOrderCount" 
            name="Change Order Count" 
            fill="#4338ca" 
            radius={[4, 4, 0, 0]} 
            className="cursor-pointer"
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="cumulativeCostImpact" 
            name="Cumulative Cost Impact" 
            stroke="#ef4444" 
            strokeWidth={2} 
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
