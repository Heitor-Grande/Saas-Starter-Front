import type { ReactNode } from "react";
import { Form, type FormSelectProps as BootstrapSelectProps } from "react-bootstrap";

export interface FormSelectProps extends Omit<BootstrapSelectProps, "id"> {
  id: string;
  label: string;
  children: ReactNode;
  helperText?: string;
  error?: string;
}

export function FormSelect({
  id,
  label,
  children,
  helperText,
  error,
  ...selectProps
}: FormSelectProps) {
  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Select {...selectProps} isInvalid={Boolean(error)}>
        {children}
      </Form.Select>
      {helperText && !error ? <Form.Text>{helperText}</Form.Text> : null}
      {error ? <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback> : null}
    </Form.Group>
  );
}
