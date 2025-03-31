
import React from "react";
import { ChangeOrderSummary } from "@/models/changeOrder";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, DollarSign, FileText, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

interface ChangeOrderSummaryCardsProps {
  summary: ChangeOrderSummary;
}

export function ChangeOrderSummaryCards({ summary }: ChangeOrderSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SummaryCard
        title="Change Order Count"
        value={summary.currentMonthCount}
        description="Current Month"
        trend={summary.percentageChangeCount}
        secondaryValue={summary.yearToDateCount}
        secondaryLabel="Year to Date"
        comparativeValue={summary.industryBenchmarkCount}
        comparativeLabel="Industry Avg"
        icon={<FileText className="h-5 w-5" />}
        threshold={summary.forecastedCount * 1.2}
        thresholdLabel="120% of Forecast"
      />
      
      <SummaryCard
        title="Financial Impact"
        value={summary.currentMonthImpact}
        description="Current Month"
        trend={summary.percentageChangeImpact}
        secondaryValue={summary.yearToDateImpact}
        secondaryLabel="Year to Date"
        comparativeValue={summary.industryBenchmarkImpact}
        comparativeLabel="Industry Avg"
        icon={<DollarSign className="h-5 w-5" />}
        isMonetary={true}
        threshold={summary.budgetAmount * 0.1}
        thresholdLabel="10% of Budget"
      />
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  trend: number;
  secondaryValue: number;
  secondaryLabel: string;
  comparativeValue: number;
  comparativeLabel: string;
  icon: React.ReactNode;
  isMonetary?: boolean;
  threshold?: number;
  thresholdLabel?: string;
}

function SummaryCard({
  title,
  value,
  description,
  trend,
  secondaryValue,
  secondaryLabel,
  comparativeValue,
  comparativeLabel,
  icon,
  isMonetary = false,
  threshold,
  thresholdLabel
}: SummaryCardProps) {
  const exceedsThreshold = threshold !== undefined && value > threshold;
  
  const formattedValue = isMonetary ? formatCurrency(value) : value;
  const formattedSecondaryValue = isMonetary ? formatCurrency(secondaryValue) : secondaryValue;
  const formattedComparativeValue = isMonetary ? formatCurrency(comparativeValue) : comparativeValue;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{formattedValue}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            
            <div className="flex items-center mt-1">
              {trend > 0 ? (
                <TrendingUp className={cn("h-4 w-4 mr-1", trend > 5 ? "text-red-500" : "text-green-500")} />
              ) : (
                <TrendingDown className={cn("h-4 w-4 mr-1", trend < -5 ? "text-green-500" : "text-amber-500")} />
              )}
              <span className={cn(
                "text-sm",
                trend > 5 ? "text-red-500" : trend < -5 ? "text-green-500" : "text-amber-500"
              )}>
                {trend > 0 ? "+" : ""}{trend.toFixed(1)}% from previous period
              </span>
            </div>
          </div>
          
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-muted p-2 rounded">
            <p className="text-xs text-muted-foreground">{secondaryLabel}</p>
            <p className="font-medium">{formattedSecondaryValue}</p>
          </div>
          
          <div className="bg-muted p-2 rounded">
            <p className="text-xs text-muted-foreground">{comparativeLabel}</p>
            <p className="font-medium">{formattedComparativeValue}</p>
          </div>
        </div>
        
        {exceedsThreshold && (
          <div className="mt-3 flex items-center gap-1 text-xs text-red-500">
            <AlertTriangle className="h-3 w-3" />
            <span>Exceeds {thresholdLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
