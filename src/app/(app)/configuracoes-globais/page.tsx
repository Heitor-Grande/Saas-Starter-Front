"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Alert, Button, Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormInput } from "@/components/ui/FormInput";
import { Loading } from "@/components/ui/Loading";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { apiRequest } from "@/util/apiRequest";
import { getTokenCookie } from "@/util/getTokenCookie";

type SettingsTab = "general" | "smtp";
interface Settings {
  nome_aplicacao: string;
  email_suporte: string | null;
  smtp_servidor: string | null;
  smtp_porta: number | null;
  smtp_usuario: string | null;
  smtp_remetente_nome: string | null;
  smtp_remetente_email: string | null;
}
interface ApiResponse<T> {
  message?: string;
  data?: T;
}
const tabLabels: Record<SettingsTab, string> = {
  general: "Geral",
  smtp: "SMTP",
};

export default function GlobalSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [smtpPassword, setSmtpPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      setIsLoading(true);
      setLoadError("");
      try {
        const token = getTokenCookie();
        if (!token)
          throw new Error(
            "Sua sessão não foi encontrada. Entre novamente na conta.",
          );
        const response = await apiRequest({
          path: "/configuracao-global",
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = (await response
          .json()
          .catch(() => null)) as ApiResponse<Settings> | null;
        if (!response.ok || !result?.data)
          throw new Error(
            result?.message ||
              "Não foi possível carregar as configurações globais.",
          );
        if (active) setSettings(result.data);
      } catch (error) {
        if (active)
          setLoadError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar as configurações globais.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void loadSettings();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  function update<K extends keyof Settings>(field: K, value: Settings[K]) {
    setSettings((current) =>
      current ? { ...current, [field]: value } : current,
    );
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setFormError("");
    try {
      const token = getTokenCookie();
      if (!token)
        throw new Error(
          "Sua sessão não foi encontrada. Entre novamente na conta.",
        );
      const response = await apiRequest({
        path: "/configuracao-global",
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: { ...settings, smtp_senha: smtpPassword || null },
      });
      const result = (await response
        .json()
        .catch(() => null)) as ApiResponse<Settings> | null;
      if (!response.ok || !result?.data)
        throw new Error(
          result?.message ||
            "Não foi possível salvar as configurações globais.",
        );
      setSettings(result.data);
      setSmtpPassword("");
      setSuccess("Configurações globais atualizadas com sucesso.");
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar as configurações globais.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading)
    return (
      <div className="audit-page">
        <Loading
          label="Carregando configurações"
          description="Consultando os parâmetros globais."
        />
      </div>
    );
  if (loadError || !settings)
    return (
      <div className="audit-page">
        <Alert variant="danger">
          <p>{loadError || "Configuração global indisponível."}</p>
          <Button
            variant="outline-danger"
            onClick={() => setReloadKey((value) => value + 1)}
          >
            Tentar novamente
          </Button>
        </Alert>
      </div>
    );

  return (
    <div className="audit-page">
      <SectionHeader
        eyebrow="Sistema"
        title="Configurações Globais"
        description="Defina parâmetros compartilhados por toda a aplicação e suas organizações."
      />
      <Tab.Container
        activeKey={activeTab}
        mountOnEnter
        unmountOnExit
        onSelect={(key) =>
          key && key in tabLabels && setActiveTab(key as SettingsTab)
        }
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
              <Tab.Content>
                <Tab.Pane eventKey="general">
                  <div className="global-settings-section-heading">
                    <h2>Informações da aplicação</h2>
                    <p>
                      Parâmetros usados como padrão em todas as organizações.
                    </p>
                  </div>
                  <Row className="g-3">
                    <Col md={6}>
                      <FormInput
                        id="applicationName"
                        label="Nome da aplicação"
                        value={settings.nome_aplicacao}
                        maxLength={100}
                        onChange={(event) =>
                          update("nome_aplicacao", event.target.value)
                        }
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput
                        id="supportEmail"
                        label="E-mail de suporte"
                        type="email"
                        value={settings.email_suporte ?? ""}
                        maxLength={255}
                        onChange={(event) =>
                          update("email_suporte", event.target.value || null)
                        }
                      />
                    </Col>
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="smtp">
                  <div className="global-settings-section-heading">
                    <h2>Servidor de e-mail</h2>
                    <p>
                      Configure o servidor usado pela aplicação para enviar
                      mensagens.
                    </p>
                  </div>
                  <Row className="g-3">
                    <Col md={8}>
                      <FormInput
                        id="smtpServer"
                        label="Servidor SMTP"
                        value={settings.smtp_servidor ?? ""}
                        maxLength={255}
                        onChange={(event) =>
                          update("smtp_servidor", event.target.value || null)
                        }
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        id="smtpPort"
                        label="Porta"
                        type="number"
                        value={settings.smtp_porta ?? ""}
                        onChange={(event) =>
                          update(
                            "smtp_porta",
                            event.target.value
                              ? Number(event.target.value)
                              : null,
                          )
                        }
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput
                        id="smtpUsername"
                        label="Usuário"
                        value={settings.smtp_usuario ?? ""}
                        autoComplete="off"
                        onChange={(event) =>
                          update("smtp_usuario", event.target.value || null)
                        }
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput
                        id="smtpPassword"
                        label="Nova senha"
                        type="password"
                        value={smtpPassword}
                        placeholder="Deixe em branco para manter a atual"
                        autoComplete="new-password"
                        onChange={(event) =>
                          setSmtpPassword(event.target.value)
                        }
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput
                        id="senderName"
                        label="Nome do remetente"
                        value={settings.smtp_remetente_nome ?? ""}
                        maxLength={100}
                        onChange={(event) =>
                          update(
                            "smtp_remetente_nome",
                            event.target.value || null,
                          )
                        }
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput
                        id="senderEmail"
                        label="E-mail do remetente"
                        type="email"
                        value={settings.smtp_remetente_email ?? ""}
                        maxLength={255}
                        onChange={(event) =>
                          update(
                            "smtp_remetente_email",
                            event.target.value || null,
                          )
                        }
                      />
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
            <div className="global-settings-actions">
              <span>Alterações aplicadas globalmente.</span>
              <Button
                type="submit"
                className="starter-button"
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar configurações"}
              </Button>
            </div>
          </Form>
        </Card>
      </Tab.Container>
      <FeedbackState
        show={Boolean(formError)}
        variant="error"
        title="Não foi possível salvar"
        description={formError}
        onClose={() => setFormError("")}
      />
      <FeedbackState
        show={Boolean(success)}
        variant="success"
        title="Configurações salvas"
        description={success}
        onClose={() => setSuccess("")}
      />
    </div>
  );
}
