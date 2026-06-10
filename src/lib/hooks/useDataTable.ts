"use client";

import { useMemo, useState } from "react";

export interface FilterConfig<T> {
  key: keyof T | string;
  title: string;
  options?: { label: string; value: string }[];
  getValue?: (row: T) => string;
}

export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface UseDataTableOptions<T> {
  data: T[];
  searchKeys?: (keyof T | string)[];
  filters?: FilterConfig<T>[];
  defaultSort?: SortState;
  defaultPageSize?: number;
  getSortValue?: (row: T, key: string) => string | number | null | undefined;
}

function getFieldValue<T>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

function compareValues(a: unknown, b: unknown, direction: SortDirection): number {
  const multiplier = direction === "asc" ? 1 : -1;
  if (a == null && b == null) return 0;
  if (a == null) return 1 * multiplier;
  if (b == null) return -1 * multiplier;

  if (typeof a === "number" && typeof b === "number") {
    return (a - b) * multiplier;
  }

  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" }) * multiplier;
}

export function useDataTable<T>({
  data,
  searchKeys = [],
  filters = [],
  defaultSort,
  defaultPageSize = 10,
  getSortValue,
}: UseDataTableOptions<T>) {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortState | null>(defaultSort ?? null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filteredData = useMemo(() => {
    let result = data;

    const query = search.trim().toLowerCase();
    if (query && searchKeys.length > 0) {
      result = result.filter((row) =>
        searchKeys.some((key) => {
          const value = getFieldValue(row, String(key));
          return String(value ?? "").toLowerCase().includes(query);
        })
      );
    }

    for (const filter of filters) {
      const filterKey = String(filter.key);
      const selected = filterValues[filterKey];
      if (selected && selected !== "all") {
        result = result.filter((row) => {
          const raw = filter.getValue ? filter.getValue(row) : getFieldValue(row, filterKey);
          return String(raw ?? "") === selected;
        });
      }
    }

    return result;
  }, [data, search, searchKeys, filters, filterValues]);

  const sortedData = useMemo(() => {
    if (!sort) return filteredData;
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const aVal = getSortValue ? getSortValue(a, sort.key) : getFieldValue(a, sort.key);
      const bVal = getSortValue ? getSortValue(b, sort.key) : getFieldValue(b, sort.key);
      return compareValues(aVal, bVal, sort.direction);
    });
    return sorted;
  }, [filteredData, sort, getSortValue]);

  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  function setFilter(key: string, value: string) {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function setFilters(values: Record<string, string>) {
    setFilterValues(values);
    setPage(1);
  }

  function clearAllFilters() {
    setFilterValues({});
    setPage(1);
  }

  function toggleSort(key: string) {
    setSort((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
    setPage(1);
  }

  function setSearchQuery(value: string) {
    setSearch(value);
    setPage(1);
  }

  function setPageSizeAndReset(size: number) {
    setPageSize(size);
    setPage(1);
  }

  const activeFilters = filters
    .map((filter) => {
      const key = String(filter.key);
      const value = filterValues[key];
      if (!value || value === "all") return null;
      const option = filter.options?.find((o) => o.value === value);
      return {
        key,
        label: `${filter.title}: ${option?.label ?? value}`,
      };
    })
    .filter((item): item is { key: string; label: string } => item !== null);

  return {
    rows: paginatedData,
    search,
    setSearch: setSearchQuery,
    filterValues,
    setFilter,
    sort,
    toggleSort,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize: setPageSizeAndReset,
    totalItems,
    totalPages,
    activeFilters,
    clearFilter: (key: string) => setFilter(key, "all"),
    clearSearch: () => setSearchQuery(""),
    setFilters,
    clearAllFilters,
  };
}
