"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Alert, Button, Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { Loading } from "@/components/ui/Loading";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { apiRequest } from "@/util/apiRequest";
import { getTokenCookie } from "@/util/getTokenCookie";
import { mascararCep, mascararCnpj } from "@/util/mascaras";

type Settings = {
  name: string; cnpj: string; planId: string; responsibleUserId: string;
  postalCode: string; street: string; addressNumber: string; complement: string;
  neighborhood: string; city: string; state: string;
};
type Field = keyof Settings;
type Errors = Partial<Record<Field, string>>;
type Option = { id: number; nome: string };
type OrganizationResponse = {
  id: number; nome: string; cnpj: string; planoid: number; plano: string;
  usuarioresponsavelid: number | null; cep: string; logradouro: string;
  numero: string; complemento: string | null; bairro: string; cidade: string;
  estado: string; usuarios: Option[]; planos: Option[];
};
type ApiResponse<T> = { message?: string; data?: T };

const emptySettings: Settings = {
  name: "", cnpj: "", planId: "", responsibleUserId: "", postalCode: "",
  street: "", addressNumber: "", complement: "", neighborhood: "", city: "", state: "",
};
const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

function mapOrganization(data: OrganizationResponse): Settings {
  return {
    name: data.nome,
    cnpj: mascararCnpj(data.cnpj),
    planId: String(data.planoid),
    responsibleUserId: data.usuarioresponsavelid ? String(data.usuarioresponsavelid) : "",
    postalCode: mascararCep(data.cep),
    street: data.logradouro,
    addressNumber: data.numero,
    complement: data.complemento ?? "",
    neighborhood: data.bairro,
    city: data.cidade,
    state: data.estado,
  };
}

export default function OrganizationSettingsPage() {
  const [settings, setSettings] = useState<Settings>(emptySettings);
  const [users, setUsers] = useState<Option[]>([]);
  const [plans, setPlans] = useState<Option[]>([]);
  const [activeTab, setActiveTab] = useState("general");
  const [errors, setErrors] = useState<Errors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadOrganization() {
      setIsLoading(true);
      setLoadError("");
      try {
        const token = getTokenCookie();
        if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
        const response = await apiRequest({
          path: "/minha-organizacao", method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = (await response.json().catch(() => null)) as ApiResponse<OrganizationResponse> | null;
        if (!response.ok || !result?.data) {
          throw new Error(result?.message || "Não foi possível carregar a organização.");
        }
        if (active) {
          setSettings(mapOrganization(result.data));
          setUsers(result.data.usuarios);
          setPlans(result.data.planos);
        }
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : "Não foi possível carregar a organização.");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void loadOrganization();
    return () => { active = false; };
  }, [reloadKey]);

  function updateField(field: Field, value: string) {
    setSettings((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (!settings.name.trim()) next.name = "Informe o nome da organização.";
    if (!settings.cnpj.trim()) next.cnpj = "Informe o CNPJ.";
    if (!plans.some((item) => String(item.id) === settings.planId)) next.planId = "Selecione um plano.";
    if (!users.some((item) => String(item.id) === settings.responsibleUserId)) next.responsibleUserId = "Selecione um usuário responsável.";
    if (!settings.postalCode.trim()) next.postalCode = "Informe o CEP.";
    if (!settings.street.trim()) next.street = "Informe o logradouro.";
    if (!settings.addressNumber.trim()) next.addressNumber = "Informe o número.";
    if (!settings.neighborhood.trim()) next.neighborhood = "Informe o bairro.";
    if (!settings.city.trim()) next.city = "Informe a cidade.";
    if (!settings.state) next.state = "Selecione o estado.";
    setErrors(next);
    if (Object.keys(next).length) { setActiveTab("general"); return; }

    setIsSaving(true);
    setSaveError("");
    try {
      const token = getTokenCookie();
      if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
      const response = await apiRequest({
        path: "/minha-organizacao", method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          nome: settings.name.trim(), cnpj: settings.cnpj, planoid: Number(settings.planId),
          usuarioresponsavelid: Number(settings.responsibleUserId), cep: settings.postalCode,
          logradouro: settings.street.trim(), numero: settings.addressNumber.trim(),
          complemento: settings.complement.trim() || null, bairro: settings.neighborhood.trim(),
          cidade: settings.city.trim(), estado: settings.state,
        },
      });
      const result = (await response.json().catch(() => null)) as ApiResponse<OrganizationResponse> | null;
      if (!response.ok || !result?.data) throw new Error(result?.message || "Não foi possível atualizar a organização.");
      setSettings(mapOrganization(result.data));
      setUsers(result.data.usuarios);
      setPlans(result.data.planos);
      setShowSuccess(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Não foi possível atualizar a organização.");
    } finally { setIsSaving(false); }
  }

  if (isLoading) return <div className="audit-page"><Loading label="Carregando organização" description="Consultando os dados da sua organização." /></div>;
  if (loadError) return (
    <div className="audit-page"><Alert variant="danger"><p>{loadError}</p>
      <Button variant="outline-danger" onClick={() => setReloadKey((value) => value + 1)}>Tentar novamente</Button>
    </Alert></div>
  );

  return (
    <div className="audit-page organization-settings-page">
      <SectionHeader eyebrow="Minha Organização" title="Organização" description="Gerencie os dados cadastrais e as configurações da sua organização." />
      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key ?? "general")}>
        <Card className="app-card global-settings-card organization-settings-card">
          <div className="global-settings-tabs-wrap"><Nav variant="tabs" className="global-settings-tabs">
            <Nav.Item><Nav.Link eventKey="general">Dados gerais</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="rules">Regras</Nav.Link></Nav.Item>
          </Nav></div>
          <Form onSubmit={saveSettings} noValidate><Card.Body><Tab.Content>
            <Tab.Pane eventKey="general">
              <div className="global-settings-section-heading"><h2>Dados da organização</h2></div>
              <Row className="g-3">
                <Col md={6}><FormInput id="organizationName" label="Nome da organização" value={settings.name} onChange={(e) => updateField("name", e.target.value)} error={errors.name} required /></Col>
                <Col md={6}><FormInput id="organizationCnpj" label="CNPJ" value={settings.cnpj} maxLength={18} placeholder="00.000.000/0000-00" onChange={(e) => updateField("cnpj", mascararCnpj(e.target.value))} error={errors.cnpj} required /></Col>
                <Col md={6}><FormSelect id="organizationPlan" label="Plano assinado" value={settings.planId} onChange={(e) => updateField("planId", e.target.value)} error={errors.planId} required>
                  <option value="">Selecione um plano</option>{plans.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
                </FormSelect></Col>
                <Col md={6}><FormSelect id="organizationResponsible" label="Usuário responsável" value={settings.responsibleUserId} onChange={(e) => updateField("responsibleUserId", e.target.value)} error={errors.responsibleUserId} required>
                  <option value="">Selecione um usuário</option>{users.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
                </FormSelect></Col>
                <Col md={4}><FormInput id="organizationPostalCode" label="CEP" value={settings.postalCode} maxLength={9} placeholder="00000-000" onChange={(e) => updateField("postalCode", mascararCep(e.target.value))} error={errors.postalCode} required /></Col>
                <Col md={8}><FormInput id="organizationStreet" label="Logradouro" value={settings.street} onChange={(e) => updateField("street", e.target.value)} error={errors.street} required /></Col>
                <Col md={3}><FormInput id="organizationAddressNumber" label="Número" value={settings.addressNumber} onChange={(e) => updateField("addressNumber", e.target.value)} error={errors.addressNumber} required /></Col>
                <Col md={5}><FormInput id="organizationComplement" label="Complemento" value={settings.complement} onChange={(e) => updateField("complement", e.target.value)} /></Col>
                <Col md={4}><FormInput id="organizationNeighborhood" label="Bairro" value={settings.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} error={errors.neighborhood} required /></Col>
                <Col md={8}><FormInput id="organizationCity" label="Cidade" value={settings.city} onChange={(e) => updateField("city", e.target.value)} error={errors.city} required /></Col>
                <Col md={4}><FormSelect id="organizationState" label="Estado" value={settings.state} onChange={(e) => updateField("state", e.target.value)} error={errors.state} required>
                  <option value="">Selecione</option>{states.map((state) => <option key={state} value={state}>{state}</option>)}
                </FormSelect></Col>
              </Row>
            </Tab.Pane><Tab.Pane eventKey="rules" />
          </Tab.Content></Card.Body>
          <div className="global-settings-actions"><span>Configurações da minha organização.</span>
            <Button type="submit" className="starter-button" disabled={activeTab !== "general" || isSaving}>{isSaving ? "Salvando..." : "Salvar configurações"}</Button>
          </div></Form>
        </Card>
      </Tab.Container>
      <FeedbackState show={showSuccess} onClose={() => setShowSuccess(false)} variant="success" title="Configurações salvas" description="Os dados da organização foram atualizados com sucesso." />
      <FeedbackState show={Boolean(saveError)} onClose={() => setSaveError("")} variant="error" title="Não foi possível salvar" description={saveError} />
    </div>
  );
}
