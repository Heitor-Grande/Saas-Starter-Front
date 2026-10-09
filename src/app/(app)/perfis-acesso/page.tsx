"use client";

import { useState, type FormEvent } from "react";
import { Badge, Button, Card, Form, Modal, Tab, Tabs } from "react-bootstrap";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormInput } from "@/components/ui/FormInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { accessProfiles, type AccessProfile } from "@/mocks/admin";
import { ProfilePermissions } from "@/features/profiles/ProfilePermissions";

const columns: DataTableColumn<AccessProfile>[] = [
  { key: "name", header: "Nome do perfil", render: (profile) => <strong>{profile.name}</strong> },
  { key: "description", header: "Descrição", render: (profile) => profile.description }
];

export default function AccessProfilesPage() {
  const [profiles, setProfiles] = useState<AccessProfile[]>(accessProfiles);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AccessProfile | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [createTab, setCreateTab] = useState("general");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery)
  );

  function closeCreate() {
    setShowCreate(false);
    setName("");
    setDescription("");
    setPermissions([]);
    setCreateTab("general");
    setErrors({});
  }

  function createProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      setCreateTab("general");
      return;
    }

    setProfiles((current) => [
      { name: trimmedName, description: trimmedDescription, users: 0, permissions },
      ...current
    ]);
    setPage(1);
    setQuery("");
    closeCreate();
    setShowSuccess(true);
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
            getRowKey={(profile) => profile.name}
            page={page}
            pageSize={4}
            onPageChange={setPage}
            onRowClick={setSelectedProfile}
            emptyMessage="Nenhum perfil encontrado."
          />
        </Card.Body>
      </Card>

      <Modal show={showCreate} onHide={closeCreate} centered size="lg" aria-labelledby="new-profile-title">
        <Form onSubmit={createProfile} noValidate>
          <Modal.Header closeButton closeLabel="Fechar">
            <Modal.Title id="new-profile-title">Novo perfil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs
              id="create-profile-tabs"
              activeKey={createTab}
              onSelect={(key) => setCreateTab(key ?? "general")}
              className="profile-form-tabs"
            >
              <Tab eventKey="general" title="Dados gerais">
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
              </Tab>
              <Tab eventKey="permissions" title="Permissões">
                <ProfilePermissions idPrefix="new-profile" permissions={permissions} onChange={setPermissions} />
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={closeCreate}>Cancelar</Button>
            <Button type="submit" className="starter-button">Criar perfil</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={Boolean(selectedProfile)} onHide={() => setSelectedProfile(null)}
        centered scrollable size="lg" aria-labelledby="profile-details-title"
      >
        <Modal.Header closeButton closeLabel="Fechar">
          <Modal.Title id="profile-details-title">Perfil cadastrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProfile ? (
            <Tabs id="view-profile-tabs" defaultActiveKey="general" className="profile-form-tabs">
              <Tab eventKey="general" title="Dados gerais">
                <div className="profiles-form-grid">
                  <FormInput id="viewProfileName" label="Nome do perfil" value={selectedProfile.name} readOnly />
                  <FormInput
                    id="viewProfileDescription" label="Descrição" as="textarea" rows={4}
                    value={selectedProfile.description} readOnly
                  />
                </div>
              </Tab>
              <Tab eventKey="permissions" title="Permissões">
                <ProfilePermissions idPrefix="view-profile" permissions={selectedProfile.permissions} />
              </Tab>
            </Tabs>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setSelectedProfile(null)}>Fechar</Button>
        </Modal.Footer>
      </Modal>

      <FeedbackState
        show={showSuccess} onClose={() => setShowSuccess(false)} variant="success"
        title="Perfil criado com sucesso" description="O novo perfil foi adicionado à listagem."
      />
    </div>
  );
}
