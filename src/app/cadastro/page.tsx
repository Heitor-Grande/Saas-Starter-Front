import { AuthShell } from "@/components/layout/AuthShell";
import { AuthDemoForm } from "@/components/ui/AuthDemoForm";

export default function SignupPage() {
  return (
    <AuthShell
      description="Crie uma conta ficticia para validar o fluxo de cadastro da fundacao visual."
      title="Criar conta"
    >
      <AuthDemoForm mode="signup" />
    </AuthShell>
  );
}
