
import { Equal, Clock, FilterX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InputDataType } from "@/pages/InputsPage";

interface DataTypeToggleProps {
  value: InputDataType | "all";
  onChange: (value: InputDataType | "all") => void;
}

export function DataTypeToggle({ value, onChange }: DataTypeToggleProps) {
  return (
    <div className="flex rounded-md border">
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
  );
}
