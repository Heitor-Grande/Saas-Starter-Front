import { AuthShell } from "@/components/layout/AuthShell";
import { AuthDemoForm } from "@/components/ui/AuthDemoForm";

export default function LoginPage() {
  return (
    <AuthShell
      description="Entre visualmente no template. Nenhuma autenticacao real sera executada."
      title="Acessar conta"
    >
      <AuthDemoForm mode="login" />
    </AuthShell>
  );
}
