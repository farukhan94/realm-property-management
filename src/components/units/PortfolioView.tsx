"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/DataTable";
import { UnitQuickPreview } from "@/components/shared/UnitQuickPreview";
import { unitsService } from "@/lib/api/services/units";
import { useEntity } from "@/lib/entity-context";
import { cn } from "@/lib/utils";
import type { Building } from "@/types/building";
import type { Unit } from "@/types/unit";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";
import { getUnitStatusAtDate } from "@/lib/unit-status";

interface UnitRow extends Unit {
  buildingName: string;
  buildingLocation: string;
  occupancyStatus: "Occupied" | "Vacant";
}

type KpiTone = "neutral" | "success" | "warning" | "info";

function kpiValueClass(tone: KpiTone): string {
  switch (tone) {
    case "success":
      return "text-revenue";
    case "warning":
      return "text-warning";
    case "info":
      return "text-primary";
    default:
      return "text-foreground";
  }
}

function BuildingKpiCards({
  totalUnits,
  occupied,
  vacant,
  occupancyPct,
}: {
  totalUnits: number;
  occupied: number;
  vacant: number;
  occupancyPct: number;
}) {
  const items: { label: string; value: string | number; tone: KpiTone }[] = [
    { label: "Total units", value: totalUnits, tone: "neutral" },
    { label: "Occupied", value: occupied, tone: "success" },
    { label: "Vacant", value: vacant, tone: "warning" },
    { label: "Occupancy", value: `${occupancyPct}%`, tone: occupancyPct >= 90 ? "success" : "info" },
  ];

  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col justify-center rounded-lg border border-border bg-card px-3 py-2"
        >
          <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
          <p className={cn("font-mono text-lg font-semibold leading-tight tabular-nums", kpiValueClass(item.tone))}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function PortfolioView() {
  const router = useRouter();
  const { entityId } = useEntity();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [buildingSearch, setBuildingSearch] = useState("");

  const load = useCallback(() => {
    unitsService.listBuildings(entityId).then(setBuildings);
    unitsService.listUnits(undefined, entityId).then((rows) => {
      const today = new Date().toISOString().slice(0, 10);
      setUnits(
        rows.map((row) => ({
          ...row,
          occupancyStatus: getUnitStatusAtDate(row, today).tenantId ? "Occupied" : "Vacant",
        }))
      );
    });
  }, [entityId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (buildings.length === 0) {
      setSelectedBuildingId(null);
      return;
    }
    setSelectedBuildingId((current) =>
      current && buildings.some((b) => b.id === current) ? current : buildings[0].id
    );
  }, [buildings]);

  const filteredBuildings = useMemo(() => {
    const query = buildingSearch.trim().toLowerCase();
    if (!query) return buildings;
    return buildings.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.location.toLowerCase().includes(query)
    );
  }, [buildings, buildingSearch]);

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId) ?? null;

  const buildingUnits = useMemo(() => {
    if (!selectedBuildingId) return [];
    return units.filter((u) => u.buildingId === selectedBuildingId);
  }, [units, selectedBuildingId]);

  const vacantCount = buildingUnits.filter((u) => u.occupancyStatus === "Vacant").length;
  const occupiedCount = buildingUnits.length - vacantCount;

  return (
    <PageShell
      title="Portfolio"
      description="Buildings, units, and occupancy across your portfolio."
      actions={
        selectedBuilding ? (
          <div className="w-full min-w-0 sm:max-w-xl">
            <BuildingKpiCards
              totalUnits={selectedBuilding.totalUnits}
              occupied={occupiedCount}
              vacant={vacantCount}
              occupancyPct={selectedBuilding.occupancy}
            />
          </div>
        ) : undefined
      }
    >
      <div className="lg:hidden">
        <Select
          value={selectedBuildingId ?? undefined}
          onValueChange={(value) => setSelectedBuildingId(value ?? null)}
        >
          <SelectTrigger className="mb-4 h-9 w-full">
            <SelectValue placeholder="Select a building…" />
          </SelectTrigger>
          <SelectContent>
            {buildings.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="flex h-[calc(100dvh-13rem)] max-h-[calc(100dvh-13rem)] flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
          <aside className="relative hidden h-full min-h-0 w-[240px] shrink-0 flex-col overflow-hidden border-b border-border p-4 lg:flex lg:border-b-0 lg:border-r">
            <Input
              type="search"
              value={buildingSearch}
              onChange={(e) => setBuildingSearch(e.target.value)}
              placeholder="Search buildings…"
              className="mb-3 h-8 shrink-0"
            />
            <div
              className={cn(
                "min-h-0 flex-1 overflow-y-auto pr-1",
                "[scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5",
                "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/50",
                "hover:[&::-webkit-scrollbar-thumb]:bg-border"
              )}
            >
              <div className="space-y-0.5 pb-2">
                {filteredBuildings.length === 0 ? (
                  <p className="px-2 py-4 text-sm text-muted-foreground">No buildings found.</p>
                ) : (
                  filteredBuildings.map((b) => {
                    const isSelected = b.id === selectedBuildingId;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBuildingId(b.id)}
                        className={cn(
                          "w-full rounded-r-md py-2.5 pl-3 pr-2 text-left transition-colors",
                          isSelected
                            ? "border-l-[3px] border-l-primary bg-primary/5"
                            : "border-l-[3px] border-l-transparent hover:bg-muted/60"
                        )}
                      >
                        <p className="truncate text-sm font-medium">{b.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{b.location}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {b.totalUnits} units · {b.occupancy}% occupied
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 lg:p-6">
            {selectedBuilding ? (
              <>
                <div className="mb-3 flex shrink-0 flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold">{selectedBuilding.name}</h2>
                  {selectedBuilding.location ? (
                    <Badge variant="secondary">{selectedBuilding.location}</Badge>
                  ) : null}
                </div>
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
                  <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <DataTable
                    {...FULL_TABLE}
                    data={buildingUnits}
                    searchPlaceholder="Search unit ID…"
                    searchKeys={["id", "label"]}
                    defaultSort={fullTableSort("id")}
                    columns={[
                      {
                        key: "id",
                        header: "Unit ID",
                        sortable: true,
                        cell: (row) => (
                          <UnitQuickPreview
                            unitId={row.id}
                            label={row.label}
                            buildingName={row.buildingName}
                            ownershipCount={row.ownershipHistory.length}
                            tenancyCount={row.tenancyHistory.length}
                          />
                        ),
                      },
                      {
                        key: "occupancyStatus",
                        header: "Status",
                        sortable: true,
                        filterKey: "occupancyStatus",
                        filterValue: (row) => row.occupancyStatus,
                        cell: (row) => row.occupancyStatus,
                      },
                      {
                        key: "history",
                        header: "Records",
                        sortValue: (row) =>
                          row.ownershipHistory.length + row.tenancyHistory.length,
                        cell: (row) =>
                          `${row.ownershipHistory.length} owners · ${row.tenancyHistory.length} tenancies`,
                      },
                    ]}
                    actions={[
                      {
                        label: "View details",
                        href: (row) => `/portfolio/units/${row.id}`,
                      },
                      {
                        label: "View timeline",
                        onClick: (row) =>
                          router.push(`/portfolio/units/${row.id}?tab=timeline`),
                      },
                    ]}
                  />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center py-12 text-sm text-muted-foreground">
                No buildings in this portfolio yet.
              </div>
            )}
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
