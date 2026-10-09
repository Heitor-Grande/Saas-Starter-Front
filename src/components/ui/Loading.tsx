import { Spinner } from "react-bootstrap";

export type LoadingMode = "inline" | "section" | "overlay";
export type LoadingSize = "sm" | "md" | "lg";

interface LoadingProps {
  visible?: boolean;
  label?: string;
  description?: string;
  mode?: LoadingMode;
  size?: LoadingSize;
  className?: string;
}

export function Loading({
  visible = true,
  label = "Carregando",
  description,
  mode = "section",
  size = "md",
  className = ""
}: LoadingProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={`ui-loading ui-loading-${mode} ui-loading-${size} ${className}`.trim()}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <Spinner animation="border" aria-hidden="true" />
      <div className="ui-loading-content">
        <strong>{label}</strong>
        {description ? <span>{description}</span> : null}
      </div>
    </div>
  );
}
