
import { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Download, HelpCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalysisVariable } from "../VariableControl";
import { formatNumber } from "@/lib/utils";

interface SensitivityCoefficientTableProps {
  variables: AnalysisVariable[];
  currentMetric: string;
  baseValue: number;
}

type SensitivityRange = "5" | "10" | "15" | "20";

export function SensitivityCoefficientTable({ 
  variables, 
  currentMetric, 
  baseValue 
}: SensitivityCoefficientTableProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [sensitivityRange, setSensitivityRange] = useState<SensitivityRange>("10");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortColumn, setSortColumn] = useState("coefficient");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Calculate sensitivity coefficients
  const calculateCoefficients = () => {
    const rangePercent = parseInt(sensitivityRange) / 100;
    
    return variables.map(variable => {
      // Calculate positive and negative impacts
      const positiveValue = variable.baseValue * (1 + rangePercent);
      const negativeValue = variable.baseValue * (1 - rangePercent);
      
      // Here we simulate the impact on the output metric
      // In a real implementation, this would call your actual calculation model
      const positiveImpact = simulateMetricImpact(variable, positiveValue, currentMetric, baseValue);
      const negativeImpact = simulateMetricImpact(variable, negativeValue, currentMetric, baseValue);
      
      // Calculate percentage changes
      const positivePercentChange = ((positiveImpact - baseValue) / baseValue) * 100;
      const negativePercentChange = ((negativeImpact - baseValue) / baseValue) * 100;
      
      // Calculate sensitivity coefficient (absolute value of the average impact)
      const coefficient = Math.abs((positivePercentChange + Math.abs(negativePercentChange)) / 2) / parseInt(sensitivityRange);
      
      return {
        variable,
        positivePercentChange,
        negativePercentChange,
        coefficient
      };
    });
  };
  
  // This function simulates the impact of changing a variable on the output metric
  // In a real implementation, this would be replaced with your actual calculation model
  const simulateMetricImpact = (
    variable: AnalysisVariable, 
    newValue: number, 
    metric: string,
    baseMetricValue: number
  ) => {
    // This is a simplified model for demonstration
    // It assumes a linear relationship between input changes and output changes
    // with some randomization to simulate different variable impacts
    
    // The impact factor determines how strongly this variable affects the output
    const impactFactor = Math.random() * 0.8 + 0.2; // Value between 0.2 and 1.0
    
    // Calculate percent change in the variable
    const percentChange = (newValue - variable.baseValue) / variable.baseValue;
    
    // Apply the change to the base metric value with the impact factor
    return baseMetricValue * (1 + (percentChange * impactFactor));
  };
  
  // Get coefficients and apply filtering and sorting
  const getCoefficientData = () => {
    let data = calculateCoefficients();
    
    // Apply category filter
    if (categoryFilter !== "All") {
      data = data.filter(item => item.variable.category === categoryFilter);
    }
    
    // Apply sorting
    data.sort((a, b) => {
      let comparison = 0;
      
      switch (sortColumn) {
        case "name":
          comparison = a.variable.name.localeCompare(b.variable.name);
          break;
        case "baseValue":
          comparison = a.variable.baseValue - b.variable.baseValue;
          break;
        case "positiveImpact":
          comparison = a.positivePercentChange - b.positivePercentChange;
          break;
        case "negativeImpact":
          comparison = a.negativePercentChange - b.negativePercentChange;
          break;
        case "coefficient":
        default:
          comparison = a.coefficient - b.coefficient;
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    return data;
  };
  
  // Handle sorting when a column header is clicked
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle sort direction if the same column is clicked
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort column and default to descending
      setSortColumn(column);
      setSortDirection("desc");
    }
  };
  
  // Handle exporting the table data
  const handleExport = (format: "csv" | "excel") => {
    // Get the data
    const data = getCoefficientData();
    
    // Create CSV content
    let csvContent = "Parameter Name,Base Value,+" + sensitivityRange + "% Impact,−" + sensitivityRange + "% Impact,Sensitivity Coefficient\n";
    
    data.forEach(item => {
      csvContent += `"${item.variable.name}",${item.variable.baseValue},${item.positivePercentChange.toFixed(2)}%,${item.negativePercentChange.toFixed(2)}%,${item.coefficient.toFixed(3)}\n`;
    });
    
    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: format === "csv" ? "text/csv;charset=utf-8;" : "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `sensitivity_coefficients_${currentMetric}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const availableCategories = ["All", ...new Set(variables.map(v => v.category))];
  
  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="mt-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <h3 className="text-base font-semibold">Sensitivity Coefficients</h3>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Range:</span>
            <Select value={sensitivityRange} onValueChange={(value: SensitivityRange) => setSensitivityRange(value)}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">±5%</SelectItem>
                <SelectItem value="10">±10%</SelectItem>
                <SelectItem value="15">±15%</SelectItem>
                <SelectItem value="20">±20%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Category:</span>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-28 h-8">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CollapsibleContent>
        <div className="mt-2 relative">
          {variables.length === 0 || !currentMetric ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              {variables.length === 0 ? (
                <>
                  <p>No variables selected for analysis.</p>
                  <p className="text-sm">Select variables to see sensitivity coefficients.</p>
                </>
              ) : (
                <>
                  <p>No output metric selected.</p>
                  <p className="text-sm">Select an output metric for sensitivity analysis.</p>
                </>
              )}
            </div>
          ) : (
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("name")}
                  >
                    Parameter Name {getSortIndicator("name")}
                  </TableHead>
                  <TableHead 
                    className="text-center cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("baseValue")}
                  >
                    Base Value {getSortIndicator("baseValue")}
                  </TableHead>
                  <TableHead 
                    className="text-center cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("positiveImpact")}
                  >
                    +{sensitivityRange}% Impact on {currentMetric} {getSortIndicator("positiveImpact")}
                  </TableHead>
                  <TableHead 
                    className="text-center cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("negativeImpact")}
                  >
                    −{sensitivityRange}% Impact on {currentMetric} {getSortIndicator("negativeImpact")}
                  </TableHead>
                  <TableHead 
                    className="text-center cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("coefficient")}
                  >
                    Sensitivity Coefficient {getSortIndicator("coefficient")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCoefficientData().map((item, index) => (
                  <TableRow key={item.variable.id}>
                    <TableCell>{item.variable.name}</TableCell>
                    <TableCell className="text-center">
                      {formatNumber(item.variable.baseValue)} 
                      {item.variable.unit && ` ${item.variable.unit}`}
                    </TableCell>
                    <TableCell 
                      className={`text-center ${item.positivePercentChange > 0 ? "text-green-600" : item.positivePercentChange < 0 ? "text-red-600" : ""}`}
                    >
                      {item.positivePercentChange > 0 ? "+" : ""}
                      {item.positivePercentChange.toFixed(2)}%
                    </TableCell>
                    <TableCell 
                      className={`text-center ${item.negativePercentChange > 0 ? "text-green-600" : item.negativePercentChange < 0 ? "text-red-600" : ""}`}
                    >
                      {item.negativePercentChange > 0 ? "+" : ""}
                      {item.negativePercentChange.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {item.coefficient.toFixed(3)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
  
  // Get the sort indicator arrow based on current sort state
  function getSortIndicator(column: string) {
    if (sortColumn === column) {
      return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 inline" /> : <ChevronDown className="h-4 w-4 inline" />;
    }
    return null;
  }
}
