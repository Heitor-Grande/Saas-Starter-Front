import { Card } from "react-bootstrap";

interface StatCardProps {
  label: string;
  value: string;
  variation: string;
  tone?: "primary" | "accent" | "neutral";
}

export function StatCard({
  label,
  value,
  variation,
  tone = "neutral"
}: StatCardProps) {
  return (
    <Card className={`app-card stat-card stat-card-${tone}`}>
      <Card.Body>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{variation}</small>
      </Card.Body>
    </Card>
  );
}
