"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loading } from "@/components/ui/Loading";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { apiRequest } from "@/util/apiRequest";
import { getTokenCookie } from "@/util/getTokenCookie";
import styles from "./dashboardadmin.module.css";

interface UsuariosPorOrganizacao {
  organizacaoid: number;
  organizacao: string;
  totalusuarios: number;
}

interface UsuariosPorPerfil {
  perfilid: number;
  perfil: string;
  totalusuarios: number;
}

interface DashboardAdmin {
  totalusuarios: number;
  usuariosinativos: number;
  totalorganizacoes: number;
  usuariospororganizacao: UsuariosPorOrganizacao[];
  usuariosporperfil: UsuariosPorPerfil[];
}

interface ApiResponse<T> {
  message?: string;
  data?: T;
}

const chartColors = [
  "#6d5dfc",
  "#2db7a3",
  "#f5a642",
  "#ef6f8f",
  "#4d8df7",
  "#9b6be8",
];

function isDashboardAdmin(value: unknown): value is DashboardAdmin {
  if (!value || typeof value !== "object") return false;
  const dashboard = value as Partial<DashboardAdmin>;

  return (
    typeof dashboard.totalusuarios === "number" &&
    typeof dashboard.usuariosinativos === "number" &&
    typeof dashboard.totalorganizacoes === "number" &&
    Array.isArray(dashboard.usuariospororganizacao) &&
    Array.isArray(dashboard.usuariosporperfil)
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      setIsLoading(true);
      setLoadError("");

      try {
        const token = getTokenCookie();
        if (!token)
          throw new Error(
            "Sua sessão não foi encontrada. Entre novamente na conta.",
          );

        const response = await apiRequest({
          path: "/dashboard-admin/findAll",
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = (await response
          .json()
          .catch(() => null)) as ApiResponse<DashboardAdmin> | null;

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Não foi possível consultar o dashboard administrativo.",
          );
        }
        if (!isDashboardAdmin(result?.data)) {
          throw new Error("A resposta da consulta do dashboard é inválida.");
        }
        if (isActive) setDashboard(result.data);
      } catch (error) {
        if (isActive) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Não foi possível consultar o dashboard administrativo. Tente novamente.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadDashboard();
    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  return (
    <div className={`audit-page ${styles.page}`}>
      <SectionHeader
        eyebrow="Visão Geral"
        title="Dashboard Administrativo"
        description="Acompanhe os principais indicadores de usuários, organizações e perfis da aplicação."
      />

      {isLoading ? (
        <Card className="app-card">
          <Card.Body>
            <Loading
              label="Carregando dashboard"
              description="Consultando os indicadores gerais."
            />
          </Card.Body>
        </Card>
      ) : loadError ? (
        <Alert variant="danger" className="mb-0">
          <p>{loadError}</p>
          <Button
            variant="outline-danger"
            onClick={() => setReloadKey((value) => value + 1)}
          >
            Tentar novamente
          </Button>
        </Alert>
      ) : dashboard ? (
        <>
          <Row className="g-3">
            <Col md={4}>
              <MetricCard
                label="Total de usuários"
                value={dashboard.totalusuarios}
                detail="Usuários cadastrados"
                tone="primary"
              />
            </Col>
            <Col md={4}>
              <MetricCard
                label="Usuários inativos"
                value={dashboard.usuariosinativos}
                detail="Contas sem acesso ativo"
                tone="warning"
              />
            </Col>
            <Col md={4}>
              <MetricCard
                label="Organizações"
                value={dashboard.totalorganizacoes}
                detail="Organizações cadastradas"
                tone="success"
              />
            </Col>
          </Row>

          <Row className="g-3 flex-grow-1">
            <Col xl={7}>
              <ChartCard
                title="Usuários por organização"
                description="Distribuição entre as organizações cadastradas."
                isEmpty={!dashboard.usuariospororganizacao.length}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboard.usuariospororganizacao}
                    margin={{ top: 12, right: 12, left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e8eaf2"
                    />
                    <XAxis
                      dataKey="organizacao"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#667085", fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      width={32}
                    />
                    <Tooltip cursor={{ fill: "#f5f6fb" }} />
                    <Bar
                      dataKey="totalusuarios"
                      name="Usuários"
                      fill="#6d5dfc"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={54}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </Col>
            <Col xl={5}>
              <ChartCard
                title="Usuários por perfil"
                description="Participação de cada perfil no total de usuários."
                isEmpty={!dashboard.usuariosporperfil.length}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboard.usuariosporperfil}
                      dataKey="totalusuarios"
                      nameKey="perfil"
                      innerRadius="48%"
                      outerRadius="76%"
                      paddingAngle={3}
                    >
                      {dashboard.usuariosporperfil.map((perfil, index) => (
                        <Cell
                          key={perfil.perfilid}
                          fill={chartColors[index % chartColors.length]}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" iconSize={9} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </Col>
          </Row>
        </>
      ) : null}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  tone: "primary" | "success" | "warning";
}) {
  return (
    <Card className={`app-card ${styles.metricCard}`}>
      <Card.Body>
        <div
          className={`${styles.metricIcon} ${styles[tone]}`}
          aria-hidden="true"
        />
        <div>
          <span>{label}</span>
          <strong>{value.toLocaleString("pt-BR")}</strong>
          <small>{detail}</small>
        </div>
      </Card.Body>
    </Card>
  );
}

function ChartCard({
  title,
  description,
  isEmpty,
  children,
}: {
  title: string;
  description: string;
  isEmpty: boolean;
  children: ReactNode;
}) {
  return (
    <Card className={`app-card ${styles.chartCard}`}>
      <Card.Body>
        <div className={styles.chartHeader}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className={styles.chartArea}>
          {isEmpty ? (
            <div className={styles.emptyState}>Nenhum dado disponível.</div>
          ) : (
            children
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
