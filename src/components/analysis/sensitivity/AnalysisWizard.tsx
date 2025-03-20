
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Info, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AnalysisVariable } from "../VariableControl";
import { useOutputs } from "@/hooks/use-outputs";
import { useInputs } from "@/hooks/use-inputs";
import { transformInputToAnalysisVariable } from "./SensitivityData";
import { calculateLCOE, calculateLCOH } from "./SensitivityData";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/utils";

interface AnalysisWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: {
    outputMetric: string;
    baseValue: number;
    selectedVariables: AnalysisVariable[];
    variableRanges: Record<string, { minPercentage: number; maxPercentage: number }>;
  }) => void;
}

export function AnalysisWizard({ isOpen, onClose, onComplete }: AnalysisWizardProps) {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOutput, setSelectedOutput] = useState("");
  const [selectedVariables, setSelectedVariables] = useState<AnalysisVariable[]>([]);
  const [variableRanges, setVariableRanges] = useState<Record<string, { 
    minPercentage: number; 
    maxPercentage: number;
    minValue?: number;
    maxValue?: number;
    rangeType: "percentage" | "absolute";
  }>>({});
  const [baseValue, setBaseValue] = useState<number>(0);
  
  const { getAllOutputs } = useOutputs();
  const { inputs } = useInputs();
  const { toast } = useToast();
  
  const outputs = getAllOutputs();
  
  const lcoeValue = calculateLCOE(inputs);
  const lcohValue = calculateLCOH(inputs);
  
  const derivedMetricInputs = [
    {
      id: "derived-lcoe",
      name: "Levelized Cost of Energy (LCOE)",
      description: "Calculated LCOE based on project inputs",
      categoryId: "production",
      unit: "$/MWh",
      dataType: "constant" as const,
      expenseType: "other" as const,
      value: lcoeValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "derived-lcoh",
      name: "Levelized Cost of Hydrogen (LCOH)",
      description: "Calculated LCOH based on project inputs",
      categoryId: "production",
      unit: "$/kg",
      dataType: "constant" as const,
      expenseType: "other" as const,
      value: lcohValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];
  
  const availableVariables = [
    ...inputs.map(input => transformInputToAnalysisVariable(input)),
    ...derivedMetricInputs.map(input => transformInputToAnalysisVariable(input))
  ];
  
  const filteredOutputs = outputs.filter(output => 
    output.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredVariables = availableVariables.filter(variable => 
    variable.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedVariables.some(selected => selected.id === variable.id)
  );
  
  const groupedVariables: Record<string, AnalysisVariable[]> = {};
  
  filteredVariables.forEach(variable => {
    const category = variable.category || "Other";
    if (!groupedVariables[category]) {
      groupedVariables[category] = [];
    }
    groupedVariables[category].push(variable);
  });
  
  const handleOutputSelect = (value: string) => {
    setSelectedOutput(value);
    
    const output = outputs.find(o => o.name === value);
    
    if (output) {
      setBaseValue(output.value);
    } else {
      const metricBaseValues: Record<string, number> = {
        "NPV": 1000000,
        "IRR": 12,
        "DSCR": 1.5,
        "LCOE": lcoeValue || 45,
        "LCOH": lcohValue || 4.5,
        "Payback": 5,
        "Equity IRR": 15,
        "MOIC": 2.5,
        "Dividend Yield": 6,
        "Cash-on-Cash Return": 12,
        "LLCR": 1.8,
        "PLCR": 2.0,
        "Interest Coverage Ratio": 3.5,
        "Gearing Ratio": 70
      };
      
      setBaseValue(metricBaseValues[value] || 0);
    }
  };
  
  const handleBaseValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setBaseValue(value);
    }
  };
  
  const handleVariableSelect = (variable: AnalysisVariable) => {
    setSelectedVariables(prev => [...prev, variable]);
    
    setVariableRanges(prev => ({
      ...prev,
      [variable.id]: {
        minPercentage: 20,
        maxPercentage: 20,
        minValue: variable.baseValue * 0.8,
        maxValue: variable.baseValue * 1.2,
        rangeType: "percentage"
      }
    }));
  };
  
  const handleVariableRemove = (variableId: string) => {
    setSelectedVariables(prev => prev.filter(v => v.id !== variableId));
    
    setVariableRanges(prev => {
      const newRanges = { ...prev };
      delete newRanges[variableId];
      return newRanges;
    });
  };
  
  const handlePercentageChange = (variableId: string, type: "min" | "max", value: number) => {
    setVariableRanges(prev => {
      const variable = selectedVariables.find(v => v.id === variableId);
      if (!variable) return prev;
      
      const currentRange = prev[variableId] || { 
        minPercentage: 20, 
        maxPercentage: 20,
        rangeType: "percentage"
      };
      
      const updatedRange = { ...currentRange };
      
      if (type === "min") {
        updatedRange.minPercentage = value;
        if (currentRange.rangeType === "percentage") {
          updatedRange.minValue = variable.baseValue * (1 - value / 100);
        }
      } else {
        updatedRange.maxPercentage = value;
        if (currentRange.rangeType === "percentage") {
          updatedRange.maxValue = variable.baseValue * (1 + value / 100);
        }
      }
      
      return { ...prev, [variableId]: updatedRange };
    });
  };
  
  const handleValueChange = (variableId: string, type: "min" | "max", value: number) => {
    setVariableRanges(prev => {
      const variable = selectedVariables.find(v => v.id === variableId);
      if (!variable) return prev;
      
      const currentRange = prev[variableId] || { 
        minPercentage: 20, 
        maxPercentage: 20,
        minValue: 0,
        maxValue: 0,
        rangeType: "absolute" 
      };
      
      const updatedRange = { ...currentRange };
      
      if (type === "min") {
        updatedRange.minValue = value;
        if (variable.baseValue !== 0) {
          updatedRange.minPercentage = Math.round(((variable.baseValue - value) / variable.baseValue) * 100);
        }
      } else {
        updatedRange.maxValue = value;
        if (variable.baseValue !== 0) {
          updatedRange.maxPercentage = Math.round(((value - variable.baseValue) / variable.baseValue) * 100);
        }
      }
      
      return { ...prev, [variableId]: updatedRange };
    });
  };
  
  const handleRangeTypeChange = (variableId: string, type: "percentage" | "absolute") => {
    setVariableRanges(prev => {
      const currentRange = prev[variableId];
      if (!currentRange) return prev;
      
      return {
        ...prev,
        [variableId]: {
          ...currentRange,
          rangeType: type
        }
      };
    });
  };
  
  const applyCommonPercentage = (percentage: number) => {
    const newRanges = { ...variableRanges };
    
    selectedVariables.forEach(variable => {
      newRanges[variable.id] = {
        minPercentage: percentage,
        maxPercentage: percentage,
        minValue: variable.baseValue * (1 - percentage / 100),
        maxValue: variable.baseValue * (1 + percentage / 100),
        rangeType: "percentage"
      };
    });
    
    setVariableRanges(newRanges);
    
    toast({
      description: `Applied ±${percentage}% range to all variables`
    });
  };
  
  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const config = {
        outputMetric: selectedOutput,
        baseValue,
        selectedVariables,
        variableRanges: Object.entries(variableRanges).reduce((acc, [key, value]) => {
          acc[key] = {
            minPercentage: value.minPercentage,
            maxPercentage: value.maxPercentage
          };
          return acc;
        }, {} as Record<string, { minPercentage: number; maxPercentage: number }>)
      };
      
      onComplete(config);
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSearchTerm("");
      setSelectedOutput("");
      setSelectedVariables([]);
      setVariableRanges({});
    }
  }, [isOpen]);
  
  const isNextEnabled = () => {
    switch (step) {
      case 1:
        return selectedOutput !== "";
      case 2:
        return selectedVariables.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Select the output metric you want to analyze for sensitivity
            </p>
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search metrics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {filteredOutputs.length > 0 ? (
                  filteredOutputs.map((output) => (
                    <div 
                      key={output.id} 
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                        selectedOutput === output.name 
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleOutputSelect(output.name)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          selectedOutput === output.name ? "bg-primary" : "border border-muted-foreground"
                        }`}>
                          {selectedOutput === output.name && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span>{output.name}</span>
                      </div>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current value: {formatNumber(output.value)}</p>
                            <p className="text-xs text-muted-foreground">{output.description || "No description available"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No metrics match your search
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {selectedOutput && (
              <div className="bg-muted/50 p-3 rounded-md space-y-3">
                <h4 className="text-sm font-medium">Selected Metric</h4>
                <p className="text-sm">{selectedOutput}</p>
                
                <div className="space-y-2">
                  <Label htmlFor="base-value">Base value</Label>
                  <Input
                    id="base-value"
                    type="number"
                    value={baseValue}
                    onChange={handleBaseValueChange}
                    className="max-w-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    This value will be used as the center point for the sensitivity analysis.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Select the input variables you want to test for sensitivity
            </p>
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search variables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Selected Variables: {selectedVariables.length}
              </span>
              
              {selectedVariables.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedVariables([])}
                >
                  Clear All
                </Button>
              )}
            </div>
            
            {selectedVariables.length > 0 && (
              <div className="flex flex-wrap gap-2 py-2">
                {selectedVariables.map((variable) => (
                  <Badge 
                    key={variable.id} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {variable.name}
                    <button 
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                      onClick={() => handleVariableRemove(variable.id)}
                    >
                      <AlertCircle className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {Object.keys(groupedVariables).length > 0 ? (
                  Object.entries(groupedVariables).map(([category, variables]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
                      
                      {variables.map((variable) => (
                        <div 
                          key={variable.id} 
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                          onClick={() => handleVariableSelect(variable)}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox id={variable.id} />
                            <Label htmlFor={variable.id} className="cursor-pointer font-normal">
                              {variable.name}
                            </Label>
                          </div>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Base value: {formatNumber(variable.baseValue)} {variable.unit}</p>
                                <p className="text-xs text-muted-foreground">
                                  {variable.name} - {variable.category || "Unknown category"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No variables match your search
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Configure the range for each variable to test its sensitivity
            </p>
            
            <div className="flex justify-end space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyCommonPercentage(5)}
                    >
                      ±5%
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Apply ±5% range to all variables</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyCommonPercentage(10)}
                    >
                      ±10%
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Apply ±10% range to all variables</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyCommonPercentage(20)}
                    >
                      ±20%
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Apply ±20% range to all variables</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-6">
                {selectedVariables.map((variable) => {
                  const range = variableRanges[variable.id] || {
                    minPercentage: 20,
                    maxPercentage: 20,
                    minValue: variable.baseValue * 0.8,
                    maxValue: variable.baseValue * 1.2,
                    rangeType: "percentage"
                  };
                  
                  return (
                    <div key={variable.id} className="space-y-3 pb-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">{variable.name}</h3>
                        
                        <Tabs 
                          value={range.rangeType} 
                          onValueChange={(value) => 
                            handleRangeTypeChange(variable.id, value as "percentage" | "absolute")
                          }
                          className="w-[200px]"
                        >
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="percentage">Percentage</TabsTrigger>
                            <TabsTrigger value="absolute">Absolute</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      
                      <div className="bg-muted/30 p-2 rounded-md text-sm">
                        Base Value: {formatNumber(variable.baseValue)} {variable.unit}
                      </div>
                      
                      <div className="space-y-4">
                        {/* Min Value Control */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Minimum Value</Label>
                            {range.rangeType === "percentage" ? (
                              <span className="text-sm text-muted-foreground">-{range.minPercentage}%</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                {formatNumber(range.minValue || 0)} {variable.unit}
                              </span>
                            )}
                          </div>
                          
                          {range.rangeType === "percentage" ? (
                            <>
                              <Slider
                                value={[range.minPercentage]}
                                min={5}
                                max={50}
                                step={5}
                                onValueChange={(values) => 
                                  handlePercentageChange(variable.id, "min", values[0])
                                }
                              />
                              <div className="text-sm text-muted-foreground">
                                Value: {formatNumber(range.minValue || 0)} {variable.unit}
                              </div>
                            </>
                          ) : (
                            <Input 
                              type="number"
                              value={range.minValue || 0}
                              onChange={(e) => 
                                handleValueChange(variable.id, "min", parseFloat(e.target.value))
                              }
                            />
                          )}
                        </div>
                        
                        {/* Max Value Control */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Maximum Value</Label>
                            {range.rangeType === "percentage" ? (
                              <span className="text-sm text-muted-foreground">+{range.maxPercentage}%</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                {formatNumber(range.maxValue || 0)} {variable.unit}
                              </span>
                            )}
                          </div>
                          
                          {range.rangeType === "percentage" ? (
                            <>
                              <Slider
                                value={[range.maxPercentage]}
                                min={5}
                                max={50}
                                step={5}
                                onValueChange={(values) => 
                                  handlePercentageChange(variable.id, "max", values[0])
                                }
                              />
                              <div className="text-sm text-muted-foreground">
                                Value: {formatNumber(range.maxValue || 0)} {variable.unit}
                              </div>
                            </>
                          ) : (
                            <Input 
                              type="number"
                              value={range.maxValue || 0}
                              onChange={(e) => 
                                handleValueChange(variable.id, "max", parseFloat(e.target.value))
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Select Output Variable" : 
             step === 2 ? "Select Input Variables" : 
             "Configure Variable Ranges"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          {renderStepContent()}
        </div>
        
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          {step > 1 && (
            <Button variant="outline" onClick={handlePrevStep}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          
          <Button onClick={handleNextStep} disabled={!isNextEnabled()}>
            {step === 3 ? (
              "Generate Chart"
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
