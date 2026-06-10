"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { UnitQuickPreview } from "@/components/shared/UnitQuickPreview";
import { unitsService } from "@/lib/api/services/units";
import { useEntity } from "@/lib/entity-context";
import type { Building } from "@/types/building";
import type { Unit } from "@/types/unit";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

interface UnitRow extends Unit {
  buildingName: string;
}

export function PortfolioView() {
  const router = useRouter();
  const { entityId } = useEntity();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [units, setUnits] = useState<UnitRow[]>([]);

  const load = useCallback(() => {
    unitsService.listBuildings(entityId).then(setBuildings);
    unitsService.listUnits(undefined, entityId).then(setUnits);
  }, [entityId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PageShell
      title="Portfolio"
      description="Buildings, units, and occupancy across your portfolio."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {buildings.map((b) => (
          <Card key={b.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{b.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{b.location}</p>
              <p className="mt-1">{b.totalUnits} units · {b.occupancy}% occupied</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Units</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={units}
            searchPlaceholder="Search unit ID or label…"
            searchKeys={["id", "label", "buildingName"]}
            defaultSort={fullTableSort("label")}
            defaultPageSize={15}
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
              { key: "label", header: "Label", sortable: true, cell: (row) => row.label },
              { key: "buildingName", header: "Building", sortable: true, filterKey: "buildingId", filterValue: (row) => row.buildingName, cell: (row) => row.buildingName },
              {
                key: "history",
                header: "Records",
                sortValue: (row) => row.ownershipHistory.length + row.tenancyHistory.length,
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
                onClick: (row) => router.push(`/portfolio/units/${row.id}?tab=timeline`),
              },
            ]}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
