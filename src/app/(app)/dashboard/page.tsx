"use client";

import { Badge, Card, Col, ProgressBar, Row, Table } from "react-bootstrap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  activityItems,
  dashboardMetrics,
  tableRows
} from "@/mocks/dashboard";

export default function DashboardPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Dashboard"
        title="Visao operacional do template"
        description="Indicadores, atividades e uma tabela demonstrativa para validar a experiencia base de um SaaS sem usar APIs."
      />
      <div className="stats-grid">
        {dashboardMetrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>
      <Row className="g-3 mt-1">
        <Col lg={7}>
          <Card className="app-card h-100">
            <Card.Body>
              <div className="card-heading">
                <h2>Workspaces recentes</h2>
                <Badge bg="light" text="dark">
                  Dados mockados
                </Badge>
              </div>
              <Table responsive className="app-table align-middle">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Responsavel</th>
                    <th>Status</th>
                    <th>Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr key={row.name}>
                      <td>{row.name}</td>
                      <td>{row.owner}</td>
                      <td>
                        <span className={`status-pill status-${row.status.toLowerCase()}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <ProgressBar now={row.progress} label={`${row.progress}%`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <Card className="app-card h-100">
            <Card.Body>
              <div className="card-heading">
                <h2>Atividades</h2>
              </div>
              <div className="activity-list">
                {activityItems.map((item) => (
                  <article className="activity-item" key={item.title}>
                    <time>{item.time}</time>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
