
import React from "react";
import { AnalysisVariable } from "../VariableControl";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Plus, Minus, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatNumber } from "@/lib/utils";

interface EditPanelProps {
  selectedVariables: AnalysisVariable[];
  currentMetric: string;
  variableRanges: Record<string, { minPercentage: number; maxPercentage: number }>;
  onRangeChange: (variableId: string, min: number, max: number) => void;
  onRemoveVariable: (variableId: string) => void;
  onUpdateChart: () => void;
}

export function EditPanel({
  selectedVariables,
  currentMetric,
  variableRanges,
  onRangeChange,
  onRemoveVariable,
  onUpdateChart
}: EditPanelProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="fixed right-0 top-1/2 transform -translate-y-1/2 z-10"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`absolute -left-10 top-1/2 transform -translate-y-1/2 flex items-center gap-1 border-r-0 rounded-r-none h-24 ${isOpen ? 'bg-background' : 'bg-muted/60 hover:bg-muted'}`}
        >
          <span className="rotate-90 font-medium text-xs whitespace-nowrap">
            {isOpen ? "Hide Editor" : "Edit Variables"}
          </span>
          <ChevronRight className={`h-4 w-4 mt-1 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="w-80 border-l border-t border-b bg-background shadow-lg rounded-l-lg p-4 max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Variable Settings</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Adjust sensitivity ranges for each variable to see how they impact {currentMetric}.
          </p>
          
          {selectedVariables.length > 0 ? (
            <div className="space-y-5">
              {selectedVariables.map((variable) => {
                const ranges = variableRanges[variable.id] || { minPercentage: 20, maxPercentage: 20 };
                
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
                        onClick={() => onRemoveVariable(variable.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Negative range */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Negative Impact</Label>
                        <span className="text-xs text-muted-foreground">-{ranges.minPercentage}%</span>
                      </div>
                      <Slider
                        value={[ranges.minPercentage]}
                        min={5}
                        max={50}
                        step={5}
                        onValueChange={(values) => 
                          onRangeChange(variable.id, values[0], ranges.maxPercentage)
                        }
                      />
                      <div className="text-xs text-muted-foreground">
                        {formatNumber(variable.baseValue * (1 - ranges.minPercentage / 100))}
                        {variable.unit && ` ${variable.unit}`}
                      </div>
                    </div>
                    
                    {/* Positive range */}
                    <div className="space-y-1 mt-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Positive Impact</Label>
                        <span className="text-xs text-muted-foreground">+{ranges.maxPercentage}%</span>
                      </div>
                      <Slider
                        value={[ranges.maxPercentage]}
                        min={5}
                        max={50}
                        step={5}
                        onValueChange={(values) => 
                          onRangeChange(variable.id, ranges.minPercentage, values[0])
                        }
                      />
                      <div className="text-xs text-muted-foreground">
                        {formatNumber(variable.baseValue * (1 + ranges.maxPercentage / 100))}
                        {variable.unit && ` ${variable.unit}`}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <Button 
                className="w-full" 
                onClick={onUpdateChart}
              >
                Update Chart
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No variables selected
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
