
import { Dispatch, SetStateAction } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DataPanel } from "@/components/ui/DataPanel";
import { Checkbox } from "@/components/ui/checkbox";

interface MonteCarloControlsProps {
  simulationCount: number;
  setSimulationCount: Dispatch<SetStateAction<number>>;
  isRunning: boolean;
}

export function MonteCarloControls({
  simulationCount,
  setSimulationCount,
  isRunning
}: MonteCarloControlsProps) {
  return (
    <DataPanel title="Simulation Parameters" className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="simulation-count">Number of Simulations</Label>
            <span className="text-sm font-medium">{simulationCount.toLocaleString()}</span>
          </div>
          <Slider
            id="simulation-count"
            min={100}
            max={10000}
            step={100}
            value={[simulationCount]}
            onValueChange={(value) => setSimulationCount(value[0])}
            disabled={isRunning}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>100</span>
            <span>5,000</span>
            <span>10,000</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Variables to Include</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="var-construction" defaultChecked disabled={isRunning} />
            <label
              htmlFor="var-construction"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Construction Cost (±20%)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="var-revenue" defaultChecked disabled={isRunning} />
            <label
              htmlFor="var-revenue"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Revenue Growth (±15%)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="var-opex" defaultChecked disabled={isRunning} />
            <label
              htmlFor="var-opex"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Operating Expenses (±10%)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="var-interest" defaultChecked disabled={isRunning} />
            <label
              htmlFor="var-interest"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Interest Rate (±2%)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="var-tax" defaultChecked disabled={isRunning} />
            <label
              htmlFor="var-tax"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tax Rate (±5%)
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Distribution Settings</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch id="normal-dist" defaultChecked disabled={isRunning} />
            <Label htmlFor="normal-dist">Use Normal Distribution</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="correlated" defaultChecked disabled={isRunning} />
            <Label htmlFor="correlated">Apply Variable Correlations</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="advanced-stats" defaultChecked disabled={isRunning} />
            <Label htmlFor="advanced-stats">Show Advanced Statistics</Label>
          </div>
        </div>
      </div>
    </DataPanel>
  );
}
