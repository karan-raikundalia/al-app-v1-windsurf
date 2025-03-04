
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart4, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Home, 
  MenuSquare, 
  Sliders 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const location = useLocation();
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(
    location.pathname.includes("/analysis")
  );

  return (
    <aside className="w-64 h-full bg-sidebar shrink-0 border-r border-sidebar-border overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 text-sidebar-foreground">
          <MenuSquare className="h-6 w-6" />
          <h1 className="text-xl font-semibold tracking-tight">Enterprise Analytics</h1>
        </div>
      </div>
      
      <nav className="px-3 py-2">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => cn("nav-link", isActive && "active")}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/scenarios" 
              className={({ isActive }) => cn("nav-link", isActive && "active")}
            >
              <FileText className="h-4 w-4" />
              <span>Scenarios</span>
            </NavLink>
          </li>

          <li>
            <div className="flex flex-col">
              <button
                onClick={() => setIsAnalysisOpen(!isAnalysisOpen)}
                className={cn(
                  "nav-link justify-between group",
                  location.pathname.includes("/analysis") && "active"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart4 className="h-4 w-4" />
                  <span>Analysis</span>
                </div>
                {isAnalysisOpen ? (
                  <ChevronDown className="h-4 w-4 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 transition-transform" />
                )}
              </button>
              
              {isAnalysisOpen && (
                <div className="mt-1 pl-2 space-y-1 animate-slide-in">
                  <NavLink
                    to="/analysis/sensitivity"
                    className={({ isActive }) => cn("sub-nav-link", isActive && "active")}
                  >
                    <Sliders className="h-4 w-4" />
                    <span>Sensitivity Analysis</span>
                  </NavLink>
                </div>
              )}
            </div>
          </li>

          <li>
            <NavLink 
              to="/proforma" 
              className={({ isActive }) => cn("nav-link", isActive && "active")}
            >
              <FileText className="h-4 w-4" />
              <span>Pro Forma</span>
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/inputs" 
              className={({ isActive }) => cn("nav-link", isActive && "active")}
            >
              <MenuSquare className="h-4 w-4" />
              <span>Inputs</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
