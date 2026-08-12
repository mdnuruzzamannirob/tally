'use client';
import { AppInput, type AppInputProps } from './app-input';
export type AppCurrencyInputProps = Omit<AppInputProps, 'leading' | 'type'> & { currency?: string };
export function AppCurrencyInput({
  currency = '৳',
  inputMode = 'decimal',
  ...props
}: AppCurrencyInputProps) {
  return (
    <AppInput
      {...props}
      className="pl-7"
      inputMode={inputMode}
      leading={<span className="text-sm font-medium">{currency}</span>}
      leadingClassName="left-2"
      type="text"
    />
  );
}
