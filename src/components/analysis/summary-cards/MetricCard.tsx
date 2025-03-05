
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  description: string;
  tooltipText: string;
  value: string;
  badgeText: string;
  badgeVariant: "default" | "secondary" | "destructive";
  probabilityLabel: string;
  probabilityValue: number;
  confidenceInterval: [string, string];
}

export function MetricCard({
  title,
  description,
  tooltipText,
  value,
  badgeText,
  badgeVariant,
  probabilityLabel,
  probabilityValue,
  confidenceInterval,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold">{value}</span>
          <Badge variant={badgeVariant}>
            {badgeText}
          </Badge>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{probabilityLabel}</span>
            <span className="font-medium">{(probabilityValue * 100).toFixed(1)}%</span>
          </div>
          <Progress value={probabilityValue * 100} className="h-2" />
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>95% Confidence Interval:</p>
          <p>{confidenceInterval[0]} to {confidenceInterval[1]}</p>
        </div>
      </CardContent>
    </Card>
  );
}
