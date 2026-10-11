"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Badge, Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormInput } from "@/components/ui/FormInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { initialPlans, type Plan } from "@/mocks/plans";
import { mascararValorMonetario } from "@/util/mascaras";

const planColumns: DataTableColumn<Plan>[] = [
  {
    key: "name",
    header: "Nome do plano",
    render: (plan) => <strong>{plan.name}</strong>
  },
  {
    key: "price",
    header: "Valor",
    render: (plan) => <span className="plan-price">R$ {plan.price}</span>
  },
  {
    key: "description",
    header: "Descrição",
    render: (plan) => plan.description
  }
];

export default function PlansSubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const filteredPlans = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

    if (!normalizedQuery) {
      return plans;
    }

    return plans.filter((plan) =>
      plan.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery)
    );
  }, [plans, query]);

  function resetForm() {
    setName("");
    setPrice("");
    setDescription("");
  }

  function closeCreateModal() {
    setShowCreateModal(false);
    resetForm();
  }

  function handleCreatePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newPlan: Plan = {
      id: `PLN-${String(plans.length + 1).padStart(3, "0")}`,
      name: name.trim(),
      price: price.trim(),
      description: description.trim()
    };

    setPlans((currentPlans) => [...currentPlans, newPlan]);
    setQuery("");
    setPage(1);
    closeCreateModal();
    setShowSuccess(true);
  }

  return (
    <div className="audit-page">

      <SectionHeader
        eyebrow="Administração"
        title="Planos e Assinaturas"
        description="Gerencie os planos disponíveis para as organizações."
      />


      <Card className="app-card plans-filter-card">
        <Card.Body>
          <Row className="align-items-end g-3">
            <Col md={7} lg={5}>
              <FormInput
                id="planSearch"
                label="Filtrar por nome do plano"
                placeholder="Digite o nome do plano"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </Col>
            <Col md="auto">
              <Button
                className="plans-clear-button"
                variant="light"
                disabled={!query}
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
              >
                Limpar filtro
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="app-card plans-table-card">
        <Card.Body>
          <DataTable
            header={
              <div className="card-heading">
                <div>
                  <h2>Planos cadastrados</h2>
                  <p className="plans-table-description">Valores mensais demonstrativos.</p>
                </div>
                <Badge bg="light" text="dark">
                  {filteredPlans.length} {filteredPlans.length === 1 ? "plano" : "planos"}
                </Badge>
              </div>
            }
            onCreate={() => setShowCreateModal(true)}
            createLabel="Novo plano"
            columns={planColumns}
            data={filteredPlans}
            getRowKey={(plan) => plan.id}
            emptyMessage="Nenhum plano corresponde ao nome informado."
            page={page}
            onPageChange={setPage}
          />
        </Card.Body>
      </Card>

      <Modal show={showCreateModal} onHide={closeCreateModal} centered>
        <Form onSubmit={handleCreatePlan}>
          <Modal.Header closeButton>
            <Modal.Title>Novo plano</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="plans-form-grid">
              <FormInput
                id="planName"
                label="Nome do plano"
                value={name}
                maxLength={50}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <FormInput
                id="planPrice"
                label="Valor"
                value={price}
                placeholder="Ex.: 99,90"
                inputMode="decimal"
                onChange={(event) => setPrice(mascararValorMonetario(event.target.value))}
                required
              />
              <FormInput
                id="planDescription"
                label="Descrição"
                as="textarea"
                rows={3}
                value={description}
                maxLength={60}
                helperText={`${description.length}/60 caracteres`}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={closeCreateModal}>
              Cancelar
            </Button>
            <Button className="starter-button" type="submit">
              Criar plano
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <FeedbackState
        show={showSuccess}
        variant="success"
        title="Plano criado"
        description="O novo plano foi adicionado à listagem demonstrativa."
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
