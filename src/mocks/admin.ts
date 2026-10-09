export interface AdminUser {
  name: string;
  email: string;
  role: string;
  organization: string;
  status: "Ativo" | "Pendente" | "Inativo";
}

export interface Organization {
  name: string;
  plan: string;
  members: number;
  status: "Ativa" | "Avaliacao" | "Pausada";
}

export interface AccessProfile {
  name: string;
  description: string;
  users: number;
  permissions: string[];
}

export interface PermissionGroup {
  resource: string;
  permissions: {
    label: string;
    admin: boolean;
    manager: boolean;
    viewer: boolean;
  }[];
}

export const adminUsers: AdminUser[] = [
  {
    name: "Marina Costa",
    email: "marina.costa@example.com",
    role: "Administrador",
    organization: "Workspace Alpha",
    status: "Ativo"
  },
  {
    name: "Rafael Lima",
    email: "rafael.lima@example.com",
    role: "Gestor",
    organization: "Portal Sigma",
    status: "Pendente"
  },
  {
    name: "Camila Torres",
    email: "camila.torres@example.com",
    role: "Leitor",
    organization: "Hub Delta",
    status: "Ativo"
  },
  {
    name: "Bruno Alves",
    email: "bruno.alves@example.com",
    role: "Suporte",
    organization: "Workspace Alpha",
    status: "Inativo"
  }
];

export const organizations: Organization[] = [
  { name: "Workspace Alpha", plan: "Growth", members: 42, status: "Ativa" },
  { name: "Portal Sigma", plan: "Starter", members: 18, status: "Avaliacao" },
  { name: "Hub Delta", plan: "Scale", members: 76, status: "Pausada" }
];

export const accessProfiles: AccessProfile[] = [
  {
    name: "Administrador",
    description: "Gerencia configurações, usuários, perfis e organizações.",
    users: 6,
    permissions: [
      "users.edit", "users.view", "users.create", "users.delete",
      "organizations.edit", "organizations.view", "organizations.create", "organizations.delete",
      "profiles.edit", "profiles.view", "profiles.create", "profiles.delete",
      "global-settings.edit", "global-settings.view"
    ]
  },
  {
    name: "Gestor",
    description: "Acompanha a operação e gerencia usuários do próprio workspace.",
    users: 18,
    permissions: ["general-dashboard.view", "users.view", "users.edit", "users.create"]
  },
  {
    name: "Leitor",
    description: "Acessa visualizações sem alterar dados administrativos.",
    users: 54,
    permissions: ["general-dashboard.view", "profiles.view"]
  }
];

export const permissionGroups: PermissionGroup[] = [
  {
    resource: "Usuarios",
    permissions: [
      { label: "Visualizar", admin: true, manager: true, viewer: false },
      { label: "Convidar", admin: true, manager: true, viewer: false },
      { label: "Desativar", admin: true, manager: false, viewer: false }
    ]
  },
  {
    resource: "Organizacoes",
    permissions: [
      { label: "Visualizar", admin: true, manager: true, viewer: false },
      { label: "Editar dados", admin: true, manager: false, viewer: false },
      { label: "Alterar plano", admin: true, manager: false, viewer: false }
    ]
  },
  {
    resource: "Configuracoes",
    permissions: [
      { label: "Visualizar", admin: true, manager: true, viewer: true },
      { label: "Editar preferencias", admin: true, manager: true, viewer: false },
      { label: "Gerenciar papeis", admin: true, manager: false, viewer: false }
    ]
  }
];
