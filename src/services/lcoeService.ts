
import { LCOEInputs, LCOEResult } from "@/models/lcoe";
import { calculateLCOE } from "@/utils/lcoeCalculator";
import { toast } from "@/components/ui/use-toast";

// Key for localStorage
const LCOE_STORAGE_KEY = "lcoe_calculations";

// Get all saved LCOE calculations
export function getSavedCalculations(): LCOEResult[] {
  try {
    const stored = localStorage.getItem(LCOE_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error retrieving LCOE calculations", error);
    toast({
      title: "Error retrieving calculations",
      description: "There was a problem retrieving your saved calculations.",
      variant: "destructive",
    });
    return [];
  }
}

// Save a new LCOE calculation
export function saveCalculation(inputs: LCOEInputs): LCOEResult {
  try {
    // Generate ID and timestamp
    const newInputs: LCOEInputs = {
      ...inputs,
      id: `lcoe_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    // Calculate LCOE breakdown
    const breakdown = calculateLCOE(newInputs);
    
    // Create result object
    const result: LCOEResult = {
      inputs: newInputs,
      breakdown,
    };
    
    // Get existing calculations and add new one
    const existing = getSavedCalculations();
    const updated = [result, ...existing];
    
    // Save to localStorage
    localStorage.setItem(LCOE_STORAGE_KEY, JSON.stringify(updated));
    
    toast({
      title: "Calculation saved",
      description: `"${newInputs.name}" has been saved successfully.`,
    });
    
    return result;
  } catch (error) {
    console.error("Error saving LCOE calculation", error);
    toast({
      title: "Error saving calculation",
      description: "There was a problem saving your calculation.",
      variant: "destructive",
    });
    throw error;
  }
}

// Delete a saved calculation
export function deleteCalculation(id: string): boolean {
  try {
    const existing = getSavedCalculations();
    const filtered = existing.filter(calc => calc.inputs.id !== id);
    
    if (filtered.length === existing.length) {
      return false; // Nothing was deleted
    }
    
    localStorage.setItem(LCOE_STORAGE_KEY, JSON.stringify(filtered));
    
    toast({
      title: "Calculation deleted",
      description: "The calculation has been deleted successfully.",
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting LCOE calculation", error);
    toast({
      title: "Error deleting calculation",
      description: "There was a problem deleting your calculation.",
      variant: "destructive",
    });
    return false;
  }
}
