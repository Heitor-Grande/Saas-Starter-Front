"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Alert, Badge, Button, Card, Form, Modal } from "react-bootstrap";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormInput } from "@/components/ui/FormInput";
import { Loading } from "@/components/ui/Loading";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { apiRequest } from "@/util/apiRequest";
import { getTokenCookie } from "@/util/getTokenCookie";

interface PerfilApi {
  id: number;
  nome: string;
  descricao: string;
}

interface ApiResponse<T> {
  message?: string;
  data?: T;
}

interface Profile {
  id: number;
  name: string;
  description: string;
}

function mapProfile(profile: PerfilApi): Profile {
  return {
    id: profile.id,
    name: profile.nome,
    description: profile.descricao
  };
}

const columns: DataTableColumn<Profile>[] = [
  { key: "name", header: "Nome do perfil", render: (profile) => <strong>{profile.name}</strong> },
  { key: "description", header: "Descrição", render: (profile) => profile.description }
];

export default function AccessProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editErrors, setEditErrors] = useState<{ name?: string; description?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [profileMutationError, setProfileMutationError] = useState("");
  const [successFeedback, setSuccessFeedback] = useState<{ title: string; description: string } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  useEffect(() => {
    let isActive = true;

    async function loadProfiles() {
      setIsLoading(true);
      setLoadError("");

      try {
        const token = getTokenCookie();
        if (!token) {
          throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
        }

        const response = await apiRequest({
          path: "/perfis/findAll",
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = (await response.json().catch(() => null)) as ApiResponse<PerfilApi[]> | null;

        if (!response.ok) {
          throw new Error(result?.message || "Não foi possível consultar os perfis.");
        }

        if (!Array.isArray(result?.data)) {
          throw new Error("A resposta da consulta de perfis é inválida.");
        }

        if (isActive) {
          setProfiles(result.data.map(mapProfile));
        }
      } catch (error) {
        if (isActive) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Não foi possível consultar os perfis. Tente novamente."
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadProfiles();

    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  async function loadProfile(profile: Profile) {
    setShowDetails(true);
    setSelectedProfile(null);
    setProfileError("");
    setIsLoadingProfile(true);

    try {
      const token = getTokenCookie();
      if (!token) {
        throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
      }

      const response = await apiRequest({
        path: `/perfis/findOne/${profile.id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = (await response.json().catch(() => null)) as ApiResponse<PerfilApi> | null;

      if (!response.ok) {
        throw new Error(result?.message || "Não foi possível consultar o perfil.");
      }

      if (!result?.data) {
        throw new Error("A resposta da consulta do perfil é inválida.");
      }

      const loadedProfile = mapProfile(result.data);
      setSelectedProfile(loadedProfile);
      setEditName(loadedProfile.name);
      setEditDescription(loadedProfile.description);
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Não foi possível consultar o perfil. Tente novamente."
      );
    } finally {
      setIsLoadingProfile(false);
    }
  }

  function closeDetails() {
    setShowDetails(false);
    setSelectedProfile(null);
    setProfileError("");
    setEditName("");
    setEditDescription("");
    setEditErrors({});
    setShowDeleteConfirmation(false);
  }

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProfile || isSaving || isDeleting) return;

    const trimmedName = editName.trim();
    const trimmedDescription = editDescription.trim();
    const nextErrors: typeof editErrors = {};

    if (!trimmedName) {
      nextErrors.name = "Informe o nome do perfil.";
    } else if (trimmedName.length > 50) {
      nextErrors.name = "O nome do perfil deve ter no máximo 50 caracteres.";
    } else if (profiles.some((profile) =>
      profile.id !== selectedProfile.id &&
      profile.name.toLocaleLowerCase("pt-BR") === trimmedName.toLocaleLowerCase("pt-BR")
    )) {
      nextErrors.name = "Já existe um perfil com esse nome.";
    }

    if (!trimmedDescription) {
      nextErrors.description = "Informe a descrição do perfil.";
    } else if (trimmedDescription.length > 100) {
      nextErrors.description = "A descrição deve ter no máximo 100 caracteres.";
    }

    setEditErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setProfileMutationError("");
    setIsSaving(true);

    try {
      const token = getTokenCookie();
      if (!token) {
        throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
      }

      const response = await apiRequest({
        path: `/perfis/update/${selectedProfile.id}`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: { nome: trimmedName, descricao: trimmedDescription }
      });
      const result = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;

      if (!response.ok) {
        throw new Error(result?.message || "Não foi possível atualizar o perfil.");
      }

      closeDetails();
      setReloadKey((value) => value + 1);
      setSuccessFeedback({
        title: "Perfil atualizado com sucesso",
        description: "As alterações do perfil foram salvas."
      });
    } catch (error) {
      setProfileMutationError(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o perfil. Tente novamente."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProfile() {
    if (!selectedProfile || isSaving || isDeleting) return;

    setShowDeleteConfirmation(false);
    setProfileMutationError("");
    setIsDeleting(true);

    try {
      const token = getTokenCookie();
      if (!token) {
        throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
      }

      const response = await apiRequest({
        path: `/perfis/remove/${selectedProfile.id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;

      if (!response.ok) {
        throw new Error(result?.message || "Não foi possível excluir o perfil.");
      }

      closeDetails();
      setReloadKey((value) => value + 1);
      setSuccessFeedback({
        title: "Perfil excluído com sucesso",
        description: "O perfil foi removido da listagem."
      });
    } catch (error) {
      setProfileMutationError(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o perfil. Tente novamente."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery)
  );

  function closeCreate() {
    setShowCreate(false);
    setName("");
    setDescription("");
    setErrors({});
  }

  async function createProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isCreating) return;

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const nextErrors: typeof errors = {};

    if (!trimmedName) {
      nextErrors.name = "Informe o nome do perfil.";
    } else if (profiles.some((profile) =>
      profile.name.toLocaleLowerCase("pt-BR") === trimmedName.toLocaleLowerCase("pt-BR")
    )) {
      nextErrors.name = "Já existe um perfil com esse nome.";
    }
    if (!trimmedDescription) nextErrors.description = "Informe a descrição do perfil.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setCreateError("");
    setIsCreating(true);

    try {
      const token = getTokenCookie();
      if (!token) {
        throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
      }

      const response = await apiRequest({
        path: "/perfis/create",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          nome: trimmedName,
          descricao: trimmedDescription
        }
      });
      const result = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;

      if (!response.ok) {
        throw new Error(result?.message || "Não foi possível criar o perfil.");
      }

      setPage(1);
      setQuery("");
      closeCreate();
      setReloadKey((value) => value + 1);
      setSuccessFeedback({
        title: "Perfil criado com sucesso",
        description: "O novo perfil foi adicionado à listagem."
      });
    } catch (error) {
      setCreateError(
        error instanceof Error
          ? error.message
          : "Não foi possível criar o perfil. Tente novamente."
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="audit-page">

      <SectionHeader
        eyebrow="Administração"
        title="Perfis"
        description="Consulte os perfis de acesso cadastrados e crie novos perfis."
      />

      <Card className="app-card">
        <Card.Body>
          <FormInput
            id="profileSearch"
            label="Filtrar por nome do perfil"
            placeholder="Digite o nome do perfil"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </Card.Body>
      </Card>
      <Card className="app-card profiles-table-card">
        <Card.Body>
          {isLoading ? (
            <Loading label="Carregando perfis" description="Consultando os perfis cadastrados." />
          ) : loadError ? (
            <Alert variant="danger" className="mb-0">
              <p>{loadError}</p>
              <Button variant="outline-danger" onClick={() => setReloadKey((value) => value + 1)}>
                Tentar novamente
              </Button>
            </Alert>
          ) : (
            <DataTable
              header={
                <div className="card-heading">
                  <h2>Perfis cadastrados</h2>
                  <Badge bg="light" text="dark">{filteredProfiles.length} {filteredProfiles.length === 1 ? "perfil" : "perfis"}</Badge>
                </div>
              }
              onCreate={() => setShowCreate(true)}
              createLabel="Novo perfil"
              columns={columns}
              data={filteredProfiles}
              getRowKey={(profile) => String(profile.id)}
              page={page}
              onPageChange={setPage}
              onRowClick={(profile) => void loadProfile(profile)}
              emptyMessage="Nenhum perfil encontrado."
            />
          )}
        </Card.Body>
      </Card>

      <Modal
        show={showCreate}
        onHide={closeCreate}
        centered
        size="lg"
        backdrop={isCreating ? "static" : true}
        keyboard={!isCreating}
        aria-labelledby="new-profile-title"
      >
        <Form onSubmit={createProfile} noValidate>
          <Loading
            visible={isCreating}
            mode="overlay"
            label="Criando perfil"
            description="Salvando os dados do novo perfil."
          />
          <Modal.Header closeButton={!isCreating} closeLabel="Fechar">
            <Modal.Title id="new-profile-title">Novo perfil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="profiles-form-grid">
              <FormInput
                id="profileName" label="Nome do perfil" value={name}
                onChange={(event) => setName(event.target.value)} error={errors.name} autoFocus required
              />
              <FormInput
                id="profileDescription" label="Descrição" as="textarea" rows={3} value={description}
                onChange={(event) => setDescription(event.target.value)} error={errors.description} required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={closeCreate} disabled={isCreating}>Cancelar</Button>
            <Button type="submit" className="starter-button" disabled={isCreating}>
              {isCreating ? "Criando..." : "Criar perfil"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={showDetails} onHide={closeDetails}
        centered scrollable size="lg"
        backdrop={isSaving || isDeleting ? "static" : true}
        keyboard={!isSaving && !isDeleting}
        aria-labelledby="profile-details-title"
      >
        <Form onSubmit={updateProfile} noValidate>
          <Loading
            visible={isSaving || isDeleting}
            mode="overlay"
            label={isDeleting ? "Excluindo perfil" : "Salvando perfil"}
            description="Aguarde a conclusão da operação."
          />
          <Modal.Header closeButton={!isSaving && !isDeleting} closeLabel="Fechar">
            <Modal.Title id="profile-details-title">Editar perfil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isLoadingProfile ? (
              <Loading label="Carregando perfil" description="Consultando os dados do perfil selecionado." />
            ) : profileError ? (
              <Alert variant="danger" className="mb-0">{profileError}</Alert>
            ) : selectedProfile ? (
              <div className="profiles-form-grid">
                <FormInput
                  id="editProfileName"
                  label="Nome do perfil"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  error={editErrors.name}
                  maxLength={50}
                  required
                />
                <FormInput
                  id="editProfileDescription"
                  label="Descrição"
                  as="textarea"
                  rows={4}
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  error={editErrors.description}
                  maxLength={100}
                  required
                />
              </div>
            ) : null}
          </Modal.Body>
          {selectedProfile && !isLoadingProfile && !profileError ? (
            <Modal.Footer>
              <Button
                type="button"
                variant="danger"
                onClick={() => setShowDeleteConfirmation(true)}
                disabled={isSaving || isDeleting}
              >
                Deletar
              </Button>
              <Button type="submit" className="starter-button-form" disabled={isSaving || isDeleting}>
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </Modal.Footer>
          ) : null}
        </Form>
      </Modal>

      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        centered
        aria-labelledby="delete-profile-title"
      >
        <Modal.Header closeButton closeLabel="Fechar">
          <Modal.Title id="delete-profile-title">Excluir perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Deseja excluir o perfil <strong>{selectedProfile?.name}</strong>? Essa ação não poderá ser desfeita.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowDeleteConfirmation(false)}>Cancelar</Button>
          <Button variant="danger" onClick={() => void deleteProfile()}>Excluir perfil</Button>
        </Modal.Footer>
      </Modal>

      <FeedbackState
        show={Boolean(successFeedback)}
        onClose={() => setSuccessFeedback(null)}
        variant="success"
        title={successFeedback?.title ?? "Operação realizada com sucesso"}
        description={successFeedback?.description ?? "A operação foi concluída."}
      />
      <FeedbackState
        show={Boolean(createError)}
        onClose={() => setCreateError("")}
        variant="error"
        title="Não foi possível criar o perfil"
        description={createError}
      />
      <FeedbackState
        show={Boolean(profileMutationError)}
        onClose={() => setProfileMutationError("")}
        variant="error"
        title="Não foi possível alterar o perfil"
        description={profileMutationError}
      />
    </div>
  );
}
