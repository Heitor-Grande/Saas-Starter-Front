"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import { FormCheckbox } from "@/components/ui/FormCheckbox";
import { FormInput } from "@/components/ui/FormInput";
import { SectionHeader } from "@/components/ui/SectionHeader";

type SettingsTab = "general" | "smtp";

const tabLabels: Record<SettingsTab, string> = {
  general: "Geral",
  smtp: "SMTP"
};

export default function GlobalSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [feedback, setFeedback] = useState("");

  function handleTabChange(key: string | null) {
    if (key && key in tabLabels) {
      setActiveTab(key as SettingsTab);
      setFeedback("");
    }
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(`Configurações de ${tabLabels[activeTab]} salvas na demonstração.`);
  }

  function testSmtpConnection() {
    setFeedback("Conexão SMTP simulada com sucesso. Nenhum dado foi enviado.");
  }

  return (
    <>
      <SectionHeader
        eyebrow="Sistema"
        title="Configurações Globais"
        description="Defina parâmetros compartilhados por toda a aplicação e suas organizações."
      />

      <Tab.Container
        activeKey={activeTab}
        mountOnEnter
        unmountOnExit
        onSelect={handleTabChange}
      >
        <Card className="app-card global-settings-card">
          <div className="global-settings-tabs-wrap">
            <Nav variant="tabs" className="global-settings-tabs">
              {Object.entries(tabLabels).map(([key, label]) => (
                <Nav.Item key={key}>
                  <Nav.Link eventKey={key}>{label}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </div>

          <Form onSubmit={handleSave}>
            <Card.Body>
              {feedback ? (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setFeedback("")}
                  className="global-settings-feedback"
                >
                  {feedback}
                </Alert>
              ) : null}

              <Tab.Content>
                <Tab.Pane eventKey="general">
                  <div className="global-settings-section-heading">
                    <h2>Informações da aplicação</h2>
                    <p>Parâmetros usados como padrão em todas as organizações.</p>
                  </div>
                  <Row className="g-3">
                    <Col md={6}>
                      <FormInput id="applicationName" label="Nome da aplicação" defaultValue="SaaS Starter" required />
                    </Col>
                    <Col md={6}>
                      <FormInput id="supportEmail" label="E-mail de suporte" type="email" defaultValue="suporte@example.com" required />
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="smtp">
                  <div className="global-settings-section-heading">
                    <h2>Servidor de e-mail</h2>
                    <p>Use somente dados fictícios nesta demonstração. Nenhuma mensagem será enviada.</p>
                  </div>
                  <Row className="g-3">
                    <Col md={8}>
                      <FormInput id="smtpServer" label="Servidor SMTP" defaultValue="smtp.example.com" required />
                    </Col>
                    <Col md={4}>
                      <FormInput id="smtpPort" label="Porta" type="text" defaultValue="587" required />
                    </Col>
                    <Col md={6}>
                      <FormInput id="smtpUsername" label="Usuário" defaultValue="mailer@example.com" autoComplete="off" />
                    </Col>
                    <Col md={6}>
                      <FormInput id="smtpPassword" label="Senha" type="password" placeholder="Não armazenada nesta demonstração" autoComplete="new-password" />
                    </Col>
                    <Col md={6}>
                      <FormInput id="senderName" label="Nome do remetente" defaultValue="SaaS Starter" />
                    </Col>
                    <Col md={6}>
                      <FormInput id="senderEmail" label="E-mail do remetente" type="email" defaultValue="no-reply@example.com" />
                    </Col>
                  </Row>
                  <div className="global-settings-divider" />
                  <div className="global-settings-switches">
                    <FormCheckbox
                      id="smtpTls"
                      label="Usar conexão segura (TLS)"
                      description="Aplicar criptografia durante a comunicação com o servidor SMTP."
                      type="switch"
                      defaultChecked
                    />
                  </div>
                  <Button type="button" variant="light" className="global-test-button" onClick={testSmtpConnection}>
                    Testar conexão
                  </Button>
                </Tab.Pane>

              </Tab.Content>
            </Card.Body>

            <div className="global-settings-actions">
              <span>Alterações aplicadas globalmente.</span>
              <Button type="submit" className="starter-button">Salvar configurações</Button>
            </div>
          </Form>
        </Card>
      </Tab.Container>
    </>
  );
}
