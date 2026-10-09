"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Alert, Button, Form } from "react-bootstrap";
import { FormInput } from "@/components/ui/FormInput";

export default function LoginPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowSuccess(true);
  }

  return (
    <main className="auth-shell login-auth-shell">
      <section className="auth-panel login-auth-panel">
        <div className="auth-heading">
          <Link className="auth-brand" href="/">
            SaaS Starter
          </Link>
          <h1>Acessar conta</h1>
          <p>Entre visualmente no template. Nenhuma autenticação real será executada.</p>
        </div>

        <Form className="demo-form" onSubmit={handleSubmit}>
          <FormInput
            id="loginEmail"
            label="E-mail"
            placeholder="voce@example.com"
            type="email"
          />
          <FormInput
            id="loginPassword"
            label="Senha"
            placeholder="Senha demonstrativa"
            type="password"
          />
          {showSuccess ? (
            <Alert variant="success">
              Login demonstrativo concluído. Nenhuma sessão real foi criada.
            </Alert>
          ) : null}
          <Button className="starter-button w-100" type="submit">
            Entrar no dashboard
          </Button>
          <div className="auth-links">
            <Link href="/">Voltar à página inicial</Link>
            <Link href="/recuperar-senha">Recuperar senha</Link>
          </div>
        </Form>
      </section>

      <div className="auth-media login-auth-media" aria-hidden="true" />
    </main>
  );
}
