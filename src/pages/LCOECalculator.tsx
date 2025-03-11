
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { LCOECalculatorForm } from "@/components/lcoe/LCOECalculatorForm";
import { SavedCalculations } from "@/components/lcoe/SavedCalculations";
import { LCOEBreakdownChart } from "@/components/lcoe/LCOEBreakdownChart";
import { LCOEInputs, LCOEResult } from "@/models/lcoe";
import { getSavedCalculations, saveCalculation, deleteCalculation } from "@/services/lcoeService";
import { DataPanel } from "@/components/ui/DataPanel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LCOECalculator = () => {
  const [savedCalculations, setSavedCalculations] = useState<LCOEResult[]>([]);
  const [selectedCalculation, setSelectedCalculation] = useState<LCOEResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>("calculator");
  
  // Load saved calculations on mount
  useEffect(() => {
    const calculations = getSavedCalculations();
    setSavedCalculations(calculations);
  }, []);
  
  // Handle saving a calculation
  const handleSave = (inputs: LCOEInputs) => {
    try {
      const savedResult = saveCalculation(inputs);
      setSavedCalculations(getSavedCalculations());
      setSelectedCalculation(savedResult);
      setActiveTab("saved");
    } catch (error) {
      console.error("Error saving calculation", error);
    }
  };
  
  // Handle deleting a calculation
  const handleDelete = (id: string) => {
    if (deleteCalculation(id)) {
      setSavedCalculations(getSavedCalculations());
      if (selectedCalculation?.inputs.id === id) {
        setSelectedCalculation(null);
      }
    }
  };
  
  // Handle selecting a calculation
  const handleSelect = (calculation: LCOEResult) => {
    setSelectedCalculation(calculation);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Levelized Cost of Energy Calculator</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="saved">Saved Calculations</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {activeTab === "calculator" ? (
          <LCOECalculatorForm onSave={handleSave} />
        ) : (
          <div className="space-y-6">
            <SavedCalculations 
              calculations={savedCalculations} 
              onDelete={handleDelete}
              onSelect={handleSelect}
            />
            
            {selectedCalculation && (
              <DataPanel title={`${selectedCalculation.inputs.name} - Details`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Project Parameters</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Energy Source</p>
                        <p className="capitalize">{selectedCalculation.inputs.energySource}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p>{selectedCalculation.inputs.capacityKW} kW</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Project Life</p>
                        <p>{selectedCalculation.inputs.projectLifeYears} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Discount Rate</p>
                        <p>{(selectedCalculation.inputs.discountRate * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity Factor</p>
                        <p>{(selectedCalculation.inputs.capacityFactor * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Initial Investment</p>
                        <p>${selectedCalculation.inputs.initialInvestment.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <LCOEBreakdownChart breakdown={selectedCalculation.breakdown} />
                  </div>
                </div>
              </DataPanel>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default LCOECalculator;
