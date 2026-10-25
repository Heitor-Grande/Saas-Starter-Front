"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormInput } from "@/components/ui/FormInput";
import { Loading } from "@/components/ui/Loading";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { apiRequest } from "@/util/apiRequest";
import { getTokenCookie } from "@/util/getTokenCookie";
import { mascararValorMonetario } from "@/util/mascaras";
import { removerMascaraValorMonetario } from "@/util/removeMascaras";

interface Plan {
  id: number;
  nome: string;
  valor: string;
  descricao: string;
}

interface ApiResponse<T> {
  message?: string;
  data?: T;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const planColumns: DataTableColumn<Plan>[] = [
  {
    key: "nome",
    header: "Nome do plano",
    render: (plan) => <strong>{plan.nome}</strong>,
  },
  {
    key: "valor",
    header: "Valor",
    render: (plan) => (
      <span className="plan-price">
        {currencyFormatter.format(Number(plan.valor))}
      </span>
    ),
  },
  { key: "descricao", header: "Descrição", render: (plan) => plan.descricao },
];

export default function PlansSubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    async function loadPlans() {
      setIsLoading(true);
      setLoadError("");
      try {
        const token = getTokenCookie();
        if (!token) {
          throw new Error(
            "Sua sessão não foi encontrada. Entre novamente na conta.",
          );
        }

        const response = await apiRequest({
          path: "/planos/findAll",
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = (await response.json().catch(() => null)) as ApiResponse<
          Plan[]
        > | null;
        if (!response.ok)
          throw new Error(
            result?.message || "Não foi possível consultar os planos.",
          );
        if (!Array.isArray(result?.data))
          throw new Error("A resposta da consulta de planos é inválida.");
        if (active) setPlans(result.data);
      } catch (error) {
        if (active)
          setLoadError(
            error instanceof Error
              ? error.message
              : "Não foi possível consultar os planos.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void loadPlans();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const filteredPlans = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return normalized
      ? plans.filter((plan) =>
          plan.nome.toLocaleLowerCase("pt-BR").includes(normalized),
        )
      : plans;
  }, [plans, query]);

  function openCreate() {
    setSelectedPlan(null);
    setName("");
    setPrice("");
    setDescription("");
    setFormError("");
    setShowForm(true);
  }

  async function openEdit(plan: Plan) {
    setFormError("");
    setIsLoading(true);
    try {
      const token = getTokenCookie();
      if (!token) {
        throw new Error(
          "Sua sessão não foi encontrada. Entre novamente na conta.",
        );
      }

      const response = await apiRequest({
        path: `/planos/findOne/${plan.id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = (await response
        .json()
        .catch(() => null)) as ApiResponse<Plan> | null;
      if (!response.ok || !result?.data)
        throw new Error(
          result?.message || "Não foi possível consultar o plano.",
        );
      setSelectedPlan(result.data);
      setName(result.data.nome);
      setPrice(mascararValorMonetario(result.data.valor));
      setDescription(result.data.descricao);
      setShowForm(true);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Não foi possível consultar o plano.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function savePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");
    try {
      const token = getTokenCookie();
      if (!token) {
        throw new Error(
          "Sua sessão não foi encontrada. Entre novamente na conta.",
        );
      }

      const response = await apiRequest({
        path: selectedPlan
          ? `/planos/update/${selectedPlan.id}`
          : "/planos/create",
        method: selectedPlan ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          nome: name.trim(),
          valor: Number(removerMascaraValorMonetario(price)),
          descricao: description.trim(),
        },
      });
      const result = (await response
        .json()
        .catch(() => null)) as ApiResponse<Plan> | null;
      if (!response.ok)
        throw new Error(result?.message || "Não foi possível salvar o plano.");
      setShowForm(false);
      setSuccess(
        selectedPlan
          ? "Plano atualizado com sucesso."
          : "Plano criado com sucesso.",
      );
      setReloadKey((value) => value + 1);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o plano.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deletePlan() {
    if (!selectedPlan) return;
    setIsDeleting(true);
    setFormError("");
    try {
      const token = getTokenCookie();
      if (!token) {
        throw new Error(
          "Sua sessão não foi encontrada. Entre novamente na conta.",
        );
      }

      const response = await apiRequest({
        path: `/planos/remove/${selectedPlan.id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = (await response
        .json()
        .catch(() => null)) as ApiResponse<null> | null;
      if (!response.ok)
        throw new Error(result?.message || "Não foi possível excluir o plano.");
      setShowDeleteConfirmation(false);
      setSuccess("Plano excluído com sucesso.");
      setReloadKey((value) => value + 1);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o plano.",
      );
    } finally {
      setIsDeleting(false);
    }
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
          {isLoading ? (
            <Loading
              label="Carregando planos"
              description="Consultando os planos cadastrados."
            />
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
          ) : (
            <DataTable
              header={
                <div className="card-heading">
                  <div>
                    <h2>Planos cadastrados</h2>
                    <p className="plans-table-description">
                      Valores mensais dos planos disponíveis.
                    </p>
                  </div>
                  <Badge bg="light" text="dark">
                    {filteredPlans.length}{" "}
                    {filteredPlans.length === 1 ? "plano" : "planos"}
                  </Badge>
                </div>
              }
              onCreate={openCreate}
              createLabel="Novo plano"
              columns={planColumns}
              data={filteredPlans}
              getRowKey={(plan) => String(plan.id)}
              emptyMessage="Nenhum plano corresponde ao nome informado."
              page={page}
              onPageChange={setPage}
              onRowClick={(plan) => void openEdit(plan)}
            />
          )}
        </Card.Body>
      </Card>
      <Modal
        show={showForm}
        onHide={() => !isSaving && !isDeleting && setShowForm(false)}
        centered
      >
        <Form onSubmit={savePlan}>
          <Modal.Header closeButton={!isSaving && !isDeleting}>
            <Modal.Title>
              {selectedPlan ? "Editar plano" : "Novo plano"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="plans-form-grid">
              <FormInput
                id="planName"
                label="Nome do plano"
                value={name}
                maxLength={30}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <FormInput
                id="planPrice"
                label="Valor"
                value={price}
                placeholder="Ex.: 99,90"
                inputMode="decimal"
                onChange={(event) =>
                  setPrice(mascararValorMonetario(event.target.value))
                }
                required
              />
              <FormInput
                id="planDescription"
                label="Descrição"
                as="textarea"
                rows={3}
                value={description}
                maxLength={100}
                helperText={`${description.length}/100 caracteres`}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            {selectedPlan ? (
              <Button
                variant="danger"
                disabled={isSaving || isDeleting}
                onClick={() => {
                  setFormError("");
                  setShowForm(false);
                  setShowDeleteConfirmation(true);
                }}
              >
                Excluir
              </Button>
            ) : (
              <Button
                variant="light"
                disabled={isSaving || isDeleting}
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            )}
            <Button
              className="starter-button"
              type="submit"
              disabled={isSaving || isDeleting}
            >
              {isSaving ? "Salvando..." : "Salvar plano"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal
        show={showDeleteConfirmation}
        onHide={() => {
          if (!isDeleting) {
            setShowDeleteConfirmation(false);
            setShowForm(true);
          }
        }}
        centered
      >
        <Modal.Header closeButton={!isDeleting}>
          <Modal.Title>Excluir plano</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Tem certeza de que deseja excluir o plano{" "}
            <strong>{selectedPlan?.nome}</strong>?
          </p>
          <p className="mb-0">Esta ação não poderá ser desfeita.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            disabled={isDeleting}
            onClick={() => {
              setShowDeleteConfirmation(false);
              setShowForm(true);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            disabled={isDeleting}
            onClick={() => void deletePlan()}
          >
            {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
          </Button>
        </Modal.Footer>
      </Modal>
      <FeedbackState
        show={Boolean(formError)}
        variant="error"
        title="Não foi possível concluir a operação"
        description={formError}
        onClose={() => setFormError("")}
      />
      <FeedbackState
        show={Boolean(success)}
        variant="success"
        title="Operação concluída"
        description={success}
        onClose={() => setSuccess("")}
      />
    </div>
  );
}
