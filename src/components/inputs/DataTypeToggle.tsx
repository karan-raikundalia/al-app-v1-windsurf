
import { Equal, Clock, FilterX, DollarSign, PiggyBank, ReceiptText, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InputDataType } from "@/pages/InputsPage";

export type ExpenseType = "capex" | "opex" | "revenue" | "other";

interface DataTypeToggleProps {
  value: InputDataType | "all";
  onChange: (value: InputDataType | "all") => void;
  className?: string;
  showExpenseFilter?: boolean;
  expenseType?: ExpenseType | "all";
  onExpenseTypeChange?: (value: ExpenseType | "all") => void;
}

export function DataTypeToggle({ 
  value, 
  onChange, 
  className,
  showExpenseFilter = false,
  expenseType = "all",
  onExpenseTypeChange
}: DataTypeToggleProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className={cn("flex rounded-md border", className)}>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none border-0 px-3 hover:bg-muted",
            value === "all" && "bg-primary/10 text-primary"
          )}
          onClick={() => onChange("all")}
        >
          <FilterX className="mr-2 h-4 w-4" />
          All Types
        </Button>
        <div className="border-l h-9" />
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none border-0 px-3 hover:bg-muted",
            value === "constant" && "bg-primary/10 text-primary"
          )}
          onClick={() => onChange("constant")}
        >
          <Equal className="mr-2 h-4 w-4" />
          Constants
        </Button>
        <div className="border-l h-9" />
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none border-0 px-3 hover:bg-muted",
            value === "timeSeries" && "bg-primary/10 text-primary"
          )}
          onClick={() => onChange("timeSeries")}
        >
          <Clock className="mr-2 h-4 w-4" />
          Time Series
        </Button>
      </div>

      {showExpenseFilter && onExpenseTypeChange && (
        <div className={cn("flex rounded-md border", className)}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none border-0 px-3 hover:bg-muted",
              expenseType === "all" && "bg-primary/10 text-primary"
            )}
            onClick={() => onExpenseTypeChange("all")}
          >
            <FilterX className="mr-2 h-4 w-4" />
            All Expenses
          </Button>
          <div className="border-l h-9" />
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none border-0 px-3 hover:bg-muted",
              expenseType === "capex" && "bg-primary/10 text-primary"
            )}
            onClick={() => onExpenseTypeChange("capex")}
          >
            <PiggyBank className="mr-2 h-4 w-4" />
            CAPEX
          </Button>
          <div className="border-l h-9" />
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none border-0 px-3 hover:bg-muted",
              expenseType === "opex" && "bg-primary/10 text-primary"
            )}
            onClick={() => onExpenseTypeChange("opex")}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            OPEX
          </Button>
          <div className="border-l h-9" />
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none border-0 px-3 hover:bg-muted",
              expenseType === "revenue" && "bg-primary/10 text-primary"
            )}
            onClick={() => onExpenseTypeChange("revenue")}
          >
            <ReceiptText className="mr-2 h-4 w-4" />
            Revenue
          </Button>
          <div className="border-l h-9" />
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none border-0 px-3 hover:bg-muted",
              expenseType === "other" && "bg-primary/10 text-primary"
            )}
            onClick={() => onExpenseTypeChange("other")}
          >
            <Star className="mr-2 h-4 w-4" />
            Other
          </Button>
        </div>
      )}
    </div>
  );
}
