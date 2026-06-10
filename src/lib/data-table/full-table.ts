import type { SortState } from "@/lib/hooks/useDataTable";

/** Shared Variation 5 table chrome props for list views. */
export const FULL_TABLE = {
  searchable: true as const,
  sortable: true as const,
  paginated: true as const,
  filterable: true as const,
  defaultPageSize: 10,
};

export function fullTableSort(defaultKey: string, direction: "asc" | "desc" = "asc"): SortState {
  return { key: defaultKey, direction };
}
