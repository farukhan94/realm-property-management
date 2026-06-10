"use client";

import { useEffect, useState } from "react";
import { FormSheet } from "@/components/shared/FormSheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ComboboxField } from "@/components/shared/ComboboxField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterConfig } from "@/lib/hooks/useDataTable";

const COMBOBOX_OPTION_THRESHOLD = 5;

interface DataTableFilterSheetProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterConfig<T>[];
  values: Record<string, string>;
  onApply: (values: Record<string, string>) => void;
  onClear: () => void;
}

export function DataTableFilterSheet<T>({
  open,
  onOpenChange,
  filters,
  values,
  onApply,
  onClear,
}: DataTableFilterSheetProps<T>) {
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      const initial: Record<string, string> = {};
      for (const filter of filters) {
        const key = String(filter.key);
        initial[key] = values[key] ?? "all";
      }
      setDraft(initial);
    }
  }, [open, filters, values]);

  function setDraftFilter(key: string, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleApply() {
    onApply(draft);
    onOpenChange(false);
  }

  function handleClear() {
    const cleared: Record<string, string> = {};
    for (const filter of filters) {
      cleared[String(filter.key)] = "all";
    }
    setDraft(cleared);
    onClear();
    onOpenChange(false);
  }

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Filter table"
      description="Narrow results by any column. Options are derived from the current dataset."
      hideDefaultFooter
      footer={
        <div className="flex flex-row justify-between gap-2">
          <Button variant="outline" onClick={handleClear}>
            Clear all
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>Apply filters</Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {filters.map((filter) => {
          const key = String(filter.key);
          const value = draft[key] ?? "all";
          const filterOptions = filter.options ?? [];
          const useCombobox = filterOptions.length > COMBOBOX_OPTION_THRESHOLD;
          const allLabel = `All ${filter.title.toLowerCase()}`;

          return (
            <div key={key} className="space-y-1.5">
              <Label>{filter.title}</Label>
              {useCombobox ? (
                <ComboboxField
                  className="w-full"
                  value={value}
                  onValueChange={(v) => setDraftFilter(key, v)}
                  placeholder={allLabel}
                  options={[
                    { value: "all", label: allLabel },
                    ...filterOptions,
                  ]}
                />
              ) : (
                <Select value={value} onValueChange={(v) => setDraftFilter(key, v ?? "all")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={allLabel} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{allLabel}</SelectItem>
                    {filterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          );
        })}
      </div>
    </FormSheet>
  );
}
