"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Alert, Button, Form } from "react-bootstrap";

interface AuthDemoFormProps {
  mode: "login" | "signup" | "recover";
}

const copy = {
  login: {
    button: "Entrar no dashboard",
    success: "Login demonstrativo concluido. Nenhuma sessao real foi criada."
  },
  signup: {
    button: "Criar conta demo",
    success: "Cadastro simulado com sucesso. Os dados permanecem apenas na tela."
  },
  recover: {
    button: "Enviar instrucao",
    success: "Instrucao visual enviada. Nenhum email real foi disparado."
  }
};

export function AuthDemoForm({ mode }: AuthDemoFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowSuccess(true);
  }

  return (
    <Form className="demo-form" onSubmit={handleSubmit}>
      {mode === "signup" ? (
        <Form.Group controlId="name">
          <Form.Label>Nome</Form.Label>
          <Form.Control placeholder="Nome completo" />
        </Form.Group>
      ) : null}
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control placeholder="voce@example.com" type="email" />
      </Form.Group>
      {mode !== "recover" ? (
        <Form.Group controlId="password">
          <Form.Label>Senha</Form.Label>
          <Form.Control placeholder="Senha demonstrativa" type="password" />
        </Form.Group>
      ) : null}
      {showSuccess ? <Alert variant="success">{copy[mode].success}</Alert> : null}
      <Button className="starter-button w-100" type="submit">
        {copy[mode].button}
      </Button>
      <div className="auth-links">
        <Link href="/dashboard">Ir direto para o dashboard</Link>
        {mode !== "login" ? <Link href="/login">Voltar ao login</Link> : null}
        {mode === "login" ? <Link href="/recuperar-senha">Recuperar senha</Link> : null}
      </div>
    </Form>
  );
}
