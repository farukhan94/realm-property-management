"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataTable, type FilterConfig, type SortState } from "@/lib/hooks/useDataTable";
import { buildFiltersFromColumns } from "@/lib/data-table/resolve-filters";
import { RowActions, type RowAction } from "@/components/shared/RowActions";
import { DataTableFilterSheet } from "@/components/shared/DataTableFilterSheet";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  filterable?: boolean;
  filterKey?: keyof T | string;
  filterValue?: (row: T) => string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T | string)[];
  filters?: FilterConfig<T>[];
  filterable?: boolean;
  sortable?: boolean;
  defaultSort?: SortState;
  paginated?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  actions?: RowAction<T>[];
  actionsHeader?: string;
}

function SortIcon({ active, direction }: { active: boolean; direction?: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="size-3.5 text-muted-foreground/60" />;
  if (direction === "asc") return <ArrowUp className="size-3.5 text-primary" />;
  return <ArrowDown className="size-3.5 text-primary" />;
}

export function DataTable<T extends { id?: string }>({
  columns,
  data,
  emptyMessage = "No records found.",
  searchable = false,
  searchPlaceholder = "Search…",
  searchKeys = [],
  filters = [],
  filterable = false,
  sortable = false,
  defaultSort,
  paginated = false,
  defaultPageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  actions,
  actionsHeader = "",
}: DataTableProps<T>) {
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const resolvedFilters = useMemo(
    () => buildFiltersFromColumns(columns, data, filters),
    [columns, data, filters]
  );

  const showFilterButton = filterable && resolvedFilters.length > 0;
  const hasToolbar = searchable || showFilterButton;
  const hasFeatures =
    hasToolbar || paginated || (actions && actions.length > 0) || sortable || filterable;

  const effectiveSearchKeys = useMemo(() => {
    if (searchKeys.length > 0) return searchKeys;
    if (!searchable) return [];
    return columns
      .filter((col) => col.key !== "__actions")
      .map((col) => col.filterKey ?? col.key);
  }, [searchKeys, searchable, columns]);

  const getSortValue = useMemo(() => {
    if (!sortable) return undefined;
    const sortableColumns = new Map(
      columns.filter((col) => col.sortable).map((col) => [col.key, col.sortValue])
    );
    return (row: T, key: string) => {
      const accessor = sortableColumns.get(key);
      if (accessor) return accessor(row);
      const val = (row as Record<string, unknown>)[key];
      if (typeof val === "string" || typeof val === "number") return val;
      return undefined;
    };
  }, [columns, sortable]);

  const table = useDataTable({
    data,
    searchKeys: searchable ? effectiveSearchKeys : [],
    filters: showFilterButton ? resolvedFilters : [],
    defaultSort,
    defaultPageSize: paginated ? defaultPageSize : data.length || defaultPageSize,
    getSortValue,
  });

  const displayColumns = useMemo(() => {
    if (!actions || actions.length === 0) return columns;
    return [
      ...columns,
      {
        key: "__actions",
        header: actionsHeader,
        className: "w-[1%] whitespace-nowrap text-right",
        filterable: false,
        sortable: false,
        cell: (row: T) => <RowActions row={row} actions={actions} />,
      } satisfies Column<T>,
    ];
  }, [columns, actions, actionsHeader]);

  const rows = hasFeatures ? table.rows : data;
  const activeFilterCount = table.activeFilters.length;

  function handleSort(key: string) {
    if (!sortable) return;
    const col = columns.find((c) => c.key === key);
    if (!col?.sortable) return;
    table.toggleSort(key);
  }

  if (!hasFeatures) {
    return (
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow key={row.id ?? i}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  return (
    <div className="space-y-3">
      {hasToolbar ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            {searchable ? (
              <Input
                type="search"
                value={table.search}
                onChange={(e) => table.setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 max-w-sm"
              />
            ) : null}
            {showFilterButton ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => setFilterSheetOpen(true)}
              >
                <SlidersHorizontal className="size-3.5" />
                Filters
                {activeFilterCount > 0 ? (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5">
                    {activeFilterCount}
                  </Badge>
                ) : null}
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            {table.totalItems} {table.totalItems === 1 ? "record" : "records"}
          </p>
        </div>
      ) : null}

      {(table.activeFilters.length > 0 || table.search) && hasToolbar ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {table.search ? (
            <Badge variant="secondary" className="gap-1 pr-1">
              Search: {table.search}
              <button
                type="button"
                onClick={table.clearSearch}
                className="rounded-sm p-0.5 hover:bg-muted"
                aria-label="Clear search"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ) : null}
          {table.activeFilters.map((filter) => (
            <Badge key={filter.key} variant="secondary" className="gap-1 pr-1">
              {filter.label}
              <button
                type="button"
                onClick={() => table.clearFilter(filter.key)}
                className="rounded-sm p-0.5 hover:bg-muted"
                aria-label={`Clear ${filter.label}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {(table.activeFilters.length > 0 || table.search) ? (
            <Button
              variant="ghost"
              size="xs"
              className="h-6 text-xs"
              onClick={() => {
                table.clearSearch();
                table.clearAllFilters();
              }}
            >
              Clear all
            </Button>
          ) : null}
        </div>
      ) : null}

      <DataTableFilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={resolvedFilters}
        values={table.filterValues}
        onApply={table.setFilters}
        onClear={table.clearAllFilters}
      />

      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              {displayColumns.map((col) => {
                const isSortable = sortable && "sortable" in col && col.sortable && col.key !== "__actions";
                const isActive = table.sort?.key === col.key;
                return (
                  <TableHead key={col.key} className={col.className}>
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className={cn(
                          "inline-flex items-center gap-1 font-medium hover:text-foreground",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {col.header}
                        <SortIcon active={isActive} direction={table.sort?.direction} />
                      </button>
                    ) : (
                      col.header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={displayColumns.length} className="text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow key={row.id ?? i}>
                  {displayColumns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {paginated && table.totalItems > 0 ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Rows per page</span>
            <Select
              value={String(table.pageSize)}
              onValueChange={(v) => table.setPageSize(Number(v ?? table.pageSize))}
            >
              <SelectTrigger size="sm" className="h-7 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Page {table.page} of {table.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={table.page <= 1}
              onClick={() => table.setPage(table.page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={table.page >= table.totalPages}
              onClick={() => table.setPage(table.page + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export type { FilterConfig, RowAction, SortState };
