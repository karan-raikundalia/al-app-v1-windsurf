
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AnalysisHeaderProps {
  onNewAnalysis: () => void;
  showAnalysisView: boolean;
}

export function AnalysisHeader({ onNewAnalysis, showAnalysisView }: AnalysisHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold tracking-tight">Sensitivity Analysis</h1>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          onClick={onNewAnalysis}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          New Analysis
        </Button>
      </div>
    </div>
  );
}
