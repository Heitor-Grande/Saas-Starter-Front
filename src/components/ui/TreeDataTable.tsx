"use client";

import { useId, useState, type ReactNode } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";

export interface TreeDataTableProps<TParent, TChild> {
  data: TParent[];
  columns: DataTableColumn<TParent>[];
  childColumns: DataTableColumn<TChild>[];
  getRowKey: (item: TParent) => string;
  getRowLabel: (item: TParent) => string;
  getChildren: (item: TParent) => TChild[];
  getChildKey: (item: TChild) => string;
  childrenLabel?: string;
  emptyMessage?: string;
  childEmptyMessage?: string;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  header?: ReactNode;
}

export function TreeDataTable<TParent, TChild>({
  data,
  columns,
  childColumns,
  getRowKey,
  getRowLabel,
  getChildren,
  getChildKey,
  childrenLabel = "Membros",
  emptyMessage,
  childEmptyMessage = "Nenhum membro cadastrado nesta organização.",
  page,
  pageSize,
  onPageChange,
  header
}: TreeDataTableProps<TParent, TChild>) {
  const id = useId();
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  function toggle(item: TParent) {
    const key = getRowKey(item);
    setExpandedKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const treeColumns = columns.map((column, index) => index === 0 ? {
    ...column,
    render: (item: TParent) => {
      const expanded = expandedKeys.has(getRowKey(item));
      return (
        <button
          type="button"
          className="ui-tree-toggle"
          aria-expanded={expanded}
          aria-controls={expanded ? `${id}-${getRowKey(item)}` : undefined}
          aria-label={`${expanded ? "Recolher" : "Expandir"} ${getRowLabel(item)}`}
          onClick={(event) => {
            event.stopPropagation();
            toggle(item);
          }}
        >
          <span className="ui-tree-caret" aria-hidden="true" />
          {column.render(item)}
        </button>
      );
    }
  } : column);

  return (
    <DataTable
      columns={treeColumns}
      data={data}
      getRowKey={getRowKey}
      header={header}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      emptyMessage={emptyMessage}
      className="ui-tree-table"
      onRowClick={toggle}
      renderRowDetails={(item) => {
        if (!expandedKeys.has(getRowKey(item))) return null;
        const children = getChildren(item);
        return (
          <section id={`${id}-${getRowKey(item)}`} className="ui-tree-children" aria-label={`${childrenLabel}: ${getRowLabel(item)}`}>
            <h3>{childrenLabel}</h3>
            <DataTable
              columns={childColumns}
              data={children}
              getRowKey={getChildKey}
              pageSize={Math.max(1, children.length)}
              emptyMessage={childEmptyMessage}
            />
          </section>
        );
      }}
    />
  );
}
