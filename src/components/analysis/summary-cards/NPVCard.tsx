
import { MetricCard } from "./MetricCard";

interface NPVCardProps {
  meanNPV: number;
  probabilityPositiveNPV: number;
  npvCI: [number, number];
  formatValue: (value: number, metric: string) => string;
}

export function NPVCard({ meanNPV, probabilityPositiveNPV, npvCI, formatValue }: NPVCardProps) {
  return (
    <MetricCard
      title="Net Present Value"
      description="Expected return in present value"
      tooltipText="Net Present Value represents the difference between the present value of cash inflows and outflows over the project&apos;s lifetime."
      value={formatValue(meanNPV, "npv")}
      badgeText={meanNPV > 0 ? "Positive" : "Negative"}
      badgeVariant={meanNPV > 0 ? "default" : "destructive"}
      probabilityLabel="Probability of Positive NPV"
      probabilityValue={probabilityPositiveNPV}
      confidenceInterval={[formatValue(npvCI[0], "npv"), formatValue(npvCI[1], "npv")]}
    />
  );
}
