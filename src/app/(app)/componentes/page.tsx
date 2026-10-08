"use client";

import { Alert, Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ComponentsPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Biblioteca"
        title="Componentes reutilizaveis"
        description="Exemplos visuais para cards, formularios, botoes, tabelas e mensagens do template."
      />
      <Row className="g-3">
        <Col lg={6}>
          <Card className="app-card h-100">
            <Card.Body>
              <div className="card-heading">
                <h2>Formulario base</h2>
              </div>
              <Form className="demo-form">
                <Form.Group controlId="componentName">
                  <Form.Label>Nome do registro</Form.Label>
                  <Form.Control placeholder="Exemplo de campo" />
                </Form.Group>
                <Form.Group controlId="componentSelect">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue="active">
                    <option value="active">Ativo</option>
                    <option value="draft">Rascunho</option>
                  </Form.Select>
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button className="starter-button">Salvar</Button>
                  <Button className="starter-button-secondary">Cancelar</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="app-card h-100">
            <Card.Body>
              <div className="card-heading">
                <h2>Tabela compacta</h2>
              </div>
              <Table responsive className="app-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Tipo</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Card</td>
                    <td>UI</td>
                    <td>Pronto</td>
                  </tr>
                  <tr>
                    <td>Sidebar</td>
                    <td>Layout</td>
                    <td>Pronto</td>
                  </tr>
                </tbody>
              </Table>
              <Alert variant="success">Mensagem de sucesso padronizada.</Alert>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12}>
          <FeedbackState
            actionLabel="Executar acao"
            description="Um estado reutilizavel para fluxos sem dados, falhas ou confirmacoes."
            title="Estado demonstrativo"
            variant="success"
          />
        </Col>
      </Row>
    </>
  );
}
