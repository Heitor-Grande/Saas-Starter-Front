"use client";

import { Badge, Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { organizations } from "@/mocks/admin";

export default function OrganizationsAdminPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Administracao"
        title="Organizacoes"
        description="Tela base para acompanhar contas, planos e status operacionais usando apenas dados ficticios."
      />
      <Row className="g-3">
        <Col lg={8}>
          <Card className="app-card h-100">
            <Card.Body>
              <div className="card-heading">
                <h2>Contas e workspaces</h2>
                <Badge bg="light" text="dark">
                  Mock local
                </Badge>
              </div>
              <Table responsive className="app-table align-middle">
                <thead>
                  <tr>
                    <th>Organizacao</th>
                    <th>Plano</th>
                    <th>Membros</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((organization) => (
                    <tr key={organization.name}>
                      <td>{organization.name}</td>
                      <td>{organization.plan}</td>
                      <td>{organization.members}</td>
                      <td>
                        <span
                          className={`status-pill admin-status-${organization.status.toLowerCase()}`}
                        >
                          {organization.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="app-card h-100">
            <Card.Body>
              <div className="card-heading">
                <h2>Cadastro visual</h2>
              </div>
              <Form className="demo-form">
                <Form.Group controlId="organizationName">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control placeholder="Nome da organizacao" />
                </Form.Group>
                <Form.Group controlId="organizationPlan">
                  <Form.Label>Plano</Form.Label>
                  <Form.Select defaultValue="Starter">
                    <option>Starter</option>
                    <option>Growth</option>
                    <option>Scale</option>
                  </Form.Select>
                </Form.Group>
                <Button className="starter-button">Simular criacao</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
