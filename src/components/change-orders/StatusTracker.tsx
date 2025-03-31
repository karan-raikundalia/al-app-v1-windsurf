
import React from "react";
import { ChangeOrderStatus } from "@/models/changeOrder";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface StatusTrackerProps {
  statuses: { status: ChangeOrderStatus; count: number }[];
  averageApprovalDays: number;
}

export function StatusTracker({ statuses, averageApprovalDays }: StatusTrackerProps) {
  // Calculate total change orders
  const totalCount = statuses.reduce((sum, item) => sum + item.count, 0);
  
  // Calculate percentages and assign colors
  const statusData = statuses.map(item => {
    const percentage = (item.count / totalCount) * 100;
    
    // Assign color based on status
    let color;
    switch (item.status) {
      case "approved":
        color = "bg-green-500";
        break;
      case "rejected":
        color = "bg-red-500";
        break;
      case "in-review":
        color = "bg-blue-500";
        break;
      case "pending":
        color = "bg-amber-500";
        break;
      default:
        color = "bg-gray-500";
    }
    
    return {
      ...item,
      percentage,
      color
    };
  });
  
  // Warning if approval cycle exceeds threshold
  const isApprovalCycleTooLong = averageApprovalDays > 14;
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {statusData.map((status) => (
          <div key={status.status} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{status.status.replace("-", " ")}</span>
              <span>{status.count} ({status.percentage.toFixed(1)}%)</span>
            </div>
            <Progress value={status.percentage} className={cn("h-2", status.color)} />
          </div>
        ))}
      </div>
      
      <div className={cn(
        "flex items-center gap-2 p-3 rounded-md",
        isApprovalCycleTooLong ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
      )}>
        {isApprovalCycleTooLong ? (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        ) : (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
        <div>
          <h4 className="font-medium flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Avg. Approval Cycle: {averageApprovalDays.toFixed(1)} days
          </h4>
          {isApprovalCycleTooLong && (
            <p className="text-xs mt-1">Exceeds 14-day target threshold</p>
          )}
        </div>
      </div>
    </div>
  );
}
