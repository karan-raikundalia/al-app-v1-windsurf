
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Variable, VariableCategory } from "../MultiMetricAnalysisTool";
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
import { toast } from "@/components/ui/use-toast";

interface VariableSelectorProps {
  variables: Variable[];
  selectedVariables: Variable[];
  setSelectedVariables: (variables: Variable[]) => void;
  analysisType: "one-way" | "two-way" | "three-way";
}

export function VariableSelector({
  variables,
  selectedVariables,
  setSelectedVariables,
  analysisType
}: VariableSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<VariableCategory[]>([]);
  
  const filteredVariables = variables.filter(variable => {
    const matchesSearch = variable.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(variable.category);
    return matchesSearch && matchesCategory;
  });
  
  const handleVariableToggle = (variable: Variable) => {
    const maxVariables = analysisType === "one-way" ? 1 : analysisType === "two-way" ? 2 : 3;
    
    if (selectedVariables.find(v => v.id === variable.id)) {
      // Remove from selection
      setSelectedVariables(selectedVariables.filter(v => v.id !== variable.id));
    } else {
      // Add to selection if not at max
      if (selectedVariables.length >= maxVariables) {
        toast({
          title: `Maximum ${maxVariables} variables allowed`,
          description: `For ${analysisType} analysis, select up to ${maxVariables} variables.`,
          variant: "destructive",
        });
        return;
      }
      setSelectedVariables([...selectedVariables, variable]);
    }
  };
  
  const handleCategoryToggle = (category: VariableCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const getCategoryBadgeColor = (category: VariableCategory) => {
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
            placeholder="Search variables..."
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
                checked={selectedCategories.includes("operational")}
                onCheckedChange={() => handleCategoryToggle("operational")}
              >
                Operational
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedCategories.includes("environmental")}
                onCheckedChange={() => handleCategoryToggle("environmental")}
              >
                Environmental
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
        {filteredVariables.length > 0 ? (
          filteredVariables.map((variable) => (
            <div 
              key={variable.id} 
              className="flex items-center p-3 hover:bg-muted/50"
            >
              <Checkbox
                id={`var-${variable.id}`}
                checked={selectedVariables.some(v => v.id === variable.id)}
                onCheckedChange={() => handleVariableToggle(variable)}
              />
              <div className="ml-3 flex-1">
                <label
                  htmlFor={`var-${variable.id}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {variable.name}
                </label>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className={`text-xs px-1.5 py-0 ${getCategoryBadgeColor(variable.category)}`}
                    >
                      {variable.category}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Range: {variable.minValue} - {variable.maxValue} {variable.unit}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No variables match your filters
          </div>
        )}
      </div>
      
      {selectedVariables.length > 0 && (
        <div className="bg-muted/50 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-2">Selected Variables</h4>
          <div className="flex flex-wrap gap-2">
            {selectedVariables.map((variable) => (
              <Badge
                key={variable.id}
                variant="secondary"
                className="px-2 py-1 flex items-center gap-1"
              >
                {variable.name}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleVariableToggle(variable)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
