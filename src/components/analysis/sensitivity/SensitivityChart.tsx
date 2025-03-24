import { useState } from "react";
import { TornadoChart } from "../TornadoChart";
import { AnalysisVariable } from "../VariableControl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, BarChart as BarChartIcon } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DataPanel } from "@/components/ui/DataPanel";
import { EditPanel } from "./EditPanel";

interface SensitivityChartProps {
  selectedVariables: AnalysisVariable[];
  currentMetric: string;
  isLoading: boolean;
  baseValue: number;
  variableRanges: Record<string, { minPercentage: number; maxPercentage: number }>;
  onRangeChange: (variableId: string, min: number, max: number) => void;
  onRemoveVariable: (variableId: string) => void;
  onUpdateChart: () => void;
  impacts: Record<string, { positiveImpact: number; negativeImpact: number }>;
}

export function SensitivityChart({ 
  selectedVariables, 
  currentMetric, 
  isLoading,
  baseValue,
  variableRanges,
  onRangeChange,
  onRemoveVariable,
  onUpdateChart,
  impacts
}: SensitivityChartProps) {
  const [sortBy, setSortBy] = useState<"impact" | "alphabetical">("impact");
  const [displayMode, setDisplayMode] = useState<"absolute" | "percentage">("absolute");
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  
  const generatePlaceholderData = () => {
    return selectedVariables.map((variable, index) => {
      const baseImpact = (baseValue * (0.15 - (index * 0.02)));
      
      return {
        variable: variable.name,
        positiveDelta: baseImpact,
        negativeDelta: -baseImpact * 0.8,
        baseline: baseValue,
        category: variable.category,
        unit: variable.unit,
        variableId: variable.id
      };
    });
  };
  
  const transformedData = (() => {
    if (Object.keys(impacts).length > 0) {
      return selectedVariables.map(variable => {
        const variableImpact = impacts[variable.id] || { positiveImpact: 0, negativeImpact: 0 };
        
        const positiveDelta = displayMode === "absolute" 
          ? variableImpact.positiveImpact 
          : (variableImpact.positiveImpact / baseValue) * 100;
          
        const negativeDelta = displayMode === "absolute" 
          ? variableImpact.negativeImpact 
          : (variableImpact.negativeImpact / baseValue) * 100;
        
        return {
          variable: variable.name,
          positiveDelta: positiveDelta,
          negativeDelta: negativeDelta,
          baseline: baseValue,
          category: variable.category,
          unit: displayMode === "percentage" ? "%" : variable.unit,
          variableId: variable.id
        };
      });
    } 
    else if (selectedVariables.length > 0) {
      return generatePlaceholderData();
    }
    
    return [];
  })();

  const handleVariableClick = (variableId: string) => {
    setSelectedVariable(variableId);
  };

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
          <BarChartIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-sm">
            Select input variables to visualize their impact on {currentMetric}
          </p>
        </div>
      </DataPanel>
    );
  }

  return (
    <div className="relative">
      <EditPanel 
        selectedVariables={selectedVariables}
        currentMetric={currentMetric}
        variableRanges={variableRanges}
        onRangeChange={onRangeChange}
        onRemoveVariable={onRemoveVariable}
        onUpdateChart={onUpdateChart}
      />
      
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
            </div>
          </div>
          
          {transformedData.length > 0 ? (
            <TornadoChart 
              data={transformedData}
              baseValue={0}
              sortBy={sortBy}
              onVariableClick={handleVariableClick}
              chartHeight={Math.max(300, 60 * selectedVariables.length)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-80">
              <BarChartIcon className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No data available for chart</p>
            </div>
          )}
          
          <div className="text-xs text-center text-muted-foreground">
            {displayMode === "absolute" ? (
              <p>Values show absolute change in {currentMetric} when variables are adjusted by their defined ranges</p>
            ) : (
              <p>Values show percentage change in {currentMetric} when variables are adjusted by their defined ranges</p>
            )}
          </div>
        </div>
      </DataPanel>
    </div>
  );
}
