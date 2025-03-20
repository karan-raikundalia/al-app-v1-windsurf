
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataPanel } from "@/components/ui/DataPanel";
import { TornadoChart } from "../TornadoChart";
import { AnalysisVariable } from "../VariableControl";
import { RiskFactorsCard } from "../summary-cards/RiskFactorsCard";

export interface OutputMetric {
  id: string;
  name: string;
  unit: string;
  description?: string;
  baseValue?: number;
}

interface OutputMetricSensitivityProps {
  outputMetric: OutputMetric;
  variables: AnalysisVariable[];
  maxInfluentialCount?: number;
}

export function OutputMetricSensitivity({ 
  outputMetric, 
  variables,
  maxInfluentialCount = 10
}: OutputMetricSensitivityProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [topInfluentialVariables, setTopInfluentialVariables] = useState<AnalysisVariable[]>([]);
  
  // Process variables on component load or when variables/outputMetric changes
  useEffect(() => {
    // In a real app, this would be an API call to analyze variables
    // Here we'll simulate the processing
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      // Sort variables by impact (absolute value) and take top N
      const sortedVariables = [...variables]
        .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
        .slice(0, maxInfluentialCount);
      
      setTopInfluentialVariables(sortedVariables);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [variables, outputMetric, maxInfluentialCount]);
  
  // Transform variables for tornado chart
  const tornadoData = topInfluentialVariables.map(variable => ({
    variable: variable.name,
    positiveDelta: variable.impact > 0 ? variable.impact : 0,
    negativeDelta: variable.impact < 0 ? variable.impact : 0,
    baseline: variable.baseValue,
    unit: outputMetric.unit
  }));
  
  // Format sensitivity ranking for risk factors card
  const sensitivityRanking = topInfluentialVariables.map(variable => ({
    variable: variable.name,
    impact: Math.abs(variable.impact) / (variable.baseValue || 1) // Normalize impact
  }));
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 bg-muted rounded animate-pulse"></div>
        <div className="h-80 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">
            Sensitivity Analysis for {outputMetric.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Showing top {topInfluentialVariables.length} most influential variables
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 text-xs">
          Base Value: {outputMetric.baseValue?.toLocaleString()} {outputMetric.unit}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataPanel>
            {tornadoData.length > 0 ? (
              <TornadoChart 
                data={tornadoData}
                baseValue={0}
                sortBy="impact"
              />
            ) : (
              <div className="flex items-center justify-center h-80">
                <p className="text-muted-foreground">
                  No variables available for sensitivity analysis
                </p>
              </div>
            )}
          </DataPanel>
        </div>
        
        <div>
          <RiskFactorsCard sensitivityRanking={sensitivityRanking} />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Interpretation</CardTitle>
          <CardDescription>Understanding the sensitivity results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            This tornado chart shows how each variable impacts the {outputMetric.name.toLowerCase()} when varied across its range.
            Longer bars indicate variables with greater influence.
          </p>
          <p>
            The most sensitive variable is <strong>{topInfluentialVariables[0]?.name}</strong>, with a potential impact of 
            {Math.abs(topInfluentialVariables[0]?.impact).toLocaleString()} {outputMetric.unit}.
          </p>
          <p className="text-muted-foreground">
            Consider focusing optimization efforts on the top 3 variables to improve project outcomes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
