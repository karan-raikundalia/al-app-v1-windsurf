
import React, { useState } from "react";
import { MoreHorizontal, FileText, Trash, Copy, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnalysisVariable } from "../VariableControl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatNumber } from "@/lib/utils";

interface SavedAnalysesProps {
  savedAnalyses: Array<{
    id: string;
    name: string;
    metric: string;
    variables: AnalysisVariable[];
    baseValue: number;
    variableRanges: Record<string, { minPercentage: number; maxPercentage: number }>;
    createdAt: Date;
  }>;
  onDeleteAnalysis: (id: string) => void;
  onLoadAnalysis: (analysis: any) => void;
  onDuplicateAnalysis: (analysis: any) => void;
  onNewAnalysis?: () => void;
}

export function SavedAnalyses({
  savedAnalyses,
  onDeleteAnalysis,
  onDuplicateAnalysis,
  onLoadAnalysis
}: SavedAnalysesProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);

  const handleViewDetails = (analysis: any) => {
    setSelectedAnalysis(analysis);
    setDetailsOpen(true);
  };

  if (savedAnalyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/30">
        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground text-sm">No saved analyses yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Your saved analyses will appear here for quick access
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <ScrollArea className="h-[300px]">
          <div className="p-1">
            {savedAnalyses.map((analysis) => (
              <div 
                key={analysis.id} 
                className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md cursor-pointer"
                onClick={() => handleViewDetails(analysis)}
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{analysis.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                        {analysis.metric}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {analysis.variables.length} variables
                      </span>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onLoadAnalysis(analysis);
                    }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Load Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateAnalysis(analysis);
                    }}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAnalysis(analysis.id);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {selectedAnalysis && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedAnalysis.name}</DialogTitle>
              <DialogDescription>
                Analysis details and variable configurations
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <Label className="font-medium">Output Metric</Label>
                <span>{selectedAnalysis.metric}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b">
                <Label className="font-medium">Base Value</Label>
                <span>{formatNumber(selectedAnalysis.baseValue)}</span>
              </div>
              
              <div className="space-y-1">
                <Label className="font-medium">Variables</Label>
                <div className="space-y-2 mt-2">
                  {selectedAnalysis.variables.map((variable: AnalysisVariable) => {
                    const ranges = selectedAnalysis.variableRanges[variable.id] || { minPercentage: 20, maxPercentage: 20 };
                    
                    return (
                      <div key={variable.id} className="text-sm p-2 bg-muted/30 rounded">
                        <div className="flex justify-between">
                          <span>{variable.name}</span>
                          <span>{formatNumber(variable.baseValue)} {variable.unit}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Range: -{ranges.minPercentage}% to +{ranges.maxPercentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDuplicateAnalysis(selectedAnalysis)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  onLoadAnalysis(selectedAnalysis);
                  setDetailsOpen(false);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Load Analysis
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
