
import { useState } from "react";
import { TornadoChart } from "../TornadoChart";
import { AnalysisVariable } from "../VariableControl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, Table as TableIcon, BarChart2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DataPanel } from "@/components/ui/DataPanel";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  generateVariableAnalysisData, 
  formatMetricValue 
} from "./SensitivityData";

interface SensitivityChartProps {
  selectedVariables: AnalysisVariable[];
  currentMetric: string;
  isLoading: boolean;
  baseValue: number;
}

export function SensitivityChart({ 
  selectedVariables, 
  currentMetric, 
  isLoading,
  baseValue
}: SensitivityChartProps) {
  const [sortBy, setSortBy] = useState<"impact" | "alphabetical">("impact");
  const [displayMode, setDisplayMode] = useState<"absolute" | "percentage">("absolute");
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  
  // Generate detailed analysis data for each variable
  const detailedData = selectedVariables.map(variable => 
    generateVariableAnalysisData(variable, currentMetric)
  );
  
  // Transform the variables data for the TornadoChart component
  const transformedData = selectedVariables.map(variable => {
    // Calculate positive and negative impacts
    // For absolute values
    const positiveImpact = displayMode === "absolute" 
      ? variable.impact 
      : (variable.impact / baseValue) * 100;
      
    const negativeImpact = displayMode === "absolute" 
      ? -variable.impact 
      : -(variable.impact / baseValue) * 100;
    
    return {
      variable: variable.name,
      positiveDelta: positiveImpact,
      negativeDelta: negativeImpact,
      baseline: baseValue,
      category: variable.category,
      unit: displayMode === "percentage" ? "%" : variable.unit
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="space-y-4 w-full max-w-md">
          <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
            <div className="h-full bg-primary animate-progress-loading rounded-full"></div>
          </div>
          <p className="text-center text-sm text-muted-foreground">Loading analysis data...</p>
        </div>
      </div>
    );
  }

  if (selectedVariables.length === 0) {
    return (
      <DataPanel>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">
            Select input variables to visualize their impact on {currentMetric}
          </p>
        </div>
      </DataPanel>
    );
  }

  return (
    <DataPanel>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Sensitivity to {currentMetric}
          </h3>
          <div className="flex gap-2">
            <div>
              <Label htmlFor="sort-by" className="sr-only">Sort by</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" id="sort-by">
                    Sort: {sortBy === "impact" ? "By Impact" : "Alphabetical"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as "impact" | "alphabetical")}>
                    <DropdownMenuRadioItem value="impact">By Impact</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="alphabetical">Alphabetical</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div>
              <Label htmlFor="display-mode" className="sr-only">Display mode</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" id="display-mode">
                    {displayMode === "absolute" ? "Absolute" : "Percentage"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={displayMode} onValueChange={(value) => setDisplayMode(value as "absolute" | "percentage")}>
                    <DropdownMenuRadioItem value="absolute">Absolute</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="percentage">Percentage (%)</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setViewMode(viewMode === "chart" ? "table" : "chart")}
              >
                {viewMode === "chart" ? (
                  <>
                    <TableIcon className="mr-1 h-4 w-4" />
                    View Data
                  </>
                ) : (
                  <>
                    <BarChart2 className="mr-1 h-4 w-4" />
                    View Chart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {viewMode === "chart" ? (
          <TornadoChart 
            data={transformedData}
            baseValue={0}
            sortBy={sortBy}
            onVariableClick={(variable) => console.log("Clicked on:", variable)}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Sensitivity Analysis Results for {currentMetric}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Variable</TableHead>
                  <TableHead>Base Value</TableHead>
                  <TableHead>Baseline {currentMetric}</TableHead>
                  <TableHead className="text-right">+20% Impact</TableHead>
                  <TableHead className="text-right">-20% Impact</TableHead>
                  <TableHead className="text-right">+20% (% Change)</TableHead>
                  <TableHead className="text-right">-20% (% Change)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedData
                  .sort((a, b) => {
                    if (sortBy === "alphabetical") {
                      return a.variable.localeCompare(b.variable);
                    }
                    // Sort by absolute impact
                    const aImpact = Math.max(Math.abs(a.positive), Math.abs(a.negative));
                    const bImpact = Math.max(Math.abs(b.positive), Math.abs(b.negative));
                    return bImpact - aImpact;
                  })
                  .map((item) => {
                    const variable = selectedVariables.find(v => v.name === item.variable);
                    const positiveResult = item.baselineValue + item.positive;
                    const negativeResult = item.baselineValue + item.negative;
                    
                    return (
                      <TableRow key={item.variable}>
                        <TableCell className="font-medium">{item.variable}</TableCell>
                        <TableCell>
                          {variable ? `${variable.baseValue} ${variable.unit}` : '—'}
                        </TableCell>
                        <TableCell>{formatMetricValue(item.baselineValue, currentMetric)}</TableCell>
                        <TableCell className="text-right text-emerald-600">
                          {formatMetricValue(positiveResult, currentMetric)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatMetricValue(negativeResult, currentMetric)}
                        </TableCell>
                        <TableCell className="text-right text-emerald-600">
                          {item.positivePercentage > 0 ? '+' : ''}
                          {item.positivePercentage.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {item.negativePercentage > 0 ? '+' : ''}
                          {item.negativePercentage.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="text-xs text-center text-muted-foreground">
          {displayMode === "absolute" ? (
            <p>Values show absolute change in {currentMetric} when each variable is adjusted ±20%</p>
          ) : (
            <p>Values show percentage change in {currentMetric} when each variable is adjusted ±20%</p>
          )}
        </div>
      </div>
    </DataPanel>
  );
}
