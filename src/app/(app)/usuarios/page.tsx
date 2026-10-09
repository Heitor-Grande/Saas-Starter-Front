"use client";

import { useState } from "react";
import { Badge, Card } from "react-bootstrap";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { organizationUsers, type OrganizationUser } from "@/mocks/organizationUsers";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short"
});

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "Nunca acessou";
}

const columns: DataTableColumn<OrganizationUser>[] = [
  {
    key: "name",
    header: "Nome",
    render: (user) => <strong>{user.name}</strong>
  },
  {
    key: "profile",
    header: "Perfil",
    render: (user) => user.profile
  },
  {
    key: "active",
    header: "Ativo",
    render: (user) => (
      <span className={`status-pill admin-status-${user.active ? "ativo" : "inativo"}`}>
        {user.active ? "Ativo" : "Inativo"}
      </span>
    )
  },
  {
    key: "createdAt",
    header: "Data de cadastro",
    render: (user) => formatDate(user.createdAt)
  },
  {
    key: "lastAccessAt",
    header: "Último acesso",
    render: (user) => formatDate(user.lastAccessAt)
  }
];

export default function OrganizationUsersPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="audit-page organization-users-page">
      <SectionHeader
        eyebrow="Minha Organização"
        title="Usuários"
        description="Consulte todos os usuários vinculados à sua organização."
      />

      <Card className="app-card organization-users-list-card">
        <Card.Body>
          <DataTable
            header={
              <div className="card-heading">
                <h2>Usuários da organização</h2>
                <Badge bg="light" text="dark">
                  {organizationUsers.length} usuários
                </Badge>
              </div>
            }
            onCreate={() => undefined}
            createLabel="Convidar usuário"
            columns={columns}
            data={organizationUsers}
            getRowKey={(user) => user.id}
            page={page}
            pageSize={4}
            onPageChange={setPage}
            emptyMessage="Nenhum usuário cadastrado."
          />
        </Card.Body>
      </Card>
    </div>
  );
}
