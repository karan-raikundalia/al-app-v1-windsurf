
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AnalysisVariable } from "../VariableControl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInputs, InputValue } from "@/hooks/use-inputs";

export interface VariableRange {
  variableId: string;
  minValue: number;
  maxValue: number;
  stepSize: number;
  usePercentage: boolean;
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

  // Filter inputs based on search query
  const filteredVariables = inputs
    .filter((input) =>
      input.name.toLowerCase().includes(variableSearchQuery.toLowerCase())
    )
    .slice(0, 10); // Limit to 10 results for performance

  const handleRangeChange = (index: number, field: keyof VariableRange, value: any) => {
    const newRanges = [...ranges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    onRangeChange(newRanges);
  };

  const addVariable = (variable: InputValue) => {
    if (selectedVariables.length >= maxVariables) return;

    // Check if variable is already selected
    const isAlreadySelected = selectedVariables.some(v => v.id === variable.id);
    if (isAlreadySelected) return;

    // For now, we're creating a mock AnalysisVariable from the InputValue
    // In a real application, this would be more sophisticated
    const newVariable: AnalysisVariable = {
      id: variable.id,
      name: variable.name,
      baseValue: typeof variable.value === 'number' ? variable.value : 0,
      minValue: typeof variable.value === 'number' ? variable.value * 0.8 : 0,
      maxValue: typeof variable.value === 'number' ? variable.value * 1.2 : 0,
      impact: 0, // This will be calculated during sensitivity analysis
      category: variable.categoryId,
      metric: "cost", // Default metric
    };

    // Add default range
    const newRange: VariableRange = {
      variableId: variable.id,
      minValue: newVariable.minValue,
      maxValue: newVariable.maxValue,
      stepSize: (newVariable.maxValue - newVariable.minValue) / 10,
      usePercentage: true,
    };

    onRangeChange([...ranges, newRange]);
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
        <Input
          type="text"
          placeholder="Search variables..."
          value={variableSearchQuery}
          onChange={(e) => setVariableSearchQuery(e.target.value)}
          className="w-full"
        />
        {variableSearchQuery && (
          <div className="border rounded-md max-h-60 overflow-y-auto">
            {filteredVariables.map((variable) => (
              <button
                key={variable.id}
                className="w-full px-3 py-2 text-left hover:bg-muted text-sm flex items-center justify-between"
                onClick={() => addVariable(variable)}
                disabled={selectedVariables.length >= maxVariables}
              >
                <div>
                  <div>{variable.name}</div>
                  <div className="text-xs text-muted-foreground">{variable.unit}</div>
                </div>
                <Plus className="h-4 w-4" />
              </button>
            ))}
            {filteredVariables.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No variables found
              </div>
            )}
          </div>
        )}
      </div>

      {ranges.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-medium">Selected Variables Configuration</h3>
          <div className="space-y-4">
            {ranges.map((range, index) => {
              const variable = inputs.find(v => v.id === range.variableId);
              if (!variable) return null;
              
              const baseValue = typeof variable.value === 'number' ? variable.value : 0;
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
                        <span className="text-sm">
                          Base Value: {baseValue} {variable.unit}
                        </span>
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
