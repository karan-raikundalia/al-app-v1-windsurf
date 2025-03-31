
import { SensitivityAnalysis } from "@/components/analysis/SensitivityAnalysis";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { FileChange } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sensitivity Analysis</h1>
          <Link to="/change-orders">
            <Button variant="outline" className="flex items-center gap-2">
              <FileChange className="h-4 w-4" />
              View EPC Design Change Orders
            </Button>
          </Link>
        </div>
        <SensitivityAnalysis />
      </div>
    </AppLayout>
  );
};

export default Index;
