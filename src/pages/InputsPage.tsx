import { useState } from "react";
import { PlusCircle, Database, Info, LayoutGrid } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputCategoryCard } from "@/components/inputs/InputCategoryCard";
import { InputDialog } from "@/components/inputs/InputDialog";
import { DataTypeToggle } from "@/components/inputs/DataTypeToggle";
import { ViewToggle } from "@/components/inputs/ViewToggle";
import { InputsTable } from "@/components/inputs/InputsTable";

export type InputCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type InputDataType = "constant" | "timeSeries";

export default function InputsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [dataTypeFilter, setDataTypeFilter] = useState<InputDataType | "all">("all");
  const [view, setView] = useState<"card" | "table">("table");
  const [viewMode, setViewMode] = useState<"component" | "expense">("component");

  const categories: InputCategory[] = [
    {
      id: "bess",
      name: "Battery Energy Storage Systems",
      description: "Technical and cost parameters for battery systems",
      icon: "battery",
    },
    {
      id: "hydrogen",
      name: "Hydrogen Systems",
      description: "Electrolyzer and hydrogen storage parameters",
      icon: "atom",
    },
    {
      id: "solar",
      name: "Solar PV Systems",
      description: "Solar panel specifications and production parameters",
      icon: "sun",
    },
    {
      id: "wind",
      name: "Wind Systems",
      description: "Wind turbine specifications and production parameters", 
      icon: "wind",
    },
    {
      id: "project-financing",
      name: "Project Financing Assumptions",
      description: "Combined project financing parameters",
      icon: "piggy-bank",
    },
    {
      id: "system-financing",
      name: "System Financing Assumptions",
      description: "Individual system financing parameters",
      icon: "wallet",
    },
    {
      id: "tax-credits",
      name: "Tax Credit Assumptions",
      description: "Available tax credits and incentives",
      icon: "receipt",
    },
    {
      id: "production",
      name: "Production Assumptions",
      description: "Energy production forecasts and parameters",
      icon: "trending-up",
    },
    {
      id: "opex",
      name: "Operating Expense Assumptions",
      description: "Ongoing operational costs and maintenance",
      icon: "calculator",
    },
    {
      id: "tax",
      name: "Tax Assumptions",
      description: "Tax rates and depreciation schedules",
      icon: "file-text",
    },
    {
      id: "construction",
      name: "Construction Loan Assumptions",
      description: "Construction financing and drawdown schedules",
      icon: "building",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Inputs</h1>
            <p className="text-muted-foreground">
              Manage input parameters for energy project analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ViewToggle 
              view={view} 
              viewMode={viewMode}
              onViewChange={setView}
              onViewModeChange={setViewMode}
            />
            <DataTypeToggle 
              value={dataTypeFilter} 
              onChange={setDataTypeFilter} 
            />
            <Button onClick={() => setShowInputDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Input
            </Button>
            <Button variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Connect Database
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Categories</TabsTrigger>
            <TabsTrigger value="bess">BESS</TabsTrigger>
            <TabsTrigger value="hydrogen">Hydrogen</TabsTrigger>
            <TabsTrigger value="solar">Solar</TabsTrigger>
            <TabsTrigger value="financing">Financing</TabsTrigger>
            <TabsTrigger value="tax">Tax & Credits</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
          </TabsList>

          {view === "table" ? (
            <>
              <TabsContent value="all" className="space-y-4">
                <InputsTable
                  dataTypeFilter={dataTypeFilter}
                  viewMode={viewMode}
                />
              </TabsContent>

              <TabsContent value="bess" className="space-y-4">
                <InputsTable
                  categoryFilter="bess"
                  dataTypeFilter={dataTypeFilter}
                  viewMode={viewMode}
                />
              </TabsContent>

              <TabsContent value="hydrogen" className="space-y-4">
                <InputsTable
                  categoryFilter="hydrogen"
                  dataTypeFilter={dataTypeFilter}
                  viewMode={viewMode}
                />
              </TabsContent>

              <TabsContent value="solar" className="space-y-4">
                <InputsTable
                  categoryFilter="solar"
                  dataTypeFilter={dataTypeFilter}
                  viewMode={viewMode}
                />
              </TabsContent>
              
              <TabsContent value="financing" className="space-y-4">
                <InputsTable
                  categoryFilter="financing"
                  dataTypeFilter={dataTypeFilter}
                  viewMode={viewMode}
                />
              </TabsContent>

              <TabsContent value="tax" className="space-y-4">
                <InputsTable
                  categoryFilter="tax"
                  dataTypeFilter={dataTypeFilter}
                  viewMode={viewMode}
                />
              </TabsContent>
              
              <TabsContent value="production" className="space-y-4">
                <InputsTable
                  categoryFilter="production"
                  dataTypeFilter={dataTypeFilter}
                  viewMode={viewMode}
                />
              </TabsContent>
            </>
          ) : (
            <>
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => (
                    <InputCategoryCard 
                      key={category.id} 
                      category={category} 
                      dataTypeFilter={dataTypeFilter}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bess" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categories
                    .filter(c => c.id === "bess")
                    .map((category) => (
                      <InputCategoryCard 
                        key={category.id} 
                        category={category} 
                        dataTypeFilter={dataTypeFilter}
                      />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="hydrogen" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categories
                    .filter(c => c.id === "hydrogen")
                    .map((category) => (
                      <InputCategoryCard 
                        key={category.id} 
                        category={category} 
                        dataTypeFilter={dataTypeFilter}
                      />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="solar" className="space-y-4">
                {view === "table" ? (
                  <InputsTable
                    categoryFilter="solar"
                    dataTypeFilter={dataTypeFilter}
                    viewMode={viewMode}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories
                      .filter(c => c.id === "solar")
                      .map((category) => (
                        <InputCategoryCard 
                          key={category.id} 
                          category={category} 
                          dataTypeFilter={dataTypeFilter}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="financing" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categories
                    .filter(c => ["project-financing", "system-financing"].includes(c.id))
                    .map((category) => (
                      <InputCategoryCard 
                        key={category.id} 
                        category={category} 
                        dataTypeFilter={dataTypeFilter}
                      />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="tax" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categories
                    .filter(c => ["tax", "tax-credits"].includes(c.id))
                    .map((category) => (
                      <InputCategoryCard 
                        key={category.id} 
                        category={category} 
                        dataTypeFilter={dataTypeFilter}
                      />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="production" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categories
                    .filter(c => c.id === "production")
                    .map((category) => (
                      <InputCategoryCard 
                        key={category.id} 
                        category={category} 
                        dataTypeFilter={dataTypeFilter}
                      />
                    ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
        
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-500">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <p className="font-medium">Database Connection</p>
          </div>
          <p className="mt-1 pl-6">
            Connect to a database to synchronize inputs across your organization.
            This will enable team collaboration and version control for your inputs.
          </p>
        </div>
      </div>

      <InputDialog 
        open={showInputDialog} 
        onOpenChange={setShowInputDialog}
        categories={categories}
      />
    </AppLayout>
  );
}
