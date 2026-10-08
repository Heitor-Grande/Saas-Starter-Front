"use client";

import { Badge, Card, Col, Row } from "react-bootstrap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { profileDetails } from "@/mocks/profile";

export default function ProfilePage() {
  return (
    <>
      <SectionHeader
        eyebrow="Perfil"
        title="Usuario demonstrativo"
        description="Informacoes locais para validar a organizacao visual de uma pagina de perfil."
      />
      <Row className="g-3">
        <Col lg={4}>
          <Card className="app-card profile-card">
            <Card.Body>
              <div className="profile-avatar">AM</div>
              <h2>Alex Morgan</h2>
              <p>Product Lead</p>
              <Badge className="starter-badge">Workspace ativo</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card className="app-card">
            <Card.Body>
              <div className="detail-grid">
                {profileDetails.map((item) => (
                  <div className="detail-item" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
