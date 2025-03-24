
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface OutputMetric {
  id: string;
  name: string;
  category: string;
  description: string;
}

const outputMetrics: OutputMetric[] = [
  // Project Developer Metrics
  { id: "irr", name: "Internal Rate of Return (IRR)", category: "Project Developer", description: "The discount rate that makes the net present value of the project zero" },
  { id: "npv", name: "Net Present Value (NPV)", category: "Project Developer", description: "The difference between the present value of cash inflows and outflows" },
  { id: "payback", name: "Payback Period", category: "Project Developer", description: "Time required to recover the initial investment" },
  { id: "ebitda", name: "EBITDA Margins", category: "Project Developer", description: "Earnings before interest, taxes, depreciation, and amortization as a percentage of revenue" },
  { id: "lcoh", name: "Levelized Cost of Hydrogen (LCOH)", category: "Project Developer", description: "The average cost of producing hydrogen over the project lifetime" },
  { id: "lcoe", name: "Levelized Cost of Energy (LCOE)", category: "Project Developer", description: "The average cost of producing energy over the project lifetime" },
  
  // Equity Investor Metrics
  { id: "equity-irr", name: "Equity IRR", category: "Equity Investors", description: "The internal rate of return on the equity portion of the investment" },
  { id: "equity-npv", name: "Equity NPV", category: "Equity Investors", description: "The net present value of the equity cash flows" },
  { id: "dividend-yield", name: "Dividend Yield", category: "Equity Investors", description: "Annual dividend as a percentage of equity investment" },
  { id: "moic", name: "Multiple on Invested Capital (MOIC)", category: "Equity Investors", description: "Total return divided by total investment" },
  
  // Debt Provider Metrics
  { id: "dscr", name: "Debt Service Coverage Ratio (DSCR)", category: "Debt Providers", description: "Operating income divided by debt service requirements" },
  { id: "llcr", name: "Loan Life Coverage Ratio (LLCR)", category: "Debt Providers", description: "NPV of available cash for debt service divided by outstanding debt" },
  { id: "plcr", name: "Project Life Coverage Ratio (PLCR)", category: "Debt Providers", description: "NPV of available cash for debt service over the project life divided by outstanding debt" },
  { id: "debt-equity", name: "Debt-to-Equity Ratio", category: "Debt Providers", description: "Total debt divided by total equity" },
];

interface OutputMetricSelectorProps {
  selectedMetric: OutputMetric | null;
  onMetricChange: (metric: OutputMetric) => void;
}

export function OutputMetricSelector({ selectedMetric, onMetricChange }: OutputMetricSelectorProps) {
  // Group metrics by category
  const metricsByCategory = outputMetrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, OutputMetric[]>);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Target Output Metric</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 gap-1.5">
              {selectedMetric ? selectedMetric.name : "Select an output metric"}
              <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[350px] max-h-[400px] overflow-auto">
            {Object.entries(metricsByCategory).map(([category, metrics]) => (
              <div key={category} className="px-2 py-1.5">
                <div className="text-sm font-medium text-muted-foreground pb-1">{category}</div>
                {metrics.map((metric) => (
                  <DropdownMenuItem
                    key={metric.id}
                    className="flex items-center justify-between cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      onMetricChange(metric);
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <span>{metric.name}</span>
                      <span className="text-xs text-muted-foreground">{metric.description}</span>
                    </div>
                    {selectedMetric?.id === metric.id && (
                      <Check className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
