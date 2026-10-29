"use client";

import { Badge, Card, Col, ProgressBar, Row, Table } from "react-bootstrap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  activityItems,
  dashboardMetrics,
  tableRows
} from "@/mocks/dashboard";

export default function DashboardPage() {
  return (
    <div className="audit-page">
      <SectionHeader
        eyebrow="Dashboard"
        title="Visão Geral"
        description="Visão geral das informações da organização."
      />
    </div>
  );
}
