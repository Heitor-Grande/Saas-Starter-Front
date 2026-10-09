export interface OrganizationUser {
  id: string;
  name: string;
  profile: string;
  active: boolean;
  createdAt: string;
  lastAccessAt: string | null;
}

export const organizationUsers: OrganizationUser[] = [
  {
    id: "USR-001",
    name: "Marina Costa",
    profile: "Administrador",
    active: true,
    createdAt: "2026-01-12T09:30:00-03:00",
    lastAccessAt: "2026-10-09T08:42:00-03:00"
  },
  {
    id: "USR-002",
    name: "Rafael Lima",
    profile: "Gestor",
    active: true,
    createdAt: "2026-02-03T14:15:00-03:00",
    lastAccessAt: "2026-10-08T17:26:00-03:00"
  },
  {
    id: "USR-003",
    name: "Camila Torres",
    profile: "Leitor",
    active: true,
    createdAt: "2026-03-18T10:05:00-03:00",
    lastAccessAt: "2026-10-07T11:10:00-03:00"
  },
  {
    id: "USR-004",
    name: "Bruno Alves",
    profile: "Suporte",
    active: false,
    createdAt: "2026-04-22T16:40:00-03:00",
    lastAccessAt: "2026-09-29T15:54:00-03:00"
  },
  {
    id: "USR-005",
    name: "Juliana Freitas",
    profile: "Leitor",
    active: true,
    createdAt: "2026-10-01T13:20:00-03:00",
    lastAccessAt: null
  }
];
