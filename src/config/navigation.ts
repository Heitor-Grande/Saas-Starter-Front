export interface NavigationItem {
  id: string;
  href?: string;
  label: string;
  description: string;
  children?: NavigationItem[];
}

export type NavigationLink = NavigationItem & { href: string };

export const mainNavigation: NavigationItem[] = [
  {
    id: "general-dashboard",
    href: "/dashboard",
    label: "Dashboard Geral",
    description: "Indicadores"
  },
  {
    id: "my-organization",
    label: "Minha Organização",
    description: "Dados e membros da organização",
    children: [
      {
        id: "organizations",
        href: "/organizacoes",
        label: "Organização",
        description: "Dados da minha organização"
      },
      {
        id: "users",
        href: "/usuarios",
        label: "Usuários",
        description: "Lista de todos os usuários da organização"
      }
    ]
  },
  {
    id: "system",
    label: "Sistema",
    description: "Operação e parâmetros",
    children: [
      {
        id: "general-admin-dashboard",
        href: "/dashboardadmin",
        label: "Dashboard Admin",
        description: "Indicadores da aplicação"
      },
      {
        id: "audit-logs",
        href: "/logs-auditoria",
        label: "Logs e Auditoria",
        description: "Histórico de atividades"
      },
      {
        id: "global-settings",
        href: "/configuracoes-globais",
        label: "Configurações Globais",
        description: "Parâmetros da aplicação"
      },
      {
        id: "plans-subscriptions",
        href: "/planos-assinaturas",
        label: "Planos e Assinaturas",
        description: "Planos de assinatura do usuário"
      },
      {
        id: "profiles",
        href: "/perfis-acesso",
        label: "Perfis",
        description: "Papéis administrativos"
      },
      {
        id: "organizacoes-e-usuarios",
        href: "/organizacoes-usuarios",
        label: "Organizações e Usuários",
        description: "Gerenciamento de organizações e usuários"
      },
    ]

  }
];

export const authNavigation: NavigationLink[] = [
  {
    id: "login",
    href: "/login",
    label: "Login",
    description: "Entrada demonstrativa"
  },
  {
    id: "signup",
    href: "/cadastro",
    label: "Cadastro",
    description: "Criação simulada"
  },
  {
    id: "recover",
    href: "/recuperar-senha",
    label: "Recuperar senha",
    description: "Fluxo visual"
  }
];
