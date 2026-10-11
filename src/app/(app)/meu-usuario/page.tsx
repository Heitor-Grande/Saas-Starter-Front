"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { Button, Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormCheckbox } from "@/components/ui/FormCheckbox";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { initialCurrentUser, type CurrentUser } from "@/mocks/currentUser";
import { mascararCpf, mascararTelefone } from "@/util/mascaras";

type EditableField = Exclude<keyof CurrentUser, "active">;
type UserErrors = Partial<Record<EditableField, string>>;

export default function CurrentUserPage() {
  const [user, setUser] = useState<CurrentUser>(initialCurrentUser);
  const [activeTab, setActiveTab] = useState("personal");
  const [errors, setErrors] = useState<UserErrors>({});
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [showSuccess, setShowSuccess] = useState(false);

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

  function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: UserErrors = {};

    if (!user.fullName.trim()) nextErrors.fullName = "Informe o nome completo.";
    if (!user.cpf.trim()) nextErrors.cpf = "Informe o CPF.";
    if (!user.birthDate) nextErrors.birthDate = "Informe a data de nascimento.";
    if (!user.email.trim()) nextErrors.email = "Informe o e-mail.";
    if (!user.phone.trim()) nextErrors.phone = "Informe o telefone.";
    if (!user.organization.trim()) nextErrors.organization = "Informe a organização.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const contactFields: EditableField[] = ["email", "phone", "organization", "profile", "jobTitle"];
      setActiveTab(Object.keys(nextErrors).some((field) => contactFields.includes(field as EditableField)) ? "contact" : "personal");
      return;
    }

    setUser((current) => ({
      ...current,
      fullName: current.fullName.trim(),
      socialName: current.socialName.trim(),
      email: current.email.trim(),
      phone: current.phone.trim()
    }));
    setShowSuccess(true);
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
                      <FormInput id="userBirthDate" label="Data de nascimento" type="date" value={user.birthDate}
                        onChange={(event) => updateField("birthDate", event.target.value)} error={errors.birthDate} required />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2} className="mt-3">
                      <FormCheckbox id="userActive" label="Usuário ativo" type="switch" checked={user.active}
                        onChange={(event) => setUser((current) => ({ ...current, active: event.target.checked }))} />
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="contact">
                  <div className="global-settings-section-heading"><h2>Vínculo e contato</h2></div>
                  <Row className="g-3">
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
                        onChange={(event) => updateField("organization", event.target.value)} error={errors.organization} required />
                    </Col>
                    <Col md={6}>
                      <FormSelect id="userProfile" label="Perfil" value={user.profile}
                        onChange={(event) => updateField("profile", event.target.value)}>
                        <option>Administrador</option>
                        <option>Gestor</option>
                        <option>Colaborador</option>
                        <option>Leitor</option>
                      </FormSelect>
                    </Col>
                    <Col md={6}>
                      <FormInput id="userJobTitle" label="Cargo" value={user.jobTitle}
                        onChange={(event) => updateField("jobTitle", event.target.value)} />
                    </Col>
                  </Row>
                </Tab.Pane>

              </Tab.Content>
            </Card.Body>

            <div className="global-settings-actions">
              <span>Os mesmos campos serão utilizados no cadastro de usuários.</span>
              <Button type="submit" className="starter-button">Salvar dados</Button>
            </div>
          </Form>
        </Card>
      </Tab.Container>

      <FeedbackState show={showSuccess} onClose={() => setShowSuccess(false)} variant="success"
        title="Dados salvos" description="As informações do usuário foram atualizadas com sucesso." />
    </div>
  );
}
