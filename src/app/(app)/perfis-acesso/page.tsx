"use client";

import { Badge, Card, Col, Row } from "react-bootstrap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { accessProfiles } from "@/mocks/admin";

export default function AccessProfilesPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Administracao"
        title="Perfis de acesso"
        description="Papeis genericos para produtos SaaS, prontos para evoluir para regras reais em fases futuras."
      />
      <Row className="g-3">
        {accessProfiles.map((profile) => (
          <Col lg={4} md={6} key={profile.name}>
            <Card className="app-card profile-role-card h-100">
              <Card.Body>
                <div className="card-heading">
                  <h2>{profile.name}</h2>
                  <Badge bg="light" text="dark">
                    {profile.users} usuarios
                  </Badge>
                </div>
                <p>{profile.description}</p>
                <div className="permission-chip-list">
                  {profile.permissions.map((permission) => (
                    <span key={permission}>{permission}</span>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
