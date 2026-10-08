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
    id: "product",
    label: "Produto",
    description: "Base operacional",
    children: [
      {
        id: "dashboard",
        href: "/dashboard",
        label: "Dashboard",
        description: "Visao geral demonstrativa"
      },
      {
        id: "workspace",
        label: "Workspace",
        description: "Conta e preferencias",
        children: [
          {
            id: "profile",
            href: "/perfil",
            label: "Perfil",
            description: "Dados do usuario simulado"
          },
          {
            id: "settings",
            href: "/configuracoes",
            label: "Configuracoes",
            description: "Preferencias do template"
          }
        ]
      }
    ]
  },
  {
    id: "foundation",
    label: "Fundacao",
    description: "Componentes e estados",
    children: [
      {
        id: "components",
        href: "/componentes",
        label: "Componentes",
        description: "Biblioteca reutilizavel"
      },
      {
        id: "states",
        href: "/estados",
        label: "Estados",
        description: "Loading, erro, vazio e sucesso"
      }
    ]
  },
  {
    id: "administration",
    label: "Administracao",
    description: "Fase 2",
    children: [
      {
        id: "access",
        label: "Acessos",
        description: "Usuarios e permissoes",
        children: [
          {
            id: "users",
            href: "/usuarios",
            label: "Usuarios",
            description: "Administracao de acessos"
          },
          {
            id: "roles",
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
