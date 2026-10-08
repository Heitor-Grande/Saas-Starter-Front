import { AuthShell } from "@/components/layout/AuthShell";
import { AuthDemoForm } from "@/components/ui/AuthDemoForm";

export default function RecoverPasswordPage() {
  return (
    <AuthShell
      description="Simule o envio de uma instrucao de recuperacao sem disparar email ou integrar API."
      title="Recuperar senha"
    >
      <AuthDemoForm mode="recover" />
    </AuthShell>
  );
}
