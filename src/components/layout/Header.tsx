"use client";

import Link from "next/link";
import { Button } from "react-bootstrap";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export function Header({ onMenuClick, sidebarOpen }: HeaderProps) {
  return (
    <header className="app-header">
      <button
        aria-expanded={sidebarOpen}
        aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
        className="mobile-menu-button"
        onClick={onMenuClick}
        type="button"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <div className="header-title">
        <span>Fase 1</span>
        <strong>Fundacao visual navegavel</strong>
      </div>
      <div className="header-actions">
        <Link href="/acesso-negado">Acesso negado</Link>
        <Button className="starter-button" size="sm" href="/login">
          Trocar usuario
        </Button>
      </div>
    </header>
  );
}
