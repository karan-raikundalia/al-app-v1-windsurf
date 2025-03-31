
import { useState } from "react";
import { TornadoChart } from "../TornadoChart";
import { AnalysisVariable } from "../VariableControl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DataPanel } from "@/components/ui/DataPanel";
import { cn } from "@/lib/utils";

interface SensitivityChartProps {
  selectedVariables: AnalysisVariable[];
  currentMetric: string;
  selectedMetrics: string[];
  onMetricChange: (metric: string) => void;
  isLoading: boolean;
  baseValue: number;
}

export function SensitivityChart({ 
  selectedVariables, 
  currentMetric, 
  selectedMetrics,
  onMetricChange,
  isLoading,
  baseValue
}: SensitivityChartProps) {
  const [sortBy, setSortBy] = useState<"impact" | "alphabetical">("impact");
  const [displayMode, setDisplayMode] = useState<"absolute" | "percentage">("absolute");
  
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

  // Check if both variables and metrics are selected
  if (selectedVariables.length === 0 || selectedMetrics.length === 0) {
    return (
      <DataPanel>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">
            {selectedVariables.length === 0 
              ? "Select input variables to visualize their impact"
              : "Select output metrics for sensitivity analysis"}
          </p>
        </div>
      </DataPanel>
    );
  }

  return (
    <DataPanel>
      <div className="space-y-6">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Sensitivity Analysis
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
            </div>
          </div>
          
          {/* Metric Pills/Tabs */}
          <div className="flex flex-wrap gap-2 pb-2 border-b">
            {selectedMetrics.map(metric => (
              <Button 
                key={metric}
                variant={metric === currentMetric ? "default" : "outline"}
                size="sm" 
                className={cn(
                  "rounded-full h-8",
                  metric === currentMetric ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
                )}
                onClick={() => onMetricChange(metric)}
              >
                {metric}
              </Button>
            ))}
          </div>
          
          {currentMetric && (
            <h4 className="text-sm font-medium text-muted-foreground">
              Showing impact on {currentMetric}
            </h4>
          )}
        </div>
        
        <TornadoChart 
          data={transformedData}
          baseValue={0}
          sortBy={sortBy}
          onVariableClick={(variable) => console.log("Clicked on:", variable)}
        />
        
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
