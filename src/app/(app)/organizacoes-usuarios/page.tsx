"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge, Card } from "react-bootstrap";
import type { DataTableColumn } from "@/components/ui/DataTable";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TreeDataTable } from "@/components/ui/TreeDataTable";
import { organizationsWithMembers, type OrganizationWithMembers, type OrganizationMember } from "@/mocks/organizationMembers";

const organizationColumns: DataTableColumn<OrganizationWithMembers>[] = [
  { key: "name", header: "Nome", render: (organization) => <strong>{organization.name}</strong> },
  {
    key: "status", header: "Status",
    render: (organization) => (
      <span className={`status-pill admin-status-${organization.active ? "ativo" : "inativo"}`}>
        {organization.active ? "Ativo" : "Inativo"}
      </span>
    )
  },
  { key: "members", header: "Total de membros", render: (organization) => organization.members.length },
  { key: "plan", header: "Plano assinado", render: (organization) => organization.plan }
];

const memberColumns: DataTableColumn<OrganizationMember>[] = [
  { key: "name", header: "Nome", render: (member) => member.name },
  { key: "profile", header: "Perfil", render: (member) => member.profile },
  {
    key: "avatar", header: "Avatar", className: "organization-avatar-cell",
    render: (member) => member.avatarUrl ? (
      <Image src={member.avatarUrl} alt={`Foto de ${member.name}`} width={36} height={36} className="organization-member-avatar" />
    ) : (
      <span className="organization-member-avatar" aria-label={`Avatar de ${member.name}`}>
        {member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
      </span>
    )
  }
];

export default function OrganizationsUsersPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="audit-page organizations-users-page">
      <SectionHeader
        eyebrow="Sistema"
        title="Organizações e Usuários"
        description="Consulte as organizações, seus planos e os membros vinculados."
      />
      <Card className="app-card organizations-users-table-card">
        <Card.Body>
          <TreeDataTable
            header={
              <div className="card-heading">
                <h2>Organizações cadastradas</h2>
                <Badge bg="light" text="dark">{organizationsWithMembers.length} organizações</Badge>
              </div>
            }
            data={organizationsWithMembers}
            columns={organizationColumns}
            childColumns={memberColumns}
            getRowKey={(organization) => organization.id}
            getRowLabel={(organization) => organization.name}
            getChildren={(organization) => organization.members}
            getChildKey={(member) => member.id}
            page={page}
            pageSize={3}
            onPageChange={setPage}
            emptyMessage="Nenhuma organização cadastrada."
          />
        </Card.Body>
      </Card>
    </div>
  );
}
