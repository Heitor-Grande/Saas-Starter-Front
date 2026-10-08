"use client";

import { Card, Table } from "react-bootstrap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { permissionGroups } from "@/mocks/admin";

function PermissionMark({ enabled }: { enabled: boolean }) {
  return (
    <span
      aria-label={enabled ? "Permitido" : "Nao permitido"}
      className={enabled ? "permission-mark enabled" : "permission-mark"}
      role="img"
    />
  );
}

export default function PermissionsPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Administracao"
        title="Matriz de permissoes"
        description="Comparacao visual de acessos por perfil, sem implementar autorizacao real nesta etapa."
      />
      <Card className="app-card">
        <Card.Body>
          <Table responsive className="app-table permission-table align-middle">
            <thead>
              <tr>
                <th>Recurso</th>
                <th>Permissao</th>
                <th>Administrador</th>
                <th>Gestor</th>
                <th>Leitor</th>
              </tr>
            </thead>
            <tbody>
              {permissionGroups.flatMap((group) =>
                group.permissions.map((permission) => (
                  <tr key={`${group.resource}-${permission.label}`}>
                    <td>{group.resource}</td>
                    <td>{permission.label}</td>
                    <td>
                      <PermissionMark enabled={permission.admin} />
                    </td>
                    <td>
                      <PermissionMark enabled={permission.manager} />
                    </td>
                    <td>
                      <PermissionMark enabled={permission.viewer} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}
