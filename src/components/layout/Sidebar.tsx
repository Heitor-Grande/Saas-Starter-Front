"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  authNavigation,
  mainNavigation,
  type NavigationItem
} from "@/config/navigation";

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
      <span>{item.label}</span>
      <small>{item.description}</small>
    </>
  );

  const navTarget = item.href ? (
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
  );

  return (
    <div className={`sidebar-item sidebar-item-level-${level}`}>
      {hasChildren ? (
        <div className="sidebar-link-shell">
          {navTarget}
          <button
            aria-expanded={open}
            aria-label={open ? `Fechar ${item.label}` : `Abrir ${item.label}`}
            className="sidebar-toggle"
            onClick={() => onToggle(item.id)}
            type="button"
          >
            <span aria-hidden="true" />
          </button>
        </div>
      ) : (
        navTarget
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
  const activeBranchIds = useMemo(
    () => collectActiveBranchIds(mainNavigation, pathname),
    [pathname]
  );
  const [openIds, setOpenIds] = useState<Set<string>>(() => activeBranchIds);

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

  return (
    <aside className="app-sidebar">
      <Link className="app-brand" href="/" onClick={onNavigate}>
        <span aria-hidden="true">S</span>
        <strong>SaaS Starter</strong>
      </Link>
      <nav aria-label="Navegacao principal">
        {mainNavigation.map((item) => (
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
        {authNavigation.map((item) => (
          <Link href={item.href} key={item.id} onClick={onNavigate}>
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
