
import { DataPanel } from "@/components/ui/DataPanel";

export function SensitivitySummary() {
  return (
    <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
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
      
      <DataPanel title="Project Status" className="border-t-4 border-t-amber-500">
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
              <span className="text-sm">Variables Analyzed</span>
              <span className="text-sm font-medium">12</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-full bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Analysis Confidence</span>
              <span className="text-sm font-medium text-green-500">High</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </DataPanel>
    </div>
  );
}
