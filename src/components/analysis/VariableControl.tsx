
import { useState } from "react";
import { Check, ChevronDown, Search, SlidersHorizontal, X, BarChart2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

export interface AnalysisVariable {
  id: string;
  name: string;
  baseValue: number;
  minValue: number;
  maxValue: number;
  impact: number;
  category: string;
  metric: "cost" | "schedule" | "performance";
}

export interface OutputMetric {
  id: string;
  name: string;
  unit: string;
  description?: string;
}

interface VariableControlProps {
  variables: AnalysisVariable[];
  onFilterChange: (variables: AnalysisVariable[]) => void;
  metrics: string[];
  outputMetrics?: OutputMetric[];
  onMetricChange: (metric: string) => void;
  onOutputMetricChange?: (metricId: string) => void;
  currentMetric: string;
  currentOutputMetric?: string;
  maxInfluentialCount?: number;
}

export function VariableControl({
  variables,
  onFilterChange,
  metrics,
  outputMetrics = [],
  onMetricChange,
  onOutputMetricChange,
  currentMetric,
  currentOutputMetric,
  maxInfluentialCount = 10,
}: VariableControlProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const categories = [...new Set(variables.map((v) => v.category))];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = variables.filter(
      (variable) =>
        variable.name.toLowerCase().includes(query) &&
        (selectedCategories.length === 0 || 
         selectedCategories.includes(variable.category))
    );
    
    onFilterChange(filtered);
  };

  const handleCategoryToggle = (category: string) => {
    let newCategories: string[];
    
    if (selectedCategories.includes(category)) {
      newCategories = selectedCategories.filter((c) => c !== category);
    } else {
      newCategories = [...selectedCategories, category];
    }
    
    setSelectedCategories(newCategories);
    
    const filtered = variables.filter(
      (variable) =>
        variable.name.toLowerCase().includes(searchQuery) &&
        (newCategories.length === 0 || newCategories.includes(variable.category))
    );
    
    onFilterChange(filtered);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search variables..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9 h-10"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                onFilterChange(
                  variables.filter(
                    (v) => selectedCategories.length === 0 || 
                    selectedCategories.includes(v.category)
                  )
                );
              }}
              className="absolute right-2.5 top-2.5 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        
        {outputMetrics.length > 0 && onOutputMetricChange && (
          <Select 
            value={currentOutputMetric} 
            onValueChange={onOutputMetricChange}
          >
            <SelectTrigger className="w-[220px]">
              <BarChart2 className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select output metric" />
            </SelectTrigger>
            <SelectContent>
              {outputMetrics.map((metric) => (
                <SelectItem key={metric.id} value={metric.id}>
                  {metric.name} ({metric.unit})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 gap-1.5">
              <SlidersHorizontal className="h-4 w-4" />
              Filter Categories
              <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                className="flex items-center justify-between cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  handleCategoryToggle(category);
                }}
              >
                {category}
                {selectedCategories.includes(category) && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10">
              Metric: {currentMetric}
              <ChevronDown className="h-3.5 w-3.5 ml-1.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {metrics.map((metric) => (
              <DropdownMenuItem
                key={metric}
                className="flex items-center justify-between cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  onMetricChange(metric);
                }}
              >
                {metric}
                {currentMetric === metric && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <div
              key={category}
              className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
            >
              {category}
              <button
                onClick={() => handleCategoryToggle(category)}
                className="rounded-full p-0.5 hover:bg-primary/20"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              setSelectedCategories([]);
              onFilterChange(
                variables.filter((v) =>
                  v.name.toLowerCase().includes(searchQuery)
                )
              );
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
