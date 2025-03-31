
import React from "react";
import { ChangeOrderCause } from "@/models/changeOrder";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface TopCausesTableProps {
  causes: ChangeOrderCause[];
  onCauseClick: (cause: string) => void;
}

export function TopCausesTable({ causes, onCauseClick }: TopCausesTableProps) {
  // Sort causes by count in descending order
  const sortedCauses = [...causes].sort((a, b) => b.count - a.count);
  
  return (
    <div className="w-full overflow-hidden">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead>Cause</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCauses.map((cause) => (
            <TableRow 
              key={cause.id}
              className="cursor-pointer hover:bg-muted"
              onClick={() => onCauseClick(cause.name)}
            >
              <TableCell className="font-medium">{cause.name}</TableCell>
              <TableCell className="text-right">{cause.count}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Progress value={cause.percentageOfTotal} className="h-2 w-16" />
                  {cause.percentageOfTotal.toFixed(1)}%
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
