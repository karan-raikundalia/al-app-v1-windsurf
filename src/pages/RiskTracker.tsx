
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RiskTrackerProps {
  defaultTab?: "assumption-validity" | "validation" | "risk-register" | "documents";
}

const RiskTracker = ({ defaultTab = "assumption-validity" }: RiskTrackerProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Risk Register</h2>
            <p className="text-muted-foreground">
              Maintain a comprehensive register of project risks, including their probability, impact, and mitigation strategies.
            </p>
            
            <div className="border rounded-md p-4 mt-4">
              <p className="text-center text-muted-foreground">
                No risks have been added to the register yet.
              </p>
            </div>
          </div>
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
