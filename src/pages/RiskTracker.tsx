
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Risk } from "@/models/risk";
import { RiskRegisterTable } from "@/components/risk/RiskRegisterTable";

interface RiskTrackerProps {
  defaultTab?: "assumption-validity" | "validation" | "risk-register" | "documents";
}

// Sample risk data
const SAMPLE_RISKS: Risk[] = [
  {
    id: "RISK-1",
    category: "Financial",
    description: "Cost overruns due to unforeseen site conditions",
    consequence: "Project budget exceeded by more than 10%",
    likelihood: "Medium",
    impact: "High", 
    mitigation: "Detailed site survey and contingency budget allocation",
    owner: "Project Manager",
    status: "In Progress",
    contingency: "Request additional funding or reduce scope"
  },
  {
    id: "RISK-2",
    category: "Technical",
    description: "Integration issues with legacy systems",
    consequence: "Project delays and potential functional limitations",
    likelihood: "High",
    impact: "Medium",
    mitigation: "Early integration testing and technical discovery phase",
    owner: "Technical Lead",
    status: "Not Started",
    contingency: "Implement temporary workarounds and schedule fixes post-launch"
  }
];

const RiskTracker = ({ defaultTab = "assumption-validity" }: RiskTrackerProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [risks, setRisks] = useState<Risk[]>(SAMPLE_RISKS);

  // Handle risk management operations
  const handleRiskAdded = (risk: Risk) => {
    setRisks([...risks, risk]);
    toast({
      title: "Risk added",
      description: `Risk ${risk.id} has been added to the register.`,
    });
  };

  const handleRiskUpdated = (updatedRisk: Risk) => {
    setRisks(risks.map(risk => risk.id === updatedRisk.id ? updatedRisk : risk));
    toast({
      title: "Risk updated",
      description: `Risk ${updatedRisk.id} has been updated.`,
    });
  };

  const handleRiskDeleted = (riskId: string) => {
    setRisks(risks.filter(risk => risk.id !== riskId));
    toast({
      title: "Risk deleted",
      description: `Risk ${riskId} has been removed from the register.`,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      toast({
        title: "Document uploaded",
        description: `Successfully uploaded ${e.target.files[0].name}`,
      });
    }
  };

  const renderContent = () => {
    switch (defaultTab) {
      case "assumption-validity":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Assumption Validity</h2>
            <p className="text-muted-foreground">
              Track and validate key project assumptions. Identify risks associated with invalid assumptions.
            </p>
            
            <div className="border rounded-md p-4 mt-4">
              <p className="text-center text-muted-foreground">
                No assumptions have been added yet. Add assumptions to track their validity.
              </p>
            </div>
          </div>
        );
      case "validation":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Validation Relevant to Project Stage</h2>
            <p className="text-muted-foreground">
              Track validation tasks and requirements specific to the current stage of your project.
            </p>
            
            <div className="border rounded-md p-4 mt-4">
              <p className="text-center text-muted-foreground">
                No validation items have been added for the current project stage.
              </p>
            </div>
          </div>
        );
      case "risk-register":
        return (
          <RiskRegisterTable 
            risks={risks} 
            onRiskAdded={handleRiskAdded} 
            onRiskUpdated={handleRiskUpdated} 
            onRiskDeleted={handleRiskDeleted} 
          />
        );
      case "documents":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contract & Document Analysis</h2>
            <p className="text-muted-foreground">
              Upload and analyze contracts and documents to identify risk provisions and key clauses.
            </p>
            
            <div className="border rounded-md p-4 mt-4">
              <p className="text-center text-muted-foreground">
                No documents have been uploaded for analysis.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Risk Tracker</h1>
          <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
            />
          </Button>
        </div>

        <div className="border rounded-lg p-6 animate-fade-in">
          {renderContent()}
        </div>
      </div>
    </AppLayout>
  );
};

export default RiskTracker;
