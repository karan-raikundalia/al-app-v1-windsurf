
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
import MonteCarloAnalysis from "./pages/MonteCarloAnalysis";
import ProformaView from "./pages/ProformaView";
import LCOECalculator from "./pages/LCOECalculator";
import MultiMetricAnalysis from "./pages/MultiMetricAnalysis";
import InputsPage from "./pages/InputsPage";

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
          <Route path="/analysis/monte-carlo" element={<MonteCarloAnalysis />} />
          <Route path="/analysis/multi-metric" element={<MultiMetricAnalysis />} />
          
          {/* Risk Tracker Routes */}
          <Route path="/risk-tracker" element={<Navigate to="/risk-tracker/assumption-validity" replace />} />
          <Route path="/risk-tracker/assumption-validity" element={<RiskTracker defaultTab="assumption-validity" />} />
          <Route path="/risk-tracker/validation" element={<RiskTracker defaultTab="validation" />} />
          <Route path="/risk-tracker/risk-register" element={<RiskTracker defaultTab="risk-register" />} />
          <Route path="/risk-tracker/documents" element={<RiskTracker defaultTab="documents" />} />
          
          {/* Proforma View */}
          <Route path="/proforma" element={<ProformaView />} />
          
          {/* LCOE Calculator */}
          <Route path="/lcoe-calculator" element={<LCOECalculator />} />
          
          {/* Inputs Page */}
          <Route path="/inputs" element={<InputsPage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
