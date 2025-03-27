
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OutputCategory } from "@/models/outputs";
import { useOutputs } from "@/hooks/use-outputs";
import { formatNumber } from "@/lib/utils";

interface OutputsSummaryProps {
  category: OutputCategory;
}

export function OutputsSummary({ category }: OutputsSummaryProps) {
  const getKeyMetrics = () => {
    switch (category.id) {
      case "developer":
        return [
          { id: "irr", name: "IRR", format: "percentage" },
          { id: "npv", name: "NPV", format: "currency" },
          { id: "lcoe", name: "LCOE", format: "currency" },
          { id: "lcoh", name: "LCOH", format: "currency" }
        ];
      case "equity":
        return [
          { id: "equity-irr", name: "Equity IRR", format: "percentage" },
          { id: "dividend-yield", name: "Dividend Yield", format: "percentage" },
          { id: "moic", name: "MOIC", format: "ratio" }
        ];
      case "debt":
        return [
          { id: "dscr", name: "DSCR", format: "ratio" },
          { id: "llcr", name: "LLCR", format: "ratio" },
          { id: "gearing", name: "Gearing", format: "percentage" }
        ];
      default:
        return [];
    }
  };
  
  const formatValue = (id: string, format: string) => {
    const output = category.outputs.find(o => o.id === id);
    if (!output) return "-";
    
    switch (format) {
      case "percentage":
        return `${formatNumber(output.value)}%`;
      case "currency":
        if (output.unit === "$/kg" || output.unit === "$/MWh") {
          return `${formatNumber(output.value)} ${output.unit}`;
        }
        return `$${formatNumber(output.value)}`;
      case "ratio":
        return `${formatNumber(output.value)}x`;
      default:
        return formatNumber(output.value);
    }
  };
  
  const getStatusColor = (id: string) => {
    const output = category.outputs.find(o => o.id === id);
    if (!output) return "text-gray-500";
    
    // Determine status color based on metric type and value
    switch (id) {
      case "irr":
      case "equity-irr":
        return output.value >= 15 ? "text-green-500" : output.value >= 10 ? "text-amber-500" : "text-red-500";
      case "npv":
      case "equity-npv":
        return output.value > 0 ? "text-green-500" : "text-red-500";
      case "dscr":
      case "llcr":
      case "plcr":
        return output.value >= 1.5 ? "text-green-500" : output.value >= 1.2 ? "text-amber-500" : "text-red-500";
      case "lcoe":
        return output.value <= 40 ? "text-green-500" : output.value <= 60 ? "text-amber-500" : "text-red-500";
      case "lcoh":
        return output.value <= 3 ? "text-green-500" : output.value <= 5 ? "text-amber-500" : "text-red-500";
      default:
        return "text-gray-500";
    }
  };
  
  const metrics = getKeyMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
            <CardDescription>
              {category.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(metric.id)}`}>
              {formatValue(metric.id, metric.format)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
