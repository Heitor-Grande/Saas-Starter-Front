export interface DashboardMetric {
  label: string;
  value: string;
  variation: string;
  tone: "primary" | "accent" | "neutral";
}

export interface ActivityItem {
  title: string;
  description: string;
  time: string;
}

export interface TableRow {
  name: string;
  owner: string;
  status: "Ativo" | "Rascunho" | "Pausado";
  progress: number;
}

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Receita simulada",
    value: "R$ 42,8k",
    variation: "+12% no periodo",
    tone: "primary"
  },
  {
    label: "Contas ativas",
    value: "1.284",
    variation: "+84 novas",
    tone: "accent"
  },
  {
    label: "Saude operacional",
    value: "98%",
    variation: "Estavel",
    tone: "neutral"
  }
];

export const activityItems: ActivityItem[] = [
  {
    title: "Novo convite enviado",
    description: "Fluxo visual de convite validado com dados ficticios.",
    time: "08:30"
  },
  {
    title: "Plano atualizado",
    description: "Simulacao de alteracao sem cobranca real.",
    time: "10:15"
  },
  {
    title: "Preferencias salvas",
    description: "Estado de sucesso demonstrado localmente.",
    time: "13:40"
  }
];

export const tableRows: TableRow[] = [
  { name: "Workspace Alpha", owner: "Marina Costa", status: "Ativo", progress: 86 },
  { name: "Portal Sigma", owner: "Rafael Lima", status: "Rascunho", progress: 42 },
  { name: "Hub Delta", owner: "Camila Torres", status: "Pausado", progress: 64 }
];
