
import { useState, useEffect } from "react";
import { VariableControl, type AnalysisVariable } from "./VariableControl";
import { DataPanel } from "@/components/ui/DataPanel";
import { SensitivityChart } from "./sensitivity/SensitivityChart";
import { SensitivitySummary } from "./sensitivity/SensitivitySummary";
import { useToast } from "@/components/ui/use-toast";
import { useInputs } from "@/hooks/use-inputs";
import { useOutputs } from "@/hooks/use-outputs";
import { Button } from "@/components/ui/button";
import { SaveIcon, RotateCcw, PlusCircle, Copy } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculateVariableImpact, transformInputToAnalysisVariable, calculateLCOE, calculateLCOH } from "./sensitivity/SensitivityData";

export function SensitivityAnalysis() {
  const [selectedVariables, setSelectedVariables] = useState<AnalysisVariable[]>([]);
  const [currentMetric, setCurrentMetric] = useState("NPV");
  const [isLoading, setIsLoading] = useState(false);
  const [baseValue, setBaseValue] = useState(1000000); // Default base value for the analysis
  const [savedAnalyses, setSavedAnalyses] = useState<Array<{
    id: string;
    name: string;
    metric: string;
    variables: AnalysisVariable[];
    baseValue: number;
    variableRanges: Record<string, { minPercentage: number; maxPercentage: number }>;
  }>>([]);
  const [analysisName, setAnalysisName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [variableRanges, setVariableRanges] = useState<Record<string, { minPercentage: number; maxPercentage: number }>>({});
  const [impacts, setImpacts] = useState<Record<string, { positiveImpact: number; negativeImpact: number }>>({});
  
  const { inputs } = useInputs();
  const { getAllOutputs } = useOutputs();
  const { toast } = useToast();
  
  // Calculate derived metrics
  const lcoeValue = calculateLCOE(inputs);
  const lcohValue = calculateLCOH(inputs);
  
  // Add derived metrics to the available variables
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
  
  // Get the list of output metrics from the outputs hook
  const outputMetrics = getAllOutputs().map(output => output.name);
  
  // Transform inputs to analysis variables whenever inputs change
  const availableVariables = [
    ...inputs.map(input => transformInputToAnalysisVariable(input)),
    ...derivedMetricInputs.map(input => transformInputToAnalysisVariable(input))
  ];

  // Initialize or update variable ranges when selectedVariables changes
  useEffect(() => {
    const newRanges = { ...variableRanges };
    let updated = false;
    
    selectedVariables.forEach(variable => {
      if (!newRanges[variable.id]) {
        // Default to ±20% range (can be asymmetric)
        newRanges[variable.id] = { 
          minPercentage: 20,
          maxPercentage: 20 
        };
        updated = true;
      }
    });
    
    if (updated) {
      setVariableRanges(newRanges);
      calculateImpacts();
    }
  }, [selectedVariables]);
  
  // Calculate the impact of each variable on the selected metric
  const calculateImpacts = () => {
    setIsLoading(true);
    
    const newImpacts: Record<string, { positiveImpact: number; negativeImpact: number }> = {};
    
    selectedVariables.forEach(variable => {
      const ranges = variableRanges[variable.id] || { minPercentage: 20, maxPercentage: 20 };
      
      // Calculate positive impact (increasing the variable)
      const positiveImpact = calculateVariableImpact(
        variable,
        currentMetric,
        baseValue,
        ranges.maxPercentage
      );
      
      // Calculate negative impact (decreasing the variable)
      const negativeImpact = -calculateVariableImpact(
        variable,
        currentMetric,
        baseValue,
        -ranges.minPercentage
      );
      
      newImpacts[variable.id] = {
        positiveImpact,
        negativeImpact
      };
    });
    
    setImpacts(newImpacts);
    
    // Simulate some calculation time
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Handle selecting variables for analysis
  const handleVariableSelection = (variables: AnalysisVariable[]) => {
    setSelectedVariables(variables);
  };

  // Handle changing the output metric
  const handleMetricChange = (metric: string) => {
    setCurrentMetric(metric);
    
    // Find the selected output to get its base value
    const selectedOutput = getAllOutputs().find(output => output.name === metric);
    
    // Update base value based on the selected metric
    if (selectedOutput) {
      setBaseValue(selectedOutput.value);
    } else {
      // Fallback to default values if not found in outputs
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
      
      setBaseValue(metricBaseValues[metric] || 0);
    }
    
    // Recalculate impacts with the new metric
    calculateImpacts();
  };
  
  // Handle changing the base value manually
  const handleBaseValueChange = (newBaseValue: number) => {
    setBaseValue(newBaseValue);
    calculateImpacts();
  };
  
  // Handle updating variable ranges
  const handleRangeChange = (variableId: string, minPercentage: number, maxPercentage: number) => {
    setVariableRanges(prev => ({
      ...prev,
      [variableId]: { minPercentage, maxPercentage }
    }));
  };
  
  // Handle removing a variable
  const handleRemoveVariable = (variableId: string) => {
    setSelectedVariables(prev => prev.filter(v => v.id !== variableId));
    
    // Also remove from ranges
    setVariableRanges(prev => {
      const newRanges = { ...prev };
      delete newRanges[variableId];
      return newRanges;
    });
    
    // And from impacts
    setImpacts(prev => {
      const newImpacts = { ...prev };
      delete newImpacts[variableId];
      return newImpacts;
    });
  };
  
  // Handle updating the chart after range changes
  const handleUpdateChart = () => {
    calculateImpacts();
    
    toast({
      description: "Chart updated with new sensitivity ranges"
    });
  };
  
  // Handle saving the analysis
  const handleSaveAnalysis = () => {
    if (selectedVariables.length === 0) {
      toast({
        title: "No variables selected",
        description: "Please select at least one variable to save this analysis.",
        variant: "destructive"
      });
      return;
    }
    
    if (!analysisName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your analysis.",
        variant: "destructive"
      });
      return;
    }
    
    const id = `analysis-${Date.now()}`;
    const newSavedAnalysis = {
      id,
      name: analysisName,
      metric: currentMetric,
      variables: selectedVariables,
      baseValue,
      variableRanges
    };
    
    setSavedAnalyses(prev => [...prev, newSavedAnalysis]);
    setDialogOpen(false);
    
    toast({
      title: "Analysis saved",
      description: `"${analysisName}" has been saved and can be accessed later.`
    });
  };
  
  // Handle duplicating the analysis
  const handleDuplicateAnalysis = () => {
    setAnalysisName(`${currentMetric} Analysis (Copy)`);
    setDialogOpen(true);
  };
  
  // Handle resetting the analysis
  const handleResetAnalysis = () => {
    setSelectedVariables([]);
    setVariableRanges({});
    setImpacts({});
    toast({
      description: "Analysis has been reset. You can now start a new analysis."
    });
  };
  
  // Handle creating a new analysis
  const handleNewAnalysis = () => {
    handleResetAnalysis();
    setAnalysisName("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Sensitivity Analysis</h1>
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <SaveIcon className="h-4 w-4" />
                Save Analysis
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Analysis</DialogTitle>
                <DialogDescription>
                  Enter a name for your sensitivity analysis to save it for later reference.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="analysis-name">Analysis Name</Label>
                  <Input 
                    id="analysis-name" 
                    placeholder="e.g., Hydrogen Project IRR Sensitivity" 
                    value={analysisName}
                    onChange={(e) => setAnalysisName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-normal text-muted-foreground">Output Metric</Label>
                  <p className="text-sm">{currentMetric}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-normal text-muted-foreground">Variables</Label>
                  <p className="text-sm">{selectedVariables.length} variables selected</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveAnalysis}>Save Analysis</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDuplicateAnalysis}
            className="flex items-center gap-1"
          >
            <Copy className="h-4 w-4" />
            Duplicate
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNewAnalysis}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            New Analysis
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetAnalysis}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
      
      <p className="text-muted-foreground max-w-4xl">
        Understand how different variables impact your project outcomes. Select an output metric, 
        choose input variables to analyze, and visualize their impact with an interactive tornado chart.
      </p>
      
      <DataPanel>
        <VariableControl
          availableVariables={availableVariables}
          onVariableSelection={handleVariableSelection}
          selectedVariables={selectedVariables}
          metrics={outputMetrics}
          onMetricChange={handleMetricChange}
          currentMetric={currentMetric}
          baseValue={baseValue}
          onBaseValueChange={handleBaseValueChange}
          showBaseValueInput={false}
        />
      </DataPanel>
      
      <SensitivityChart 
        selectedVariables={selectedVariables}
        currentMetric={currentMetric}
        isLoading={isLoading}
        baseValue={baseValue}
        variableRanges={variableRanges}
        onRangeChange={handleRangeChange}
        onRemoveVariable={handleRemoveVariable}
        onUpdateChart={handleUpdateChart}
        impacts={impacts}
      />
      
      <SensitivitySummary 
        selectedVariables={selectedVariables}
        currentMetric={currentMetric}
        baseValue={baseValue}
      />
    </div>
  );
}
