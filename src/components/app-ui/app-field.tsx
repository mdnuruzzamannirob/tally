import { Children, isValidElement, type ReactNode } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';

export type AppFieldProps = {
  children: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  label: ReactNode;
  optional?: boolean;
  required?: boolean;
};
export function AppField({
  children,
  description,
  error,
  label,
  optional = false,
  required,
}: AppFieldProps) {
  const disabled = Children.toArray(children).some(
    (child) => isValidElement<{ disabled?: boolean }>(child) && child.props.disabled,
  );
  return (
    <Field className="gap-2" data-disabled={disabled || undefined} data-invalid={Boolean(error)}>
      <FieldLabel className="gap-1 group-data-[disabled=true]/field:cursor-not-allowed">
        {label}
        {required ? (
          <span aria-label="required" className="text-destructive">
            *
          </span>
        ) : optional ? (
          <span className="text-xs font-normal text-muted-foreground/75">(optional)</span>
        ) : null}
      </FieldLabel>
      {children}
      {description ? (
        <FieldDescription className="text-xs leading-4 text-muted-foreground/75">
          {description}
        </FieldDescription>
      ) : null}
      {error ? <FieldError className="text-xs leading-4" role="alert">{error}</FieldError> : null}
    </Field>
  );
}
