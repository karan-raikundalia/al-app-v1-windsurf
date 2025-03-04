
import React from "react";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container py-6 h-full animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
