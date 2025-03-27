
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Save, X } from "lucide-react";
import { useOutputs } from "@/hooks/use-outputs";
import { OutputValue } from "@/models/outputs";
import { formatNumber } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface OutputsTableProps {
  outputs: OutputValue[];
}

export function OutputsTable({ outputs }: OutputsTableProps) {
  const { updateOutput } = useOutputs();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  
  const handleEdit = (output: OutputValue) => {
    setEditingId(output.id);
    setEditValue(output.value.toString());
  };
  
  const handleSave = (output: OutputValue) => {
    const numValue = parseFloat(editValue);
    
    if (isNaN(numValue)) {
      toast({
        title: "Invalid value",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }
    
    updateOutput(output.id, numValue);
    setEditingId(null);
    
    toast({
      title: "Output updated",
      description: `${output.name} has been updated to ${formatValue(numValue, output)}`
    });
  };
  
  const handleCancel = () => {
    setEditingId(null);
  };
  
  const formatValue = (value: number, output: OutputValue) => {
    switch (output.format) {
      case "percentage":
        return `${formatNumber(value)}%`;
      case "currency":
        if (output.unit === "$/kg" || output.unit === "$/MWh") {
          return `${formatNumber(value)} ${output.unit}`;
        }
        return `$${formatNumber(value)}`;
      case "ratio":
        return `${formatNumber(value)}x`;
      case "years":
        return `${formatNumber(value)} years`;
      default:
        return `${formatNumber(value)} ${output.unit}`;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "developer":
        return "bg-blue-100 text-blue-800";
      case "equity":
        return "bg-green-100 text-green-800";
      case "debt":
        return "bg-amber-100 text-amber-800";
      default:
        return "";
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Metric</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[150px] text-right">Value</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outputs.map((output) => (
            <TableRow key={output.id}>
              <TableCell className="font-medium">
                {output.name}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {output.description}
              </TableCell>
              <TableCell className="text-right">
                {editingId === output.id ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-24 text-right ml-auto"
                  />
                ) : (
                  formatValue(output.value, output)
                )}
              </TableCell>
              <TableCell>
                {editingId === output.id ? (
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSave(output)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(output)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
