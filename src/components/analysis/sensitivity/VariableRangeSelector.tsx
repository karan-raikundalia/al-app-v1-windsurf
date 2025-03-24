import { useState, useEffect } from "react";
import { Minus, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AnalysisVariable } from "../VariableControl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInputs, InputValue } from "@/hooks/use-inputs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface VariableRange {
  variableId: string;
  minValue: number;
  maxValue: number;
  stepSize: number;
  usePercentage: boolean;
  modifiedBaseValue?: number;
}

interface VariableRangeSelectorProps {
  selectedVariables: AnalysisVariable[];
  ranges: VariableRange[];
  onRangeChange: (ranges: VariableRange[]) => void;
  maxVariables?: number;
}

export function VariableRangeSelector({
  selectedVariables,
  ranges,
  onRangeChange,
  maxVariables = 5,
}: VariableRangeSelectorProps) {
  const { inputs } = useInputs();
  const [variableSearchQuery, setVariableSearchQuery] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const filteredVariables = inputs
    .filter((input) =>
      input.name.toLowerCase().includes(variableSearchQuery.toLowerCase())
    )
    .filter(input => {
      return !ranges.some(range => range.variableId === input.id);
    });

  const handleRangeChange = (index: number, field: keyof VariableRange, value: any) => {
    const newRanges = [...ranges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    
    if (field === 'modifiedBaseValue') {
      const variable = inputs.find(v => v.id === newRanges[index].variableId);
      const originalBaseValue = typeof variable?.value === 'number' ? variable.value : 0;
      
      const ratio = value / originalBaseValue;
      
      if (newRanges[index].usePercentage) {
        const oldMin = newRanges[index].minValue / originalBaseValue;
        const oldMax = newRanges[index].maxValue / originalBaseValue;
        newRanges[index].minValue = value * oldMin;
        newRanges[index].maxValue = value * oldMax;
      } else {
        const oldMinOffset = newRanges[index].minValue - originalBaseValue;
        const oldMaxOffset = newRanges[index].maxValue - originalBaseValue;
        newRanges[index].minValue = value + oldMinOffset;
        newRanges[index].maxValue = value + oldMaxOffset;
      }
    }
    
    onRangeChange(newRanges);
  };

  const addVariable = (variableId: string) => {
    if (selectedVariables.length >= maxVariables) return;

    const variable = inputs.find(v => v.id === variableId);
    if (!variable) return;
    
    const isAlreadySelected = ranges.some(r => r.variableId === variable.id);
    if (isAlreadySelected) return;

    const baseValue = typeof variable.value === 'number' ? variable.value : 0;
    
    const newRange: VariableRange = {
      variableId: variable.id,
      minValue: baseValue * 0.8,
      maxValue: baseValue * 1.2,
      stepSize: (baseValue * 1.2 - baseValue * 0.8) / 10,
      usePercentage: true,
      modifiedBaseValue: baseValue,
    };

    onRangeChange([...ranges, newRange]);
    setVariableSearchQuery("");
    setIsSelectOpen(false);
  };

  const removeVariable = (index: number) => {
    const newRanges = [...ranges];
    newRanges.splice(index, 1);
    onRangeChange(newRanges);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Select Variables to Test (Maximum {maxVariables})
        </label>
        
        <Popover open={isSelectOpen} onOpenChange={setIsSelectOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              disabled={ranges.length >= maxVariables}
            >
              <span>{ranges.length >= maxVariables ? `Maximum ${maxVariables} variables selected` : "Add variable"}</span>
              <Plus className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <div className="flex items-center p-2 border-b">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input
                placeholder="Search variables..."
                value={variableSearchQuery}
                onChange={(e) => setVariableSearchQuery(e.target.value)}
                className="border-none shadow-none focus-visible:ring-0 h-8"
              />
            </div>
            <ScrollArea className="h-[200px]">
              {filteredVariables.length > 0 ? (
                <div className="py-1">
                  {filteredVariables.map((variable) => (
                    <button
                      key={variable.id}
                      className="w-full px-3 py-2 text-left hover:bg-muted text-sm flex items-center justify-between"
                      onClick={() => addVariable(variable.id)}
                    >
                      <div>
                        <div>{variable.name}</div>
                        <div className="text-xs text-muted-foreground">{variable.unit}</div>
                      </div>
                      <Plus className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-4 px-3 text-center text-sm text-muted-foreground">
                  {variableSearchQuery ? "No variables found" : "No more variables available"}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {ranges.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-medium">Selected Variables Configuration</h3>
          <div className="space-y-4">
            {ranges.map((range, index) => {
              const variable = inputs.find(v => v.id === range.variableId);
              if (!variable) return null;
              
              const originalBaseValue = typeof variable.value === 'number' ? variable.value : 0;
              const baseValue = range.modifiedBaseValue !== undefined ? range.modifiedBaseValue : originalBaseValue;
              
              const displayMin = range.usePercentage 
                ? `${((range.minValue / baseValue) * 100 - 100).toFixed(0)}%` 
                : range.minValue.toString();
              const displayMax = range.usePercentage 
                ? `+${((range.maxValue / baseValue) * 100 - 100).toFixed(0)}%` 
                : range.maxValue.toString();
              
              return (
                <Card key={range.variableId}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{variable.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariable(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{variable.unit}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-sm">Base Value</span>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={baseValue}
                              onChange={(e) =>
                                handleRangeChange(index, "modifiedBaseValue", parseFloat(e.target.value))
                              }
                              className="w-32"
                            />
                            <span className="text-sm text-muted-foreground">{variable.unit}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Use Percentage</span>
                          <input
                            type="checkbox"
                            checked={range.usePercentage}
                            onChange={(e) =>
                              handleRangeChange(index, "usePercentage", e.target.checked)
                            }
                            className="form-checkbox h-4 w-4"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">Variable Range</label>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            value={range.minValue}
                            onChange={(e) =>
                              handleRangeChange(index, "minValue", parseFloat(e.target.value))
                            }
                            className="w-20"
                          />
                          <Slider
                            min={baseValue * 0.5}
                            max={baseValue * 1.5}
                            step={(baseValue * 1.5 - baseValue * 0.5) / 100}
                            value={[range.minValue, range.maxValue]}
                            onValueChange={([min, max]) => {
                              handleRangeChange(index, "minValue", min);
                              handleRangeChange(index, "maxValue", max);
                            }}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={range.maxValue}
                            onChange={(e) =>
                              handleRangeChange(index, "maxValue", parseFloat(e.target.value))
                            }
                            className="w-20"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Min: {displayMin}</span>
                        <span className="text-sm">Max: {displayMax}</span>
                      </div>
                      
                      <div className="pt-2">
                        <label className="text-sm block mb-1">Step Size</label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={range.stepSize}
                            onChange={(e) =>
                              handleRangeChange(index, "stepSize", parseFloat(e.target.value))
                            }
                            className="w-24"
                          />
                          <div className="text-sm text-muted-foreground">
                            ({Math.floor((range.maxValue - range.minValue) / range.stepSize)} steps)
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

