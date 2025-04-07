import { DataPanel } from "@/components/ui/DataPanel";
import { AnalysisVariable } from "../VariableControl";

interface SensitivitySummaryProps {
  selectedVariables?: AnalysisVariable[];
  currentMetric?: string;
  baseValue?: number;
}

export function SensitivitySummary({ 
  selectedVariables = [], 
  currentMetric = "NPV", 
  baseValue = 0 
}: SensitivitySummaryProps) {
  // Get the top 5 most impactful variables
  const topVariables = [...selectedVariables]
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, 5);

  // Count high, medium, and low impact variables
  const highImpactCount = selectedVariables.filter(v => Math.abs(v.impact) / baseValue > 0.1).length;
  const mediumImpactCount = selectedVariables.filter(v => 
    Math.abs(v.impact) / baseValue <= 0.1 && Math.abs(v.impact) / baseValue > 0.05
  ).length;
  const lowImpactCount = selectedVariables.filter(v => Math.abs(v.impact) / baseValue <= 0.05).length;

  // Determine overall risk level
  let riskLevel = "Low";
  let riskColor = "text-green-500";
  let riskWidth = "w-1/5";

  if (highImpactCount >= 3) {
    riskLevel = "High";
    riskColor = "text-red-500";
    riskWidth = "w-4/5";
  } else if (highImpactCount >= 1 || mediumImpactCount >= 3) {
    riskLevel = "Medium";
    riskColor = "text-amber-500";
    riskWidth = "w-3/5";
  }

  // If no variables are selected, show the default content
  if (selectedVariables.length === 0) {
    return (
      <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
        <DataPanel title="Key Insights" className="border-t-4 border-t-blue-500">
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
              <p>Revenue Growth has the highest positive impact on project outcomes</p>
            </li>
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
              <p>Labor Cost shows the most significant negative impact</p>
            </li>
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-500 mt-1.5 shrink-0"></div>
              <p>5 variables have high sensitivity, requiring close monitoring</p>
            </li>
          </ul>
        </DataPanel>
        
        <DataPanel title="Recommendations" className="border-t-4 border-t-green-500">
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <p>Focus on optimizing Revenue Growth strategies</p>
            </li>
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <p>Implement Labor Cost containment measures</p>
            </li>
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <p>Develop contingency plans for Supply Chain Delays</p>
            </li>
          </ul>
        </DataPanel>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
      <DataPanel title="Key Insights" className="border-t-4 border-t-blue-500">
        <ul className="space-y-3 text-sm">
          {topVariables.length > 0 && (
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
              <p>{topVariables[0].name} has the highest impact on {currentMetric}</p>
            </li>
          )}
          <li className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
            <p>{highImpactCount} variables have high sensitivity ({'>'}10% impact)</p>
          </li>
          <li className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-500 mt-1.5 shrink-0"></div>
            <p>{selectedVariables.length} total variables analyzed for impact on {currentMetric}</p>
          </li>
        </ul>
      </DataPanel>
      
      <DataPanel title="Recommendations" className="border-t-4 border-t-green-500">
        <ul className="space-y-3 text-sm">
          {topVariables.length > 0 && (
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <p>Focus on optimizing {topVariables[0].name}</p>
            </li>
          )}
          {topVariables.length > 1 && (
            <li className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <p>Monitor {topVariables[1].name} closely</p>
            </li>
          )}
          <li className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
            <p>Develop contingency plans for high-impact variables</p>
          </li>
        </ul>
      </DataPanel>
    </div>
  );
}
