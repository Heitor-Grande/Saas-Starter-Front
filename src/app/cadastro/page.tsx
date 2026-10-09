"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormCheckbox } from "@/components/ui/FormCheckbox";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";

interface SignupOrganization {
  name: string;
  cnpj: string;
  plan: string;
  postalCode: string;
  street: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface SignupUser {
  fullName: string;
  socialName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  active: boolean;
  profile: string;
  jobTitle: string;
  password: string;
  passwordConfirmation: string;
}

type OrganizationField = keyof SignupOrganization;
type UserField = Exclude<keyof SignupUser, "active">;
type SignupErrors = Partial<Record<OrganizationField | UserField, string>>;

const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const initialOrganization: SignupOrganization = {
  name: "",
  cnpj: "",
  plan: "Starter",
  postalCode: "",
  street: "",
  addressNumber: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: ""
};

const initialUser: SignupUser = {
  fullName: "",
  socialName: "",
  cpf: "",
  birthDate: "",
  email: "",
  phone: "",
  active: true,
  profile: "Administrador",
  jobTitle: "",
  password: "",
  passwordConfirmation: ""
};

export default function SignupPage() {
  const [organization, setOrganization] = useState(initialOrganization);
  const [user, setUser] = useState(initialUser);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  function updateOrganization(field: OrganizationField, value: string) {
    setOrganization((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function updateUser(field: UserField, value: string) {
    setUser((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: SignupErrors = {};

    if (!organization.name.trim()) nextErrors.name = "Informe o nome da organização.";
    if (!organization.cnpj.trim()) nextErrors.cnpj = "Informe o CNPJ.";
    if (!organization.postalCode.trim()) nextErrors.postalCode = "Informe o CEP.";
    if (!organization.street.trim()) nextErrors.street = "Informe o logradouro.";
    if (!organization.addressNumber.trim()) nextErrors.addressNumber = "Informe o número.";
    if (!organization.neighborhood.trim()) nextErrors.neighborhood = "Informe o bairro.";
    if (!organization.city.trim()) nextErrors.city = "Informe a cidade.";
    if (!organization.state) nextErrors.state = "Selecione o estado.";
    if (!user.fullName.trim()) nextErrors.fullName = "Informe o nome completo.";
    if (!user.cpf.trim()) nextErrors.cpf = "Informe o CPF.";
    if (!user.birthDate) nextErrors.birthDate = "Informe a data de nascimento.";
    if (!user.email.trim()) nextErrors.email = "Informe o e-mail.";
    if (!user.phone.trim()) nextErrors.phone = "Informe o telefone.";
    if (!user.password) nextErrors.password = "Informe uma senha.";
    if (user.password !== user.passwordConfirmation) {
      nextErrors.passwordConfirmation = "As senhas não coincidem.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setShowSuccess(true);
  }

  return (
    <main className="auth-shell signup-auth-shell">
      <section className="auth-panel signup-auth-panel">
        <div className="auth-heading">
          <Link className="auth-brand" href="/">
            SaaS Starter
          </Link>
          <h1>Criar conta</h1>
          <p>Cadastre sua organização e o primeiro usuário responsável.</p>
        </div>

      <Form className="signup-form" onSubmit={submitSignup} noValidate>
        <div className="signup-form-scroll">
          <section className="signup-form-section" aria-labelledby="organization-section-title">
            <div className="signup-section-heading">
              <span>01</span>
              <div>
                <h2 id="organization-section-title">Dados da organização</h2>
                <p>Informações cadastrais e plano inicial.</p>
              </div>
            </div>

            <Row className="g-3">
              <Col md={6}>
                <FormInput
                  id="signupOrganizationName"
                  label="Nome da organização"
                  value={organization.name}
                  onChange={(event) => updateOrganization("name", event.target.value)}
                  error={errors.name}
                  required
                />
              </Col>
              <Col md={6}>
                <FormInput
                  id="signupOrganizationCnpj"
                  label="CNPJ"
                  value={organization.cnpj}
                  maxLength={18}
                  placeholder="00.000.000/0000-00"
                  onChange={(event) => updateOrganization("cnpj", event.target.value)}
                  error={errors.cnpj}
                  required
                />
              </Col>
              <Col md={6}>
                <FormSelect
                  id="signupOrganizationPlan"
                  label="Plano assinado"
                  value={organization.plan}
                  onChange={(event) => updateOrganization("plan", event.target.value)}
                >
                  <option>Starter</option>
                  <option>Growth</option>
                  <option>Scale</option>
                </FormSelect>
              </Col>
              <Col md={6}>
                <FormInput
                  id="signupResponsibleUser"
                  label="Usuário responsável"
                  value={user.fullName}
                  placeholder="Preenchido com o nome do usuário"
                  readOnly
                />
              </Col>
              <Col md={4}>
                <FormInput id="signupOrganizationPostalCode" label="CEP" value={organization.postalCode}
                  maxLength={9} placeholder="00000-000"
                  onChange={(event) => updateOrganization("postalCode", event.target.value)}
                  error={errors.postalCode} required />
              </Col>
              <Col md={8}>
                <FormInput id="signupOrganizationStreet" label="Logradouro" value={organization.street}
                  onChange={(event) => updateOrganization("street", event.target.value)}
                  error={errors.street} required />
              </Col>
              <Col md={3}>
                <FormInput id="signupOrganizationAddressNumber" label="Número" value={organization.addressNumber}
                  onChange={(event) => updateOrganization("addressNumber", event.target.value)}
                  error={errors.addressNumber} required />
              </Col>
              <Col md={5}>
                <FormInput id="signupOrganizationComplement" label="Complemento" value={organization.complement}
                  onChange={(event) => updateOrganization("complement", event.target.value)} />
              </Col>
              <Col md={4}>
                <FormInput id="signupOrganizationNeighborhood" label="Bairro" value={organization.neighborhood}
                  onChange={(event) => updateOrganization("neighborhood", event.target.value)}
                  error={errors.neighborhood} required />
              </Col>
              <Col md={8}>
                <FormInput id="signupOrganizationCity" label="Cidade" value={organization.city}
                  onChange={(event) => updateOrganization("city", event.target.value)}
                  error={errors.city} required />
              </Col>
              <Col md={4}>
                <FormSelect id="signupOrganizationState" label="Estado" value={organization.state}
                  onChange={(event) => updateOrganization("state", event.target.value)}
                  error={errors.state} required>
                  <option value="">Selecione</option>
                  {states.map((state) => <option key={state} value={state}>{state}</option>)}
                </FormSelect>
              </Col>
            </Row>
          </section>

          <hr className="signup-divider" />

          <section className="signup-form-section" aria-labelledby="user-section-title">
            <div className="signup-section-heading">
              <span>02</span>
              <div>
                <h2 id="user-section-title">Dados do usuário responsável</h2>
                <p>Informações pessoais, vínculo e acesso.</p>
              </div>
            </div>

            <Row className="g-3">
              <Col xs={12}>
                <FormInput
                  id="signupAvatar"
                  label="Avatar"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  helperText="Formatos aceitos: JPG, PNG ou WebP."
                />
              </Col>
              <Col md={6}>
                <FormInput id="signupFullName" label="Nome completo" value={user.fullName}
                  onChange={(event) => updateUser("fullName", event.target.value)} error={errors.fullName} required />
              </Col>
              <Col md={6}>
                <FormInput id="signupSocialName" label="Nome social" value={user.socialName}
                  onChange={(event) => updateUser("socialName", event.target.value)} helperText="Preenchimento opcional." />
              </Col>
              <Col md={6}>
                <FormInput id="signupCpf" label="CPF" value={user.cpf} maxLength={14}
                  placeholder="000.000.000-00" onChange={(event) => updateUser("cpf", event.target.value)}
                  error={errors.cpf} required />
              </Col>
              <Col md={6}>
                <FormInput id="signupBirthDate" label="Data de nascimento" type="date" value={user.birthDate}
                  onChange={(event) => updateUser("birthDate", event.target.value)} error={errors.birthDate} required />
              </Col>
              <Col md={6}>
                <FormInput id="signupEmail" label="E-mail" type="email" value={user.email}
                  onChange={(event) => updateUser("email", event.target.value)} error={errors.email} required />
              </Col>
              <Col md={6}>
                <FormInput id="signupPhone" label="Telefone" type="tel" value={user.phone}
                  placeholder="(00) 00000-0000" onChange={(event) => updateUser("phone", event.target.value)}
                  error={errors.phone} required />
              </Col>
              <Col md={6}>
                <FormInput id="signupOrganizationLink" label="Organização pertencente"
                  value={organization.name} placeholder="Preenchida pelos dados da organização" readOnly />
              </Col>
              <Col md={6}>
                <FormSelect id="signupProfile" label="Perfil" value={user.profile}
                  onChange={(event) => updateUser("profile", event.target.value)}>
                  <option>Administrador</option>
                  <option>Gestor</option>
                  <option>Colaborador</option>
                  <option>Leitor</option>
                </FormSelect>
              </Col>
              <Col md={6}>
                <FormInput id="signupJobTitle" label="Cargo" value={user.jobTitle}
                  onChange={(event) => updateUser("jobTitle", event.target.value)} />
              </Col>
              <Col md={6} className="d-flex align-items-end">
                <FormCheckbox id="signupUserActive" label="Usuário ativo" type="switch" checked={user.active}
                  onChange={(event) => setUser((current) => ({ ...current, active: event.target.checked }))} />
              </Col>
              <Col md={6}>
                <FormInput id="signupPassword" label="Senha" type="password" value={user.password}
                  onChange={(event) => updateUser("password", event.target.value)} error={errors.password} required />
              </Col>
              <Col md={6}>
                <FormInput id="signupPasswordConfirmation" label="Confirmar senha" type="password"
                  value={user.passwordConfirmation}
                  onChange={(event) => updateUser("passwordConfirmation", event.target.value)}
                  error={errors.passwordConfirmation} required />
              </Col>
            </Row>
          </section>
        </div>

        <div className="signup-form-actions">
          <Link href="/login">Já tenho uma conta</Link>
          <Button className="starter-button" type="submit">Criar conta</Button>
        </div>
      </Form>

      <FeedbackState
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        variant="success"
        title="Cadastro concluído"
        description="A organização e o usuário responsável foram cadastrados com sucesso."
      />
      </section>
    </main>
  );
}
