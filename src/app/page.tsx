import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing-page">
      <Image
        className="landing-background"
        src="/images/saas-landing-hero.png"
        alt="Painel de gestão SaaS exibido em um ambiente de trabalho"
        fill
        priority
        sizes="100vw"
      />
      <div className="landing-overlay" aria-hidden="true" />

      <header className="landing-header">
        <Link className="landing-brand" href="/" aria-label="SaaS Starter - página inicial">
          <span aria-hidden="true">S</span>
          <strong>SaaS Starter</strong>
        </Link>
        <nav className="landing-navigation" aria-label="Navegação da página inicial">
          <Link className="landing-login-link" href="/login">Entrar</Link>
          <Link className="landing-header-cta" href="/cadastro">Assinar</Link>
        </nav>
      </header>

      <section className="landing-content" aria-labelledby="landing-title">
        <span className="landing-eyebrow">Gestão simples. Decisões mais claras.</span>
        <h1 id="landing-title">SaaS Starter</h1>
        <p className="landing-lead">
          Uma base completa para organizar sua operação, acompanhar resultados e manter sua equipe conectada.
        </p>
        <div className="landing-actions">
          <Link className="landing-primary-action" href="/cadastro">Assinar</Link>
          <Link className="landing-secondary-action" href="/login">Acessar minha conta</Link>
        </div>
        <div className="landing-highlights" aria-label="Destaques da plataforma">
          <span>Operação centralizada</span>
          <span>Equipe organizada</span>
          <span>Dados acessíveis</span>
        </div>
      </section>
    </main>
  );
}
