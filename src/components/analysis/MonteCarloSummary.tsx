
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface MonteCarloSummaryProps {
  results: any;
}

export function MonteCarloSummary({ results }: MonteCarloSummaryProps) {
  if (!results) return null;

  // Helper function to format values
  const formatValue = (value: number, metric: string) => {
    if (metric === "npv") return `$${(value / 1000000).toFixed(2)}M`;
    if (metric === "irr") return `${(value * 100).toFixed(2)}%`;
    if (metric === "paybackPeriod") return `${value.toFixed(2)} years`;
    if (metric === "debtServiceCoverage") return value.toFixed(2);
    if (metric === "equityMultiple") return `${value.toFixed(2)}x`;
    return value.toFixed(2);
  };

  // Get mean values
  const getMean = (arr: number[]) => arr.reduce((sum, val) => sum + val, 0) / arr.length;
  
  const meanNPV = getMean(results.npv);
  const meanIRR = getMean(results.irr);
  const meanPayback = getMean(results.paybackPeriod);
  const meanDSCR = getMean(results.debtServiceCoverage);
  const meanEM = getMean(results.equityMultiple);

  // Calculate probability of success for different metrics
  const probabilityPositiveNPV = results.npv.filter((val: number) => val > 0).length / results.npv.length;
  const probabilityIRRAbove10 = results.irr.filter((val: number) => val > 0.10).length / results.irr.length;
  const probabilityPaybackUnder5 = results.paybackPeriod.filter((val: number) => val < 5).length / results.paybackPeriod.length;
  const probabilityDSCRAbove1 = results.debtServiceCoverage.filter((val: number) => val > 1).length / results.debtServiceCoverage.length;
  const probabilityEMAbove2 = results.equityMultiple.filter((val: number) => val > 2).length / results.equityMultiple.length;
  
  // Get confidence intervals
  const npvCI = results.confidenceIntervals.npv;
  const irrCI = results.confidenceIntervals.irr;
  const paybackCI = results.confidenceIntervals.paybackPeriod;
  const dscrCI = results.confidenceIntervals.debtServiceCoverage;
  const emCI = results.confidenceIntervals.equityMultiple;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Net Present Value
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Net Present Value represents the difference between the present value of cash inflows and outflows over the project&apos;s lifetime.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Expected return in present value</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">{formatValue(meanNPV, "npv")}</span>
            <Badge variant={meanNPV > 0 ? "default" : "destructive"}>
              {meanNPV > 0 ? "Positive" : "Negative"}
            </Badge>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Probability of Positive NPV</span>
              <span className="font-medium">{(probabilityPositiveNPV * 100).toFixed(1)}%</span>
            </div>
            <Progress value={probabilityPositiveNPV * 100} className="h-2" />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>95% Confidence Interval:</p>
            <p>{formatValue(npvCI[0], "npv")} to {formatValue(npvCI[1], "npv")}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Internal Rate of Return
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Internal Rate of Return is the discount rate that makes the net present value of all cash flows equal to zero.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Annualized rate of return</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">{formatValue(meanIRR, "irr")}</span>
            <Badge variant={meanIRR > 0.10 ? "default" : "secondary"}>
              {meanIRR > 0.15 ? "Excellent" : meanIRR > 0.10 ? "Good" : "Low"}
            </Badge>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Probability IRR {`>`} 10%</span>
              <span className="font-medium">{(probabilityIRRAbove10 * 100).toFixed(1)}%</span>
            </div>
            <Progress value={probabilityIRRAbove10 * 100} className="h-2" />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>95% Confidence Interval:</p>
            <p>{formatValue(irrCI[0], "irr")} to {formatValue(irrCI[1], "irr")}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Payback Period
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Payback Period is the time required to recover the initial investment.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Years to recover investment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">{formatValue(meanPayback, "paybackPeriod")}</span>
            <Badge variant={meanPayback < 5 ? "default" : "secondary"}>
              {meanPayback < 3 ? "Fast" : meanPayback < 5 ? "Average" : "Slow"}
            </Badge>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Probability {`<`} 5 Years</span>
              <span className="font-medium">{(probabilityPaybackUnder5 * 100).toFixed(1)}%</span>
            </div>
            <Progress value={probabilityPaybackUnder5 * 100} className="h-2" />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>95% Confidence Interval:</p>
            <p>{formatValue(paybackCI[0], "paybackPeriod")} to {formatValue(paybackCI[1], "paybackPeriod")}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Debt Service Coverage
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Debt Service Coverage Ratio measures the project&apos;s ability to generate sufficient cash flows to cover debt obligations.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Cash flow to debt service ratio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">{formatValue(meanDSCR, "debtServiceCoverage")}</span>
            <Badge variant={meanDSCR > 1.2 ? "default" : meanDSCR > 1 ? "secondary" : "destructive"}>
              {meanDSCR > 1.5 ? "Strong" : meanDSCR > 1.2 ? "Good" : meanDSCR > 1 ? "Adequate" : "Weak"}
            </Badge>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Probability DSCR {`>`} 1.0</span>
              <span className="font-medium">{(probabilityDSCRAbove1 * 100).toFixed(1)}%</span>
            </div>
            <Progress value={probabilityDSCRAbove1 * 100} className="h-2" />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>95% Confidence Interval:</p>
            <p>{formatValue(dscrCI[0], "debtServiceCoverage")} to {formatValue(dscrCI[1], "debtServiceCoverage")}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Equity Multiple
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Equity Multiple represents total cash distributions divided by total equity invested.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Total return multiple on equity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">{formatValue(meanEM, "equityMultiple")}</span>
            <Badge variant={meanEM > 2 ? "default" : "secondary"}>
              {meanEM > 2.5 ? "Excellent" : meanEM > 2 ? "Good" : "Low"}
            </Badge>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Probability EM {`>`} 2.0x</span>
              <span className="font-medium">{(probabilityEMAbove2 * 100).toFixed(1)}%</span>
            </div>
            <Progress value={probabilityEMAbove2 * 100} className="h-2" />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>95% Confidence Interval:</p>
            <p>{formatValue(emCI[0], "equityMultiple")} to {formatValue(emCI[1], "equityMultiple")}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Key Risk Factors</CardTitle>
          <CardDescription>Variables with highest impact on outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.sensitivityRanking.slice(0, 3).map((item: any, index: number) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.variable}</span>
                  <span>{(item.impact * 100).toFixed(1)}% impact</span>
                </div>
                <Progress value={item.impact * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {item.variable === "Construction Cost" ? "Higher construction costs significantly reduce project profitability" : 
                   item.variable === "Revenue Growth" ? "Lower revenue growth rates reduce long-term returns" : 
                   item.variable === "Operating Expenses" ? "Increased operating expenses impact cash flow metrics" : 
                   item.variable === "Interest Rate" ? "Higher interest rates increase financing costs" : 
                   "Tax rate changes affect net cash flows"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
