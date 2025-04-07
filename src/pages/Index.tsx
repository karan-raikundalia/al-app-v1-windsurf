import { SensitivityAnalysis } from "@/components/analysis/SensitivityAnalysis";
import { AppLayout } from "@/components/layout/AppLayout";

const Index = () => {
  return (
    <AppLayout>
      <div className="p-6">
        <SensitivityAnalysis />
      </div>
    </AppLayout>
  );
};

export default Index;
