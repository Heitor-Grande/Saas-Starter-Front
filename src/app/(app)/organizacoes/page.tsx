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

type EditableField = Exclude<keyof OrganizationSettings, "active" | "plan">;
type SettingsErrors = Partial<Record<EditableField, string>>;
const members = organizationsWithMembers.find((organization) => organization.id === "ORG-001")?.members ?? [];
const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

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
    if (!settings.postalCode.trim()) nextErrors.postalCode = "Informe o CEP.";
    if (!settings.street.trim()) nextErrors.street = "Informe o logradouro.";
    if (!settings.addressNumber.trim()) nextErrors.addressNumber = "Informe o número.";
    if (!settings.neighborhood.trim()) nextErrors.neighborhood = "Informe o bairro.";
    if (!settings.city.trim()) nextErrors.city = "Informe a cidade.";
    if (!settings.state) nextErrors.state = "Selecione o estado.";
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
      postalCode: current.postalCode.trim(),
      street: current.street.trim(),
      addressNumber: current.addressNumber.trim(),
      complement: current.complement.trim(),
      neighborhood: current.neighborhood.trim(),
      city: current.city.trim()
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
                    <Col md={4}>
                      <FormInput id="organizationPostalCode" label="CEP" value={settings.postalCode} maxLength={9}
                        placeholder="00000-000" onChange={(event) => updateField("postalCode", event.target.value)}
                        error={errors.postalCode} required />
                    </Col>
                    <Col md={8}>
                      <FormInput id="organizationStreet" label="Logradouro" value={settings.street}
                        onChange={(event) => updateField("street", event.target.value)}
                        error={errors.street} required />
                    </Col>
                    <Col md={3}>
                      <FormInput id="organizationAddressNumber" label="Número" value={settings.addressNumber}
                        onChange={(event) => updateField("addressNumber", event.target.value)}
                        error={errors.addressNumber} required />
                    </Col>
                    <Col md={5}>
                      <FormInput id="organizationComplement" label="Complemento" value={settings.complement}
                        onChange={(event) => updateField("complement", event.target.value)} />
                    </Col>
                    <Col md={4}>
                      <FormInput id="organizationNeighborhood" label="Bairro" value={settings.neighborhood}
                        onChange={(event) => updateField("neighborhood", event.target.value)}
                        error={errors.neighborhood} required />
                    </Col>
                    <Col md={8}>
                      <FormInput id="organizationCity" label="Cidade" value={settings.city}
                        onChange={(event) => updateField("city", event.target.value)}
                        error={errors.city} required />
                    </Col>
                    <Col md={4}>
                      <FormSelect id="organizationState" label="Estado" value={settings.state}
                        onChange={(event) => updateField("state", event.target.value)}
                        error={errors.state} required>
                        <option value="">Selecione</option>
                        {states.map((state) => <option key={state} value={state}>{state}</option>)}
                      </FormSelect>
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
