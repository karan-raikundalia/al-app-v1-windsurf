
import { MetricCard } from "./MetricCard";

interface IRRCardProps {
  meanIRR: number;
  probabilityIRRAbove10: number;
  irrCI: [number, number];
  formatValue: (value: number, metric: string) => string;
}

export function IRRCard({ meanIRR, probabilityIRRAbove10, irrCI, formatValue }: IRRCardProps) {
  return (
    <MetricCard
      title="Internal Rate of Return"
      description="Annualized rate of return"
      tooltipText="Internal Rate of Return is the discount rate that makes the net present value of all cash flows equal to zero."
      value={formatValue(meanIRR, "irr")}
      badgeText={meanIRR > 0.15 ? "Excellent" : meanIRR > 0.10 ? "Good" : "Low"}
      badgeVariant={meanIRR > 0.10 ? "default" : "secondary"}
      probabilityLabel={`Probability IRR ${`>`} 10%`}
      probabilityValue={probabilityIRRAbove10}
      confidenceInterval={[formatValue(irrCI[0], "irr"), formatValue(irrCI[1], "irr")]}
    />
  );
}
