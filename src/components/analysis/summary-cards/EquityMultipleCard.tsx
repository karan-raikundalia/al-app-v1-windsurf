
import { MetricCard } from "./MetricCard";

interface EquityMultipleCardProps {
  meanEM: number;
  probabilityEMAbove2: number;
  emCI: [number, number];
  formatValue: (value: number, metric: string) => string;
}

export function EquityMultipleCard({ meanEM, probabilityEMAbove2, emCI, formatValue }: EquityMultipleCardProps) {
  return (
    <MetricCard
      title="Equity Multiple"
      description="Total return multiple on equity"
      tooltipText="Equity Multiple represents total cash distributions divided by total equity invested."
      value={formatValue(meanEM, "equityMultiple")}
      badgeText={meanEM > 2.5 ? "Excellent" : meanEM > 2 ? "Good" : "Low"}
      badgeVariant={meanEM > 2 ? "default" : "secondary"}
      probabilityLabel={`Probability EM ${`>`} 2.0x`}
      probabilityValue={probabilityEMAbove2}
      confidenceInterval={[formatValue(emCI[0], "equityMultiple"), formatValue(emCI[1], "equityMultiple")]}
    />
  );
}
