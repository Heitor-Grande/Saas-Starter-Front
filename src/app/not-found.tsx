"use client";

import { Button } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";

export default function NotFoundPage() {
  return (
    <main className="center-page">
      <FeedbackState
        description="A rota solicitada nao existe, mas a navegacao do template continua disponivel."
        title="Pagina nao encontrada"
        variant="empty"
      />
      <Button className="starter-button mt-3" href="/">
        Voltar ao inicio
      </Button>
    </main>
  );
}
