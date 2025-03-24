
import { useState } from "react";
import { DownloadCloud, Table as TableIcon, BarChart as ChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { OutputMetric } from "./OutputMetricSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

export interface SensitivityResult {
  variableId: string;
  variableName: string;
  baseValue: number;
  testValue: number;
  outputValue: number;
  percentChange: number;
  absoluteChange: number;
  unit: string;
}

interface SensitivityResultsProps {
  outputMetric: OutputMetric | null;
  results: SensitivityResult[];
  isLoading: boolean;
  baseOutputValue: number;
}

export function SensitivityResults({
  outputMetric,
  results,
  isLoading,
  baseOutputValue,
}: SensitivityResultsProps) {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [sortBy, setSort] = useState<"impact" | "name">("impact");

  // Sort and format data for the chart
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "impact") {
      return Math.abs(b.absoluteChange) - Math.abs(a.absoluteChange);
    }
    return a.variableName.localeCompare(b.variableName);
  });

  // Transform results for tornado chart
  const chartData = sortedResults.map((result) => ({
    variableName: result.variableName,
    value: result.absoluteChange,
    original: result,
  }));

  const handleExport = () => {
    // This would be implemented with a proper export library
    toast.success("Export functionality will be implemented");
  };

  const renderCustomTooltip = (props: any) => {
    const { payload } = props;
    if (!payload || payload.length === 0) return null;
    
    const data = payload[0].payload;
    const original = data.original;
    const isPositive = data.value >= 0;
    
    return (
      <div className="bg-white p-3 border rounded-md shadow-md text-sm">
        <p className="font-medium">{original.variableName}</p>
        <p>Base value: {original.baseValue} {original.unit}</p>
        <p>Test value: {original.testValue} {original.unit}</p>
        <p className={isPositive ? "text-green-600" : "text-red-600"}>
          {isPositive ? "+" : ""}{original.absoluteChange.toFixed(2)} ({isPositive ? "+" : ""}{original.percentChange.toFixed(2)}%)
        </p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sensitivity Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="space-y-4 w-full max-w-md">
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div className="h-full bg-primary animate-progress-loading rounded-full"></div>
              </div>
              <p className="text-center text-sm text-muted-foreground">Running sensitivity analysis...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!outputMetric || results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sensitivity Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground">
              Configure variables and run the analysis to see results here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>
            Sensitivity on {outputMetric.name}
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by impact</span>
              <Switch
                checked={sortBy === "impact"}
                onCheckedChange={(checked) => setSort(checked ? "impact" : "name")}
              />
            </div>
            <div className="flex items-center">
              <Button
                variant={viewMode === "chart" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("chart")}
                className="rounded-r-none"
              >
                <ChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-l-none"
              >
                <TableIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" onClick={handleExport}>
              <DownloadCloud className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "chart" ? (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="variableName" 
                  type="category" 
                  tick={{ fontSize: 12 }}
                  width={110}
                />
                <Tooltip content={renderCustomTooltip} />
                <ReferenceLine x={0} stroke="#000" />
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value >= 0 ? "#4ade80" : "#f87171"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variable</TableHead>
                  <TableHead>Base Value</TableHead>
                  <TableHead>Test Value</TableHead>
                  <TableHead>Output Change (Absolute)</TableHead>
                  <TableHead>Output Change (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedResults.map((result) => (
                  <TableRow key={result.variableId}>
                    <TableCell className="font-medium">{result.variableName}</TableCell>
                    <TableCell>{result.baseValue} {result.unit}</TableCell>
                    <TableCell>{result.testValue} {result.unit}</TableCell>
                    <TableCell className={result.absoluteChange > 0 ? "text-green-600" : "text-red-600"}>
                      {result.absoluteChange > 0 ? "+" : ""}{result.absoluteChange.toFixed(2)}
                    </TableCell>
                    <TableCell className={result.percentChange > 0 ? "text-green-600" : "text-red-600"}>
                      {result.percentChange > 0 ? "+" : ""}{result.percentChange.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
