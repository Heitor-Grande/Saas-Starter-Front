import { Form, type FormControlProps } from "react-bootstrap";

export interface FormInputProps extends Omit<FormControlProps, "id"> {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
}

export function FormInput({ id, label, helperText, error, ...controlProps }: FormInputProps) {
  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control {...controlProps} isInvalid={Boolean(error)} />
      {helperText && !error ? <Form.Text>{helperText}</Form.Text> : null}
      {error ? <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback> : null}
    </Form.Group>
  );
}
