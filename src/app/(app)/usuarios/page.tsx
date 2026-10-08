"use client";

import { Badge, Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { adminUsers } from "@/mocks/admin";

export default function UsersAdminPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Administracao"
        title="Usuarios"
        description="Interface demonstrativa para listar, filtrar e preparar convites de usuarios sem autenticação ou persistencia real."
      />
      <Row className="g-3">
        <Col lg={8}>
          <Card className="app-card h-100">
            <Card.Body>
              <div className="card-heading">
                <h2>Usuarios cadastrados</h2>
                <Badge bg="light" text="dark">
                  {adminUsers.length} registros
                </Badge>
              </div>
              <Table responsive className="app-table align-middle">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Perfil</th>
                    <th>Organizacao</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user) => (
                    <tr key={user.email}>
                      <td>
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                      </td>
                      <td>{user.role}</td>
                      <td>{user.organization}</td>
                      <td>
                        <span className={`status-pill admin-status-${user.status.toLowerCase()}`}>
                          {user.status}
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
                <h2>Novo convite</h2>
              </div>
              <Form className="demo-form">
                <Form.Group controlId="inviteEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control placeholder="usuario@example.com" type="email" />
                </Form.Group>
                <Form.Group controlId="inviteRole">
                  <Form.Label>Perfil</Form.Label>
                  <Form.Select defaultValue="Gestor">
                    <option>Administrador</option>
                    <option>Gestor</option>
                    <option>Leitor</option>
                  </Form.Select>
                </Form.Group>
                <Button className="starter-button">Simular convite</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
