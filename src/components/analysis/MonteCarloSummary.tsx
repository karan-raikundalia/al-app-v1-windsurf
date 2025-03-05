
import { NPVCard } from "./summary-cards/NPVCard";
import { IRRCard } from "./summary-cards/IRRCard";
import { PaybackCard } from "./summary-cards/PaybackCard";
import { DSCRCard } from "./summary-cards/DSCRCard";
import { EquityMultipleCard } from "./summary-cards/EquityMultipleCard";
import { RiskFactorsCard } from "./summary-cards/RiskFactorsCard";
import { calculateMean, calculateProbability, formatMetricValue } from "./utils/monteCarloUtils";

interface MonteCarloSummaryProps {
  results: any;
}

export function MonteCarloSummary({ results }: MonteCarloSummaryProps) {
  if (!results) return null;

  // Calculate mean values
  const meanNPV = calculateMean(results.npv);
  const meanIRR = calculateMean(results.irr);
  const meanPayback = calculateMean(results.paybackPeriod);
  const meanDSCR = calculateMean(results.debtServiceCoverage);
  const meanEM = calculateMean(results.equityMultiple);

  // Calculate probability of success for different metrics
  const probabilityPositiveNPV = calculateProbability(results.npv, val => val > 0);
  const probabilityIRRAbove10 = calculateProbability(results.irr, val => val > 0.10);
  const probabilityPaybackUnder5 = calculateProbability(results.paybackPeriod, val => val < 5);
  const probabilityDSCRAbove1 = calculateProbability(results.debtServiceCoverage, val => val > 1);
  const probabilityEMAbove2 = calculateProbability(results.equityMultiple, val => val > 2);
  
  // Get confidence intervals
  const npvCI = results.confidenceIntervals.npv;
  const irrCI = results.confidenceIntervals.irr;
  const paybackCI = results.confidenceIntervals.paybackPeriod;
  const dscrCI = results.confidenceIntervals.debtServiceCoverage;
  const emCI = results.confidenceIntervals.equityMultiple;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NPVCard 
        meanNPV={meanNPV}
        probabilityPositiveNPV={probabilityPositiveNPV}
        npvCI={npvCI}
        formatValue={formatMetricValue}
      />
      
      <IRRCard 
        meanIRR={meanIRR}
        probabilityIRRAbove10={probabilityIRRAbove10}
        irrCI={irrCI}
        formatValue={formatMetricValue}
      />
      
      <PaybackCard 
        meanPayback={meanPayback}
        probabilityPaybackUnder5={probabilityPaybackUnder5}
        paybackCI={paybackCI}
        formatValue={formatMetricValue}
      />
      
      <DSCRCard 
        meanDSCR={meanDSCR}
        probabilityDSCRAbove1={probabilityDSCRAbove1}
        dscrCI={dscrCI}
        formatValue={formatMetricValue}
      />
      
      <EquityMultipleCard 
        meanEM={meanEM}
        probabilityEMAbove2={probabilityEMAbove2}
        emCI={emCI}
        formatValue={formatMetricValue}
      />
      
      <RiskFactorsCard sensitivityRanking={results.sensitivityRanking} />
    </div>
  );
}
