export interface OrganizationMember {
  id: string;
  name: string;
  profile: string;
  avatarUrl: string | null;
}

export interface OrganizationWithMembers {
  id: string;
  name: string;
  active: boolean;
  plan: string;
  members: OrganizationMember[];
}

export const organizationsWithMembers: OrganizationWithMembers[] = [
  {
    id: "ORG-001",
    name: "Workspace Alpha",
    active: true,
    plan: "Growth",
    members: [
      { id: "USR-001", name: "Marina Costa", profile: "Administrador", avatarUrl: null },
      { id: "USR-004", name: "Bruno Alves", profile: "Gestor", avatarUrl: null }
    ]
  },
  {
    id: "ORG-002",
    name: "Portal Sigma",
    active: true,
    plan: "Starter",
    members: [
      { id: "USR-002", name: "Rafael Lima", profile: "Gestor", avatarUrl: null }
    ]
  },
  {
    id: "ORG-003",
    name: "Hub Delta",
    active: false,
    plan: "Scale",
    members: [
      { id: "USR-003", name: "Camila Torres", profile: "Leitor", avatarUrl: null }
    ]
  },
  {
    id: "ORG-004",
    name: "Núcleo Aurora",
    active: true,
    plan: "Starter",
    members: []
  }
];
