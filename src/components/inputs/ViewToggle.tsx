import { LayoutGrid, LayoutList, FileStackIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  view: "card" | "table";
  viewMode: "component" | "expense";
  onViewChange: (view: "card" | "table") => void;
  onViewModeChange: (mode: "component" | "expense") => void;
}

export function ViewToggle({ 
  view, 
  viewMode, 
  onViewChange, 
  onViewModeChange 
}: ViewToggleProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <div className="flex rounded-md border">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none border-0 px-3 hover:bg-muted",
            view === "table" && "bg-primary/10 text-primary"
          )}
          onClick={() => onViewChange("table")}
        >
          <LayoutList className="mr-2 h-4 w-4" />
          Table View
        </Button>
        <div className="border-l h-9" />
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none border-0 px-3 hover:bg-muted",
            view === "card" && "bg-primary/10 text-primary"
          )}
          onClick={() => onViewChange("card")}
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          Card View
        </Button>
      </div>

      {view === "table" && (
        <div className="flex rounded-md border">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none border-0 px-3 hover:bg-muted",
              viewMode === "component" && "bg-primary/10 text-primary"
            )}
            onClick={() => onViewModeChange("component")}
          >
            <FileStackIcon className="mr-2 h-4 w-4" />
            By Component
          </Button>
          <div className="border-l h-9" />
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none border-0 px-3 hover:bg-muted",
              viewMode === "expense" && "bg-primary/10 text-primary"
            )}
            onClick={() => onViewModeChange("expense")}
          >
            <FileText className="mr-2 h-4 w-4" />
            By Expense Type
          </Button>
        </div>
      )}
    </div>
  );
}
