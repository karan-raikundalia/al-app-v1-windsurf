
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Upload, List, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RiskTracker = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("assumption-validity");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      toast({
        title: "Document uploaded",
        description: `Successfully uploaded ${e.target.files[0].name}`,
      });
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

        <Tabs defaultValue="assumption-validity" className="w-full" 
          onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="assumption-validity" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Assumption Validity</span>
            </TabsTrigger>
            <TabsTrigger value="validation" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Validation</span>
            </TabsTrigger>
            <TabsTrigger value="risk-register" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>Risk Register</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assumption-validity" className="border rounded-lg p-6 animate-fade-in mt-4">
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
          </TabsContent>

          <TabsContent value="validation" className="border rounded-lg p-6 animate-fade-in mt-4">
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
          </TabsContent>

          <TabsContent value="risk-register" className="border rounded-lg p-6 animate-fade-in mt-4">
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
          </TabsContent>

          <TabsContent value="documents" className="border rounded-lg p-6 animate-fade-in mt-4">
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
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default RiskTracker;
