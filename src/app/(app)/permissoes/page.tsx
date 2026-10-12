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

interface PermissaoApi {
  id: number;
  nome: string;
  descricao: string;
}

interface ApiResponse<T> {
  message?: string;
  data?: T;
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface FormErrors {
  name?: string;
  description?: string;
}

interface Feedback {
  title: string;
  description: string;
}

function mapPermission(permission: PermissaoApi): Permission {
  return {
    id: permission.id,
    name: permission.nome,
    description: permission.descricao
  };
}

function validatePermission(
  name: string,
  description: string,
  permissions: Permission[],
  ignoredId?: number
): FormErrors {
  const errors: FormErrors = {};

  if (!name) {
    errors.name = "Informe o nome da permissão.";
  } else if (name.length > 30) {
    errors.name = "O nome da permissão deve ter no máximo 30 caracteres.";
  } else if (permissions.some((permission) =>
    permission.id !== ignoredId &&
    permission.name.toLocaleLowerCase("pt-BR") === name.toLocaleLowerCase("pt-BR")
  )) {
    errors.name = "Já existe uma permissão com esse nome.";
  }

  if (!description) {
    errors.description = "Informe a descrição da permissão.";
  } else if (description.length > 100) {
    errors.description = "A descrição deve ter no máximo 100 caracteres.";
  }

  return errors;
}

const columns: DataTableColumn<Permission>[] = [
  {
    key: "name",
    header: "Nome da permissão",
    render: (permission) => <strong>{permission.name}</strong>
  },
  {
    key: "description",
    header: "Descrição",
    render: (permission) => permission.description
  }
];

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createErrors, setCreateErrors] = useState<FormErrors>({});
  const [isCreating, setIsCreating] = useState(false);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editErrors, setEditErrors] = useState<FormErrors>({});
  const [isLoadingPermission, setIsLoadingPermission] = useState(false);
  const [permissionError, setPermissionError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [mutationError, setMutationError] = useState("");
  const [successFeedback, setSuccessFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadPermissions() {
      setIsLoading(true);
      setLoadError("");

      try {
        const token = getTokenCookie();
        if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");

        const response = await apiRequest({
          path: "/permissoes/findAll",
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = (await response.json().catch(() => null)) as ApiResponse<PermissaoApi[]> | null;

        if (!response.ok) {
          throw new Error(result?.message || "Não foi possível consultar as permissões.");
        }
        if (!Array.isArray(result?.data)) {
          throw new Error("A resposta da consulta de permissões é inválida.");
        }

        if (isActive) setPermissions(result.data.map(mapPermission));
      } catch (error) {
        if (isActive) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Não foi possível consultar as permissões. Tente novamente."
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadPermissions();
    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  function closeCreate() {
    setShowCreate(false);
    setCreateName("");
    setCreateDescription("");
    setCreateErrors({});
  }

  async function createPermission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isCreating) return;

    const name = createName.trim();
    const description = createDescription.trim();
    const errors = validatePermission(name, description, permissions);
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setMutationError("");
    setIsCreating(true);

    try {
      const token = getTokenCookie();
      if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");

      const response = await apiRequest({
        path: "/permissoes/create",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: { nome: name, descricao: description }
      });
      const result = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
      if (!response.ok) {
        throw new Error(result?.message || "Não foi possível criar a permissão.");
      }

      closeCreate();
      setQuery("");
      setPage(1);
      setReloadKey((value) => value + 1);
      setSuccessFeedback({
        title: "Permissão criada com sucesso",
        description: "A nova permissão foi adicionada à listagem."
      });
    } catch (error) {
      setMutationError(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a permissão. Tente novamente."
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function loadPermission(permission: Permission) {
    setShowDetails(true);
    setSelectedPermission(null);
    setPermissionError("");
    setEditErrors({});
    setIsLoadingPermission(true);

    try {
      const token = getTokenCookie();
      if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");

      const response = await apiRequest({
        path: `/permissoes/findOne/${permission.id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = (await response.json().catch(() => null)) as ApiResponse<PermissaoApi> | null;
      if (!response.ok) {
        throw new Error(result?.message || "Não foi possível consultar a permissão.");
      }
      if (!result?.data) {
        throw new Error("A resposta da consulta da permissão é inválida.");
      }

      const loadedPermission = mapPermission(result.data);
      setSelectedPermission(loadedPermission);
      setEditName(loadedPermission.name);
      setEditDescription(loadedPermission.description);
    } catch (error) {
      setPermissionError(
        error instanceof Error
          ? error.message
          : "Não foi possível consultar a permissão. Tente novamente."
      );
    } finally {
      setIsLoadingPermission(false);
    }
  }

  function closeDetails() {
    setShowDetails(false);
    setSelectedPermission(null);
    setEditName("");
    setEditDescription("");
    setEditErrors({});
    setPermissionError("");
    setShowDeleteConfirmation(false);
  }

  async function updatePermission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPermission || isSaving || isDeleting) return;

    const name = editName.trim();
    const description = editDescription.trim();
    const errors = validatePermission(name, description, permissions, selectedPermission.id);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setMutationError("");
    setIsSaving(true);

    try {
      const token = getTokenCookie();
      if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");

      const response = await apiRequest({
        path: `/permissoes/update/${selectedPermission.id}`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: { nome: name, descricao: description }
      });
      const result = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
      if (!response.ok) {
        throw new Error(result?.message || "Não foi possível atualizar a permissão.");
      }

      closeDetails();
      setReloadKey((value) => value + 1);
      setSuccessFeedback({
        title: "Permissão atualizada com sucesso",
        description: "As alterações da permissão foram salvas."
      });
    } catch (error) {
      setMutationError(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a permissão. Tente novamente."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deletePermission() {
    if (!selectedPermission || isSaving || isDeleting) return;

    setShowDeleteConfirmation(false);
    setMutationError("");
    setIsDeleting(true);

    try {
      const token = getTokenCookie();
      if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");

      const response = await apiRequest({
        path: `/permissoes/remove/${selectedPermission.id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
      if (!response.ok) {
        throw new Error(result?.message || "Não foi possível excluir a permissão.");
      }

      closeDetails();
      setReloadKey((value) => value + 1);
      setSuccessFeedback({
        title: "Permissão excluída com sucesso",
        description: "A permissão foi removida da listagem."
      });
    } catch (error) {
      setMutationError(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a permissão. Tente novamente."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery)
  );

  return (
    <div className="audit-page">
      <SectionHeader
        eyebrow="Sistema"
        title="Permissões"
        description="Consulte e gerencie as permissões disponíveis para os perfis de acesso."
      />

      <Card className="app-card">
        <Card.Body>
          <FormInput
            id="permissionSearch"
            label="Filtrar por nome da permissão"
            placeholder="Digite o nome da permissão"
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
            <Loading label="Carregando permissões" description="Consultando as permissões cadastradas." />
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
                  <h2>Permissões cadastradas</h2>
                  <Badge bg="light" text="dark">
                    {filteredPermissions.length} {filteredPermissions.length === 1 ? "permissão" : "permissões"}
                  </Badge>
                </div>
              }
              onCreate={() => setShowCreate(true)}
              createLabel="Nova permissão"
              columns={columns}
              data={filteredPermissions}
              getRowKey={(permission) => String(permission.id)}
              page={page}
              onPageChange={setPage}
              onRowClick={(permission) => void loadPermission(permission)}
              emptyMessage="Nenhuma permissão encontrada."
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
        aria-labelledby="new-permission-title"
      >
        <Form onSubmit={createPermission} noValidate>
          <Loading
            visible={isCreating}
            mode="overlay"
            label="Criando permissão"
            description="Salvando os dados da nova permissão."
          />
          <Modal.Header closeButton={!isCreating} closeLabel="Fechar">
            <Modal.Title id="new-permission-title">Nova permissão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="profiles-form-grid">
              <FormInput
                id="permissionName"
                label="Nome da permissão"
                value={createName}
                onChange={(event) => setCreateName(event.target.value)}
                error={createErrors.name}
                maxLength={30}
                autoFocus
                required
              />
              <FormInput
                id="permissionDescription"
                label="Descrição"
                as="textarea"
                rows={3}
                value={createDescription}
                onChange={(event) => setCreateDescription(event.target.value)}
                error={createErrors.description}
                maxLength={100}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={closeCreate} disabled={isCreating}>Cancelar</Button>
            <Button type="submit" className="starter-button-form" disabled={isCreating}>
              {isCreating ? "Criando..." : "Criar permissão"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={showDetails}
        onHide={closeDetails}
        centered
        scrollable
        size="lg"
        backdrop={isSaving || isDeleting ? "static" : true}
        keyboard={!isSaving && !isDeleting}
        aria-labelledby="permission-details-title"
      >
        <Form onSubmit={updatePermission} noValidate>
          <Loading
            visible={isSaving || isDeleting}
            mode="overlay"
            label={isDeleting ? "Excluindo permissão" : "Salvando permissão"}
            description="Aguarde a conclusão da operação."
          />
          <Modal.Header closeButton={!isSaving && !isDeleting} closeLabel="Fechar">
            <Modal.Title id="permission-details-title">Editar permissão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isLoadingPermission ? (
              <Loading label="Carregando permissão" description="Consultando os dados selecionados." />
            ) : permissionError ? (
              <Alert variant="danger" className="mb-0">{permissionError}</Alert>
            ) : selectedPermission ? (
              <div className="profiles-form-grid">
                <FormInput
                  id="editPermissionName"
                  label="Nome da permissão"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  error={editErrors.name}
                  maxLength={30}
                  required
                />
                <FormInput
                  id="editPermissionDescription"
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
          {selectedPermission && !isLoadingPermission && !permissionError ? (
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
        aria-labelledby="delete-permission-title"
      >
        <Modal.Header closeButton closeLabel="Fechar">
          <Modal.Title id="delete-permission-title">Excluir permissão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Deseja excluir a permissão <strong>{selectedPermission?.name}</strong>? Os vínculos existentes com
            perfis também serão removidos.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowDeleteConfirmation(false)}>Cancelar</Button>
          <Button variant="danger" onClick={() => void deletePermission()}>Excluir permissão</Button>
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
        show={Boolean(mutationError)}
        onClose={() => setMutationError("")}
        variant="error"
        title="Não foi possível concluir a operação"
        description={mutationError}
      />
    </div>
  );
}
