"use client";

import type { ReactNode } from "react";
import { Pagination, Table } from "react-bootstrap";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  render: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => string;
  emptyMessage?: string;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = "Nenhum registro encontrado.",
  page = 1,
  pageSize = 10,
  onPageChange,
  onRowClick,
  className = ""
}: DataTableProps<T>) {
  const pageCount = Math.max(1, Math.ceil(data.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), pageCount);
  const visibleItems = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const isInteractive = Boolean(onRowClick);

  function selectRow(item: T) {
    onRowClick?.(item);
  }

  return (
    <>
      <Table responsive hover className={`app-table ui-data-table align-middle ${className}`.trim()}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.headerClassName}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item) => (
            <tr
              key={getRowKey(item)}
              className={isInteractive ? "ui-data-table-row-interactive" : undefined}
              onClick={isInteractive ? () => selectRow(item) : undefined}
              onKeyDown={
                isInteractive
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectRow(item);
                      }
                    }
                  : undefined
              }
              tabIndex={isInteractive ? 0 : undefined}
            >
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
          {visibleItems.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="ui-data-table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>

      {pageCount > 1 && onPageChange ? (
        <div className="ui-data-table-pagination">
          <span>Pagina {currentPage} de {pageCount}</span>
          <Pagination size="sm">
            <Pagination.Prev
              aria-label="Pagina anterior"
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            />
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
              <Pagination.Item
                key={item}
                active={item === currentPage}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Pagination.Item>
            ))}
            <Pagination.Next
              aria-label="Proxima pagina"
              disabled={currentPage === pageCount}
              onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
            />
          </Pagination>
        </div>
      ) : null}
    </>
  );
}
