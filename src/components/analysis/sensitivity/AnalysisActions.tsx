
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { SaveIcon, RotateCcw, Copy, Download } from "lucide-react";
import { useState } from "react";

interface AnalysisActionsProps {
  currentMetric: string;
  selectedVariables: any[];
  onSaveAnalysis: (name: string) => void;
  onDuplicateAnalysis: () => void;
  onResetAnalysis: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export function AnalysisActions({
  currentMetric,
  selectedVariables,
  onSaveAnalysis,
  onDuplicateAnalysis,
  onResetAnalysis,
  onExportPNG,
  onExportPDF,
  onExportExcel
}: AnalysisActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [analysisName, setAnalysisName] = useState("");

  const handleSave = () => {
    onSaveAnalysis(analysisName);
    setDialogOpen(false);
  };

  return (
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
            <Button onClick={handleSave}>Save Analysis</Button>
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
          <DropdownMenuItem onClick={onExportPNG}>
            Export as PNG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportPDF}>
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportExcel}>
            Export as Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDuplicateAnalysis}
        disabled={selectedVariables.length === 0}
        className="flex items-center gap-1"
      >
        <Copy className="h-4 w-4" />
        Duplicate
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onResetAnalysis}
        disabled={selectedVariables.length === 0}
        className="flex items-center gap-1"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
    </>
  );
}
