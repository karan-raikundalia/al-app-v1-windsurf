
import React from "react";
import { LCOEResult } from "@/models/lcoe";
import { formatNumber } from "@/lib/utils";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DataPanel } from "@/components/ui/DataPanel";
import { Trash2, BarChart3 } from "lucide-react";

interface SavedCalculationsProps {
  calculations: LCOEResult[];
  onDelete: (id: string) => void;
  onSelect: (calculation: LCOEResult) => void;
}

export function SavedCalculations({ 
  calculations, 
  onDelete, 
  onSelect 
}: SavedCalculationsProps) {
  if (calculations.length === 0) {
    return (
      <DataPanel className="h-[200px] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No Saved Calculations</h3>
          <p className="text-muted-foreground">
            Save your calculations to view them here.
          </p>
        </div>
      </DataPanel>
    );
  }

  return (
    <DataPanel title="Saved Calculations">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Energy Source</TableHead>
              <TableHead>Capacity (kW)</TableHead>
              <TableHead className="text-right">LCOE ($/MWh)</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculations.map((calc) => (
              <TableRow key={calc.inputs.id}>
                <TableCell className="font-medium">{calc.inputs.name}</TableCell>
                <TableCell className="capitalize">{calc.inputs.energySource}</TableCell>
                <TableCell>{calc.inputs.capacityKW}</TableCell>
                <TableCell className="text-right">${formatNumber(calc.breakdown.totalLCOE)}</TableCell>
                <TableCell className="text-right">
                  {calc.inputs.createdAt 
                    ? new Date(calc.inputs.createdAt).toLocaleDateString() 
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelect(calc)}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(calc.inputs.id!)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DataPanel>
  );
}
