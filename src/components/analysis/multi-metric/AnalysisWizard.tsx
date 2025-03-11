
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  AnalysisConfiguration,
  Metric, 
  Project, 
  Variable 
} from "../MultiMetricAnalysisTool";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DataPanel } from "@/components/ui/DataPanel";
import { Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AnalysisWizardProps {
  onClose: () => void;
  onComplete: (config: AnalysisConfiguration) => void;
  initialConfig: AnalysisConfiguration;
}

export function AnalysisWizard({
  onClose,
  onComplete,
  initialConfig
}: AnalysisWizardProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<AnalysisConfiguration>(initialConfig);
  const [selectedProject, setSelectedProject] = useState<string>(
    initialConfig.projects[0]?.id || ""
  );
  
  const handleTypeChange = (type: "one-way" | "two-way" | "three-way") => {
    setConfig({
      ...config,
      analysisType: type
    });
  };
  
  const handleStepsChange = (steps: string) => {
    const stepsNum = parseInt(steps, 10);
    if (!isNaN(stepsNum) && stepsNum > 0) {
      setConfig({
        ...config,
        numberOfSteps: stepsNum
      });
    }
  };
  
  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete wizard
      onComplete(config);
    }
  };
  
  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Configure Analysis Type</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Analysis Type</Label>
                <RadioGroup 
                  value={config.analysisType} 
                  onValueChange={(value: "one-way" | "two-way" | "three-way") => handleTypeChange(value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-way" id="one-way" />
                    <Label 
                      htmlFor="one-way" 
                      className="font-normal cursor-pointer"
                    >
                      One-way Analysis
                      <p className="text-xs text-muted-foreground mt-1">
                        Analyze the impact of a single variable on metrics.
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="two-way" id="two-way" />
                    <Label 
                      htmlFor="two-way" 
                      className="font-normal cursor-pointer"
                    >
                      Two-way Analysis
                      <p className="text-xs text-muted-foreground mt-1">
                        Analyze the impact of two variables simultaneously.
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="three-way" id="three-way" />
                    <Label 
                      htmlFor="three-way" 
                      className="font-normal cursor-pointer"
                    >
                      Three-way Analysis
                      <p className="text-xs text-muted-foreground mt-1">
                        Analyze the impact of three variables simultaneously.
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="steps">Number of Steps</Label>
                <Input 
                  id="steps"
                  type="number"
                  min={2}
                  max={20}
                  value={config.numberOfSteps}
                  onChange={(e) => handleStepsChange(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Number of data points to calculate for each variable range. Higher values provide more detail but take longer to calculate.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Select Project</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Project</Label>
                <Select 
                  value={selectedProject} 
                  onValueChange={handleProjectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name} ({project.technology})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the project to analyze. Base values will be loaded from the selected project.
                </p>
              </div>
              
              {selectedProject && (
                <DataPanel title="Project Parameters" className="mt-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {Object.entries(config.projects.find(p => p.id === selectedProject)?.baseValues || {}).map(([key, value], index) => {
                      const variable = config.variables.find(v => v.id === key);
                      if (!variable) return null;
                      
                      return (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm">{variable.name}:</span>
                          <span className="text-sm font-medium">
                            {value} {variable.unit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </DataPanel>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Confirm Analysis Setup</h2>
            
            <DataPanel>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Analysis Type</h3>
                  <p className="text-sm">
                    {config.analysisType === "one-way" ? "One-way Analysis" : 
                     config.analysisType === "two-way" ? "Two-way Analysis" : 
                     "Three-way Analysis"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Project</h3>
                  <p className="text-sm">
                    {config.projects.find(p => p.id === selectedProject)?.name || "No project selected"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Steps</h3>
                  <p className="text-sm">{config.numberOfSteps}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Next Steps</h3>
                  <ul className="text-sm space-y-1 mt-1">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-green-500" />
                      Select variables to analyze
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-green-500" />
                      Select metrics to evaluate
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-green-500" />
                      Run the analysis
                    </li>
                  </ul>
                </div>
              </div>
            </DataPanel>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Analysis Setup Wizard</DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((stepNum) => (
                <div 
                  key={stepNum}
                  className={`flex items-center justify-center h-8 w-8 rounded-full border text-sm
                    ${step === stepNum ? 
                      'bg-primary text-primary-foreground border-primary' : 
                      step > stepNum ? 
                        'bg-primary/20 text-primary border-primary/30' : 
                        'bg-muted text-muted-foreground border-muted-foreground/20'
                    }`}
                >
                  {stepNum}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Step {step} of 3
            </span>
          </div>
          
          {renderStepContent()}
          
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNextStep}
              >
                {step < 3 ? 'Next' : 'Complete'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
