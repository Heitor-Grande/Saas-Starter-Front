"use client";

import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card } from "react-bootstrap";
import type { DataTableColumn } from "@/components/ui/DataTable";
import { Loading } from "@/components/ui/Loading";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TreeDataTable } from "@/components/ui/TreeDataTable";
import { apiRequest } from "@/util/apiRequest";
import { getTokenCookie } from "@/util/getTokenCookie";

interface OrganizationMember {
  id: number;
  nome: string;
  perfil: string;
  ativo: boolean;
}

interface OrganizationWithMembers {
  id: number;
  nome: string;
  plano: string;
  usuarios: OrganizationMember[];
}

interface ApiResponse<T> {
  message?: string;
  data?: T;
}

const organizationColumns: DataTableColumn<OrganizationWithMembers>[] = [
  {
    key: "nome",
    header: "Nome",
    render: (organization) => <strong>{organization.nome}</strong>
  },
  {
    key: "usuarios",
    header: "Total de membros",
    render: (organization) => organization.usuarios.length
  },
  {
    key: "plano",
    header: "Plano assinado",
    render: (organization) => organization.plano
  }
];

const memberColumns: DataTableColumn<OrganizationMember>[] = [
  { key: "nome", header: "Nome", render: (member) => member.nome },
  { key: "perfil", header: "Perfil", render: (member) => member.perfil },
  {
    key: "ativo",
    header: "Status",
    render: (member) => (
      <span className={`status-pill admin-status-${member.ativo ? "ativo" : "inativo"}`}>
        {member.ativo ? "Ativo" : "Inativo"}
      </span>
    )
  }
];

export default function OrganizationsUsersPage() {
  const [organizations, setOrganizations] = useState<OrganizationWithMembers[]>([]);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadOrganizations() {
      setIsLoading(true);
      setLoadError("");

      try {
        const token = getTokenCookie();
        if (!token) {
          throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");
        }

        const response = await apiRequest({
          path: "/organizacoes-usuarios/findAll",
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = (await response.json().catch(() => null)) as
          | ApiResponse<OrganizationWithMembers[]>
          | null;

        if (!response.ok) {
          throw new Error(result?.message || "Não foi possível consultar as organizações e usuários.");
        }

        if (!Array.isArray(result?.data)) {
          throw new Error("A resposta da consulta de organizações e usuários é inválida.");
        }

        if (isActive) {
          setOrganizations(result.data);
          setPage(1);
        }
      } catch (error) {
        if (isActive) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Não foi possível consultar as organizações e usuários. Tente novamente."
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadOrganizations();

    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  return (
    <div className="audit-page organizations-users-page">
      <SectionHeader
        eyebrow="Sistema"
        title="Organizações e Usuários"
        description="Consulte as organizações, seus planos e os membros vinculados."
      />
      <Card className="app-card organizations-users-table-card">
        <Card.Body>
          {isLoading ? (
            <Loading
              label="Carregando organizações e usuários"
              description="Consultando as organizações e seus membros."
            />
          ) : loadError ? (
            <Alert variant="danger" className="mb-0">
              <p>{loadError}</p>
              <Button variant="outline-danger" onClick={() => setReloadKey((value) => value + 1)}>
                Tentar novamente
              </Button>
            </Alert>
          ) : (
            <TreeDataTable
              header={
                <div className="card-heading">
                  <h2>Organizações cadastradas</h2>
                  <Badge bg="light" text="dark">
                    {organizations.length} organizações
                  </Badge>
                </div>
              }
              data={organizations}
              columns={organizationColumns}
              childColumns={memberColumns}
              getRowKey={(organization) => String(organization.id)}
              getRowLabel={(organization) => organization.nome}
              getChildren={(organization) => organization.usuarios}
              getChildKey={(member) => String(member.id)}
              page={page}
              pageSize={3}
              onPageChange={setPage}
              emptyMessage="Nenhuma organização cadastrada."
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
