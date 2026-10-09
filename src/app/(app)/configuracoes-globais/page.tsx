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
    setFeedback(`Configuracoes de ${tabLabels[activeTab]} salvas na demonstracao.`);
  }

  function testSmtpConnection() {
    setFeedback("Conexao SMTP simulada com sucesso. Nenhum dado foi enviado.");
  }

  return (
    <>
      <SectionHeader
        eyebrow="Sistema"
        title="Configuracoes Globais"
        description="Defina parametros compartilhados por toda a aplicacao e suas organizacoes."
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
                    <h2>Informacoes da aplicacao</h2>
                    <p>Parametros usados como padrao em todas as organizacoes.</p>
                  </div>
                  <Row className="g-3">
                    <Col md={6}>
                      <FormInput id="applicationName" label="Nome da aplicacao" defaultValue="SaaS Starter" required />
                    </Col>
                    <Col md={6}>
                      <FormInput id="supportEmail" label="Email de suporte" type="email" defaultValue="suporte@example.com" required />
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="smtp">
                  <div className="global-settings-section-heading">
                    <h2>Servidor de email</h2>
                    <p>Use somente dados ficticios nesta demonstracao. Nenhuma mensagem sera enviada.</p>
                  </div>
                  <Row className="g-3">
                    <Col md={8}>
                      <FormInput id="smtpServer" label="Servidor SMTP" defaultValue="smtp.example.com" required />
                    </Col>
                    <Col md={4}>
                      <FormInput id="smtpPort" label="Porta" type="text" defaultValue="587" required />
                    </Col>
                    <Col md={6}>
                      <FormInput id="smtpUsername" label="Usuario" defaultValue="mailer@example.com" autoComplete="off" />
                    </Col>
                    <Col md={6}>
                      <FormInput id="smtpPassword" label="Senha" type="password" placeholder="Nao armazenada nesta demonstracao" autoComplete="new-password" />
                    </Col>
                    <Col md={6}>
                      <FormInput id="senderName" label="Nome do remetente" defaultValue="SaaS Starter" />
                    </Col>
                    <Col md={6}>
                      <FormInput id="senderEmail" label="Email do remetente" type="email" defaultValue="no-reply@example.com" />
                    </Col>
                  </Row>
                  <div className="global-settings-divider" />
                  <div className="global-settings-switches">
                    <FormCheckbox
                      id="smtpTls"
                      label="Usar conexao segura (TLS)"
                      description="Aplicar criptografia durante a comunicacao com o servidor SMTP."
                      type="switch"
                      defaultChecked
                    />
                  </div>
                  <Button type="button" variant="light" className="global-test-button" onClick={testSmtpConnection}>
                    Testar conexao
                  </Button>
                </Tab.Pane>

              </Tab.Content>
            </Card.Body>

            <div className="global-settings-actions">
              <span>Alteracoes aplicadas globalmente.</span>
              <Button type="submit" className="starter-button">Salvar configuracoes</Button>
            </div>
          </Form>
        </Card>
      </Tab.Container>
    </>
  );
}
