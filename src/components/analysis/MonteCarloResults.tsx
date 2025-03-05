
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

interface MonteCarloResultsProps {
  results: any;
}

export function MonteCarloResults({ results }: MonteCarloResultsProps) {
  const [activeTab, setActiveTab] = useState("detailed");
  const [xMetric, setXMetric] = useState("npv");
  const [yMetric, setYMetric] = useState("irr");

  if (!results) return null;

  // Format values for display
  const formatValue = (value: number, metric: string) => {
    if (metric === "npv") return `$${(value / 1000000).toFixed(2)}M`;
    if (metric === "irr") return `${(value * 100).toFixed(2)}%`;
    if (metric === "paybackPeriod") return `${value.toFixed(2)} years`;
    if (metric === "debtServiceCoverage") return value.toFixed(2);
    if (metric === "equityMultiple") return `${value.toFixed(2)}x`;
    return value.toFixed(2);
  };

  // Generate scatter plot data
  const generateScatterData = () => {
    // Return 100 random samples from the simulation for the scatter plot
    const sampleSize = 100;
    const sampleIndices = Array.from({ length: results[xMetric].length }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, sampleSize);
    
    return sampleIndices.map((index: number) => ({
      x: results[xMetric][index],
      y: results[yMetric][index],
    }));
  };

  // Calculate percentiles for a given array
  const getPercentiles = (arr: number[]) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const len = sorted.length;
    return {
      min: sorted[0],
      p10: sorted[Math.floor(len * 0.1)],
      p25: sorted[Math.floor(len * 0.25)],
      median: sorted[Math.floor(len * 0.5)],
      p75: sorted[Math.floor(len * 0.75)],
      p90: sorted[Math.floor(len * 0.9)],
      max: sorted[len - 1],
      mean: arr.reduce((sum, val) => sum + val, 0) / len,
      stdDev: Math.sqrt(
        arr.reduce((sum, val) => sum + Math.pow(val - (arr.reduce((s, v) => s + v, 0) / len), 2), 0) / len
      )
    };
  };

  // Get statistics for all metrics
  const statistics = {
    npv: getPercentiles(results.npv),
    irr: getPercentiles(results.irr),
    paybackPeriod: getPercentiles(results.paybackPeriod),
    debtServiceCoverage: getPercentiles(results.debtServiceCoverage),
    equityMultiple: getPercentiles(results.equityMultiple)
  };

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glassmorphism rounded-lg p-3 text-sm">
          <p className="font-medium">Simulation Result</p>
          <p>{formatValue(data.x, xMetric)}</p>
          <p>{formatValue(data.y, yMetric)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="detailed">Detailed Statistics</TabsTrigger>
          <TabsTrigger value="scatter">Correlation Plot</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detailed" className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Metric</TableHead>
                  <TableHead>Min</TableHead>
                  <TableHead>10th %</TableHead>
                  <TableHead>25th %</TableHead>
                  <TableHead>Median</TableHead>
                  <TableHead>75th %</TableHead>
                  <TableHead>90th %</TableHead>
                  <TableHead>Max</TableHead>
                  <TableHead>Mean</TableHead>
                  <TableHead>Std Dev</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">NPV</TableCell>
                  <TableCell>{formatValue(statistics.npv.min, "npv")}</TableCell>
                  <TableCell>{formatValue(statistics.npv.p10, "npv")}</TableCell>
                  <TableCell>{formatValue(statistics.npv.p25, "npv")}</TableCell>
                  <TableCell>{formatValue(statistics.npv.median, "npv")}</TableCell>
                  <TableCell>{formatValue(statistics.npv.p75, "npv")}</TableCell>
                  <TableCell>{formatValue(statistics.npv.p90, "npv")}</TableCell>
                  <TableCell>{formatValue(statistics.npv.max, "npv")}</TableCell>
                  <TableCell>{formatValue(statistics.npv.mean, "npv")}</TableCell>
                  <TableCell>{formatValue(statistics.npv.stdDev, "npv")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">IRR</TableCell>
                  <TableCell>{formatValue(statistics.irr.min, "irr")}</TableCell>
                  <TableCell>{formatValue(statistics.irr.p10, "irr")}</TableCell>
                  <TableCell>{formatValue(statistics.irr.p25, "irr")}</TableCell>
                  <TableCell>{formatValue(statistics.irr.median, "irr")}</TableCell>
                  <TableCell>{formatValue(statistics.irr.p75, "irr")}</TableCell>
                  <TableCell>{formatValue(statistics.irr.p90, "irr")}</TableCell>
                  <TableCell>{formatValue(statistics.irr.max, "irr")}</TableCell>
                  <TableCell>{formatValue(statistics.irr.mean, "irr")}</TableCell>
                  <TableCell>{formatValue(statistics.irr.stdDev, "irr")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Payback Period</TableCell>
                  <TableCell>{formatValue(statistics.paybackPeriod.min, "paybackPeriod")}</TableCell>
                  <TableCell>{formatValue(statistics.paybackPeriod.p10, "paybackPeriod")}</TableCell>
                  <TableCell>{formatValue(statistics.paybackPeriod.p25, "paybackPeriod")}</TableCell>
                  <TableCell>{formatValue(statistics.paybackPeriod.median, "paybackPeriod")}</TableCell>
                  <TableCell>{formatValue(statistics.paybackPeriod.p75, "paybackPeriod")}</TableCell>
                  <TableCell>{formatValue(statistics.paybackPeriod.p90, "paybackPeriod")}</TableCell>
                  <TableCell>{formatValue(statistics.paybackPeriod.max, "paybackPeriod")}</TableCell>
                  <TableCell>{formatValue(statistics.paybackPeriod.mean, "paybackPeriod")}</TableCell>
                  <TableCell>{formatValue(statistics.paybackPeriod.stdDev, "paybackPeriod")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">DSCR</TableCell>
                  <TableCell>{formatValue(statistics.debtServiceCoverage.min, "debtServiceCoverage")}</TableCell>
                  <TableCell>{formatValue(statistics.debtServiceCoverage.p10, "debtServiceCoverage")}</TableCell>
                  <TableCell>{formatValue(statistics.debtServiceCoverage.p25, "debtServiceCoverage")}</TableCell>
                  <TableCell>{formatValue(statistics.debtServiceCoverage.median, "debtServiceCoverage")}</TableCell>
                  <TableCell>{formatValue(statistics.debtServiceCoverage.p75, "debtServiceCoverage")}</TableCell>
                  <TableCell>{formatValue(statistics.debtServiceCoverage.p90, "debtServiceCoverage")}</TableCell>
                  <TableCell>{formatValue(statistics.debtServiceCoverage.max, "debtServiceCoverage")}</TableCell>
                  <TableCell>{formatValue(statistics.debtServiceCoverage.mean, "debtServiceCoverage")}</TableCell>
                  <TableCell>{formatValue(statistics.debtServiceCoverage.stdDev, "debtServiceCoverage")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Equity Multiple</TableCell>
                  <TableCell>{formatValue(statistics.equityMultiple.min, "equityMultiple")}</TableCell>
                  <TableCell>{formatValue(statistics.equityMultiple.p10, "equityMultiple")}</TableCell>
                  <TableCell>{formatValue(statistics.equityMultiple.p25, "equityMultiple")}</TableCell>
                  <TableCell>{formatValue(statistics.equityMultiple.median, "equityMultiple")}</TableCell>
                  <TableCell>{formatValue(statistics.equityMultiple.p75, "equityMultiple")}</TableCell>
                  <TableCell>{formatValue(statistics.equityMultiple.p90, "equityMultiple")}</TableCell>
                  <TableCell>{formatValue(statistics.equityMultiple.max, "equityMultiple")}</TableCell>
                  <TableCell>{formatValue(statistics.equityMultiple.mean, "equityMultiple")}</TableCell>
                  <TableCell>{formatValue(statistics.equityMultiple.stdDev, "equityMultiple")}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="scatter" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div>
                <label htmlFor="x-metric" className="text-sm font-medium block mb-1">X-Axis:</label>
                <select 
                  id="x-metric"
                  className="text-sm p-2 border rounded-md"
                  value={xMetric}
                  onChange={(e) => setXMetric(e.target.value)}
                >
                  <option value="npv">Net Present Value</option>
                  <option value="irr">Internal Rate of Return</option>
                  <option value="paybackPeriod">Payback Period</option>
                  <option value="debtServiceCoverage">Debt Service Coverage</option>
                  <option value="equityMultiple">Equity Multiple</option>
                </select>
              </div>
              <div>
                <label htmlFor="y-metric" className="text-sm font-medium block mb-1">Y-Axis:</label>
                <select 
                  id="y-metric"
                  className="text-sm p-2 border rounded-md"
                  value={yMetric}
                  onChange={(e) => setYMetric(e.target.value)}
                >
                  <option value="npv">Net Present Value</option>
                  <option value="irr">Internal Rate of Return</option>
                  <option value="paybackPeriod">Payback Period</option>
                  <option value="debtServiceCoverage">Debt Service Coverage</option>
                  <option value="equityMultiple">Equity Multiple</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing 100 random samples from the simulation
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name={xMetric} 
                  tickFormatter={(value) => formatValue(value, xMetric)}
                  label={{ 
                    value: xMetric === "npv" ? "Net Present Value" : 
                           xMetric === "irr" ? "Internal Rate of Return" :
                           xMetric === "paybackPeriod" ? "Payback Period" :
                           xMetric === "debtServiceCoverage" ? "Debt Service Coverage" : "Equity Multiple", 
                    position: 'insideBottom', 
                    offset: -10 
                  }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name={yMetric} 
                  tickFormatter={(value) => formatValue(value, yMetric)}
                  label={{ 
                    value: yMetric === "npv" ? "Net Present Value" : 
                           yMetric === "irr" ? "Internal Rate of Return" :
                           yMetric === "paybackPeriod" ? "Payback Period" :
                           yMetric === "debtServiceCoverage" ? "Debt Service Coverage" : "Equity Multiple", 
                    angle: -90, 
                    position: 'insideLeft' 
                  }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip content={<CustomScatterTooltip />} />
                <Scatter 
                  name="Simulation Results" 
                  data={generateScatterData()} 
                  fill="#8B5CF6" 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="sensitivity" className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Variable</TableHead>
                  <TableHead>Impact on Outcome</TableHead>
                  <TableHead>Correlation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.sensitivityRanking.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.variable}</TableCell>
                    <TableCell>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${item.impact * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{(item.impact * 100).toFixed(1)}%</span>
                    </TableCell>
                    <TableCell>
                      {item.variable === "Construction Cost" ? "-0.82" : 
                       item.variable === "Revenue Growth" ? "0.77" : 
                       item.variable === "Operating Expenses" ? "-0.65" : 
                       item.variable === "Interest Rate" ? "-0.43" : "0.31"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
