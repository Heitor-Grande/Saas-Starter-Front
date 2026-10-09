"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Card, Col, Modal, Row } from "react-bootstrap";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { auditLogs, type AuditAction, type AuditLog } from "@/mocks/auditLogs";


const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short"
});

const auditColumns: DataTableColumn<AuditLog>[] = [
  {
    key: "user",
    header: "Usuário que fez a ação",
    render: (log) => (
      <>
        <strong>{log.user.name}</strong>
        <small>{log.user.email}</small>
      </>
    )
  },
  {
    key: "occurredAt",
    header: "Data da ação",
    render: (log) => (
      <>
        <strong>{dateFormatter.format(new Date(log.occurredAt))}</strong>
        <small>{log.organization}</small>
      </>
    )
  },
  {
    key: "action",
    header: "Tipo da ação",
    render: (log) => (
      <span className={`audit-action audit-action-${log.action.toLowerCase()}`}>
        {log.action}
      </span>
    )
  }
];

function JsonPanel({ label, value }: { label: string; value: AuditLog["before"] }) {
  return (
    <div className="audit-json-panel">
      <div className="audit-json-heading">
        <h3>{label}</h3>
        <span>{value ? "JSON" : "Sem dados"}</span>
      </div>
      {value ? (
        <pre>{JSON.stringify(value, null, 2)}</pre>
      ) : (
        <div className="audit-json-empty">Nenhuma informação registrada.</div>
      )}
    </div>
  );
}

export default function AuditLogsPage() {
  const [query, setQuery] = useState("");
  const [action, setAction] = useState<AuditAction | "">("");
  const [organization, setOrganization] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [page, setPage] = useState(1);

  const organizations = useMemo(
    () => Array.from(new Set(auditLogs.map((log) => log.organization))),
    []
  );

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

    return auditLogs.filter((log) => {
      const matchesQuery =
        !normalizedQuery ||
        log.user.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        log.user.email.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        log.resource.toLocaleLowerCase("pt-BR").includes(normalizedQuery);

      return matchesQuery && (!action || log.action === action) &&
        (!organization || log.organization === organization);
    });
  }, [action, organization, query]);

  function updateFilter(callback: () => void) {
    callback();
    setPage(1);
  }

  function clearFilters() {
    setQuery("");
    setAction("");
    setOrganization("");
    setPage(1);
  }

  return (
    <div className="audit-page">
      <SectionHeader
        eyebrow="Sistema"
        title="Logs e Auditoria"
        description="Consulte alterações realizadas na aplicação e compare os dados de cada operação."
      />

      <Card className="app-card audit-filter-card">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col lg={5} md={12}>
              <FormInput
                id="auditSearch"
                label="Buscar"
                value={query}
                placeholder="Usuário, e-mail ou recurso"
                onChange={(event) => updateFilter(() => setQuery(event.target.value))}
              />
            </Col>
            <Col lg={2} md={4}>
              <FormSelect
                id="auditAction"
                label="Operação"
                value={action}
                onChange={(event) =>
                  updateFilter(() => setAction(event.target.value as AuditAction | ""))
                }
              >
                <option value="">Todas</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </FormSelect>
            </Col>
            <Col lg={3} md={5}>
              <FormSelect
                id="auditOrganization"
                label="Organização"
                value={organization}
                onChange={(event) => updateFilter(() => setOrganization(event.target.value))}
              >
                <option value="">Todas</option>
                {organizations.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </FormSelect>
            </Col>
            <Col lg={2} md={3}>
              <Button className="audit-clear-button" variant="light" onClick={clearFilters}>
                Limpar filtros
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="app-card audit-table-card">
        <Card.Body>
          <div className="card-heading">
            <div>
              <h2>Histórico de operações</h2>
              <p className="audit-table-description">Selecione um registro para visualizar os detalhes.</p>
            </div>
            <Badge bg="light" text="dark">
              {filteredLogs.length} {filteredLogs.length === 1 ? "registro" : "registros"}
            </Badge>
          </div>

          <DataTable
            columns={auditColumns}
            data={filteredLogs}
            getRowKey={(log) => log.id}
            emptyMessage="Nenhum registro corresponde aos filtros selecionados."
            page={page}
            onPageChange={setPage}
            onRowClick={setSelectedLog}
          />
        </Card.Body>
      </Card>

      <Modal
        show={Boolean(selectedLog)}
        onHide={() => setSelectedLog(null)}
        centered
        size="xl"
        dialogClassName="audit-modal"
      >
        {selectedLog ? (
          <>
            <Modal.Header closeButton>
              <div>
                <span className="audit-modal-id">{selectedLog.id}</span>
                <Modal.Title>Detalhes da operação</Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="audit-modal-summary">
                <div><span>Usuário</span><strong>{selectedLog.user.name}</strong></div>
                <div><span>Data e hora</span><strong>{dateFormatter.format(new Date(selectedLog.occurredAt))}</strong></div>
                <div><span>Operação</span><strong>{selectedLog.action}</strong></div>
                <div><span>Recurso</span><strong>{selectedLog.resource}</strong></div>
                <div><span>Organização</span><strong>{selectedLog.organization}</strong></div>
              </div>
              <div className="audit-comparison-grid">
                <JsonPanel label="Antes" value={selectedLog.before} />
                <JsonPanel label="Depois" value={selectedLog.after} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={() => setSelectedLog(null)}>Fechar</Button>
            </Modal.Footer>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
