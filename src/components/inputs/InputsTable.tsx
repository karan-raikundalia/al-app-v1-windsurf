import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InputValue, useInputs } from "@/hooks/use-inputs";
import { InputDataType } from "@/pages/InputsPage";
import { Badge } from "@/components/ui/badge";
import { Equal, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface InputsTableProps {
  categoryFilter?: string;
  dataTypeFilter: InputDataType | "all";
  viewMode: "component" | "expense";
}

export function InputsTable({
  categoryFilter,
  dataTypeFilter,
  viewMode,
}: InputsTableProps) {
  const { inputs } = useInputs();
  const [timeSeriesDialog, setTimeSeriesDialog] = useState<{
    open: boolean;
    input?: InputValue;
  }>({ open: false });

  // Filter inputs based on category and data type
  const filteredInputs = inputs.filter((input) => {
    const categoryMatch = !categoryFilter || categoryFilter === "all" || input.categoryId === categoryFilter;
    const dataTypeMatch = dataTypeFilter === "all" || input.dataType === dataTypeFilter;
    console.log('Input:', input.name, 'Category:', input.categoryId, 'Category Match:', categoryMatch);
    return categoryMatch && dataTypeMatch;
  });

  // Group inputs based on view mode
  const groupedInputs = filteredInputs.reduce((acc, input) => {
    const key = viewMode === "component" ? input.categoryId : getExpenseType(input);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(input);
    console.log('Grouped Input:', input.name, 'Key:', key);
    return acc;
  }, {} as Record<string, InputValue[]>);

  // Helper function to get expense type based on input properties
  function getExpenseType(input: InputValue): string {
    if (input.expenseType) {
      return input.expenseType;
    }
    if (input.name.toLowerCase().includes("capex") || input.description.toLowerCase().includes("capital")) {
      return "capex";
    } else if (input.name.toLowerCase().includes("opex") || input.description.toLowerCase().includes("operating")) {
      return "opex";
    } else if (input.categoryId.includes("tax") || input.name.toLowerCase().includes("tax")) {
      return "tax";
    } else if (input.categoryId.includes("financing") || input.name.toLowerCase().includes("financing")) {
      return "financing";
    } else {
      return "other";
    }
  }

  // Get a human-readable label for a group key
  function getGroupLabel(key: string): string {
    const labelMap: Record<string, string> = {
      bess: "Battery Energy Storage Systems",
      hydrogen: "Hydrogen Systems",
      solar: "Solar PV Systems",
      wind: "Wind Systems",
      "project-financing": "Project Financing",
      "system-financing": "System Financing",
      "tax-credits": "Tax Credits",
      production: "Production",
      opex: "Operating Expenses",
      tax: "Tax",
      construction: "Construction",
      capex: "Capital Expenditures",
      financing: "Financing",
      other: "Other",
    };
    return labelMap[key] || key;
  }

  // Handle opening time series dialog
  const handleViewTimeSeries = (input: InputValue) => {
    setTimeSeriesDialog({
      open: true,
      input,
    });
  };

  // Format time series data for chart
  const formatTimeSeriesData = (values?: number[]) => {
    if (!values) return [];
    return values.map((value, index) => ({
      hour: index,
      value,
    }));
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedInputs).map(([groupKey, groupInputs]) => (
        <div key={groupKey} className="space-y-2">
          <h3 className="text-lg font-medium">{getGroupLabel(groupKey)}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupInputs.map((input) => (
                <TableRow key={input.id}>
                  <TableCell className="font-medium">{input.name}</TableCell>
                  <TableCell>{input.description}</TableCell>
                  <TableCell>{input.unit}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 ${
                        input.dataType === "constant"
                          ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                          : "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400"
                      }`}
                    >
                      {input.dataType === "constant" ? (
                        <Equal className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {input.dataType === "constant" ? "Constant" : "Time Series"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {input.dataType === "constant"
                      ? typeof input.value === "number"
                        ? input.value.toFixed(2)
                        : input.value
                      : `${input.timeSeriesValues?.length || 0} points`}
                  </TableCell>
                  <TableCell>
                    {input.dataType === "timeSeries" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTimeSeries(input)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}

      {/* Time Series View Dialog */}
      <Dialog
        open={timeSeriesDialog.open}
        onOpenChange={(open) => setTimeSeriesDialog({ open, input: timeSeriesDialog.input })}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{timeSeriesDialog.input?.name}</DialogTitle>
            <DialogDescription>
              {timeSeriesDialog.input?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="h-[300px] w-full">
            <ChartContainer
              className="h-full"
              config={{
                value: {
                  theme: {
                    light: "hsl(var(--primary))",
                    dark: "hsl(var(--primary))",
                  },
                },
              }}
            >
              <AreaChart
                data={formatTimeSeriesData(timeSeriesDialog.input?.timeSeriesValues)}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  label={{ value: "Hour", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  label={{
                    value: timeSeriesDialog.input?.unit,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent
                          className="border-none bg-background/80 backdrop-blur-sm"
                          payload={payload}
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  fill="hsl(var(--primary) / 0.2)"
                  strokeWidth={2}
                  stroke="hsl(var(--primary))"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </DialogContent>
      </Dialog>

      {Object.keys(groupedInputs).length === 0 && (
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No inputs found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
