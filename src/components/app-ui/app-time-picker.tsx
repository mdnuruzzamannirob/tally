'use client';
import { Clock3 } from 'lucide-react';
import { AppSelect } from './app-select';
const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 ? '30' : '00';
  const value = `${String(hours).padStart(2, '0')}:${minutes}`;
  const displayHour = hours % 12 || 12;
  return { label: `${displayHour}:${minutes} ${hours < 12 ? 'AM' : 'PM'}`, value };
});
export function AppTimePicker({
  onValueChange,
  value,
}: {
  onValueChange?: (value: string | null) => void;
  value?: string | null;
}) {
  return (
    <AppSelect
      contentClassName="max-h-64"
      leading={<Clock3 />}
      onValueChange={onValueChange}
      options={timeOptions}
      placeholder="Select time"
      value={value}
    />
  );
}
