export type AuditAction = "POST" | "PUT" | "DELETE";

export interface AuditLog {
  id: string;
  user: {
    name: string;
    email: string;
  };
  organization: string;
  occurredAt: string;
  action: AuditAction;
  resource: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
}

export const auditLogs: AuditLog[] = [
  {
    id: "LOG-1048",
    user: { name: "Marina Costa", email: "marina.costa@example.com" },
    organization: "Workspace Alpha",
    occurredAt: "2026-10-08T14:32:00-03:00",
    action: "PUT",
    resource: "Usuário / USR-204",
    before: {
      id: "USR-204",
      nome: "Rafael Lima",
      perfil: "Leitor",
      ativo: true
    },
    after: {
      id: "USR-204",
      nome: "Rafael Lima",
      perfil: "Gestor",
      ativo: true
    }
  },
  {
    id: "LOG-1047",
    user: { name: "Bruno Alves", email: "bruno.alves@example.com" },
    organization: "Portal Sigma",
    occurredAt: "2026-10-08T11:18:00-03:00",
    action: "POST",
    resource: "Organização / ORG-088",
    before: null,
    after: {
      id: "ORG-088",
      nome: "Nucleo Aurora",
      plano: "Starter",
      ativa: true
    }
  },
  {
    id: "LOG-1046",
    user: { name: "Camila Torres", email: "camila.torres@example.com" },
    organization: "Hub Delta",
    occurredAt: "2026-10-07T17:46:00-03:00",
    action: "DELETE",
    resource: "Convite / INV-391",
    before: {
      id: "INV-391",
      email: "convidado@example.com",
      perfil: "Leitor",
      status: "Pendente"
    },
    after: null
  },
  {
    id: "LOG-1045",
    user: { name: "Marina Costa", email: "marina.costa@example.com" },
    organization: "Workspace Alpha",
    occurredAt: "2026-10-07T09:05:00-03:00",
    action: "PUT",
    resource: "Perfil / PRF-012",
    before: { id: "PRF-012", nome: "Suporte", permissoes: ["usuarios.ler"] },
    after: {
      id: "PRF-012",
      nome: "Suporte",
      permissoes: ["usuarios.ler", "usuarios.editar"]
    }
  },
  {
    id: "LOG-1044",
    user: { name: "Rafael Lima", email: "rafael.lima@example.com" },
    organization: "Portal Sigma",
    occurredAt: "2026-10-06T16:21:00-03:00",
    action: "POST",
    resource: "Usuário / USR-219",
    before: null,
    after: {
      id: "USR-219",
      nome: "Juliana Freitas",
      email: "juliana.freitas@example.com",
      ativo: true
    }
  },
  {
    id: "LOG-1043",
    user: { name: "Bruno Alves", email: "bruno.alves@example.com" },
    organization: "Workspace Alpha",
    occurredAt: "2026-10-06T10:12:00-03:00",
    action: "DELETE",
    resource: "Token de acesso / TKN-055",
    before: { id: "TKN-055", descricao: "Integração de homologação", ativo: true },
    after: null
  },
  {
    id: "LOG-1042",
    user: { name: "Camila Torres", email: "camila.torres@example.com" },
    organization: "Hub Delta",
    occurredAt: "2026-10-05T15:40:00-03:00",
    action: "PUT",
    resource: "Organização / ORG-021",
    before: { id: "ORG-021", nome: "Hub Delta", plano: "Growth" },
    after: { id: "ORG-021", nome: "Hub Delta", plano: "Scale" }
  }
];
