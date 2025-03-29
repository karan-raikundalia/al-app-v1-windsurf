
import { useState, useEffect } from "react";
import { Check, ChevronDown, Search, Plus, Minus, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatNumber } from "@/lib/utils";

export interface AnalysisVariable {
  id: string;
  name: string;
  baseValue: number;
  minValue: number;
  maxValue: number;
  impact: number;
  category: string;
  unit?: string;
  metric?: "cost" | "schedule" | "performance" | "revenue" | "other";
}

interface VariableControlProps {
  availableVariables: AnalysisVariable[];
  onVariableSelection: (variables: AnalysisVariable[]) => void;
  selectedVariables: AnalysisVariable[];
  metrics: string[];
  onMetricChange: (metric: string) => void;
  currentMetric: string;
  baseValue: number;
  onBaseValueChange: (value: number) => void;
  showBaseValueInput?: boolean;
}

// Function to categorize variables into groups
const categorizeVariables = (variables: AnalysisVariable[]) => {
  const categories: Record<string, AnalysisVariable[]> = {
    "Technical": [],
    "Financial": [],
    "Operational": [],
    "Other": []
  };
  
  // Categorize variables based on their category property
  variables.forEach(variable => {
    const category = mapCategoryToGroup(variable.category);
    categories[category].push(variable);
  });
  
  return categories;
};

// Map variable categories to higher-level groups
const mapCategoryToGroup = (category: string): string => {
  const technicalCategories = ["solar", "wind", "battery", "bess", "hydrogen", "production"];
  const financialCategories = ["project-financing", "system-financing", "tax-credits", "tax"];
  const operationalCategories = ["opex", "construction"];
  
  if (technicalCategories.includes(category)) return "Technical";
  if (financialCategories.includes(category)) return "Financial";
  if (operationalCategories.includes(category)) return "Operational";
  return "Other";
};

export function VariableControl({
  availableVariables,
  onVariableSelection,
  selectedVariables,
  metrics,
  onMetricChange,
  currentMetric,
  baseValue,
  onBaseValueChange,
  showBaseValueInput = true
}: VariableControlProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVariables, setFilteredVariables] = useState<AnalysisVariable[]>(availableVariables);
  const [variableRanges, setVariableRanges] = useState<Record<string, { minPercentage: number; maxPercentage: number }>>({}); 
  
  // Update filtered variables when search query changes or availableVariables changes
  useEffect(() => {
    const filtered = availableVariables.filter(
      variable => variable.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVariables(filtered);
  }, [searchQuery, availableVariables]);
  
  // Initialize variable ranges for newly selected variables
  useEffect(() => {
    const newRanges = { ...variableRanges };
    let updated = false;
    
    selectedVariables.forEach(variable => {
      if (!newRanges[variable.id]) {
        // Default to ±20% range (symmetrical)
        newRanges[variable.id] = { 
          minPercentage: -20,
          maxPercentage: 20
        };
        updated = true;
        
        // Also update the impact value based on the default range
        variable.minValue = variable.baseValue * 0.8;
        variable.maxValue = variable.baseValue * 1.2;
        variable.impact = variable.baseValue * 0.2; // Set initial impact
      }
    });
    
    if (updated) {
      setVariableRanges(newRanges);
    }
  }, [selectedVariables]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleVariableSelect = (variable: AnalysisVariable) => {
    const isAlreadySelected = selectedVariables.some(v => v.id === variable.id);
    
    if (isAlreadySelected) {
      // Remove the variable
      const updated = selectedVariables.filter(v => v.id !== variable.id);
      onVariableSelection(updated);
    } else {
      // Add the variable with initial min/max/impact calculation
      const variableWithRange = {
        ...variable,
        minValue: variable.baseValue * 0.8, // Default -20%
        maxValue: variable.baseValue * 1.2, // Default +20%
        impact: variable.baseValue * 0.2 // Default 20% impact
      };
      onVariableSelection([...selectedVariables, variableWithRange]);
    }
  };
  
  const handleRemoveVariable = (variableId: string) => {
    const updated = selectedVariables.filter(v => v.id !== variableId);
    onVariableSelection(updated);
  };
  
  const handleRangeChange = (variableId: string, minMax: [number, number]) => {
    const variable = selectedVariables.find(v => v.id === variableId);
    if (!variable) return;
    
    const baseVal = variable.baseValue;
    const minPercentage = ((minMax[0] - baseVal) / baseVal) * 100;
    const maxPercentage = ((minMax[1] - baseVal) / baseVal) * 100;
    
    // Update the range in our local state
    setVariableRanges(prev => ({
      ...prev,
      [variableId]: { 
        minPercentage,
        maxPercentage
      }
    }));
    
    // Update the impact value and min/max values for this variable
    const updatedVariables = selectedVariables.map(variable => {
      if (variable.id === variableId) {
        return {
          ...variable,
          minValue: minMax[0],
          maxValue: minMax[1],
          // Use the larger percentage change for impact
          impact: Math.max(
            Math.abs(minMax[0] - baseVal),
            Math.abs(minMax[1] - baseVal)
          )
        };
      }
      return variable;
    });
    
    onVariableSelection(updatedVariables);
  };
  
  const handleBaseValueAdjust = (adjustment: number) => {
    const newValue = baseValue + adjustment;
    if (newValue > 0) {
      onBaseValueChange(newValue);
    }
  };
  
  const handleBaseValueInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      onBaseValueChange(value);
    }
  };

  // Update the min/max values when the user directly enters them
  const handleMinMaxInput = (variableId: string, isMin: boolean, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    const variable = selectedVariables.find(v => v.id === variableId);
    if (!variable) return;
    
    const updatedVariables = selectedVariables.map(v => {
      if (v.id === variableId) {
        if (isMin) {
          // Ensure min doesn't exceed max
          const minValue = Math.min(numValue, v.maxValue);
          return { ...v, minValue };
        } else {
          // Ensure max doesn't fall below min
          const maxValue = Math.max(numValue, v.minValue);
          return { ...v, maxValue };
        }
      }
      return v;
    });
    
    // Update the range percentages in state
    const updatedVar = updatedVariables.find(v => v.id === variableId);
    if (updatedVar) {
      const minPercentage = ((updatedVar.minValue - updatedVar.baseValue) / updatedVar.baseValue) * 100;
      const maxPercentage = ((updatedVar.maxValue - updatedVar.baseValue) / updatedVar.baseValue) * 100;
      
      setVariableRanges(prev => ({
        ...prev,
        [variableId]: { minPercentage, maxPercentage }
      }));
    }
    
    onVariableSelection(updatedVariables);
  };

  // Group variables by category
  const categorizedVariables = categorizeVariables(filteredVariables);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px]">
          <Label htmlFor="metric">Output Metric</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between mt-2">
                {currentMetric}
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Metric</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {metrics.map((metric) => (
                <DropdownMenuCheckboxItem
                  key={metric}
                  checked={currentMetric === metric}
                  onCheckedChange={() => onMetricChange(metric)}
                >
                  {metric}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {showBaseValueInput && (
          <div className="flex-1 min-w-[250px]">
            <Label htmlFor="baseValue">Base Value</Label>
            <div className="flex items-center gap-2 mt-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleBaseValueAdjust(-Math.max(1, baseValue * 0.01))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="baseValue"
                type="number"
                value={baseValue}
                onChange={handleBaseValueInput}
                className="text-center"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleBaseValueAdjust(Math.max(1, baseValue * 0.01))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <Separator />
      
      <div>
        <Label htmlFor="variables" className="text-base font-medium">Select Input Variables for Sensitivity Analysis</Label>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="variables"
            placeholder="Search variables..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full mt-2 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Select Variables
              <ChevronDown className="h-4 w-4 ml-auto opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[350px]">
            <DropdownMenuLabel>Available Variables</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[400px]">
              {Object.entries(categorizedVariables).map(([category, variables]) => (
                variables.length > 0 && (
                  <DropdownMenuGroup key={category}>
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium bg-muted/50">
                      {category}
                    </DropdownMenuLabel>
                    {variables.map((variable) => (
                      <DropdownMenuItem
                        key={variable.id}
                        onSelect={(e) => {
                          e.preventDefault();
                          handleVariableSelect(variable);
                        }}
                        className="py-2"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span>{variable.name}</span>
                            <span className="text-xs text-muted-foreground">
                              Base: {formatNumber(variable.baseValue)} 
                              {variable.unit && ` ${variable.unit}`}
                            </span>
                          </div>
                          {selectedVariables.some(v => v.id === variable.id) && (
                            <Check className="h-4 w-4 ml-2" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </DropdownMenuGroup>
                )
              ))}
              
              {filteredVariables.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No variables found
                </div>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {selectedVariables.length === 0 ? (
        <div className="bg-muted/30 rounded-lg p-6 text-center">
          <SlidersHorizontal className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Select variables to begin sensitivity analysis</p>
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          <h3 className="text-sm font-medium flex items-center">
            Selected Variables and Ranges 
            <Badge variant="outline" className="ml-2">{selectedVariables.length}</Badge>
          </h3>
          
          <div className="space-y-6">
            {selectedVariables.map((variable) => {
              const range = variableRanges[variable.id] || { minPercentage: -20, maxPercentage: 20 };
              
              return (
                <div key={variable.id} className="space-y-3 bg-muted/20 border border-muted rounded-lg p-4 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveVariable(variable.id)}
                    className="absolute top-2 right-2 h-7 w-7"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div>
                    <div className="flex items-center gap-2 pr-6">
                      <span className="font-medium">{variable.name}</span>
                      <Badge variant="outline" className="text-xs">{variable.category}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Base Case: {formatNumber(variable.baseValue)}
                      {variable.unit && ` ${variable.unit}`}
                    </div>
                  </div>
                  
                  <div className="space-y-5 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Min</span>
                        <span>Base</span>
                        <span>Max</span>
                      </div>
                      
                      <Slider
                        value={[variable.minValue, variable.maxValue]}
                        min={variable.baseValue * 0.5}  // Allow up to 50% reduction
                        max={variable.baseValue * 1.5}  // Allow up to 50% increase
                        step={(variable.baseValue * 1.5 - variable.baseValue * 0.5) / 100} // 100 steps across the range
                        onValueChange={(values) => handleRangeChange(variable.id, [values[0], values[1]])}
                        className="my-4"
                      />
                      
                      <div className="flex justify-between gap-3">
                        <div className="flex-1">
                          <Input
                            value={formatNumber(variable.minValue)}
                            onChange={(e) => handleMinMaxInput(variable.id, true, e.target.value)}
                            className="text-sm text-right"
                          />
                          <div className="text-xs text-muted-foreground text-right mt-1">
                            {range.minPercentage.toFixed(0)}% of base
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <Input
                            value={formatNumber(variable.maxValue)}
                            onChange={(e) => handleMinMaxInput(variable.id, false, e.target.value)}
                            className="text-sm text-right"
                          />
                          <div className="text-xs text-muted-foreground text-right mt-1">
                            {range.maxPercentage.toFixed(0)}% of base
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
