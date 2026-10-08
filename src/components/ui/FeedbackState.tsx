import { Button } from "react-bootstrap";

interface FeedbackStateProps {
  title: string;
  description: string;
  variant: "loading" | "error" | "empty" | "success";
  actionLabel?: string;
}

export function FeedbackState({
  title,
  description,
  variant,
  actionLabel
}: FeedbackStateProps) {
  return (
    <div className={`feedback-state feedback-${variant}`}>
      <div className="feedback-icon" aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
      {actionLabel ? (
        <Button className="starter-button" size="sm">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
