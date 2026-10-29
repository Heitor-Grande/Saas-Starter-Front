"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Alert, Badge, Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormCheckbox } from "@/components/ui/FormCheckbox";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { Loading } from "@/components/ui/Loading";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { apiRequest } from "@/util/apiRequest";
import { getTokenCookie } from "@/util/getTokenCookie";
import { mascararCpf, mascararTelefone } from "@/util/mascaras";
import { validarForcaSenha } from "@/util/validarForcaSenha";

type ApiResponse<T> = { message?: string; data?: T };
type Profile = { id: number; nome: string };
type UserApi = {
  id: number;
  nome: string;
  nomesocial: string | null;
  cpf: string;
  datanascimento: string;
  email: string;
  telefone: string;
  perfilid: number;
  perfil: string;
  cargo: string | null;
  ativo: boolean;
  datacriacao: string;
};
type UserDetailsApi = UserApi & { perfis: Profile[] };
type FormData = {
  name: string;
  socialName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  profileId: string;
  jobTitle: string;
  active: boolean;
  password: string;
  passwordConfirmation: string;
};
type FormErrors = Partial<Record<keyof FormData, string>>;
type Feedback = { title: string; description: string };

const emptyForm: FormData = {
  name: "",
  socialName: "",
  cpf: "",
  birthDate: "",
  email: "",
  phone: "",
  profileId: "",
  jobTitle: "",
  active: true,
  password: "",
  passwordConfirmation: "",
};
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" });

function mapUserToForm(user: UserApi): FormData {
  return {
    name: user.nome,
    socialName: user.nomesocial ?? "",
    cpf: mascararCpf(user.cpf),
    birthDate: user.datanascimento,
    email: user.email,
    phone: mascararTelefone(user.telefone),
    profileId: String(user.perfilid),
    jobTitle: user.cargo ?? "",
    active: user.ativo,
    password: "",
    passwordConfirmation: "",
  };
}

function validateForm(data: FormData, profiles: Profile[], passwordRequired: boolean): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Informe o nome completo.";
  if (data.cpf.replace(/\D/g, "").length !== 11) errors.cpf = "Informe um CPF com 11 dígitos.";
  if (!data.birthDate) errors.birthDate = "Informe a data de nascimento.";
  if (!data.email.trim() || !data.email.includes("@")) errors.email = "Informe um e-mail válido.";
  const phoneLength = data.phone.replace(/\D/g, "").length;
  if (phoneLength < 10 || phoneLength > 11) errors.phone = "Informe um telefone com 10 ou 11 dígitos.";
  if (!profiles.some((profile) => String(profile.id) === data.profileId)) errors.profileId = "Selecione um perfil.";
  if (passwordRequired || data.password) {
    const validation = validarForcaSenha(data.password);
    if (!validation.valida) errors.password = validation.erros[0];
    if (data.password !== data.passwordConfirmation) errors.passwordConfirmation = "As senhas não coincidem.";
  }
  return errors;
}

function requestBody(data: FormData, includePassword: boolean) {
  return {
    nome: data.name.trim(),
    nomesocial: data.socialName.trim() || null,
    cpf: data.cpf,
    datanascimento: data.birthDate,
    email: data.email.trim(),
    telefone: data.phone,
    perfilid: Number(data.profileId),
    cargo: data.jobTitle.trim() || null,
    ativo: data.active,
    ...(includePassword ? { senha: data.password } : {}),
  };
}

interface UserFormProps {
  prefix: string;
  data: FormData;
  errors: FormErrors;
  profiles: Profile[];
  passwordRequired: boolean;
  onChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

function UserForm({ prefix, data, errors, profiles, passwordRequired, onChange }: UserFormProps) {
  return (
    <Row className="g-3">
      <Col md={6}><FormInput id={`${prefix}Name`} label="Nome completo" value={data.name} maxLength={100} onChange={(e) => onChange("name", e.target.value)} error={errors.name} required /></Col>
      <Col md={6}><FormInput id={`${prefix}SocialName`} label="Nome social" value={data.socialName} maxLength={100} onChange={(e) => onChange("socialName", e.target.value)} error={errors.socialName} /></Col>
      <Col md={6}><FormInput id={`${prefix}Cpf`} label="CPF" value={data.cpf} maxLength={14} placeholder="000.000.000-00" onChange={(e) => onChange("cpf", mascararCpf(e.target.value))} error={errors.cpf} required /></Col>
      <Col md={6}><FormInput id={`${prefix}BirthDate`} label="Data de nascimento" type="date" value={data.birthDate} onChange={(e) => onChange("birthDate", e.target.value)} error={errors.birthDate} required /></Col>
      <Col md={6}><FormInput id={`${prefix}Email`} label="E-mail" type="email" value={data.email} maxLength={100} onChange={(e) => onChange("email", e.target.value)} error={errors.email} required /></Col>
      <Col md={6}><FormInput id={`${prefix}Phone`} label="Telefone" type="tel" value={data.phone} maxLength={15} placeholder="(00) 00000-0000" onChange={(e) => onChange("phone", mascararTelefone(e.target.value))} error={errors.phone} required /></Col>
      <Col md={6}><FormSelect id={`${prefix}Profile`} label="Perfil" value={data.profileId} onChange={(e) => onChange("profileId", e.target.value)} error={errors.profileId} required>
        <option value="">Selecione um perfil</option>
        {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.nome}</option>)}
      </FormSelect></Col>
      <Col md={6}><FormInput id={`${prefix}JobTitle`} label="Cargo" value={data.jobTitle} maxLength={100} onChange={(e) => onChange("jobTitle", e.target.value)} error={errors.jobTitle} /></Col>
      {passwordRequired ? (
        <>
          <Col md={6}><FormInput id={`${prefix}Password`} label="Senha" type="password" value={data.password} autoComplete="new-password" helperText="Mínimo de 5 caracteres, com número, maiúscula e caractere especial." onChange={(e) => onChange("password", e.target.value)} error={errors.password} required /></Col>
          <Col md={6}><FormInput id={`${prefix}PasswordConfirmation`} label="Confirmar senha" type="password" value={data.passwordConfirmation} autoComplete="new-password" onChange={(e) => onChange("passwordConfirmation", e.target.value)} error={errors.passwordConfirmation} required /></Col>
        </>
      ) : null}
      <Col xs={12}><FormCheckbox id={`${prefix}Active`} label="Usuário ativo" type="switch" checked={data.active} onChange={(e) => onChange("active", e.target.checked)} /></Col>
    </Row>
  );
}

const columns: DataTableColumn<UserApi>[] = [
  { key: "name", header: "Nome", render: (user) => <strong>{user.nome}</strong> },
  { key: "email", header: "E-mail", render: (user) => user.email },
  { key: "profile", header: "Perfil", render: (user) => user.perfil },
  { key: "active", header: "Ativo", render: (user) => <span className={`status-pill admin-status-${user.ativo ? "ativo" : "inativo"}`}>{user.ativo ? "Ativo" : "Inativo"}</span> },
  { key: "createdAt", header: "Data de cadastro", render: (user) => dateFormatter.format(new Date(user.datacriacao)) },
];

export default function OrganizationUsersPage() {
  const [users, setUsers] = useState<UserApi[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<FormData>(emptyForm);
  const [createErrors, setCreateErrors] = useState<FormErrors>({});
  const [isCreating, setIsCreating] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserApi | null>(null);
  const [editForm, setEditForm] = useState<FormData>(emptyForm);
  const [editProfiles, setEditProfiles] = useState<Profile[]>([]);
  const [editErrors, setEditErrors] = useState<FormErrors>({});
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [userError, setUserError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const [success, setSuccess] = useState<Feedback | null>(null);

  useEffect(() => {
    let active = true;
    async function loadUsers() {
      setIsLoading(true);
      setLoadError("");
      try {
        const token = getTokenCookie();
        if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
        const [usersResponse, profilesResponse] = await Promise.all([
          apiRequest({ path: "/usuarios", method: "GET", headers: { Authorization: `Bearer ${token}` } }),
          apiRequest({ path: "/perfis/findAll", method: "GET", headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const usersResult = (await usersResponse.json().catch(() => null)) as ApiResponse<UserApi[]> | null;
        const profilesResult = (await profilesResponse.json().catch(() => null)) as ApiResponse<Profile[]> | null;
        if (!usersResponse.ok || !Array.isArray(usersResult?.data)) throw new Error(usersResult?.message || "Não foi possível consultar os usuários.");
        if (!profilesResponse.ok || !Array.isArray(profilesResult?.data)) throw new Error(profilesResult?.message || "Não foi possível consultar os perfis.");
        if (active) { setUsers(usersResult.data); setProfiles(profilesResult.data); }
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : "Não foi possível consultar os usuários.");
      } finally { if (active) setIsLoading(false); }
    }
    void loadUsers();
    return () => { active = false; };
  }, [reloadKey]);

  function changeCreate<K extends keyof FormData>(field: K, value: FormData[K]) {
    setCreateForm((current) => ({ ...current, [field]: value }));
    setCreateErrors((current) => ({ ...current, [field]: undefined }));
  }
  function changeEdit<K extends keyof FormData>(field: K, value: FormData[K]) {
    setEditForm((current) => ({ ...current, [field]: value }));
    setEditErrors((current) => ({ ...current, [field]: undefined }));
  }
  function closeCreate() { setShowCreate(false); setCreateForm(emptyForm); setCreateErrors({}); }
  function closeEdit() { setShowEdit(false); setSelectedUser(null); setEditForm(emptyForm); setEditErrors({}); setUserError(""); setShowDeleteConfirmation(false); }

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateForm(createForm, profiles, true);
    setCreateErrors(errors);
    if (Object.keys(errors).length || isCreating) return;
    setIsCreating(true); setMutationError("");
    try {
      const token = getTokenCookie();
      if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
      const response = await apiRequest({ path: "/usuarios", method: "POST", headers: { Authorization: `Bearer ${token}` }, body: requestBody(createForm, true) });
      const result = (await response.json().catch(() => null)) as ApiResponse<UserApi> | null;
      if (!response.ok) throw new Error(result?.message || "Não foi possível criar o usuário.");
      closeCreate(); setPage(1); setReloadKey((value) => value + 1);
      setSuccess({ title: "Usuário criado", description: "O novo usuário foi adicionado à organização." });
    } catch (error) { setMutationError(error instanceof Error ? error.message : "Não foi possível criar o usuário."); }
    finally { setIsCreating(false); }
  }

  async function openUser(user: UserApi) {
    setShowEdit(true); setSelectedUser(null); setUserError(""); setEditErrors({}); setIsLoadingUser(true);
    try {
      const token = getTokenCookie();
      if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
      const response = await apiRequest({ path: `/usuarios/${user.id}`, method: "GET", headers: { Authorization: `Bearer ${token}` } });
      const result = (await response.json().catch(() => null)) as ApiResponse<UserDetailsApi> | null;
      if (!response.ok || !result?.data) throw new Error(result?.message || "Não foi possível abrir o usuário.");
      setSelectedUser(result.data); setEditForm(mapUserToForm(result.data)); setEditProfiles(result.data.perfis);
    } catch (error) { setUserError(error instanceof Error ? error.message : "Não foi possível abrir o usuário."); }
    finally { setIsLoadingUser(false); }
  }

  async function updateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUser || isSaving) return;
    const errors = validateForm(editForm, editProfiles, false);
    setEditErrors(errors);
    if (Object.keys(errors).length) return;
    setIsSaving(true); setMutationError("");
    try {
      const token = getTokenCookie();
      if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
      const response = await apiRequest({ path: `/usuarios/${selectedUser.id}`, method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: requestBody(editForm, Boolean(editForm.password)) });
      const result = (await response.json().catch(() => null)) as ApiResponse<UserApi> | null;
      if (!response.ok) throw new Error(result?.message || "Não foi possível atualizar o usuário.");
      closeEdit(); setReloadKey((value) => value + 1);
      setSuccess({ title: "Usuário atualizado", description: "As alterações do usuário foram salvas." });
    } catch (error) { setMutationError(error instanceof Error ? error.message : "Não foi possível atualizar o usuário."); }
    finally { setIsSaving(false); }
  }

  async function deleteUser() {
    if (!selectedUser || isDeleting) return;
    setShowDeleteConfirmation(false); setIsDeleting(true); setMutationError("");
    try {
      const token = getTokenCookie();
      if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
      const response = await apiRequest({ path: `/usuarios/${selectedUser.id}`, method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const result = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
      if (!response.ok) throw new Error(result?.message || "Não foi possível excluir o usuário.");
      closeEdit(); setReloadKey((value) => value + 1);
      setSuccess({ title: "Usuário excluído", description: "O usuário foi removido da organização." });
    } catch (error) { setMutationError(error instanceof Error ? error.message : "Não foi possível excluir o usuário."); }
    finally { setIsDeleting(false); }
  }

  return (
    <div className="audit-page organization-users-page">
      <SectionHeader eyebrow="Minha Organização" title="Usuários" description="Consulte e gerencie os usuários vinculados à sua organização." />
      <Card className="app-card organization-users-list-card"><Card.Body>
        {isLoading ? <Loading label="Carregando usuários" description="Consultando os usuários da organização." /> : loadError ? (
          <Alert variant="danger"><p>{loadError}</p><Button variant="outline-danger" onClick={() => setReloadKey((value) => value + 1)}>Tentar novamente</Button></Alert>
        ) : <DataTable header={<div className="card-heading"><h2>Usuários da organização</h2><Badge bg="light" text="dark">{users.length} usuários</Badge></div>}
          onCreate={() => setShowCreate(true)} createLabel="Novo usuário" columns={columns} data={users}
          getRowKey={(user) => String(user.id)} page={page} pageSize={8} onPageChange={setPage}
          onRowClick={(user) => void openUser(user)} emptyMessage="Nenhum usuário cadastrado." />}
      </Card.Body></Card>

      <Modal show={showCreate} onHide={closeCreate} centered scrollable size="xl" backdrop={isCreating ? "static" : true} keyboard={!isCreating}>
        <Form onSubmit={createUser} noValidate><Loading visible={isCreating} mode="overlay" label="Criando usuário" description="Salvando o novo cadastro." />
          <Modal.Header closeButton={!isCreating}><Modal.Title>Novo usuário</Modal.Title></Modal.Header>
          <Modal.Body><UserForm prefix="createUser" data={createForm} errors={createErrors} profiles={profiles} passwordRequired onChange={changeCreate} /></Modal.Body>
          <Modal.Footer><Button variant="light" onClick={closeCreate} disabled={isCreating}>Cancelar</Button><Button type="submit" className="starter-button-form" disabled={isCreating}>{isCreating ? "Criando..." : "Criar usuário"}</Button></Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showEdit} onHide={closeEdit} centered scrollable size="xl" backdrop={isSaving || isDeleting ? "static" : true} keyboard={!isSaving && !isDeleting}>
        <Form onSubmit={updateUser} noValidate><Loading visible={isSaving || isDeleting} mode="overlay" label={isDeleting ? "Excluindo usuário" : "Salvando usuário"} description="Aguarde a conclusão da operação." />
          <Modal.Header closeButton={!isSaving && !isDeleting}><Modal.Title>Editar usuário</Modal.Title></Modal.Header>
          <Modal.Body>{isLoadingUser ? <Loading label="Carregando usuário" description="Consultando os dados selecionados." /> : userError ? <Alert variant="danger" className="mb-0">{userError}</Alert> : selectedUser ? <UserForm prefix="editUser" data={editForm} errors={editErrors} profiles={editProfiles} passwordRequired={false} onChange={changeEdit} /> : null}</Modal.Body>
          {selectedUser && !isLoadingUser && !userError ? <Modal.Footer><Button type="button" variant="danger" onClick={() => setShowDeleteConfirmation(true)} disabled={isSaving || isDeleting}>Excluir</Button><Button type="submit" className="starter-button-form" disabled={isSaving || isDeleting}>{isSaving ? "Salvando..." : "Salvar"}</Button></Modal.Footer> : null}
        </Form>
      </Modal>

      <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)} centered>
        <Modal.Header closeButton><Modal.Title>Excluir usuário</Modal.Title></Modal.Header>
        <Modal.Body><p className="mb-0">Deseja excluir o usuário <strong>{selectedUser?.nome}</strong>? Esta ação não poderá ser desfeita.</p></Modal.Body>
        <Modal.Footer><Button variant="light" onClick={() => setShowDeleteConfirmation(false)}>Cancelar</Button><Button variant="danger" onClick={() => void deleteUser()}>Excluir usuário</Button></Modal.Footer>
      </Modal>

      <FeedbackState show={Boolean(success)} onClose={() => setSuccess(null)} variant="success" title={success?.title ?? "Operação concluída"} description={success?.description ?? "A operação foi concluída com sucesso."} />
      <FeedbackState show={Boolean(mutationError)} onClose={() => setMutationError("")} variant="error" title="Não foi possível concluir a operação" description={mutationError} />
    </div>
  );
}
