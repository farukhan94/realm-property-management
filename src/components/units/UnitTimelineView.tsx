"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimelineBar } from "./TimelineBar";
import { UnitStatusPanel } from "./UnitStatusPanel";
import { unitsService } from "@/lib/api/services/units";
import { getPersonName } from "@/lib/mock/seed";
import type { Unit } from "@/types/unit";
import { Button } from "@/components/ui/button";

interface UnitTimelineViewProps {
  unitId: string;
}

const RANGE_START = "2017-01-01";
const RANGE_END = "2026-12-31";

export function UnitTimelineView({ unitId }: UnitTimelineViewProps) {
  const [unit, setUnit] = useState<(Unit & { buildingName: string }) | null>(null);

  useEffect(() => {
    unitsService.getUnit(unitId).then(setUnit);
  }, [unitId]);

  if (!unit) {
    return (
      <PageShell title="Loading..." description="">
        <p className="text-muted-foreground">Loading unit...</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={unit.label}
      description={`${unit.buildingName} · ${unit.id}`}
      actions={
        <Button variant="outline" size="sm" render={<Link href="/portfolio" />}>
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ownership history</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {unit.ownershipHistory.map((r, i) => (
                <TimelineBar
                  key={i}
                  label={getPersonName(r.ownerId)}
                  startDate={r.startDate}
                  endDate={r.endDate}
                  rangeStart={RANGE_START}
                  rangeEnd={RANGE_END}
                  color="#3b82f6"
                  detail={`${r.startDate} → ${r.endDate ?? "present"}`}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tenancy history</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {unit.tenancyHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tenancy records.</p>
              ) : (
                unit.tenancyHistory.map((r, i) => (
                  <TimelineBar
                    key={i}
                    label={getPersonName(r.tenantId)}
                    startDate={r.startDate}
                    endDate={r.endDate}
                    rangeStart={RANGE_START}
                    rangeEnd={RANGE_END}
                    color="#10b981"
                    detail={r.leaseId ? `Lease ${r.leaseId}` : ""}
                  />
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Management periods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {unit.managementPeriods.map((r, i) => (
                <TimelineBar
                  key={i}
                  label={r.managed ? "Managed" : "Not managed"}
                  startDate={r.startDate}
                  endDate={r.endDate}
                  rangeStart={RANGE_START}
                  rangeEnd={RANGE_END}
                  color={r.managed ? "#6366f1" : "#94a3b8"}
                  detail={r.entityId}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <UnitStatusPanel unitId={unitId} />
      </div>
    </PageShell>
  );
}
