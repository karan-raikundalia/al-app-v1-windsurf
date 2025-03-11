
import { useState } from "react";
import { Search, SlidersHorizontal, Info, X } from "lucide-react";
import { Metric, MetricCategory } from "../MultiMetricAnalysisTool";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricSelectorProps {
  metrics: Metric[];
  selectedMetrics: Metric[];
  setSelectedMetrics: (metrics: Metric[]) => void;
}

export function MetricSelector({
  metrics,
  selectedMetrics,
  setSelectedMetrics
}: MetricSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<MetricCategory[]>([]);
  
  const filteredMetrics = metrics.filter(metric => {
    const matchesSearch = 
      metric.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      metric.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(metric.category);
    return matchesSearch && matchesCategory;
  });
  
  const handleMetricToggle = (metric: Metric) => {
    if (selectedMetrics.find(m => m.id === metric.id)) {
      // Remove from selection
      setSelectedMetrics(selectedMetrics.filter(m => m.id !== metric.id));
    } else {
      // Add to selection
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };
  
  const handleCategoryToggle = (category: MetricCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const getCategoryBadgeColor = (category: MetricCategory) => {
    switch (category) {
      case "financial":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "technical":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "operational":
        return "bg-green-100 text-green-800 border-green-200";
      case "environmental":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search metrics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuCheckboxItem
                checked={selectedCategories.includes("financial")}
                onCheckedChange={() => handleCategoryToggle("financial")}
              >
                Financial
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedCategories.includes("technical")}
                onCheckedChange={() => handleCategoryToggle("technical")}
              >
                Technical
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedCategories.includes("environmental")}
                onCheckedChange={() => handleCategoryToggle("environmental")}
              >
                Environmental
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedCategories.includes("operational")}
                onCheckedChange={() => handleCategoryToggle("operational")}
              >
                Operational
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="px-2 py-1 flex items-center gap-1"
              onClick={() => handleCategoryToggle(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <X className="h-3 w-3 cursor-pointer" />
            </Badge>
          ))}
          <button
            onClick={() => setSelectedCategories([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}
      
      <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
        {filteredMetrics.length > 0 ? (
          filteredMetrics.map((metric) => (
            <div 
              key={metric.id} 
              className="flex items-center p-3 hover:bg-muted/50"
            >
              <Checkbox
                id={`metric-${metric.id}`}
                checked={selectedMetrics.some(m => m.id === metric.id)}
                onCheckedChange={() => handleMetricToggle(metric)}
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={`metric-${metric.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {metric.name}
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{metric.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <Badge
                    variant="outline"
                    className={`text-xs px-1.5 py-0 ${getCategoryBadgeColor(metric.category)}`}
                  >
                    {metric.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Unit: {metric.unit}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No metrics match your filters
          </div>
        )}
      </div>
      
      {selectedMetrics.length > 0 && (
        <div className="bg-muted/50 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-2">Selected Metrics</h4>
          <div className="flex flex-wrap gap-2">
            {selectedMetrics.map((metric) => (
              <Badge
                key={metric.id}
                variant="secondary"
                className="px-2 py-1 flex items-center gap-1"
              >
                {metric.name}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleMetricToggle(metric)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
