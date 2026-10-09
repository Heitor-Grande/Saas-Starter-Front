"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
        <button
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
          className="mobile-menu-button app-shell-menu-button"
          onClick={() => setSidebarOpen((currentValue) => !currentValue)}
          type="button"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
