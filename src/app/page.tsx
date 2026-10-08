"use client";

import Image from "next/image";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";

interface FeatureCard {
  title: string;
  description: string;
  icon: "layout" | "data" | "states";
}

interface MetricCard {
  value: string;
  label: string;
}

const metrics: MetricCard[] = [
  { value: "01", label: "Base visual pronta para evoluir" },
  { value: "100%", label: "Frontend local com dados ficticios" },
  { value: "4", label: "Pilares iniciais da stack definidos" }
];

const features: FeatureCard[] = [
  {
    title: "Layout de produto",
    description:
      "Estrutura pensada para receber sidebar, header, areas de conteudo e rotas navegaveis sem acoplar o template a um nicho.",
    icon: "layout"
  },
  {
    title: "Dados substituiveis",
    description:
      "Espaco preparado para mocks locais, facilitando trocar cenarios demonstrativos por contratos reais nas proximas fases.",
    icon: "data"
  },
  {
    title: "Estados consistentes",
    description:
      "Padroes visuais para loading, vazio, erro e sucesso podem crescer a partir da mesma identidade clara e reutilizavel.",
    icon: "states"
  }
];

const stackItems = ["Next.js", "TypeScript", "React-Bootstrap", "Bootstrap"];

const routeItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Login" },
  { href: "/cadastro", label: "Cadastro" },
  { href: "/componentes", label: "Componentes" },
  { href: "/usuarios", label: "Usuarios" },
  { href: "/organizacoes", label: "Organizacoes" },
  { href: "/perfis-acesso", label: "Perfis" },
  { href: "/permissoes", label: "Permissoes" }
];

function FeatureIcon({ icon }: Pick<FeatureCard, "icon">) {
  const commonProps = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true
  };

  if (icon === "data") {
    return (
      <svg {...commonProps}>
        <path
          d="M5 7.5C5 5.57 8.13 4 12 4s7 1.57 7 3.5S15.87 11 12 11 5 9.43 5 7.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M5 7.5V12c0 1.93 3.13 3.5 7 3.5s7-1.57 7-3.5V7.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M5 12v4.5c0 1.93 3.13 3.5 7 3.5s7-1.57 7-3.5V12"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  if (icon === "states") {
    return (
      <svg {...commonProps}>
        <path
          d="M6.5 7.5h11M6.5 12h6M6.5 16.5h9"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M4.5 9h15" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 9v10.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="starter-shell">
      <Container className="starter-container">
        <section className="starter-hero">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <Badge className="starter-badge mb-3">Template SaaS</Badge>
              <h1 className="starter-title">Uma base clara para produtos SaaS.</h1>
              <p className="starter-subtitle">
                Um ponto de partida navegavel, responsivo e neutro o suficiente
                para virar diferentes produtos sem parecer um layout generico.
              </p>
              <div className="starter-actions">
                <Button className="starter-button" href="#fundacao">
                  Explorar base
                </Button>
                <Button className="starter-button-secondary" href="/dashboard">
                  Abrir dashboard
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="starter-visual-panel">
                <Image
                  src="/images/starter-dashboard.svg"
                  alt="Previa visual de um painel SaaS com metricas e cards"
                  width={900}
                  height={650}
                  priority
                  className="starter-dashboard-image"
                />
              </div>
            </Col>
          </Row>
        </section>

        <section className="starter-metrics" aria-label="Resumo da base">
          {metrics.map((metric) => (
            <Card className="starter-metric-card" key={metric.label}>
              <Card.Body>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </Card.Body>
            </Card>
          ))}
        </section>

        <section className="starter-section" id="componentes">
          <div className="starter-section-heading">
            <span>Componentes iniciais</span>
            <h2>Estrutura para crescer com consistencia.</h2>
          </div>
          <Row className="g-3">
            {features.map((feature) => (
              <Col md={4} key={feature.title}>
                <Card className="starter-feature-card h-100">
                  <Card.Body>
                    <div className="starter-icon">
                      <FeatureIcon icon={feature.icon} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <section className="starter-foundation" id="fundacao">
          <Row className="g-4 align-items-center">
            <Col lg={5}>
              <div className="starter-section-heading mb-0">
                <span>Fundacao tecnica</span>
                <h2>Stack simples, reutilizavel e pronta para a Fase 1.</h2>
              </div>
            </Col>
            <Col lg={7}>
              <div className="starter-stack-grid">
                {stackItems.map((item) => (
                  <div className="starter-stack-item" key={item}>
                    <span aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </section>

        <section className="starter-routes" aria-label="Rotas da fase 1">
          <div className="starter-section-heading">
            <span>Navegacao</span>
            <h2>Rotas principais ja acessiveis.</h2>
          </div>
          <div className="starter-route-grid">
            {routeItems.map((item) => (
              <Button
                className="starter-button-secondary"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
