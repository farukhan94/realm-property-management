import type { FilterConfig } from "@/lib/hooks/useDataTable";
import type { Column } from "@/components/shared/DataTable";

function getFieldValue<T>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

export function resolveFilterOptions<T>(
  data: T[],
  filter: FilterConfig<T>
): { label: string; value: string }[] {
  if (filter.options?.length) return filter.options;

  const values = new Set<string>();
  for (const row of data) {
    const raw = filter.getValue ? filter.getValue(row) : getFieldValue(row, String(filter.key));
    if (raw == null || raw === "") continue;
    values.add(String(raw));
  }

  return [...values]
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
    .map((value) => ({ label: value, value }));
}

export function buildFiltersFromColumns<T>(
  columns: Column<T>[],
  data: T[],
  explicitFilters: FilterConfig<T>[] = []
): FilterConfig<T>[] {
  if (explicitFilters.length > 0) {
    return explicitFilters;
  }

  return columns
    .filter((col) => col.key !== "__actions" && col.filterable !== false && col.header)
    .map((col) => ({
      key: col.filterKey ?? col.key,
      title: col.header,
      getValue: col.filterValue,
      options: resolveFilterOptions(data, {
        key: col.filterKey ?? col.key,
        title: col.header,
        getValue: col.filterValue,
      }),
    }));
}
