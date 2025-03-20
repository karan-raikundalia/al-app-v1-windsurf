
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { DownloadCloud, Table as TableIcon, BarChart as ChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { OutputMetric } from "./OutputMetricSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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

  // Prepare data for tornado chart
  const chartData = sortedResults.map((result) => ({
    variableName: result.variableName,
    impact: result.absoluteChange,
    percentChange: result.percentChange,
    baseValue: result.baseValue,
    testValue: result.testValue,
    unit: result.unit,
  }));

  const handleExport = () => {
    // This would be implemented with a proper export library
    toast.success("Export functionality will be implemented");
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
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="horizontal"
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="variableName" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => {
                    const dataPoint = props.payload;
                    return [
                      `${dataPoint.impact > 0 ? '+' : ''}${dataPoint.impact.toFixed(2)} (${dataPoint.percentChange > 0 ? '+' : ''}${dataPoint.percentChange.toFixed(2)}%)`,
                      'Impact'
                    ];
                  }}
                  labelFormatter={(label) => `Variable: ${label}`}
                />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="impact" fill="#8884d8" />
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
