export interface OrganizationSettings {
  name: string;
  cnpj: string;
  plan: string;
  responsibleUserId: string;
  active: boolean;
  postalCode: string;
  street: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const initialOrganizationSettings: OrganizationSettings = {
  name: "Workspace Alpha",
  cnpj: "00.000.000/0001-00",
  plan: "Growth",
  responsibleUserId: "USR-001",
  active: true,
  postalCode: "01000-000",
  street: "Rua Exemplo",
  addressNumber: "100",
  complement: "",
  neighborhood: "Centro",
  city: "São Paulo",
  state: "SP"
};
