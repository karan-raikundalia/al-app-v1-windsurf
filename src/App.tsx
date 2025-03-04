
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RiskTracker from "./pages/RiskTracker";
import { SensitivityAnalysis } from "./components/analysis/SensitivityAnalysis";
import { AppLayout } from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analysis/sensitivity" element={<Index />} />
          <Route path="/risk-tracker" element={<RiskTracker />} />
          
          {/* Placeholder routes for other sections */}
          <Route 
            path="/dashboard" 
            element={
              <AppLayout>
                <div className="flex items-center justify-center h-[600px]">
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold tracking-tight mb-4">Dashboard</h1>
                    <p className="text-muted-foreground">This page is under development.</p>
                  </div>
                </div>
              </AppLayout>
            } 
          />
          
          <Route 
            path="/scenarios" 
            element={
              <AppLayout>
                <div className="flex items-center justify-center h-[600px]">
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold tracking-tight mb-4">Scenarios</h1>
                    <p className="text-muted-foreground">This page is under development.</p>
                  </div>
                </div>
              </AppLayout>
            } 
          />
          
          <Route 
            path="/proforma" 
            element={
              <AppLayout>
                <div className="flex items-center justify-center h-[600px]">
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold tracking-tight mb-4">Pro Forma</h1>
                    <p className="text-muted-foreground">This page is under development.</p>
                  </div>
                </div>
              </AppLayout>
            } 
          />
          
          <Route 
            path="/inputs" 
            element={
              <AppLayout>
                <div className="flex items-center justify-center h-[600px]">
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold tracking-tight mb-4">Inputs</h1>
                    <p className="text-muted-foreground">This page is under development.</p>
                  </div>
                </div>
              </AppLayout>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
