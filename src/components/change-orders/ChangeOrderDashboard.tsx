
import { useState } from "react";
import { MonthlyChangeOrderChart } from "./MonthlyChangeOrderChart";
import { ChangeOrderSummaryCards } from "./ChangeOrderSummaryCards";
import { SeverityDistributionChart } from "./SeverityDistributionChart";
import { TopCausesTable } from "./TopCausesTable";
import { StatusTracker } from "./StatusTracker";
import { DataPanel } from "@/components/ui/DataPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Share, Download } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { mockChangeOrders, mockChangeOrderSummary } from "./mockData";
import { ProjectPhase, ChangeOrderSeverity } from "@/models/changeOrder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription
} from "@/components/ui/alert-dialog";
import { ChangeOrderDetailView } from "./ChangeOrderDetailView";
import { ChangeOrderTable } from "./ChangeOrderTable";
import { ProjectMetricsGrid } from "./ProjectMetricsGrid";

export function ChangeOrderDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [phaseFilter, setPhaseFilter] = useState<ProjectPhase | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<ChangeOrderSeverity | "all">("all");
  const [originatorFilter, setOriginatorFilter] = useState<string>("all");
  const [timelineValue, setTimelineValue] = useState([11]); // Default to latest month
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedChangeOrder, setSelectedChangeOrder] = useState<string | null>(null);

  // Get unique originators for filter
  const originators = ["all", ...new Set(mockChangeOrders.map(order => order.originator))];

  // Filter change orders
  const filteredChangeOrders = mockChangeOrders.filter(order => {
    if (phaseFilter !== "all" && order.projectPhase !== phaseFilter) return false;
    if (severityFilter !== "all" && order.severity !== severityFilter) return false;
    if (originatorFilter !== "all" && order.originator !== originatorFilter) return false;
    return true;
  });

  // Handle click on a change order in any chart or table
  const handleChangeOrderClick = (changeOrderId: string) => {
    setSelectedChangeOrder(changeOrderId);
  };

  // Close detail view
  const handleCloseDetailView = () => {
    setSelectedChangeOrder(null);
  };

  const handleShareView = () => {
    setShowShareDialog(true);
  };

  const handleExport = () => {
    alert("Exporting change order data...");
    // In a real implementation, this would generate and download a CSV or Excel file
  };

  const selectedChangeOrderData = selectedChangeOrder
    ? mockChangeOrders.find(order => order.id === selectedChangeOrder)
    : null;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">EPC Design Change Orders</h1>
        <div className="flex gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="list">Change Order List</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={handleShareView}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <DataPanel title="Filters" className="h-full">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Phase</label>
                <Select
                  value={phaseFilter}
                  onValueChange={(value) => setPhaseFilter(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Phases</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="procurement">Procurement</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="commissioning">Commissioning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Impact Level</label>
                <Select
                  value={severityFilter}
                  onValueChange={(value) => setSeverityFilter(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Originator</label>
                <Select
                  value={originatorFilter}
                  onValueChange={setOriginatorFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select originator" />
                  </SelectTrigger>
                  <SelectContent>
                    {originators.map((originator) => (
                      <SelectItem key={originator} value={originator}>
                        {originator === "all" ? "All Originators" : originator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Historical Timeline
                </label>
                <Slider
                  value={timelineValue}
                  onValueChange={setTimelineValue}
                  max={11}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{mockChangeOrderSummary.monthlyData[0].month}</span>
                  <span>{mockChangeOrderSummary.monthlyData[timelineValue[0]].month}</span>
                </div>
              </div>
            </div>
          </DataPanel>
        </div>

        <div className="col-span-2">
          <ChangeOrderSummaryCards summary={mockChangeOrderSummary} />
        </div>
      </div>

      <Tabs value={activeTab}>
        <TabsContent value="dashboard" className="space-y-6 mt-0">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <DataPanel title="Monthly Change Orders & Cumulative Cost Impact">
                <MonthlyChangeOrderChart 
                  data={mockChangeOrderSummary.monthlyData} 
                  timelineValue={timelineValue[0]} 
                  forecastedCount={mockChangeOrderSummary.forecastedCount}
                  budgetAmount={mockChangeOrderSummary.budgetAmount}
                  onBarClick={handleChangeOrderClick}
                />
              </DataPanel>
            </div>

            <div className="col-span-4">
              <DataPanel title="Severity Distribution">
                <SeverityDistributionChart 
                  data={mockChangeOrderSummary.severityDistribution} 
                  onSliceClick={(severity) => setSeverityFilter(severity)}
                />
              </DataPanel>
            </div>

            <div className="col-span-4">
              <DataPanel title="Top 5 Change Order Causes">
                <TopCausesTable 
                  causes={mockChangeOrderSummary.topCauses} 
                  onCauseClick={(cause) => console.log(`Filter by cause: ${cause}`)}
                />
              </DataPanel>
            </div>

            <div className="col-span-4">
              <DataPanel title="Approval Status Tracker">
                <StatusTracker 
                  statuses={mockChangeOrderSummary.statusDistribution}
                  averageApprovalDays={mockChangeOrderSummary.averageApprovalDays}
                />
              </DataPanel>
            </div>
            
            {/* New Project Metrics Section */}
            <div className="col-span-12">
              <DataPanel title="Project Performance Metrics">
                <ProjectMetricsGrid />
              </DataPanel>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <DataPanel>
            <ChangeOrderTable 
              changeOrders={filteredChangeOrders} 
              onRowClick={handleChangeOrderClick}
            />
          </DataPanel>
        </TabsContent>
      </Tabs>

      {selectedChangeOrderData && (
        <ChangeOrderDetailView 
          changeOrder={selectedChangeOrderData} 
          isOpen={!!selectedChangeOrder}
          onClose={handleCloseDetailView}
        />
      )}

      <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Share this view</AlertDialogTitle>
          <AlertDialogDescription>
            Share this filtered view with project stakeholders.
            <div className="mt-4 p-2 bg-muted rounded-md text-sm font-mono break-all">
              {`${window.location.origin}/change-orders?phase=${phaseFilter}&severity=${severityFilter}&originator=${originatorFilter}&timeline=${timelineValue[0]}`}
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
            <Button variant="default" onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/change-orders?phase=${phaseFilter}&severity=${severityFilter}&originator=${originatorFilter}&timeline=${timelineValue[0]}`
              );
              setShowShareDialog(false);
            }}>
              Copy Link
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
