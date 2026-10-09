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
    id: "overview",
    label: "Visão Geral",
    description: "Resumo administrativo",
    children: [
      {
        id: "general-dashboard",
        href: "/dashboard",
        label: "Dashboard Geral",
        description: "Indicadores do sistema"
      }
    ]
  },
  {
    id: "administration",
    label: "Administração",
    description: "Gestão da aplicação",
    children: [
      {
        id: "users",
        href: "/usuarios",
        label: "Usuários",
        description: "Contas e acessos"
      },
      {
        id: "profiles-permissions",
        label: "Perfis e Permissões",
        description: "Papéis e matriz de acesso",
        children: [
          {
            id: "profiles",
            href: "/perfis-acesso",
            label: "Perfis",
            description: "Papéis administrativos"
          },
          {
            id: "permissions",
            href: "/permissoes",
            label: "Permissões",
            description: "Matriz de recursos"
          }
        ]
      },
      {
        id: "organizations",
        href: "/organizacoes",
        label: "Organizações",
        description: "Workspaces e contas"
      }
    ]
  },
  {
    id: "system",
    label: "Sistema",
    description: "Operação e parâmetros",
    children: [
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
      }
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
