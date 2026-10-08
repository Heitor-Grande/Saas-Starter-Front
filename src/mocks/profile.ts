export interface ProfileDetail {
  label: string;
  value: string;
}

export const profileDetails: ProfileDetail[] = [
  { label: "Nome", value: "Alex Morgan" },
  { label: "Email", value: "alex.morgan@example.com" },
  { label: "Cargo", value: "Product Lead" },
  { label: "Organizacao", value: "Starter Workspace" }
];

export const settingsOptions = [
  "Resumo semanal",
  "Alertas de seguranca",
  "Modo compacto",
  "Preferencias de acessibilidade"
];
