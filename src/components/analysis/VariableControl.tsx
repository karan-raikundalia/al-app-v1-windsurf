
import { useState, useEffect } from "react";
import { Check, ChevronDown, Search, Plus, Minus, X } from "lucide-react";
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
  DropdownMenuTrigger 
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
  showBaseValueInput?: boolean; // New optional prop with default value
}

export function VariableControl({
  availableVariables,
  onVariableSelection,
  selectedVariables,
  metrics,
  onMetricChange,
  currentMetric,
  baseValue,
  onBaseValueChange,
  showBaseValueInput = true // Default to true for backward compatibility
}: VariableControlProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVariables, setFilteredVariables] = useState<AnalysisVariable[]>(availableVariables);
  const [variableRanges, setVariableRanges] = useState<Record<string, { percentage: number }>>({});
  
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
        newRanges[variable.id] = { percentage: 20 }; // Default to ±20%
        updated = true;
        
        // Also update the impact value based on the default range
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
      // Add the variable with initial impact calculation
      const variableWithImpact = {
        ...variable,
        impact: variable.baseValue * 0.2 // Default 20% impact
      };
      onVariableSelection([...selectedVariables, variableWithImpact]);
    }
  };
  
  const handleRemoveVariable = (variableId: string) => {
    const updated = selectedVariables.filter(v => v.id !== variableId);
    onVariableSelection(updated);
  };
  
  const handleRangeChange = (variableId: string, newPercentage: number) => {
    // Update the range in our local state
    setVariableRanges(prev => ({
      ...prev,
      [variableId]: { percentage: newPercentage }
    }));
    
    // Update the impact value for this variable
    const updatedVariables = selectedVariables.map(variable => {
      if (variable.id === variableId) {
        // Calculate impact based on percentage of base value
        return {
          ...variable,
          impact: variable.baseValue * (newPercentage / 100)
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
        <Label htmlFor="variables">Input Variables</Label>
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
            <Button variant="outline" className="w-full mt-2">
              Select Variables
              <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[300px]">
            <DropdownMenuLabel>Available Variables</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {filteredVariables.length > 0 ? (
                filteredVariables.map((variable) => (
                  <DropdownMenuItem
                    key={variable.id}
                    onSelect={(e) => {
                      e.preventDefault();
                      handleVariableSelect(variable);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{variable.name}</span>
                      {selectedVariables.some(v => v.id === variable.id) && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No variables found
                </div>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {selectedVariables.length > 0 && (
        <div className="space-y-4 mt-4">
          <h3 className="text-sm font-medium">Selected Variables and Ranges</h3>
          
          <div className="space-y-6">
            {selectedVariables.map((variable) => {
              const range = variableRanges[variable.id]?.percentage || 20;
              
              return (
                <div key={variable.id} className="space-y-2 bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{variable.name}</span>
                        <Badge variant="outline">{variable.category}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Base: {formatNumber(variable.baseValue)}
                        {variable.unit && ` ${variable.unit}`}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveVariable(variable.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>-{range}%</span>
                      <span>Range: ±{range}%</span>
                      <span>+{range}%</span>
                    </div>
                    <Slider
                      value={[range]}
                      min={5}
                      max={50}
                      step={5}
                      onValueChange={(values) => handleRangeChange(variable.id, values[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>
                        {formatNumber(variable.baseValue * (1 - range / 100))}
                        {variable.unit && ` ${variable.unit}`}
                      </span>
                      <span>
                        {formatNumber(variable.baseValue * (1 + range / 100))}
                        {variable.unit && ` ${variable.unit}`}
                      </span>
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
