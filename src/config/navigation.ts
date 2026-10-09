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
    label: "Visao Geral",
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
    label: "Administracao",
    description: "Gestao da aplicacao",
    children: [
      {
        id: "users",
        href: "/usuarios",
        label: "Usuarios",
        description: "Contas e acessos"
      },
      {
        id: "profiles-permissions",
        label: "Perfis e Permissoes",
        description: "Papeis e matriz de acesso",
        children: [
          {
            id: "profiles",
            href: "/perfis-acesso",
            label: "Perfis",
            description: "Papeis administrativos"
          },
          {
            id: "permissions",
            href: "/permissoes",
            label: "Permissoes",
            description: "Matriz de recursos"
          }
        ]
      },
      {
        id: "organizations",
        href: "/organizacoes",
        label: "Organizacoes",
        description: "Workspaces e contas"
      },
      {
        id: "plans-subscriptions",
        href: "/planos-assinaturas",
        label: "Planos e Assinaturas",
        description: "Planos, limites e status"
      }
    ]
  },
  {
    id: "system",
    label: "Sistema",
    description: "Operacao e parametros",
    children: [
      {
        id: "audit-logs",
        href: "/logs-auditoria",
        label: "Logs e Auditoria",
        description: "Historico de atividades"
      },
      {
        id: "global-settings",
        href: "/configuracoes-globais",
        label: "Configuracoes Globais",
        description: "Parametros da aplicacao"
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
    description: "Criacao simulada"
  },
  {
    id: "recover",
    href: "/recuperar-senha",
    label: "Recuperar senha",
    description: "Fluxo visual"
  }
];
