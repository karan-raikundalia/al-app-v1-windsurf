
import { MetricCard } from "./MetricCard";

interface DSCRCardProps {
  meanDSCR: number;
  probabilityDSCRAbove1: number;
  dscrCI: [number, number];
  formatValue: (value: number, metric: string) => string;
}

export function DSCRCard({ meanDSCR, probabilityDSCRAbove1, dscrCI, formatValue }: DSCRCardProps) {
  return (
    <MetricCard
      title="Debt Service Coverage"
      description="Cash flow to debt service ratio"
      tooltipText="Debt Service Coverage Ratio measures the project&apos;s ability to generate sufficient cash flows to cover debt obligations."
      value={formatValue(meanDSCR, "debtServiceCoverage")}
      badgeText={meanDSCR > 1.5 ? "Strong" : meanDSCR > 1.2 ? "Good" : meanDSCR > 1 ? "Adequate" : "Weak"}
      badgeVariant={meanDSCR > 1.2 ? "default" : meanDSCR > 1 ? "secondary" : "destructive"}
      probabilityLabel={`Probability DSCR ${`>`} 1.0`}
      probabilityValue={probabilityDSCRAbove1}
      confidenceInterval={[formatValue(dscrCI[0], "debtServiceCoverage"), formatValue(dscrCI[1], "debtServiceCoverage")]}
    />
  );
}
