"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { mainNavigation, type NavigationItem } from "@/config/navigation";
import { apiRequest } from "@/util/apiRequest";
import { clearCookies } from "@/util/clearCookies";
import { getTokenCookie } from "@/util/getTokenCookie";

interface PermissaoUsuarioApi {
  permissão: string;
  temacesso: boolean;
}

interface ApiResponse<T> {
  message?: string;
  data?: T;
}

class ApiRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiRequestError";
  }
}

interface SidebarNavItemProps {
  item: NavigationItem;
  pathname: string;
  level: 1 | 2 | 3;
  openIds: Set<string>;
  onNavigate: () => void;
  onToggle: (id: string) => void;
}

interface SidebarProps {
  onNavigate: () => void;
}

function filterNavigationByPermissions(
  items: NavigationItem[],
  allowedPermissions: Set<string>
): NavigationItem[] {
  return items.flatMap((item) => {
    if (!allowedPermissions.has(item.permissao)) {
      return [];
    }

    const children = item.children
      ? filterNavigationByPermissions(item.children, allowedPermissions)
      : undefined;

    if (item.children && children?.length === 0) {
      return [];
    }

    return [{ ...item, children }];
  });
}

function isItemActive(item: NavigationItem, pathname: string): boolean {
  if (item.href === pathname) {
    return true;
  }

  return item.children?.some((child) => isItemActive(child, pathname)) ?? false;
}

function collectActiveBranchIds(
  items: NavigationItem[],
  pathname: string,
  activeIds = new Set<string>()
): Set<string> {
  items.forEach((item) => {
    if (item.children?.length && isItemActive(item, pathname)) {
      activeIds.add(item.id);
      collectActiveBranchIds(item.children, pathname, activeIds);
    }
  });

  return activeIds;
}

function SidebarNavItem({
  item,
  pathname,
  level,
  openIds,
  onNavigate,
  onToggle
}: SidebarNavItemProps) {
  const hasChildren = Boolean(item.children?.length);
  const active = isItemActive(item, pathname);
  const open = hasChildren ? openIds.has(item.id) : false;
  const className = [
    "sidebar-link",
    `sidebar-link-level-${level}`,
    active ? "active" : "",
    !item.href ? "sidebar-link-group" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className="sidebar-link-label">{item.label}</span>
      <small>{item.description}</small>
    </>
  );

  return (
    <div className={`sidebar-item sidebar-item-level-${level}`}>
      {hasChildren && item.href ? (
        <div className="sidebar-row">
          <Link
            aria-current={item.href === pathname ? "page" : undefined}
            className={className}
            href={item.href}
            onClick={onNavigate}
          >
            {content}
          </Link>
          <button
            aria-expanded={open}
            aria-label={open ? `Fechar ${item.label}` : `Abrir ${item.label}`}
            className="sidebar-inline-toggle"
            onClick={() => onToggle(item.id)}
            type="button"
          >
            <span className="sidebar-caret" aria-hidden="true" />
          </button>
        </div>
      ) : hasChildren ? (
        <button
          aria-current={active ? "true" : undefined}
          aria-expanded={open}
          className={`${className} sidebar-disclosure`}
          onClick={() => onToggle(item.id)}
          type="button"
        >
          <span className="sidebar-link-copy">{content}</span>
          <span className="sidebar-caret" aria-hidden="true" />
        </button>
      ) : item.href ? (
        <Link
          aria-current={item.href === pathname ? "page" : undefined}
          className={className}
          href={item.href}
          onClick={onNavigate}
        >
          {content}
        </Link>
      ) : (
        <div aria-current={active ? "true" : undefined} className={className}>
          {content}
        </div>
      )}
      {hasChildren && open && level < 3 ? (
        <div className="sidebar-children">
          {item.children?.map((child) => (
            <SidebarNavItem
              item={child}
              key={child.id}
              level={(level + 1) as 2 | 3}
              onNavigate={onNavigate}
              onToggle={onToggle}
              openIds={openIds}
              pathname={pathname}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowedPermissions, setAllowedPermissions] = useState<Set<string>>(new Set());
  const [authorizationError, setAuthorizationError] = useState("");
  const filteredNavigation = useMemo(
    () => filterNavigationByPermissions(mainNavigation, allowedPermissions),
    [allowedPermissions]
  );
  const activeBranchIds = useMemo(
    () => collectActiveBranchIds(filteredNavigation, pathname),
    [filteredNavigation, pathname]
  );
  const [openIds, setOpenIds] = useState<Set<string>>(() => activeBranchIds);

  useEffect(() => {
    let isActive = true;

    async function loadPermissions() {
      const token = getTokenCookie();

      if (!token) {
        if (isActive) setAllowedPermissions(new Set());
        setAuthorizationError("Não foi possível carregar as permissões do usuário. Por favor, faça login novamente.");
        return;
      }

      try {
        const response = await apiRequest({
          path: "/carrega-permissoes-usuario",
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = (await response.json().catch(() => null)) as ApiResponse<PermissaoUsuarioApi[]> | null;

        if (!response.ok) {
          throw new ApiRequestError(
            result?.message || "Não foi possível carregar as permissões do usuário.",
            response.status
          );
        }

        if (!Array.isArray(result?.data)) {
          throw new Error("Não foi possível carregar as permissões do usuário.");
        }

        if (isActive) {
          setAllowedPermissions(new Set(
            result.data
              .filter((permission) => permission.temacesso === true)
              .map((permission) => permission.permissão)
          ));
        }
      } catch (error) {
        if (!isActive) return;

        setAllowedPermissions(new Set());
        setAuthorizationError(error instanceof Error ? error.message : "Algo inesperado aconteceu ao carregar as permissões.");
      }
    }

    void loadPermissions();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    setOpenIds((currentOpenIds) => {
      const nextOpenIds = new Set(currentOpenIds);

      activeBranchIds.forEach((id) => nextOpenIds.add(id));

      return nextOpenIds;
    });
  }, [activeBranchIds]);

  function handleToggle(id: string) {
    setOpenIds((currentOpenIds) => {
      const nextOpenIds = new Set(currentOpenIds);

      if (nextOpenIds.has(id)) {
        nextOpenIds.delete(id);
      } else {
        nextOpenIds.add(id);
      }

      return nextOpenIds;
    });
  }

  function handleLogout() {
    clearCookies();
    onNavigate();
  }

  function handleAuthorizationErrorClose() {
    setAuthorizationError("");
    clearCookies();
    onNavigate();
    router.replace("/login");
  }

  return (
    <aside className="app-sidebar">
      <Link className="app-brand" href="/" onClick={onNavigate}>
        <span aria-hidden="true">S</span>
        <strong>SaaS Starter</strong>
      </Link>
      <nav aria-label="Navegação principal">
        {filteredNavigation.map((item) => (
          <SidebarNavItem
            item={item}
            key={item.id}
            level={1}
            onNavigate={onNavigate}
            onToggle={handleToggle}
            openIds={openIds}
            pathname={pathname}
          />
        ))}
      </nav>
      <div className="sidebar-auth">
        <Link
          aria-current={pathname === "/meu-usuario" ? "page" : undefined}
          className={pathname === "/meu-usuario" ? "active" : undefined}
          href="/meu-usuario"
          onClick={onNavigate}
        >
          Meu usuário
        </Link>
        <Button className="starter-button" size="sm" href="/login" onClick={handleLogout}>
          Sair
        </Button>
      </div>
      <FeedbackState
        show={Boolean(authorizationError)}
        onClose={handleAuthorizationErrorClose}
        variant="error"
        title="Sessão inválida"
        description={authorizationError}
      />
    </aside>
  );
}
