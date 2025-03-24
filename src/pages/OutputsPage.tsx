
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataPanel } from "@/components/ui/DataPanel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OutputsTable } from "@/components/outputs/OutputsTable";
import { OutputsSummary } from "@/components/outputs/OutputsSummary";
import { useOutputs } from "@/hooks/use-outputs";

const OutputsPage = () => {
  const { outputs } = useOutputs();
  const [activeCategory, setActiveCategory] = useState<string>("developer");

  // Find the currently selected category
  const selectedCategory = outputs.find(cat => cat.id === activeCategory);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Project Outputs</h1>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList>
              {outputs.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <p className="text-muted-foreground max-w-4xl">
          View and manage key financial and operational metrics for different project stakeholders. 
          These outputs can be used in sensitivity analysis to understand their impact on project outcomes.
        </p>
        
        {selectedCategory && (
          <>
            <OutputsSummary category={selectedCategory} />
            
            <DataPanel title={`${selectedCategory.name} Outputs`}>
              <OutputsTable outputs={selectedCategory.outputs} />
            </DataPanel>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default OutputsPage;
