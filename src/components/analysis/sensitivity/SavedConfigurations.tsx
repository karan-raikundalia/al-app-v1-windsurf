
import { useState } from "react";
import { Save, Trash, ChevronDown, Check, CopyIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { OutputMetric } from "./OutputMetricSelector";
import { VariableRange } from "./VariableRangeSelector";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  onReset: () => void;
}

export function SavedConfigurations({
  currentConfig,
  onLoadConfig,
  onReset,
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
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);

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
    setIsDeleteAlertOpen(false);
    setConfigToDelete(null);
  };

  const confirmDelete = (id: string) => {
    setConfigToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const duplicateConfig = (config: SensitivityConfig) => {
    const newConfig: SensitivityConfig = {
      ...config,
      id: `config-${Date.now()}`,
      name: `${config.name} (copy)`,
      dateCreated: new Date(),
    };

    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("sensitivityConfigs", JSON.stringify(updatedConfigs));
    toast.success("Configuration duplicated");
  };
  
  const handleReset = () => {
    onReset();
    toast.success("Analysis reset");
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

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleReset} 
          className="flex-1"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Analysis
        </Button>
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
            <DropdownMenuContent className="w-[350px]">
              {savedConfigs.map((config) => (
                <div key={config.id}>
                  <DropdownMenuItem
                    className="flex flex-col items-start p-3 cursor-pointer"
                    onClick={() => onLoadConfig(config)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="font-medium flex items-center">
                        {config.name}
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateConfig(config);
                          }}
                          className="h-8 w-8 p-0 mr-1"
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(config.id);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {config.outputMetric.name} ({config.variableRanges.length} variables)
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Created: {new Date(config.dateCreated).toLocaleDateString()}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this saved configuration? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => configToDelete && deleteConfig(configToDelete)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
