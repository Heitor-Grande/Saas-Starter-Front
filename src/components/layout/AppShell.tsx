"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleCloseSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className={sidebarOpen ? "app-shell sidebar-mobile-open" : "app-shell"}>
      <button
        aria-label="Fechar menu"
        className="sidebar-backdrop"
        onClick={handleCloseSidebar}
        type="button"
      />
      <Sidebar onNavigate={handleCloseSidebar} />
      <div className="app-main">
        <Header
          onMenuClick={() => setSidebarOpen((currentValue) => !currentValue)}
          sidebarOpen={sidebarOpen}
        />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
