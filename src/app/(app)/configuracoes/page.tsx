"use client";

import { Card, Form } from "react-bootstrap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { settingsOptions } from "@/mocks/profile";

export default function SettingsPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Configuracoes"
        title="Preferencias reutilizaveis"
        description="Controles visuais que podem servir como base para preferencias reais em fases futuras."
      />
      <Card className="app-card">
        <Card.Body>
          <div className="settings-list">
            {settingsOptions.map((option, index) => (
              <div className="settings-item" key={option}>
                <div>
                  <strong>{option}</strong>
                  <span>Preferencia demonstrativa do template.</span>
                </div>
                <Form.Check
                  aria-label={option}
                  defaultChecked={index < 2}
                  type="switch"
                />
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
