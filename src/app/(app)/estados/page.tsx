"use client";

import { Col, Row } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function StatesPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Estados"
        title="Loading, vazio, erro e sucesso"
        description="Padroes visuais consistentes para fluxos comuns de produtos SaaS."
      />
      <Row className="g-3">
        <Col md={6}>
          <FeedbackState
            description="Carregando informacoes ficticias do workspace."
            title="Carregando dados"
            variant="loading"
          />
        </Col>
        <Col md={6}>
          <FeedbackState
            actionLabel="Tentar novamente"
            description="Nao foi possivel simular a operacao neste momento."
            title="Algo saiu do esperado"
            variant="error"
          />
        </Col>
        <Col md={6}>
          <FeedbackState
            actionLabel="Criar primeiro item"
            description="Quando nao houver registros, a interface orienta o proximo passo."
            title="Nenhum item encontrado"
            variant="empty"
          />
        </Col>
        <Col md={6}>
          <FeedbackState
            description="Operacao visual concluida sem persistencia real."
            title="Tudo certo"
            variant="success"
          />
        </Col>
      </Row>
    </>
  );
}
