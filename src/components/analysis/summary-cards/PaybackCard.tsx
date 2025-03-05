
import { MetricCard } from "./MetricCard";

interface PaybackCardProps {
  meanPayback: number;
  probabilityPaybackUnder5: number;
  paybackCI: [number, number];
  formatValue: (value: number, metric: string) => string;
}

export function PaybackCard({ meanPayback, probabilityPaybackUnder5, paybackCI, formatValue }: PaybackCardProps) {
  return (
    <MetricCard
      title="Payback Period"
      description="Years to recover investment"
      tooltipText="Payback Period is the time required to recover the initial investment."
      value={formatValue(meanPayback, "paybackPeriod")}
      badgeText={meanPayback < 3 ? "Fast" : meanPayback < 5 ? "Average" : "Slow"}
      badgeVariant={meanPayback < 5 ? "default" : "secondary"}
      probabilityLabel={`Probability ${`<`} 5 Years`}
      probabilityValue={probabilityPaybackUnder5}
      confidenceInterval={[formatValue(paybackCI[0], "paybackPeriod"), formatValue(paybackCI[1], "paybackPeriod")]}
    />
  );
}
