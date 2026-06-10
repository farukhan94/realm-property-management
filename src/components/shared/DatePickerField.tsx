"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export function DatePickerField({
  label,
  value,
  onChange,
  id = "date-picker",
}: DatePickerFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-[200px]"
      />
    </div>
  );
}
