"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form } from "react-bootstrap";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { FormInput } from "@/components/ui/FormInput";
import { Loading } from "@/components/ui/Loading";
import { apiRequest } from "@/util/apiRequest";

interface LoginResponse {
  message?: string;
  data?: { token?: string };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");

  /** Envia as credenciais, salva o token recebido e abre o dashboard após o login. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setRequestError("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest({
        path: "/login",
        method: "POST",
        body: { email: email.trim(), senha }
      });
      const result = (await response.json().catch(() => null)) as LoginResponse | null;

      if (!response.ok) {
        setRequestError(result?.message || "Não foi possível entrar na conta. Tente novamente.");
        setIsSubmitting(false);
        return;
      }

      const token = result?.data?.token;
      if (typeof token !== "string" || !token) {
        setRequestError("Não foi possível iniciar a sessão. Tente novamente.");
        setIsSubmitting(false);
        return;
      }

      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `token=${encodeURIComponent(token)}; Path=/; SameSite=Lax${secure}`;
      router.push("/dashboard");
    } catch {
      setRequestError("Não foi possível conectar ao servidor. Tente novamente.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell login-auth-shell">
      <section className="auth-panel login-auth-panel">
        <Loading visible={isSubmitting} mode="overlay" label="Entrando na conta" />
        <div className="auth-heading">
          SaaS Starter
          <h1>Acessar conta</h1>
        </div>

        <Form className="demo-form" onSubmit={handleSubmit}>
          <FormInput
            id="loginEmail"
            label="E-mail"
            placeholder="voce@example.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
            disabled={isSubmitting}
          />
          <FormInput
            id="loginPassword"
            label="Senha"
            placeholder="Digite sua senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            autoComplete="current-password"
            required
            disabled={isSubmitting}
          />
          <Button className="starter-button w-100" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar no dashboard"}
          </Button>
          <div className="auth-links">
            <Link href="/">Voltar à página inicial</Link>
            <Link href="/recuperar-senha">Recuperar senha</Link>
          </div>
        </Form>
      </section>

      <div className="auth-media login-auth-media" aria-hidden="true" />
      <FeedbackState
        show={Boolean(requestError)}
        variant="error"
        title="Não foi possível entrar"
        description={requestError}
        onClose={() => setRequestError("")}
      />
    </main>
  );
}
