export interface CurrentUser {
  fullName: string;
  socialName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  active: boolean;
  organization: string;
  profile: string;
  jobTitle: string;
}

export const initialCurrentUser: CurrentUser = {
  fullName: "Marina Almeida",
  socialName: "",
  cpf: "123.456.789-00",
  birthDate: "1991-08-17",
  email: "marina.almeida@empresa.com.br",
  phone: "(11) 98765-4321",
  active: true,
  organization: "Horizonte Tecnologia",
  profile: "Administrador",
  jobTitle: "Gerente de Operações"
};
