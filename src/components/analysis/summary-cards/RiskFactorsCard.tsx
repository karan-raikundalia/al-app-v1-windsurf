
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RiskFactor {
  variable: string;
  impact: number;
}

interface RiskFactorsCardProps {
  sensitivityRanking: RiskFactor[];
}

export function RiskFactorsCard({ sensitivityRanking }: RiskFactorsCardProps) {
  const getRiskDescription = (variable: string) => {
    switch (variable) {
      case "Construction Cost":
        return "Higher construction costs significantly reduce project profitability";
      case "Revenue Growth":
        return "Lower revenue growth rates reduce long-term returns";
      case "Operating Expenses":
        return "Increased operating expenses impact cash flow metrics";
      case "Interest Rate":
        return "Higher interest rates increase financing costs";
      default:
        return "Tax rate changes affect net cash flows";
    }
  };

  return (
    <Card className="md:col-span-2 lg:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Key Risk Factors</CardTitle>
        <CardDescription>Variables with highest impact on outcomes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sensitivityRanking.slice(0, 3).map((item: RiskFactor, index: number) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.variable}</span>
                <span>{(item.impact * 100).toFixed(1)}% impact</span>
              </div>
              <Progress value={item.impact * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {getRiskDescription(item.variable)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
