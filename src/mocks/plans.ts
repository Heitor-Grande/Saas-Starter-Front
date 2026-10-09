export interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
}

export const initialPlans: Plan[] = [
  {
    id: "PLN-001",
    name: "Starter",
    price: "49,90",
    description: "Recursos essenciais para equipes em fase inicial."
  },
  {
    id: "PLN-002",
    name: "Growth",
    price: "129,90",
    description: "Mais capacidade para operações em crescimento."
  },
  {
    id: "PLN-003",
    name: "Scale",
    price: "299,90",
    description: "Controles avançados para estruturas maiores."
  }
];
