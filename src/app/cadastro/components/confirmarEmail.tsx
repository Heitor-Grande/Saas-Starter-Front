"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { FormInput } from "@/components/ui/FormInput";

interface ConfirmarEmailProps {
  show: boolean;
  email: string;
  isSubmitting: boolean;
  error?: string;
  onHide: () => void;
  onConfirm: (codigo: string) => void;
  onResend: () => void;
}

export function ConfirmarEmail({
  show,
  email,
  isSubmitting,
  error,
  onHide,
  onConfirm,
  onResend
}: ConfirmarEmailProps) {
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    if (!show) setCodigo("");
  }, [show]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (codigo.length === 6 && !isSubmitting) onConfirm(codigo);
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop={isSubmitting ? "static" : true}
      keyboard={!isSubmitting}
      aria-labelledby="confirmar-email-title"
    >
      <Form onSubmit={submit}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title id="confirmar-email-title">Confirmar e-mail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Enviamos um código de 6 números para <strong>{email}</strong>. Digite-o abaixo
            para concluir a criação da conta.
          </p>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <FormInput
            id="signupEmailCode"
            label="Código de confirmação"
            placeholder="000000"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={codigo}
            onChange={(event) => setCodigo(event.target.value.replace(/\D/g, ""))}
            required
            disabled={isSubmitting}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" type="button" onClick={onResend} disabled={isSubmitting}>
            Reenviar código
          </Button>
          <Button variant="light" type="button" onClick={onHide} disabled={isSubmitting}>
            Voltar
          </Button>
          <Button
            className="starter-button-form"
            type="submit"
            disabled={isSubmitting || codigo.length !== 6}
          >
            {isSubmitting ? "Confirmando..." : "Confirmar e criar conta"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
