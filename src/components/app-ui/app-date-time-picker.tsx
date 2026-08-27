"use client";
import { format, isValid, parseISO } from "date-fns";
import { AppDatePicker } from "./app-date-picker";
import { AppInput } from "./app-input";
export function AppDateTimePicker({
  onChange,
  placeholder = "Pick date and time",
  value,
}: {
  onChange?: (value: string) => void;
  placeholder?: string;
  value?: string;
}) {
  const parsed = value ? parseISO(value) : undefined;
  const date = parsed && isValid(parsed) ? parsed : undefined;
  const time = value?.slice(11, 16) || "09:00";
  const update = (nextDate: Date | undefined, nextTime: string) => {
    if (nextDate) onChange?.(`${format(nextDate, "yyyy-MM-dd")}T${nextTime}`);
  };
  return (
    <div className="flex w-full items-center gap-2">
      <div className="min-w-0 flex-1">
        <AppDatePicker
          onValueChange={(nextDate) => update(nextDate, time)}
          placeholder={placeholder}
          value={date}
        />
      </div>
      <AppInput
        aria-label="Select time"
        className="w-32 shrink-0"
        onChange={(event) => update(date, event.target.value || time)}
        type="time"
        value={time}
      />
    </div>
  );
}
