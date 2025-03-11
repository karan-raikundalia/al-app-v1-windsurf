
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataPanel } from "@/components/ui/DataPanel";
import { VariableSelector } from "./multi-metric/VariableSelector";
import { MetricSelector } from "./multi-metric/MetricSelector";
import { AnalysisResults } from "./multi-metric/AnalysisResults";
import { AnalysisWizard } from "./multi-metric/AnalysisWizard";
import { Button } from "@/components/ui/button";
import { 
  BarChartHorizontal, 
  BookTemplate, 
  Download, 
  History, 
  AreaChart, 
  Save 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Define types for our analysis
export interface Variable {
  id: string;
  name: string;
  baseValue: number;
  minValue: number;
  maxValue: number;
  unit: string;
  category: VariableCategory;
  stepSize?: number;
}

export type VariableCategory = "financial" | "technical" | "operational" | "environmental";

export interface Metric {
  id: string;
  name: string;
  description: string;
  category: MetricCategory;
  unit: string;
  isSelected: boolean;
}

export type MetricCategory = "financial" | "technical" | "environmental" | "operational";

export interface AnalysisConfiguration {
  variables: Variable[];
  metrics: Metric[];
  projects: Project[];
  analysisType: "one-way" | "two-way" | "three-way";
  numberOfSteps: number;
}

export interface Project {
  id: string;
  name: string;
  technology: "solar" | "wind" | "battery" | "hybrid";
  baseValues: Record<string, number>;
}

export function MultiMetricAnalysisTool() {
  const [activeTab, setActiveTab] = useState<string>("analysis");
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [config, setConfig] = useState<AnalysisConfiguration>({
    variables: defaultVariables,
    metrics: defaultMetrics,
    projects: defaultProjects,
    analysisType: "two-way",
    numberOfSteps: 10
  });
  
  const [selectedVariables, setSelectedVariables] = useState<Variable[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<Metric[]>([]);
  
  const handleStartAnalysis = () => {
    if (selectedVariables.length < 1) {
      toast({
        title: "Select Variables",
        description: "Please select at least one variable for analysis.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedMetrics.length < 1) {
      toast({
        title: "Select Metrics",
        description: "Please select at least one metric to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, this would trigger the analysis calculation
    toast({
      title: "Analysis Started",
      description: `Analyzing ${selectedMetrics.length} metrics across ${selectedVariables.length} variables.`,
    });
    
    setActiveTab("results");
  };
  
  const handleSaveAnalysis = () => {
    toast({
      title: "Analysis Saved",
      description: "Your analysis configuration has been saved.",
    });
  };
  
  const handleExportResults = () => {
    toast({
      title: "Results Exported",
      description: "Results have been exported to CSV format.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Multi-Metric Sensitivity Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Analyze multiple metrics across multiple variables for renewable energy projects
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5"
            onClick={() => setShowWizard(true)}
          >
            <BookTemplate className="h-4 w-4" />
            Setup Wizard
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5"
            onClick={handleSaveAnalysis}
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5"
            onClick={handleExportResults}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="analysis" className="gap-1.5">
            <BarChartHorizontal className="h-4 w-4" />
            Setup Analysis
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-1.5">
            <AreaChart className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <DataPanel title="Select Variables" className="md:col-span-1">
              <VariableSelector 
                variables={config.variables}
                selectedVariables={selectedVariables}
                setSelectedVariables={setSelectedVariables}
                analysisType={config.analysisType}
              />
            </DataPanel>
            
            <DataPanel title="Select Metrics" className="md:col-span-1">
              <MetricSelector 
                metrics={config.metrics}
                selectedMetrics={selectedMetrics}
                setSelectedMetrics={setSelectedMetrics}
              />
            </DataPanel>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleStartAnalysis} 
              className="gap-1.5"
            >
              <BarChartHorizontal className="h-4 w-4" />
              Run Analysis
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          <AnalysisResults 
            variables={selectedVariables} 
            metrics={selectedMetrics}
            projects={config.projects}
            analysisType={config.analysisType}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <DataPanel>
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No Saved Analyses</h3>
              <p className="text-muted-foreground mt-2">
                Your previous analyses will appear here once you save them.
              </p>
            </div>
          </DataPanel>
        </TabsContent>
      </Tabs>
      
      {showWizard && (
        <AnalysisWizard 
          onClose={() => setShowWizard(false)}
          onComplete={(newConfig) => {
            setConfig(newConfig);
            setShowWizard(false);
            toast({
              title: "Analysis Configured",
              description: "Your analysis has been set up successfully.",
            });
          }}
          initialConfig={config}
        />
      )}
    </div>
  );
}

// Default data for our analysis tool
const defaultVariables: Variable[] = [
  {
    id: "capex",
    name: "Capital Expenditure",
    baseValue: 1000000,
    minValue: 800000,
    maxValue: 1200000,
    unit: "$",
    category: "financial"
  },
  {
    id: "opex",
    name: "Operational Expenditure",
    baseValue: 50000,
    minValue: 40000,
    maxValue: 60000,
    unit: "$/year",
    category: "operational"
  },
  {
    id: "energy_price",
    name: "Energy Price",
    baseValue: 50,
    minValue: 30,
    maxValue: 70,
    unit: "$/MWh",
    category: "financial"
  },
  {
    id: "degradation",
    name: "Annual Degradation",
    baseValue: 0.5,
    minValue: 0.3,
    maxValue: 0.8,
    unit: "%",
    category: "technical"
  },
  {
    id: "discount_rate",
    name: "Discount Rate",
    baseValue: 8,
    minValue: 5,
    maxValue: 12,
    unit: "%",
    category: "financial"
  },
  {
    id: "interest_rate",
    name: "Interest Rate",
    baseValue: 5,
    minValue: 3,
    maxValue: 8,
    unit: "%",
    category: "financial"
  },
  {
    id: "capacity_factor",
    name: "Capacity Factor",
    baseValue: 25,
    minValue: 18,
    maxValue: 32,
    unit: "%",
    category: "technical"
  },
  {
    id: "tax_rate",
    name: "Tax Rate",
    baseValue: 21,
    minValue: 15,
    maxValue: 28,
    unit: "%",
    category: "financial"
  },
  {
    id: "carbon_price",
    name: "Carbon Price",
    baseValue: 25,
    minValue: 10,
    maxValue: 50,
    unit: "$/ton CO2",
    category: "environmental"
  }
];

const defaultMetrics: Metric[] = [
  {
    id: "irr",
    name: "IRR",
    description: "Internal Rate of Return",
    category: "financial",
    unit: "%",
    isSelected: false
  },
  {
    id: "npv",
    name: "NPV",
    description: "Net Present Value",
    category: "financial",
    unit: "$",
    isSelected: false
  },
  {
    id: "lcoe",
    name: "LCOE",
    description: "Levelized Cost of Energy",
    category: "financial",
    unit: "$/MWh",
    isSelected: false
  },
  {
    id: "payback",
    name: "Payback Period",
    description: "Time to recover investment",
    category: "financial",
    unit: "years",
    isSelected: false
  },
  {
    id: "dscr",
    name: "DSCR",
    description: "Debt Service Coverage Ratio",
    category: "financial",
    unit: "ratio",
    isSelected: false
  },
  {
    id: "energy_yield",
    name: "Energy Yield",
    description: "Annual energy production",
    category: "technical",
    unit: "MWh",
    isSelected: false
  },
  {
    id: "performance_ratio",
    name: "Performance Ratio",
    description: "Actual vs theoretical energy output",
    category: "technical",
    unit: "%",
    isSelected: false
  },
  {
    id: "co2_avoided",
    name: "CO2 Avoided",
    description: "Carbon emissions avoided",
    category: "environmental",
    unit: "tons CO2",
    isSelected: false
  },
  {
    id: "water_usage",
    name: "Water Usage",
    description: "Water consumption",
    category: "environmental",
    unit: "m³",
    isSelected: false
  },
  {
    id: "land_efficiency",
    name: "Land Efficiency",
    description: "Energy production per area",
    category: "environmental",
    unit: "MWh/acre",
    isSelected: false
  }
];

const defaultProjects: Project[] = [
  {
    id: "solar_1",
    name: "Solar PV Project",
    technology: "solar",
    baseValues: {
      capex: 1000000,
      opex: 50000,
      energy_price: 50,
      degradation: 0.5,
      discount_rate: 8,
      interest_rate: 5,
      capacity_factor: 25,
      tax_rate: 21,
      carbon_price: 25
    }
  }
];
