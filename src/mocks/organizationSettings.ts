export interface OrganizationSettings {
  name: string;
  cnpj: string;
  address: string;
  plan: string;
  responsibleUserId: string;
  active: boolean;
}

export const initialOrganizationSettings: OrganizationSettings = {
  name: "Workspace Alpha",
  cnpj: "00.000.000/0001-00",
  address: "Rua Exemplo, 100, Centro, São Paulo - SP, 01000-000",
  plan: "Growth",
  responsibleUserId: "USR-001",
  active: true
};
