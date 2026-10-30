"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Alert, Button, Form } from "react-bootstrap";
import { FormInput } from "@/components/ui/FormInput";
import { Loading } from "@/components/ui/Loading";
import { apiRequest } from "@/util/apiRequest";

type Etapa = "email" | "codigo" | "senha" | "concluido";
type ApiResponse = { message?: string; data?: { token?: string; expiraEmSegundos?: number } };
const STORAGE_KEY = "recuperacaoSenhaToken";
const STORAGE_STAGE_KEY = "recuperacaoSenhaEtapa";

export default function RecoverPasswordPage() {
  const [etapa, setEtapa] = useState<Etapa>("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [token, setToken] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const tokenSalvo = sessionStorage.getItem(STORAGE_KEY);
    const etapaSalva = sessionStorage.getItem(STORAGE_STAGE_KEY);
    if (tokenSalvo) {
      setToken(tokenSalvo);
      setEtapa(etapaSalva === "senha" ? "senha" : "codigo");
    }
  }, []);

  function guardarToken(novoToken: string, proximaEtapa: "codigo" | "senha") {
    setToken(novoToken);
    sessionStorage.setItem(STORAGE_KEY, novoToken);
    sessionStorage.setItem(STORAGE_STAGE_KEY, proximaEtapa);
  }

  async function chamarApi(path: string, body: Record<string, string>) {
    setErro(""); setMensagem(""); setEnviando(true);
    try {
      const response = await apiRequest({ path, method: "POST", body });
      const result = (await response.json().catch(() => null)) as ApiResponse | null;
      if (!response.ok) {
        setErro(result?.message || "Não foi possível concluir a solicitação.");
        return null;
      }
      setMensagem(result?.message || "Solicitação concluída.");
      return result;
    } catch {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
      return null;
    } finally { setEnviando(false); }
  }

  async function solicitarCodigo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await chamarApi("/recuperacao-senha/solicitar", { email: email.trim() });
    const novoToken = result?.data?.token;
    if (novoToken) { guardarToken(novoToken, "codigo"); setEtapa("codigo"); }
  }

  async function validarCodigo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await chamarApi("/recuperacao-senha/validar-codigo", { token, codigo });
    const novoToken = result?.data?.token;
    if (novoToken) { guardarToken(novoToken, "senha"); setEtapa("senha"); }
  }

  async function redefinirSenha(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (senha !== confirmarSenha) { setErro("A confirmação da senha não confere."); return; }
    const result = await chamarApi("/recuperacao-senha/redefinir", { token, senha, confirmarSenha });
    if (result) {
      sessionStorage.removeItem(STORAGE_KEY); sessionStorage.removeItem(STORAGE_STAGE_KEY);
      setToken(""); setEtapa("concluido");
    }
  }

  function reiniciar() {
    sessionStorage.removeItem(STORAGE_KEY); sessionStorage.removeItem(STORAGE_STAGE_KEY);
    setToken(""); setCodigo("");
    setMensagem(""); setErro(""); setEtapa("email");
  }

  return (
    <main className="auth-shell recover-auth-shell">
      <section className="auth-panel">
        <Loading visible={enviando} mode="overlay" label="Processando solicitação" />
        <div className="auth-heading">
          <Link className="auth-brand" href="/">SaaS Starter</Link>
          <h1>Recuperar senha</h1>
          <p>
            {etapa === "email" && "Informe seu e-mail para receber um código de verificação."}
            {etapa === "codigo" && "Digite o código de 6 números enviado para o seu e-mail."}
            {etapa === "senha" && "Crie uma nova senha para acessar sua conta."}
            {etapa === "concluido" && "Sua senha foi alterada e já pode ser usada no login."}
          </p>
        </div>

        {mensagem && etapa !== "concluido" ? <Alert variant="success">{mensagem}</Alert> : null}
        {erro ? <Alert variant="danger">{erro}</Alert> : null}

        {etapa === "email" ? (
          <Form className="demo-form" onSubmit={solicitarCodigo}>
            <FormInput id="recoverEmail" label="E-mail" placeholder="voce@example.com" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required disabled={enviando} />
            <Button className="starter-button w-100" type="submit" disabled={enviando}>Enviar código</Button>
          </Form>
        ) : null}

        {etapa === "codigo" ? (
          <Form className="demo-form" onSubmit={validarCodigo}>
            <FormInput id="recoverCode" label="Código de verificação" placeholder="000000" type="text"
              inputMode="numeric" maxLength={6} value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
              autoComplete="one-time-code" required disabled={enviando} />
            <Button className="starter-button w-100" type="submit" disabled={enviando || codigo.length !== 6}>Validar código</Button>
            <Button variant="link" type="button" onClick={reiniciar} disabled={enviando}>Usar outro e-mail</Button>
          </Form>
        ) : null}

        {etapa === "senha" ? (
          <Form className="demo-form" onSubmit={redefinirSenha}>
            <FormInput id="newPassword" label="Nova senha" type="password" value={senha}
              onChange={(e) => setSenha(e.target.value)} autoComplete="new-password" required disabled={enviando}
              helperText="Mínimo de 5 caracteres, com número, maiúscula e caractere especial." />
            <FormInput id="confirmPassword" label="Confirmar nova senha" type="password" value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)} autoComplete="new-password" required disabled={enviando} />
            <Button className="starter-button w-100" type="submit" disabled={enviando}>Alterar senha</Button>
          </Form>
        ) : null}

        {etapa === "concluido" ? (
          <Alert variant="success">Senha redefinida com sucesso. <Alert.Link as={Link} href="/login">Ir para o login</Alert.Link></Alert>
        ) : null}
        <div className="auth-links">
          <Link href="/">Voltar à página inicial</Link><Link href="/login">Voltar ao login</Link>
        </div>
      </section>
    </main>
  );
}
