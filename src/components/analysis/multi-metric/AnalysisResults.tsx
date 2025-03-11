
import { useState } from "react";
import { DataPanel } from "@/components/ui/DataPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TornadoChart } from "../TornadoChart";
import { Variable, Metric, Project } from "../MultiMetricAnalysisTool";
import { HeatMapChart } from "./HeatMapChart";
import { Surface3DChart } from "./Surface3DChart";
import { BarChart, BarChartHorizontal, LineChart, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

interface AnalysisResultsProps {
  variables: Variable[];
  metrics: Metric[];
  projects: Project[];
  analysisType: "one-way" | "two-way" | "three-way";
}

export function AnalysisResults({
  variables,
  metrics,
  projects,
  analysisType
}: AnalysisResultsProps) {
  const [activeChartType, setActiveChartType] = useState<string>(
    analysisType === "one-way" ? "tornado" : 
    analysisType === "two-way" ? "heatmap" : "surface"
  );
  
  const [activeMetric, setActiveMetric] = useState<string>(
    metrics.length > 0 ? metrics[0].id : ""
  );
  
  // Mock data for the charts
  const tornadoData = variables.map(variable => {
    const variableImpact = (Math.random() * 2 - 1) * 100000; // Random impact between -100k and 100k
    return {
      variable: variable.name,
      positiveDelta: variableImpact > 0 ? variableImpact : 0,
      negativeDelta: variableImpact < 0 ? variableImpact : 0,
      baseline: variable.baseValue
    };
  });
  
  const getMetricById = (id: string) => {
    return metrics.find(m => m.id === id) || metrics[0];
  };
  
  const renderChartSection = () => {
    if (variables.length === 0 || metrics.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Please select variables and metrics to analyze
          </p>
        </div>
      );
    }
    
    switch (activeChartType) {
      case "tornado":
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">
              Impact on {getMetricById(activeMetric)?.name} ({getMetricById(activeMetric)?.unit})
            </h3>
            <TornadoChart data={tornadoData} baseValue={0} />
          </div>
        );
        
      case "heatmap":
        return <HeatMapChart />;
        
      case "surface":
        return <Surface3DChart />;
        
      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Select a chart type to visualize results
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analysis Results</h2>
        <div className="flex items-center gap-1">
          {projects.map(project => (
            <Badge key={project.id} variant="outline" className="px-2 py-1">
              {project.name}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        {metrics.slice(0, 4).map(metric => (
          <Card key={metric.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{metric.name}</CardTitle>
              <CardDescription className="text-xs">
                {metric.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(Math.random() * 1000000)} {metric.unit}
              </div>
              <div className="flex items-center justify-between mt-4">
                <Badge
                  variant={Math.random() > 0.5 ? "default" : "destructive"}
                >
                  {Math.random() > 0.5 ? "↑" : "↓"} {(Math.random() * 10).toFixed(2)}%
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={() => setActiveMetric(metric.id)}
                >
                  Analyze
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs value={activeChartType} onValueChange={setActiveChartType}>
        <div className="flex items-center justify-between">
          <TabsList>
            {analysisType === "one-way" && (
              <TabsTrigger value="tornado" className="gap-1">
                <BarChartHorizontal className="h-4 w-4" />
                Tornado Chart
              </TabsTrigger>
            )}
            {analysisType === "two-way" && (
              <TabsTrigger value="heatmap" className="gap-1">
                <PieChart className="h-4 w-4" />
                Heat Map
              </TabsTrigger>
            )}
            {analysisType === "three-way" && (
              <TabsTrigger value="surface" className="gap-1">
                <LineChart className="h-4 w-4" />
                Surface Plot
              </TabsTrigger>
            )}
            <TabsTrigger value="bar" className="gap-1">
              <BarChart className="h-4 w-4" />
              Bar Chart
            </TabsTrigger>
          </TabsList>
          
          {metrics.length > 1 && (
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Metric:</span>
              <select 
                className="text-sm border rounded px-2 py-1 bg-background"
                value={activeMetric}
                onChange={(e) => setActiveMetric(e.target.value)}
              >
                {metrics.map(metric => (
                  <option key={metric.id} value={metric.id}>
                    {metric.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <TabsContent value={activeChartType} className="pt-4">
          <DataPanel className="min-h-[400px] flex items-stretch">
            {renderChartSection()}
          </DataPanel>
        </TabsContent>
      </Tabs>
      
      <div className="grid md:grid-cols-3 gap-4">
        <DataPanel title="Key Insights" className="border-t-4 border-t-blue-500">
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
              <p>Variables with highest positive impact: <strong>Energy Price</strong>, <strong>Capacity Factor</strong></p>
            </li>
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
              <p>Variables with highest negative impact: <strong>CapEx</strong>, <strong>Interest Rate</strong></p>
            </li>
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-500 mt-1.5 shrink-0"></div>
              <p>Most sensitive metrics: <strong>IRR</strong>, <strong>NPV</strong></p>
            </li>
          </ul>
        </DataPanel>
        
        <DataPanel title="Risk Assessment" className="border-t-4 border-t-amber-500">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Overall Risk Level</span>
                <span className="text-sm font-medium text-amber-500">Medium</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-amber-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Financial Risk</span>
                <span className="text-sm font-medium text-red-500">High</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-red-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Technical Risk</span>
                <span className="text-sm font-medium text-green-500">Low</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-2/5 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </DataPanel>
        
        <DataPanel title="Recommendations" className="border-t-4 border-t-green-500">
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <p>Negotiate better financing terms to reduce interest rate impact</p>
            </li>
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <p>Explore opportunities to improve capacity factor</p>
            </li>
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <p>Consider phased implementation to reduce initial CapEx burden</p>
            </li>
          </ul>
        </DataPanel>
      </div>
    </div>
  );
}
