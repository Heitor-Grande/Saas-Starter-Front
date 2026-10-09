"use client";

import { useState, type FormEvent } from "react";
import { Button, Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormCheckbox } from "@/components/ui/FormCheckbox";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { organizationsWithMembers } from "@/mocks/organizationMembers";
import { initialOrganizationSettings, type OrganizationSettings } from "@/mocks/organizationSettings";

type EditableField = "name" | "cnpj" | "address" | "responsibleUserId";
type SettingsErrors = Partial<Record<EditableField, string>>;
const members = organizationsWithMembers.find((organization) => organization.id === "ORG-001")?.members ?? [];

export default function OrganizationSettingsPage() {
  const [settings, setSettings] = useState<OrganizationSettings>(initialOrganizationSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [errors, setErrors] = useState<SettingsErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  function updateField(field: EditableField, value: string) {
    setSettings((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: SettingsErrors = {};
    if (!settings.name.trim()) nextErrors.name = "Informe o nome da organização.";
    if (!settings.cnpj.trim()) nextErrors.cnpj = "Informe o CNPJ.";
    if (!settings.address.trim()) nextErrors.address = "Informe o endereço.";
    if (!members.some((member) => member.id === settings.responsibleUserId)) {
      nextErrors.responsibleUserId = "Selecione um usuário responsável.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setActiveTab("general");
      return;
    }
    setSettings((current) => ({
      ...current,
      name: current.name.trim(),
      cnpj: current.cnpj.trim(),
      address: current.address.trim()
    }));
    setShowSuccess(true);
  }

  return (
    <div className="audit-page organization-settings-page">
      <SectionHeader
        eyebrow="Minha Organização"
        title="Organização"
        description="Gerencie os dados cadastrais e as configurações da sua organização."
      />
      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key ?? "general")}>
        <Card className="app-card global-settings-card organization-settings-card">
          <div className="global-settings-tabs-wrap">
            <Nav variant="tabs" className="global-settings-tabs">
              <Nav.Item><Nav.Link eventKey="general">Dados gerais</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="rules">Regras</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="support">Suporte</Nav.Link></Nav.Item>
            </Nav>
          </div>
          <Form onSubmit={saveSettings} noValidate>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="general">
                  <div className="global-settings-section-heading">
                    <h2>Dados da organização</h2>
                  </div>
                  <Row className="g-3">
                    <Col md={6}>
                      <FormInput
                        id="organizationName" label="Nome da organização" value={settings.name}
                        onChange={(event) => updateField("name", event.target.value)} error={errors.name} required
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput
                        id="organizationCnpj" label="CNPJ" value={settings.cnpj} maxLength={18}
                        placeholder="00.000.000/0000-00"
                        onChange={(event) => updateField("cnpj", event.target.value)} error={errors.cnpj} required
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput id="organizationPlan" label="Plano assinado" value={settings.plan} readOnly />
                    </Col>
                    <Col md={6}>
                      <FormSelect
                        id="organizationResponsible" label="Usuário responsável" value={settings.responsibleUserId}
                        onChange={(event) => updateField("responsibleUserId", event.target.value)}
                        error={errors.responsibleUserId} required
                      >
                        <option value="">Selecione um usuário</option>
                        {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
                      </FormSelect>
                    </Col>
                    <Col xs={12}>
                      <FormInput
                        id="organizationAddress" label="Endereço" as="textarea" rows={2} value={settings.address}
                        onChange={(event) => updateField("address", event.target.value)} error={errors.address} required
                      />
                    </Col>
                  </Row>
                  <div className="global-settings-divider" />
                  <FormCheckbox
                    id="organizationActive" label="Organização ativa" type="switch" checked={settings.active}
                    onChange={(event) => setSettings((current) => ({ ...current, active: event.target.checked }))}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="rules" />
                <Tab.Pane eventKey="support" />
              </Tab.Content>
            </Card.Body>
            <div className="global-settings-actions">
              <span>Configurações da minha organização.</span>
              <Button type="submit" className="starter-button" disabled={activeTab !== "general"}>
                Salvar configurações
              </Button>
            </div>
          </Form>
        </Card>
      </Tab.Container>
      <FeedbackState
        show={showSuccess} onClose={() => setShowSuccess(false)} variant="success"
        title="Configurações salvas"
        description="Os dados da organização foram atualizados com sucesso."
      />
    </div>
  );
}
