
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CapitalRiskRatioChart } from "./metrics/CapitalRiskRatioChart";
import { ProjectTimelineBudgetChart } from "./metrics/ProjectTimelineBudgetChart";
import { CostEstimateRefinementChart } from "./metrics/CostEstimateRefinementChart";
import { TechnologyValidationChart } from "./metrics/TechnologyValidationChart";
import { RiskRegisterClosureChart } from "./metrics/RiskRegisterClosureChart";

export function ProjectMetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Capital at Risk Ratio</CardTitle>
        </CardHeader>
        <CardContent>
          <CapitalRiskRatioChart />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Project Timeline/Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectTimelineBudgetChart />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Cost Estimate Refinement</CardTitle>
        </CardHeader>
        <CardContent>
          <CostEstimateRefinementChart />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Technology Validation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <TechnologyValidationChart />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Risk Register Closure Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <RiskRegisterClosureChart />
        </CardContent>
      </Card>
    </div>
  );
}
