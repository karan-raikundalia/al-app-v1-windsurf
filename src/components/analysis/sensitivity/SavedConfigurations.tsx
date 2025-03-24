
import { useState } from "react";
import { Save, Trash, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OutputMetric } from "./OutputMetricSelector";
import { VariableRange } from "./VariableRangeSelector";
import { toast } from "sonner";

export interface SensitivityConfig {
  id: string;
  name: string;
  outputMetric: OutputMetric;
  variableRanges: VariableRange[];
  dateCreated: Date;
}

interface SavedConfigurationsProps {
  currentConfig: {
    outputMetric: OutputMetric | null;
    variableRanges: VariableRange[];
  };
  onLoadConfig: (config: SensitivityConfig) => void;
}

export function SavedConfigurations({
  currentConfig,
  onLoadConfig,
}: SavedConfigurationsProps) {
  const [configName, setConfigName] = useState("");
  const [savedConfigs, setSavedConfigs] = useState<SensitivityConfig[]>(() => {
    // Load saved configs from localStorage
    try {
      const saved = localStorage.getItem("sensitivityConfigs");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading saved sensitivity configurations", e);
      return [];
    }
  });

  const saveCurrentConfig = () => {
    if (!configName.trim()) {
      toast.error("Please enter a name for this configuration");
      return;
    }

    if (!currentConfig.outputMetric) {
      toast.error("Please select an output metric");
      return;
    }

    if (currentConfig.variableRanges.length === 0) {
      toast.error("Please select at least one variable");
      return;
    }

    const newConfig: SensitivityConfig = {
      id: `config-${Date.now()}`,
      name: configName,
      outputMetric: currentConfig.outputMetric,
      variableRanges: currentConfig.variableRanges,
      dateCreated: new Date(),
    };

    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("sensitivityConfigs", JSON.stringify(updatedConfigs));
    
    setConfigName("");
    toast.success("Configuration saved successfully");
  };

  const deleteConfig = (id: string) => {
    const updatedConfigs = savedConfigs.filter((config) => config.id !== id);
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("sensitivityConfigs", JSON.stringify(updatedConfigs));
    toast.success("Configuration deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Save Current Configuration</label>
        <div className="flex gap-2">
          <Input
            placeholder="Configuration name"
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={saveCurrentConfig} disabled={!currentConfig.outputMetric || currentConfig.variableRanges.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {savedConfigs.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Load Saved Configuration</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Select a saved configuration</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {savedConfigs.map((config) => (
                <DropdownMenuItem
                  key={config.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col gap-1 flex-1" onClick={() => onLoadConfig(config)}>
                    <span>{config.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {config.outputMetric.name} ({config.variableRanges.length} variables)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConfig(config.id);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
