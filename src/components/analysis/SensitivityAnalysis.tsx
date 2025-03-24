
import { useState, useEffect } from "react";
import { VariableControl, type AnalysisVariable } from "./VariableControl";
import { DataPanel } from "@/components/ui/DataPanel";
import { SensitivityChart } from "./sensitivity/SensitivityChart";
import { SensitivitySummary } from "./sensitivity/SensitivitySummary";
import { SavedAnalyses } from "./sensitivity/SavedAnalyses";
import { useToast } from "@/components/ui/use-toast";
import { useInputs } from "@/hooks/use-inputs";
import { useOutputs } from "@/hooks/use-outputs";
import { Button } from "@/components/ui/button";
import { SaveIcon, RotateCcw, PlusCircle, Copy, Download } from "lucide-react";
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
import { AnalysisWizard } from "./sensitivity/AnalysisWizard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { calculateVariableImpact, transformInputToAnalysisVariable, calculateLCOE, calculateLCOH } from "./sensitivity/SensitivityData";

// Define saved analysis type
export interface SavedAnalysis {
  id: string;
  name: string;
  metric: string;
  variables: AnalysisVariable[];
  baseValue: number;
  variableRanges: Record<string, { 
    minPercentage: number; 
    maxPercentage: number; 
  }>;
  createdAt: Date;
}

// Sample saved analyses for demonstration
const sampleSavedAnalyses: SavedAnalysis[] = [
  {
    id: "analysis-1",
    name: "NPV Sensitivity - Base Case",
    metric: "NPV",
    variables: [
      {
        id: "capex",
        name: "Capital Expenditure",
        baseValue: 1000000,
        unit: "$",
        category: "Financial"
      },
      {
        id: "opex",
        name: "Operating Expenses",
        baseValue: 50000,
        unit: "$/year",
        category: "Operations"
      },
      {
        id: "production",
        name: "Annual Production",
        baseValue: 10000,
        unit: "MWh",
        category: "Production"
      }
    ],
    baseValue: 500000,
    variableRanges: {
      "capex": { minPercentage: 20, maxPercentage: 20 },
      "opex": { minPercentage: 15, maxPercentage: 15 },
      "production": { minPercentage: 10, maxPercentage: 10 }
    },
    createdAt: new Date(2023, 9, 15)
  },
  {
    id: "analysis-2",
    name: "IRR Sensitivity Analysis",
    metric: "IRR",
    variables: [
      {
        id: "discount-rate",
        name: "Discount Rate",
        baseValue: 8,
        unit: "%",
        category: "Financial"
      },
      {
        id: "inflation",
        name: "Inflation Rate",
        baseValue: 2.5,
        unit: "%",
        category: "Macroeconomic"
      }
    ],
    baseValue: 12.5,
    variableRanges: {
      "discount-rate": { minPercentage: 25, maxPercentage: 25 },
      "inflation": { minPercentage: 40, maxPercentage: 40 }
    },
    createdAt: new Date(2023, 10, 22)
  }
];

export function SensitivityAnalysis() {
  const [selectedVariables, setSelectedVariables] = useState<AnalysisVariable[]>([]);
  const [currentMetric, setCurrentMetric] = useState("NPV");
  const [isLoading, setIsLoading] = useState(false);
  const [baseValue, setBaseValue] = useState(1000000); // Default base value for the analysis
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>(sampleSavedAnalyses);
  const [analysisName, setAnalysisName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [variableRanges, setVariableRanges] = useState<Record<string, { minPercentage: number; maxPercentage: number }>>({});
  const [impacts, setImpacts] = useState<Record<string, { positiveImpact: number; negativeImpact: number }>>({});
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  
  const { inputs } = useInputs();
  const { getAllOutputs } = useOutputs();
  const { toast } = useToast();
  
  // Get the list of output metrics from the outputs hook
  const outputMetrics = getAllOutputs().map(output => output.name);
  
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

  // Effect to recalculate impacts when variables, ranges, or metric changes
  useEffect(() => {
    if (selectedVariables.length > 0) {
      calculateImpacts();
    }
  }, [selectedVariables, currentMetric, baseValue]);

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
        "LCOE": calculateLCOE(inputs) || 45,
        "LCOH": calculateLCOH(inputs) || 4.5,
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
  };
  
  // Handle changing the base value manually
  const handleBaseValueChange = (newBaseValue: number) => {
    setBaseValue(newBaseValue);
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
    const newSavedAnalysis: SavedAnalysis = {
      id,
      name: analysisName,
      metric: currentMetric,
      variables: selectedVariables,
      baseValue,
      variableRanges,
      createdAt: new Date()
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
  
  // Handle loading a saved analysis
  const handleLoadAnalysis = (analysis: SavedAnalysis) => {
    setCurrentMetric(analysis.metric);
    setBaseValue(analysis.baseValue);
    setSelectedVariables(analysis.variables);
    setVariableRanges(analysis.variableRanges);
    setShowAnalysisView(true);
    
    // Calculate impacts for the loaded analysis
    setIsLoading(true);
    setTimeout(() => {
      calculateImpacts();
    }, 100);
    
    toast({
      description: `Loaded analysis: ${analysis.name}`
    });
  };
  
  // Handle deleting a saved analysis
  const handleDeleteAnalysis = (analysisId: string) => {
    setSavedAnalyses(prev => prev.filter(analysis => analysis.id !== analysisId));
    
    toast({
      description: "Analysis deleted"
    });
  };
  
  // Handle resetting the analysis
  const handleResetAnalysis = () => {
    setSelectedVariables([]);
    setVariableRanges({});
    setImpacts({});
    setShowAnalysisView(false);
    toast({
      description: "Analysis has been reset. You can now start a new analysis."
    });
  };
  
  // Handle creating a new analysis using the wizard
  const handleNewAnalysis = () => {
    setWizardOpen(true);
  };

  // Handle export as PNG
  const handleExportPNG = () => {
    // Placeholder for PNG export functionality
    toast({
      description: "Exporting as PNG... (Not implemented)"
    });
  };
  
  // Handle export as PDF
  const handleExportPDF = () => {
    // Placeholder for PDF export functionality
    toast({
      description: "Exporting as PDF... (Not implemented)"
    });
  };
  
  // Handle export as Excel
  const handleExportExcel = () => {
    // Placeholder for Excel export functionality
    toast({
      description: "Exporting as Excel... (Not implemented)"
    });
  };
  
  // Handle completing the wizard
  const handleWizardComplete = (config: {
    outputMetric: string;
    baseValue: number;
    selectedVariables: AnalysisVariable[];
    variableRanges: Record<string, { minPercentage: number; maxPercentage: number }>;
  }) => {
    setCurrentMetric(config.outputMetric);
    setBaseValue(config.baseValue);
    setSelectedVariables(config.selectedVariables);
    setVariableRanges(config.variableRanges);
    setWizardOpen(false);
    setShowAnalysisView(true);
    
    // Calculate impacts for the new configuration
    setIsLoading(true);
    setTimeout(() => {
      calculateImpacts();
    }, 100);
    
    toast({
      description: "New sensitivity analysis created successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Sensitivity Analysis</h1>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleNewAnalysis}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            New Analysis
          </Button>
          
          {showAnalysisView && (
            <>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    disabled={selectedVariables.length === 0}
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={selectedVariables.length === 0}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportPNG}>
                    Export as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportExcel}>
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDuplicateAnalysis}
                disabled={selectedVariables.length === 0}
                className="flex items-center gap-1"
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetAnalysis}
                disabled={selectedVariables.length === 0}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>
      
      <p className="text-muted-foreground max-w-4xl">
        Understand how different variables impact your project outcomes. Create a new analysis to 
        select an output metric, choose input variables to analyze, and visualize their impact 
        with an interactive tornado chart.
      </p>
      
      {showAnalysisView ? (
        <>
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
        </>
      ) : (
        <SavedAnalyses 
          analyses={savedAnalyses}
          onLoadAnalysis={handleLoadAnalysis}
          onDeleteAnalysis={handleDeleteAnalysis}
          onNewAnalysis={handleNewAnalysis}
        />
      )}
      
      {/* Analysis Wizard Modal */}
      <AnalysisWizard 
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={handleWizardComplete}
      />
    </div>
  );
}
