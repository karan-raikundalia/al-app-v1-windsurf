
import React, { useState } from "react";
import { LCOEInputs, LCOEBreakdown } from "@/models/lcoe";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataPanel } from "@/components/ui/DataPanel";
import { calculateLCOE, getDefaultInputs } from "@/utils/lcoeCalculator";
import { LCOEBreakdownChart } from "./LCOEBreakdownChart";

interface LCOECalculatorFormProps {
  onSave: (inputs: LCOEInputs) => void;
}

export function LCOECalculatorForm({ onSave }: LCOECalculatorFormProps) {
  const [energySource, setEnergySource] = useState<"solar" | "wind" | "battery" | "hybrid">("solar");
  const [inputs, setInputs] = useState<LCOEInputs>(getDefaultInputs("solar"));
  const [breakdown, setBreakdown] = useState<LCOEBreakdown | null>(null);
  
  // Handle energy source change
  const handleEnergySourceChange = (value: string) => {
    const newSource = value as "solar" | "wind" | "battery" | "hybrid";
    setEnergySource(newSource);
    setInputs(getDefaultInputs(newSource));
    setBreakdown(null);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse numeric inputs
    if (e.target.type === "number") {
      parsedValue = parseFloat(value) || 0;
    }
    
    setInputs(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };
  
  // Handle slider change
  const handleSliderChange = (name: string, value: number[]) => {
    setInputs(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };
  
  // Calculate LCOE
  const handleCalculate = () => {
    try {
      const result = calculateLCOE(inputs);
      setBreakdown(result);
    } catch (error) {
      console.error("Error calculating LCOE", error);
    }
  };
  
  // Handle save
  const handleSave = () => {
    if (breakdown) {
      onSave(inputs);
    }
  };
  
  // Reset form
  const handleReset = () => {
    setInputs(getDefaultInputs(energySource));
    setBreakdown(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <DataPanel title="LCOE Calculator">
          <div className="space-y-6">
            {/* Energy Source Selector */}
            <div className="space-y-2">
              <Label>Energy Source</Label>
              <Tabs
                value={energySource}
                onValueChange={handleEnergySourceChange}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="solar">Solar</TabsTrigger>
                  <TabsTrigger value="wind">Wind</TabsTrigger>
                  <TabsTrigger value="battery">Battery</TabsTrigger>
                  <TabsTrigger value="hybrid">Hybrid</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                value={inputs.name}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Project Parameters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                <Input
                  id="initialInvestment"
                  name="initialInvestment"
                  type="number"
                  value={inputs.initialInvestment}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacityKW">Capacity (kW)</Label>
                <Input
                  id="capacityKW"
                  name="capacityKW"
                  type="number"
                  value={inputs.capacityKW}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectLifeYears">Project Life (years)</Label>
                <Input
                  id="projectLifeYears"
                  name="projectLifeYears"
                  type="number"
                  value={inputs.projectLifeYears}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountRate">
                  Discount Rate ({(inputs.discountRate * 100).toFixed(1)}%)
                </Label>
                <Slider
                  name="discountRate"
                  min={0.01}
                  max={0.20}
                  step={0.005}
                  value={[inputs.discountRate]}
                  onValueChange={(value) => handleSliderChange("discountRate", value)}
                />
              </div>
            </div>
            
            {/* Performance Parameters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacityFactor">
                  Capacity Factor ({(inputs.capacityFactor * 100).toFixed(1)}%)
                </Label>
                <Slider
                  name="capacityFactor"
                  min={0.1}
                  max={0.5}
                  step={0.01}
                  value={[inputs.capacityFactor]}
                  onValueChange={(value) => handleSliderChange("capacityFactor", value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="annualDegradation">
                  Annual Degradation ({(inputs.annualDegradation * 100).toFixed(2)}%)
                </Label>
                <Slider
                  name="annualDegradation"
                  min={0}
                  max={0.03}
                  step={0.001}
                  value={[inputs.annualDegradation]}
                  onValueChange={(value) => handleSliderChange("annualDegradation", value)}
                />
              </div>
            </div>
            
            {/* Operation Costs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annualOMCost">Annual O&M Cost ($)</Label>
                <Input
                  id="annualOMCost"
                  name="annualOMCost"
                  type="number"
                  value={inputs.annualOMCost}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelCost">Fuel Cost ($/MWh)</Label>
                <Input
                  id="fuelCost"
                  name="fuelCost"
                  type="number"
                  value={inputs.fuelCost}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Battery-specific parameters (conditionally rendered) */}
            {(energySource === "battery" || energySource === "hybrid") && (
              <div className="grid grid-cols-2 gap-4 border-t pt-4 border-gray-200">
                <div className="space-y-2">
                  <Label htmlFor="batteryCapacityKWh">Battery Capacity (kWh)</Label>
                  <Input
                    id="batteryCapacityKWh"
                    name="batteryCapacityKWh"
                    type="number"
                    value={inputs.batteryCapacityKWh}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="batteryRoundTripEfficiency">
                    Round Trip Efficiency ({(inputs.batteryRoundTripEfficiency || 0) * 100}%)
                  </Label>
                  <Slider
                    name="batteryRoundTripEfficiency"
                    min={0.7}
                    max={1}
                    step={0.01}
                    value={[inputs.batteryRoundTripEfficiency || 0.85]}
                    onValueChange={(value) => handleSliderChange("batteryRoundTripEfficiency", value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="batteryReplacementYear">Replacement Year</Label>
                  <Input
                    id="batteryReplacementYear"
                    name="batteryReplacementYear"
                    type="number"
                    value={inputs.batteryReplacementYear}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="batteryReplacementCost">Replacement Cost ($)</Label>
                  <Input
                    id="batteryReplacementCost"
                    name="batteryReplacementCost"
                    type="number"
                    value={inputs.batteryReplacementCost}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            
            {/* Tax and Incentives */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4 border-gray-200">
              <div className="space-y-2">
                <Label htmlFor="taxRate">
                  Tax Rate ({(inputs.taxRate || 0) * 100}%)
                </Label>
                <Slider
                  name="taxRate"
                  min={0}
                  max={0.4}
                  step={0.01}
                  value={[inputs.taxRate || 0]}
                  onValueChange={(value) => handleSliderChange("taxRate", value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investmentTaxCredit">
                  Investment Tax Credit ({(inputs.investmentTaxCredit || 0) * 100}%)
                </Label>
                <Slider
                  name="investmentTaxCredit"
                  min={0}
                  max={0.5}
                  step={0.01}
                  value={[inputs.investmentTaxCredit || 0]}
                  onValueChange={(value) => handleSliderChange("investmentTaxCredit", value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productionTaxCredit">Production Tax Credit ($/MWh)</Label>
                <Input
                  id="productionTaxCredit"
                  name="productionTaxCredit"
                  type="number"
                  value={inputs.productionTaxCredit || 0}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="carbonPrice">Carbon Price ($/ton)</Label>
                <Input
                  id="carbonPrice"
                  name="carbonPrice"
                  type="number"
                  value={inputs.carbonPrice || 0}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button onClick={handleCalculate} className="flex-1">Calculate LCOE</Button>
              <Button onClick={handleReset} variant="outline">Reset</Button>
            </div>
          </div>
        </DataPanel>
      </div>
      
      <div>
        {breakdown ? (
          <div className="space-y-6">
            <DataPanel>
              <LCOEBreakdownChart breakdown={breakdown} />
            </DataPanel>
            
            <div className="flex justify-end gap-4">
              <Button onClick={handleSave} variant="default">Save Calculation</Button>
            </div>
          </div>
        ) : (
          <DataPanel className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No Calculation Yet</h3>
              <p className="text-muted-foreground">
                Fill in the parameters and click "Calculate LCOE" to see results.
              </p>
            </div>
          </DataPanel>
        )}
      </div>
    </div>
  );
}
