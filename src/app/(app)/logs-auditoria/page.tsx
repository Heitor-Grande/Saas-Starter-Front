"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Col, Modal, Row } from "react-bootstrap";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { Loading } from "@/components/ui/Loading";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { apiRequest } from "@/util/apiRequest";
import { getTokenCookie } from "@/util/getTokenCookie";

type AuditAction = "DELETE" | "PATCH" | "POST" | "PUT";

interface AuditLog {
  id: number;
  organizacaoid: number;
  organizacaonome: string;
  feitoporusuarioid: number;
  usuarionome: string;
  usuarioemail: string;
  perfil: string;
  feitoem: string;
  acao: AuditAction;
  antes: Record<string, unknown> | null;
  depois: Record<string, unknown> | null;
}

interface ApiResponse<T> {
  message?: string;
  data?: T;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short"
});

const auditColumns: DataTableColumn<AuditLog>[] = [
  {
    key: "usuario",
    header: "Usuário que fez a ação",
    render: (log) => (
      <>
        <strong>{log.usuarionome}</strong>
        <small>{log.usuarioemail}</small>
      </>
    )
  },
  {
    key: "perfil",
    header: "Perfil",
    render: (log) => log.perfil
  },
  {
    key: "feitoem",
    header: "Data da ação",
    render: (log) => (
      <>
        <strong>{dateFormatter.format(new Date(log.feitoem))}</strong>
        <small>{log.organizacaonome}</small>
      </>
    )
  },
  {
    key: "acao",
    header: "Tipo da ação",
    render: (log) => (
      <span className={`audit-action audit-action-${log.acao.toLowerCase()}`}>{log.acao}</span>
    )
  }
];

function JsonPanel({ label, value }: { label: string; value: AuditLog["antes"] }) {
  return (
    <div className="audit-json-panel">
      <div className="audit-json-heading">
        <h3>{label}</h3>
        <span>{value !== null ? "JSON" : "Sem dados"}</span>
      </div>
      {value !== null ? (
        <pre>{JSON.stringify(value, null, 2)}</pre>
      ) : (
        <div className="audit-json-empty">Nenhuma informação registrada.</div>
      )}
    </div>
  );
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [query, setQuery] = useState("");
  const [action, setAction] = useState<AuditAction | "">("");
  const [organization, setOrganization] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadLogs() {
      setIsLoading(true);
      setLoadError("");

      try {
        const token = getTokenCookie();
        if (!token) throw new Error("Sua sessão não foi encontrada. Entre novamente na conta.");

        const response = await apiRequest({
          path: "/log/findAll",
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = (await response.json().catch(() => null)) as ApiResponse<AuditLog[]> | null;

        if (!response.ok) {
          throw new Error(result?.message || "Não foi possível consultar os logs de auditoria.");
        }
        if (!Array.isArray(result?.data)) {
          throw new Error("A resposta da consulta de logs é inválida.");
        }

        if (isActive) {
          setLogs(result.data);
          setPage(1);
        }
      } catch (error) {
        if (isActive) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Não foi possível consultar os logs de auditoria. Tente novamente."
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadLogs();
    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  const organizations = useMemo(
    () =>
      Array.from(
        new Map(logs.map((log) => [log.organizacaoid, log.organizacaonome])).entries()
      ),
    [logs]
  );

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

    return logs.filter((log) => {
      const matchesQuery =
        !normalizedQuery ||
        log.usuarionome.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        log.usuarioemail.toLocaleLowerCase("pt-BR").includes(normalizedQuery);

      return (
        matchesQuery &&
        (!action || log.acao === action) &&
        (!organization || String(log.organizacaoid) === organization)
      );
    });
  }, [action, logs, organization, query]);

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
                placeholder="Nome ou e-mail do usuário"
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
                <option value="PATCH">PATCH</option>
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
                {organizations.map(([id, nome]) => (
                  <option key={id} value={id}>
                    {nome}
                  </option>
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
          {isLoading ? (
            <Loading label="Carregando logs" description="Consultando o histórico de auditoria." />
          ) : loadError ? (
            <Alert variant="danger" className="mb-0">
              <p>{loadError}</p>
              <Button variant="outline-danger" onClick={() => setReloadKey((value) => value + 1)}>
                Tentar novamente
              </Button>
            </Alert>
          ) : (
            <DataTable
              header={
                <div className="card-heading">
                  <div>
                    <h2>Histórico de operações</h2>
                    <p className="audit-table-description">
                      Selecione um registro para visualizar os detalhes.
                    </p>
                  </div>
                  <Badge bg="light" text="dark">
                    {filteredLogs.length} {filteredLogs.length === 1 ? "registro" : "registros"}
                  </Badge>
                </div>
              }
              columns={auditColumns}
              data={filteredLogs}
              getRowKey={(log) => String(log.id)}
              emptyMessage="Nenhum registro corresponde aos filtros selecionados."
              page={page}
              onPageChange={setPage}
              onRowClick={setSelectedLog}
            />
          )}
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
                <span className="audit-modal-id">LOG-{selectedLog.id}</span>
                <Modal.Title>Detalhes da operação</Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="audit-modal-summary">
                <div>
                  <span>Usuário</span>
                  <strong>{selectedLog.usuarionome}</strong>
                </div>
                <div>
                  <span>Data e hora</span>
                  <strong>{dateFormatter.format(new Date(selectedLog.feitoem))}</strong>
                </div>
                <div>
                  <span>Operação</span>
                  <strong>{selectedLog.acao}</strong>
                </div>
                <div>
                  <span>Perfil</span>
                  <strong>{selectedLog.perfil}</strong>
                </div>
                <div>
                  <span>Organização</span>
                  <strong>{selectedLog.organizacaonome}</strong>
                </div>
              </div>
              <div className="audit-comparison-grid">
                <JsonPanel label="Antes" value={selectedLog.antes} />
                <JsonPanel label="Depois" value={selectedLog.depois} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={() => setSelectedLog(null)}>
                Fechar
              </Button>
            </Modal.Footer>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
