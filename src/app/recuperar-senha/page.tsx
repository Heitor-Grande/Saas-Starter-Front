"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Alert, Button, Form } from "react-bootstrap";
import { FormInput } from "@/components/ui/FormInput";

export default function RecoverPasswordPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowSuccess(true);
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-heading">
          <Link className="auth-brand" href="/">
            SaaS Starter
          </Link>
          <h1>Recuperar senha</h1>
          <p>
            Simule o envio de uma instrução de recuperação sem disparar e-mail ou integrar uma API.
          </p>
        </div>

        <Form className="demo-form" onSubmit={handleSubmit}>
          <FormInput
            id="recoverEmail"
            label="E-mail"
            placeholder="voce@example.com"
            type="email"
          />
          {showSuccess ? (
            <Alert variant="success">
              Instrução visual enviada. Nenhum e-mail real foi disparado.
            </Alert>
          ) : null}
          <Button className="starter-button w-100" type="submit">
            Enviar instrução
          </Button>
          <div className="auth-links">
            <Link href="/">Voltar à página inicial</Link>
            <Link href="/login">Voltar ao login</Link>
          </div>
        </Form>
      </section>
    </main>
  );
}
