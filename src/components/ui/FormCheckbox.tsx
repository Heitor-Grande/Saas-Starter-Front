import { Form, type FormCheckProps as BootstrapCheckProps } from "react-bootstrap";

export interface FormCheckboxProps extends Omit<BootstrapCheckProps, "id" | "label"> {
  id: string;
  label: string;
  description?: string;
}

export function FormCheckbox({
  id,
  label,
  description,
  type = "checkbox",
  className = "",
  ...checkProps
}: FormCheckboxProps) {
  return (
    <div className={`ui-checkbox-field ${className}`.trim()}>
      <div>
        <label htmlFor={id}>{label}</label>
        {description ? <span>{description}</span> : null}
      </div>
      <Form.Check id={id} type={type} aria-label={label} {...checkProps} />
    </div>
  );
}
