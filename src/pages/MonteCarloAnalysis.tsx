
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonteCarloChart } from "@/components/analysis/MonteCarloChart";
import { MonteCarloControls } from "@/components/analysis/MonteCarloControls";
import { MonteCarloResults } from "@/components/analysis/MonteCarloResults";
import { MonteCarloSummary } from "@/components/analysis/MonteCarloSummary";
import { DataPanel } from "@/components/ui/DataPanel";
import { Play, Download, RefreshCw } from "lucide-react";

const MonteCarloAnalysis = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [simulationCount, setSimulationCount] = useState(1000);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("chart");

  const runSimulation = () => {
    setIsRunning(true);
    setIsComplete(false);
    
    // Simulate a delay for the Monte Carlo analysis
    setTimeout(() => {
      // Generate fake results
      const results = generateMonteCarloResults(simulationCount);
      setSimulationResults(results);
      setIsRunning(false);
      setIsComplete(true);
      
      toast({
        title: "Simulation Complete",
        description: `${simulationCount.toLocaleString()} simulations completed successfully.`
      });
    }, 1500);
  };

  const generateMonteCarloResults = (iterations: number) => {
    // Key project finance metrics to simulate
    const metrics = {
      npv: { mean: 25000000, stdDev: 5000000 },
      irr: { mean: 0.138, stdDev: 0.025 },
      paybackPeriod: { mean: 4.5, stdDev: 0.8 },
      debtServiceCoverage: { mean: 1.35, stdDev: 0.15 },
      equityMultiple: { mean: 2.2, stdDev: 0.3 }
    };
    
    // Generate simulated data points
    const results = {
      npv: [],
      irr: [],
      paybackPeriod: [],
      debtServiceCoverage: [],
      equityMultiple: [],
      probabilityOfSuccess: 0,
      confidenceIntervals: {},
      sensitivityRanking: []
    };
    
    // Box-Muller transform for normal distribution
    const generateNormalDistribution = (mean: number, stdDev: number) => {
      let u = 0, v = 0;
      while(u === 0) u = Math.random();
      while(v === 0) v = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      return z * stdDev + mean;
    };
    
    // Generate distributions for each metric
    for (let i = 0; i < iterations; i++) {
      results.npv.push(generateNormalDistribution(metrics.npv.mean, metrics.npv.stdDev));
      results.irr.push(generateNormalDistribution(metrics.irr.mean, metrics.irr.stdDev));
      results.paybackPeriod.push(generateNormalDistribution(metrics.paybackPeriod.mean, metrics.paybackPeriod.stdDev));
      results.debtServiceCoverage.push(generateNormalDistribution(metrics.debtServiceCoverage.mean, metrics.debtServiceCoverage.stdDev));
      results.equityMultiple.push(generateNormalDistribution(metrics.equityMultiple.mean, metrics.equityMultiple.stdDev));
    }
    
    // Calculate probability of success (NPV > 0)
    const successfulRuns = results.npv.filter(value => value > 0).length;
    results.probabilityOfSuccess = successfulRuns / iterations;
    
    // Calculate confidence intervals (95%)
    const calculatePercentile = (arr: number[], percentile: number) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const index = Math.floor(sorted.length * percentile);
      return sorted[index];
    };
    
    results.confidenceIntervals = {
      npv: [calculatePercentile(results.npv, 0.025), calculatePercentile(results.npv, 0.975)],
      irr: [calculatePercentile(results.irr, 0.025), calculatePercentile(results.irr, 0.975)],
      paybackPeriod: [calculatePercentile(results.paybackPeriod, 0.025), calculatePercentile(results.paybackPeriod, 0.975)],
      debtServiceCoverage: [calculatePercentile(results.debtServiceCoverage, 0.025), calculatePercentile(results.debtServiceCoverage, 0.975)],
      equityMultiple: [calculatePercentile(results.equityMultiple, 0.025), calculatePercentile(results.equityMultiple, 0.975)]
    };
    
    // Generate sensitivity ranking
    results.sensitivityRanking = [
      { variable: "Construction Cost", impact: 0.35 },
      { variable: "Revenue Growth", impact: 0.25 },
      { variable: "Operating Expenses", impact: 0.18 },
      { variable: "Interest Rate", impact: 0.12 },
      { variable: "Tax Rate", impact: 0.10 }
    ];
    
    return results;
  };

  const downloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Monte Carlo analysis report has been downloaded."
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Monte Carlo Analysis</h1>
          <div className="flex gap-2">
            <Button 
              onClick={runSimulation} 
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {isRunning ? "Running..." : "Run Simulation"}
            </Button>
            <Button 
              variant="outline" 
              onClick={downloadReport}
              disabled={!isComplete}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9 space-y-6">
            <DataPanel title="Simulation Results" description={isComplete ? `${simulationCount.toLocaleString()} iterations completed` : "Configure and run simulation"}>
              {isComplete ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="chart">Distribution Chart</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="details">Detailed Results</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chart" className="mt-0">
                    <MonteCarloChart results={simulationResults} />
                  </TabsContent>
                  <TabsContent value="summary" className="mt-0">
                    <MonteCarloSummary results={simulationResults} />
                  </TabsContent>
                  <TabsContent value="details" className="mt-0">
                    <MonteCarloResults results={simulationResults} />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  {isRunning ? (
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p>Running {simulationCount.toLocaleString()} simulations...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p>Configure simulation parameters and click "Run Simulation"</p>
                    </div>
                  )}
                </div>
              )}
            </DataPanel>
          </div>
          
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <MonteCarloControls 
              simulationCount={simulationCount}
              setSimulationCount={setSimulationCount}
              isRunning={isRunning}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MonteCarloAnalysis;
