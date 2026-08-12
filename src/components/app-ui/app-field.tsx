import type { ReactNode } from 'react';
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
  optional = true,
  required,
}: AppFieldProps) {
  return (
    <Field className="gap-2" data-invalid={Boolean(error)}>
      <FieldLabel>
        {label}
        {required ? (
          <span aria-label="required" className="ml-0.5 text-destructive">
            *
          </span>
        ) : optional ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground/75">(optional)</span>
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
