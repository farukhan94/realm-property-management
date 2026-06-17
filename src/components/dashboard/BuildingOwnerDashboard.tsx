"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building, TrendingUp, Wrench } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "@/lib/api/services/dashboard";
import { ROLE_PERSON_MAP } from "@/types/role";
import { DashboardWidget, MetricRow } from "./DashboardWidget";

export function BuildingOwnerDashboard() {
  const ownerId = ROLE_PERSON_MAP["Building Owner"]!;
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboardService.getBuildingOwnerDashboard>> | null>(null);

  useEffect(() => {
    dashboardService.getBuildingOwnerDashboard(ownerId).then(setData);
  }, [ownerId]);

  if (!data) return <PageShell title="Building Owner" description="Loading…"><p className="text-muted-foreground">Loading…</p></PageShell>;

  const occupancy = data.totalUnits > 0 ? Math.round((data.occupied / data.totalUnits) * 100) : 0;

  return (
    <PageShell
      title="Building Owner Dashboard"
      description="Portfolio overview for your buildings"
      actions={<Button variant="outline" size="sm" render={<Link href="/portal/owner" />}>My Portal</Button>}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardWidget title="Buildings" icon={Building}>
          <div className="text-2xl font-bold">{data.buildings.length}</div>
          <p className="text-xs text-muted-foreground">{data.buildings.map((b) => b.name).join(", ")}</p>
        </DashboardWidget>
        <DashboardWidget title="Occupancy" icon={TrendingUp}>
          <div className="text-2xl font-bold">{occupancy}%</div>
          <MetricRow label="Occupied" value={`${data.occupied} / ${data.totalUnits}`} />
        </DashboardWidget>
        <DashboardWidget title="Monthly Income" icon={TrendingUp}>
          <div className="text-2xl font-bold"><CurrencyDisplay amount={data.monthlyIncome} /></div>
        </DashboardWidget>
        <DashboardWidget title="Open Maintenance" icon={Wrench}>
          <div className="text-2xl font-bold">{data.maintenance}</div>
        </DashboardWidget>
      </div>
      <Card className="mt-4">
        <CardHeader><CardTitle>Recent Settlements</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {data.settlements.slice(0, 5).map((s) => (
              <li key={s.unitId} className="flex justify-between border-b border-border pb-2">
                <span>{s.unitLabel}</span>
                <CurrencyDisplay amount={s.netPayable} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </PageShell>
  );
}
