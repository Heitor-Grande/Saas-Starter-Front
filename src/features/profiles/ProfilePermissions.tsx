import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { FormCheckbox } from "@/components/ui/FormCheckbox";
import { mainNavigation, type NavigationItem, type NavigationLink } from "@/config/navigation";

function collectLinks(items: NavigationItem[]): NavigationLink[] {
  return items.flatMap((item) => [
    ...(item.href ? [{ ...item, href: item.href }] : []),
    ...collectLinks(item.children ?? [])
  ]);
}

const menus = collectLinks(mainNavigation);
const actions = [
  { key: "edit", label: "Editar" },
  { key: "view", label: "Visualizar" },
  { key: "create", label: "Criar" },
  { key: "delete", label: "Deletar" }
] as const;

interface ProfilePermissionsProps {
  idPrefix: string;
  permissions: string[];
  onChange?: (permissions: string[]) => void;
}

export function ProfilePermissions({ idPrefix, permissions, onChange }: ProfilePermissionsProps) {
  const columns: DataTableColumn<NavigationLink>[] = [
    { key: "menu", header: "Menu", render: (menu) => <strong>{menu.label}</strong> },
    ...actions.map((action) => ({
      key: action.key,
      header: action.label,
      className: "profile-permission-cell",
      headerClassName: "profile-permission-cell",
      render: (menu: NavigationLink) => {
        if (menu.href === "/dashboard" && action.key !== "view") {
          return null;
        }

        const permission = `${menu.id}.${action.key}`;
        return (
          <FormCheckbox
            id={`${idPrefix}-${menu.id}-${action.key}`}
            label={`${action.label}: ${menu.label}`}
            className="profile-permission-check"
            checked={permissions.includes(permission)}
            disabled={!onChange}
            onChange={(event) => onChange?.(
              event.target.checked
                ? [...permissions, permission]
                : permissions.filter((value) => value !== permission)
            )}
          />
        );
      }
    }))
  ];

  return (
    <div className="profile-permissions">
      <DataTable
        columns={columns}
        data={menus}
        getRowKey={(menu) => menu.id}
        pageSize={Math.max(1, menus.length)}
        emptyMessage="Nenhum menu disponível."
      />
    </div>
  );
}
