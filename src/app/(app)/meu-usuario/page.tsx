"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { Alert, Button, Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormCheckbox } from "@/components/ui/FormCheckbox";
import { FormInput } from "@/components/ui/FormInput";
import { Loading } from "@/components/ui/Loading";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CurrentUser } from "@/mocks/currentUser";
import { apiRequest } from "@/util/apiRequest";
import { getTokenCookie } from "@/util/getTokenCookie";
import { mascararCpf, mascararTelefone } from "@/util/mascaras";

type EditableField = Exclude<keyof CurrentUser, "active">;
type UserErrors = Partial<Record<EditableField, string>>;
type ApiResponse<T> = { message?: string; data?: T };
type CurrentUserResponse = {
  id: number;
  nome: string;
  nomesocial: string | null;
  cpf: string;
  datanascimento: string;
  email: string;
  telefone: string;
  ativo: boolean;
  organizacao: string;
  perfil: string;
  cargo: string | null;
};

const emptyUser: CurrentUser = {
  fullName: "",
  socialName: "",
  cpf: "",
  birthDate: "",
  email: "",
  phone: "",
  active: false,
  organization: "",
  profile: "",
  jobTitle: "",
};

function mapCurrentUser(data: CurrentUserResponse): CurrentUser {
  return {
    fullName: data.nome,
    socialName: data.nomesocial ?? "",
    cpf: mascararCpf(data.cpf),
    birthDate: data.datanascimento,
    email: data.email,
    phone: mascararTelefone(data.telefone),
    active: data.ativo,
    organization: data.organizacao,
    profile: data.perfil,
    jobTitle: data.cargo ?? "",
  };
}

export default function CurrentUserPage() {
  const [user, setUser] = useState<CurrentUser>(emptyUser);
  const [activeTab, setActiveTab] = useState("personal");
  const [errors, setErrors] = useState<UserErrors>({});
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      setIsLoading(true);
      setLoadError("");

      try {
        const token = getTokenCookie();
        if (!token) {
          throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
        }

        const response = await apiRequest({
          path: "/meu-usuario",
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = (await response.json().catch(() => null)) as ApiResponse<CurrentUserResponse> | null;

        if (!response.ok || !result?.data) {
          throw new Error(result?.message || "Não foi possível carregar os dados do usuário.");
        }

        if (active) {
          setUser(mapCurrentUser(result.data));
        }
      } catch (error) {
        if (active) {
          setLoadError(error instanceof Error ? error.message : "Não foi possível carregar os dados do usuário.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadUser();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  function updateField(field: EditableField, value: string) {
    setUser((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function updateAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarUrl(URL.createObjectURL(file));
  }

  async function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: UserErrors = {};

    if (!user.fullName.trim()) nextErrors.fullName = "Informe o nome completo.";
    if (!user.cpf.trim()) nextErrors.cpf = "Informe o CPF.";
    if (!user.birthDate) nextErrors.birthDate = "Informe a data de nascimento.";
    if (!user.email.trim()) nextErrors.email = "Informe o e-mail.";
    if (!user.phone.trim()) nextErrors.phone = "Informe o telefone.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setActiveTab("personal");
      return;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      const token = getTokenCookie();
      if (!token) {
        throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
      }

      const response = await apiRequest({
        path: "/meu-usuario",
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          nome: user.fullName.trim(),
          nomesocial: user.socialName.trim() || null,
          cpf: user.cpf,
          datanascimento: user.birthDate,
          email: user.email.trim(),
          telefone: user.phone,
          cargo: user.jobTitle.trim() || null,
          ativo: user.active,
        },
      });
      const result = (await response.json().catch(() => null)) as ApiResponse<CurrentUserResponse> | null;

      if (!response.ok || !result?.data) {
        throw new Error(result?.message || "Não foi possível atualizar os dados do usuário.");
      }

      setUser(mapCurrentUser(result.data));
      setShowSuccess(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Não foi possível atualizar os dados do usuário.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="audit-page user-profile-page">
        <Loading label="Carregando usuário" description="Consultando seus dados pessoais e de vínculo." />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="audit-page user-profile-page">
        <Alert variant="danger">
          <p>{loadError}</p>
          <Button variant="outline-danger" onClick={() => setReloadKey((value) => value + 1)}>
            Tentar novamente
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="audit-page user-profile-page">
      <SectionHeader
        eyebrow="Conta"
        title="Meu usuário"
        description="Gerencie seus dados pessoais e informações de contato."
      />

      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key ?? "personal")}>
        <Card className="app-card global-settings-card user-profile-card">
          <div className="global-settings-tabs-wrap">
            <Nav variant="tabs" className="global-settings-tabs">
              <Nav.Item><Nav.Link eventKey="personal">Dados pessoais</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="contact">Vínculo e contato</Nav.Link></Nav.Item>
            </Nav>
          </div>

          <Form onSubmit={saveUser} noValidate>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="personal">
                  <div className="user-avatar-section">
                    <div className="user-avatar-preview" aria-label="Avatar do usuário">
                      {avatarUrl ? (
                        <Image alt="Avatar selecionado" src={avatarUrl} width={88} height={88} unoptimized />
                      ) : <span>{initials}</span>}
                    </div>
                    <div className="user-avatar-field">
                      <FormInput
                        id="userAvatar"
                        label="Avatar"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        helperText="Formatos aceitos: JPG, PNG ou WebP."
                        onChange={updateAvatar}
                      />
                    </div>
                  </div>

                  <Row className="g-3">
                    <Col md={6}>
                      <FormInput id="userFullName" label="Nome completo" value={user.fullName}
                        onChange={(event) => updateField("fullName", event.target.value)} error={errors.fullName} required />
                    </Col>
                    <Col md={6}>
                      <FormInput id="userCpf" label="CPF" value={user.cpf} maxLength={14}
                        placeholder="000.000.000-00" onChange={(event) => updateField("cpf", mascararCpf(event.target.value))} error={errors.cpf} required />
                    </Col>
                    <Col md={6}>
                      <FormInput id="userSocialName" label="Nome social" value={user.socialName}
                        onChange={(event) => updateField("socialName", event.target.value)} />
                    </Col>
                    <Col md={6}>
                      <FormInput id="userBirthDate" label="Data de nascimento" type="date" value={user.birthDate}
                        onChange={(event) => updateField("birthDate", event.target.value)} error={errors.birthDate} required />
                    </Col>
                    <Col md={6}>
                      <FormInput id="userEmail" label="E-mail" type="email" value={user.email}
                        onChange={(event) => updateField("email", event.target.value)} error={errors.email} required />
                    </Col>
                    <Col md={6}>
                      <FormInput id="userPhone" label="Telefone" type="tel" value={user.phone}
                        placeholder="(00) 00000-0000" onChange={(event) => updateField("phone", mascararTelefone(event.target.value))} error={errors.phone} required />
                    </Col>
                    <Col md={6}>
                      <FormInput id="userOrganization" label="Organização pertencente" value={user.organization}
                        error={errors.organization} required disabled />
                    </Col>
                    <Col md={6}>
                      <FormInput id="userProfile" label="Perfil" value={user.profile} readOnly />
                    </Col>
                    <Col md={6}>
                      <FormInput id="userJobTitle" label="Cargo" value={user.jobTitle}
                        onChange={(event) => updateField("jobTitle", event.target.value)} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2} className="mt-3">
                      <FormCheckbox id="userActive" label="Usuário ativo" type="switch" checked={user.active}
                        disabled />
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>

            <div className="global-settings-actions">
              <span>Os mesmos campos serão utilizados no cadastro de usuários.</span>
              <Button type="submit" className="starter-button" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar dados"}
              </Button>
            </div>
          </Form>
        </Card>
      </Tab.Container>

      <FeedbackState show={showSuccess} onClose={() => setShowSuccess(false)} variant="success"
        title="Dados salvos" description="As informações do usuário foram atualizadas com sucesso." />
      <FeedbackState show={Boolean(saveError)} onClose={() => setSaveError("")} variant="error"
        title="Não foi possível salvar" description={saveError} />
    </div>
  );
}
