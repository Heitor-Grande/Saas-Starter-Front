"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { Loading } from "@/components/ui/Loading";
import { apiRequest } from "@/util/apiRequest";
import {
  mascararCep,
  mascararCnpj,
  mascararCpf,
  mascararCvv,
  mascararNumeroCartao,
  mascararTelefone,
  mascararValidadeCartao
} from "@/util/mascaras";
import {
  removerMascaraCep,
  removerMascaraCnpj,
  removerMascaraCpf,
  removerMascaraTelefone
} from "@/util/removeMascaras";
import { validarForcaSenha } from "@/util/validarForcaSenha";
import { ConfirmarEmail } from "./components/confirmarEmail";

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

type PaymentMethod = "pix" | "credit-card";

interface SignupPayment {
  method: PaymentMethod;
  cardNumber: string;
  holderName: string;
  expiry: string;
  cvv: string;
}

type OrganizationField = keyof SignupOrganization;
type UserField = Exclude<keyof SignupUser, "active">;
type PaymentField = Exclude<keyof SignupPayment, "method">;
type SignupErrors = Partial<Record<OrganizationField | UserField | PaymentField, string>>;

interface ApiResponse {
  message: string;
  data?: { token?: string; expiraEmSegundos?: number };
}

interface PublicPlan {
  id: number;
  nome: string;
  valor: string;
}

interface PlansApiResponse {
  message?: string;
  data?: PublicPlan[];
}

interface ViaCepResponse {
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const initialOrganization: SignupOrganization = {
  name: "",
  cnpj: "",
  plan: "",
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
  profile: "1",
  jobTitle: "",
  password: "",
  passwordConfirmation: ""
};

const initialPayment: SignupPayment = {
  method: "pix",
  cardNumber: "",
  holderName: "",
  expiry: "",
  cvv: ""
};

export default function SignupPage() {
  const router = useRouter();
  const [organization, setOrganization] = useState(initialOrganization);
  const [user, setUser] = useState(initialUser);
  const [payment, setPayment] = useState(initialPayment);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [confirmationToken, setConfirmationToken] = useState("");
  const [confirmationError, setConfirmationError] = useState("");
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadPlans() {
      try {
        const response = await apiRequest({ path: "/planos-publicos", method: "GET" });
        const result = (await response.json().catch(() => null)) as PlansApiResponse | null;
        if (!response.ok) throw new Error(result?.message || "Não foi possível carregar os planos.");
        const availablePlans = result?.data ?? [];
        if (!active) return;
        setPlans(availablePlans);
        setOrganization((current) => ({
          ...current,
          plan: current.plan || String(availablePlans[0]?.id ?? "")
        }));
        if (availablePlans.length === 0) setPlansError("Nenhum plano está disponível.");
      } catch (error) {
        if (active) {
          setPlansError(error instanceof Error ? error.message : "Não foi possível carregar os planos.");
        }
      } finally {
        if (active) setIsLoadingPlans(false);
      }
    }
    void loadPlans();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const cep = removerMascaraCep(organization.postalCode);
    if (cep.length !== 8) return;

    const controller = new AbortController();
    async function loadAddress() {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
          signal: controller.signal
        });
        if (!response.ok) return;
        const address = (await response.json()) as ViaCepResponse;
        if (address.erro) return;

        setOrganization((current) => ({
          ...current,
          street: address.logradouro ?? current.street,
          complement: address.complemento || current.complement,
          neighborhood: address.bairro ?? current.neighborhood,
          city: address.localidade ?? current.city,
          state: address.uf ?? current.state
        }));
        setErrors((current) => ({
          ...current,
          street: undefined,
          neighborhood: undefined,
          city: undefined,
          state: undefined
        }));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) return;
      }
    }

    void loadAddress();
    return () => controller.abort();
  }, [organization.postalCode]);

  function updateOrganization(field: OrganizationField, value: string) {
    setOrganization((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function updateUser(field: UserField, value: string) {
    setUser((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function updatePayment(field: PaymentField, value: string) {
    setPayment((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function updatePaymentMethod(method: PaymentMethod) {
    setPayment((current) => ({ ...current, method }));
    if (method === "pix") {
      setErrors((current) => ({
        ...current,
        cardNumber: undefined,
        holderName: undefined,
        expiry: undefined,
        cvv: undefined
      }));
    }
  }

  function buildSignupPayload() {
    return {
      organizacao: {
        nome: organization.name.trim(),
        cnpj: removerMascaraCnpj(organization.cnpj),
        planoid: Number(organization.plan),
        cep: removerMascaraCep(organization.postalCode),
        logradouro: organization.street.trim(),
        numero: organization.addressNumber.trim(),
        complemento: organization.complement.trim() || undefined,
        bairro: organization.neighborhood.trim(),
        cidade: organization.city.trim(),
        estado: organization.state
      },
      usuario: {
        nome: user.fullName.trim(),
        nomesocial: user.socialName.trim() || undefined,
        cpf: removerMascaraCpf(user.cpf),
        datanascimento: user.birthDate,
        email: user.email.trim(),
        telefone: removerMascaraTelefone(user.phone),
        perfilid: Number(user.profile),
        cargo: user.jobTitle.trim() || undefined,
        ativo: user.active,
        senha: user.password
      }
    };
  }

  async function requestConfirmationCode() {
    setRequestError("");
    setConfirmationError("");
    setIsSubmitting(true);
    try {
      const response = await apiRequest({
        path: "/cadastro-inicial/solicitar-confirmacao",
        method: "POST",
        body: buildSignupPayload()
      });
      const result = (await response.json().catch(() => null)) as ApiResponse | null;
      if (!response.ok) throw new Error(result?.message || "Não foi possível enviar o código.");
      const token = result?.data?.token;
      if (!token) throw new Error("O servidor não devolveu a autorização de confirmação.");
      setConfirmationToken(token);
      setShowEmailConfirmation(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível enviar o código.";
      if (showEmailConfirmation) setConfirmationError(message);
      else setRequestError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmEmail(codigo: string) {
    setConfirmationError("");
    setIsSubmitting(true);
    try {
      const response = await apiRequest({
        path: "/cadastro-inicial/confirmar-email",
        method: "POST",
        body: { token: confirmationToken, codigo, cadastro: buildSignupPayload() }
      });
      const result = (await response.json().catch(() => null)) as ApiResponse | null;
      if (!response.ok) throw new Error(result?.message || "Não foi possível confirmar o e-mail.");
      setShowEmailConfirmation(false);
      setConfirmationToken("");
      setShowSuccess(true);
    } catch (error) {
      setConfirmationError(
        error instanceof Error ? error.message : "Não foi possível confirmar o e-mail."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: SignupErrors = {};

    if (!organization.name.trim()) nextErrors.name = "Informe o nome da organização.";
    if (!organization.cnpj.trim()) nextErrors.cnpj = "Informe o CNPJ.";
    if (!organization.plan) nextErrors.plan = "Selecione um plano.";
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
    const validacaoSenha = validarForcaSenha(user.password);
    if (!validacaoSenha.valida) nextErrors.password = validacaoSenha.erros.join(" ");
    if (user.password !== user.passwordConfirmation) {
      nextErrors.passwordConfirmation = "As senhas não coincidem.";
    }
    if (payment.method === "credit-card") {
      if (!payment.cardNumber.trim()) nextErrors.cardNumber = "Informe o número do cartão.";
      if (!payment.holderName.trim()) nextErrors.holderName = "Informe o nome do titular.";
      if (!payment.expiry.trim()) nextErrors.expiry = "Informe a validade.";
      if (!payment.cvv.trim()) nextErrors.cvv = "Informe o código de segurança.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await requestConfirmationCode();
  }

  return (
    <main className="auth-shell signup-auth-shell">
      <section className="auth-panel signup-auth-panel">
        <Loading
          visible={isSubmitting}
          mode="overlay"
          label={showEmailConfirmation ? "Confirmando e-mail" : "Enviando código"}
          description="Aguarde enquanto processamos sua solicitação."
        />
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
                  onChange={(event) => updateOrganization("cnpj", mascararCnpj(event.target.value))}
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
                  error={errors.plan || plansError}
                  disabled={isLoadingPlans || plans.length === 0}
                  required
                >
                  <option value="">{isLoadingPlans ? "Carregando planos..." : "Selecione"}</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.nome} - {Number(plan.valor).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      })}
                    </option>
                  ))}
                </FormSelect>
              </Col>
              <Col md={4}>
                <FormInput id="signupOrganizationPostalCode" label="CEP" value={organization.postalCode}
                  maxLength={9} placeholder="00000-000"
                  onChange={(event) => updateOrganization("postalCode", mascararCep(event.target.value))}
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
                  placeholder="000.000.000-00" onChange={(event) => updateUser("cpf", mascararCpf(event.target.value))}
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
                  placeholder="(00) 00000-0000" onChange={(event) => updateUser("phone", mascararTelefone(event.target.value))}
                  error={errors.phone} required />
              </Col>
              <Col md={6}>
                <FormInput id="signupOrganizationLink" label="Organização pertencente"
                  value={organization.name} placeholder="Preenchida pelos dados da organização" readOnly />
              </Col>
              <Col md={6}>
                <FormSelect id="signupProfile" label="Perfil" value={user.profile}
                  onChange={(event) => updateUser("profile", event.target.value)}>
                  <option value="1">Administrador</option>
                  <option value="2">Gestor</option>
                  <option value="3">Colaborador</option>
                  <option value="4">Leitor</option>
                </FormSelect>
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

          <hr className="signup-divider" />

          <section className="signup-form-section" aria-labelledby="payment-section-title">
            <div className="signup-section-heading">
              <span>03</span>
              <div>
                <h2 id="payment-section-title">Método de pagamento</h2>
                <p>Escolha como deseja realizar o pagamento da assinatura.</p>
              </div>
            </div>

            <Row className="g-3">
              <Col md={6}>
                <FormSelect
                  id="signupPaymentMethod"
                  label="Forma de pagamento"
                  value={payment.method}
                  onChange={(event) => updatePaymentMethod(event.target.value as PaymentMethod)}
                >
                  <option value="pix">PIX</option>
                  <option value="credit-card">Cartão de crédito</option>
                </FormSelect>
              </Col>

              {payment.method === "pix" ? (
                <Col xs={12}>
                  <p className="signup-payment-note">
                    Nenhuma outra informação é necessária para pagamento via PIX.
                  </p>
                </Col>
              ) : (
                <>
                  <Col md={6}>
                    <FormInput
                      id="signupCardNumber"
                      label="Número do cartão"
                      value={payment.cardNumber}
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={19}
                      placeholder="0000 0000 0000 0000"
                      onChange={(event) => updatePayment("cardNumber", mascararNumeroCartao(event.target.value))}
                      error={errors.cardNumber}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <FormInput
                      id="signupCardHolder"
                      label="Nome do titular"
                      value={payment.holderName}
                      autoComplete="cc-name"
                      onChange={(event) => updatePayment("holderName", event.target.value)}
                      error={errors.holderName}
                      required
                    />
                  </Col>
                  <Col md={3}>
                    <FormInput
                      id="signupCardExpiry"
                      label="Validade"
                      value={payment.expiry}
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      maxLength={5}
                      placeholder="MM/AA"
                      onChange={(event) => updatePayment("expiry", mascararValidadeCartao(event.target.value))}
                      error={errors.expiry}
                      required
                    />
                  </Col>
                  <Col md={3}>
                    <FormInput
                      id="signupCardCvv"
                      label="Código de segurança (CVV)"
                      type="password"
                      value={payment.cvv}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={4}
                      placeholder="000"
                      onChange={(event) => updatePayment("cvv", mascararCvv(event.target.value))}
                      error={errors.cvv}
                      required
                    />
                  </Col>
                </>
              )}
            </Row>
          </section>
        </div>

        <div className="signup-form-actions">
          <Link href="/login">Já tenho uma conta</Link>
          <Button className="starter-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando código..." : "Continuar e confirmar e-mail"}
          </Button>
        </div>
      </Form>

      <FeedbackState
        show={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.push("/login");
        }}
        variant="success"
        title="Cadastro concluído"
        description="A organização e o usuário responsável foram cadastrados com sucesso."
      />
      <FeedbackState
        show={Boolean(requestError)}
        onClose={() => setRequestError("")}
        variant="error"
        title="Não foi possível concluir o cadastro"
        description={requestError}
      />
      <ConfirmarEmail
        show={showEmailConfirmation}
        email={user.email}
        isSubmitting={isSubmitting}
        error={confirmationError}
        onHide={() => {
          setShowEmailConfirmation(false);
          setConfirmationError("");
        }}
        onConfirm={(codigo) => void confirmEmail(codigo)}
        onResend={() => void requestConfirmationCode()}
      />
      </section>
    </main>
  );
}
