import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AdminDashboardPage() {
  return (
    <div className="audit-page">
      <SectionHeader
        eyebrow="Visão Geral"
        title="Dashboard Admin"
        description="Acompanhe os indicadores gerais da aplicação."
      />
    </div>
  );
}
