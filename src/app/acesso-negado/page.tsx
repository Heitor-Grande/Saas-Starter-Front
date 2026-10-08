"use client";

import { Button } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";

export default function AccessDeniedPage() {
  return (
    <main className="center-page">
      <FeedbackState
        description="Esta tela demonstra como o template comunica uma restricao sem implementar autorizacao real."
        title="Acesso negado"
        variant="error"
      />
      <Button className="starter-button mt-3" href="/dashboard">
        Voltar ao dashboard
      </Button>
    </main>
  );
}
