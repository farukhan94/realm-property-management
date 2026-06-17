"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { dashboardService } from "@/lib/api/services/dashboard";
import { ROLE_PERSON_MAP } from "@/types/role";
import { DashboardWidget } from "./DashboardWidget";
import { FULL_TABLE } from "@/lib/data-table/full-table";

export function FlatOwnerDashboard() {
  const ownerId = ROLE_PERSON_MAP["Flat Owner"]!;
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboardService.getFlatOwnerDashboard>> | null>(null);

  useEffect(() => {
    dashboardService.getFlatOwnerDashboard(ownerId).then(setData);
  }, [ownerId]);

  if (!data) return <PageShell title="Flat Owner" description="Loading…"><p className="text-muted-foreground">Loading…</p></PageShell>;

  return (
    <PageShell
      title="Flat Owner Dashboard"
      description="Units you own across buildings"
      actions={<Button variant="outline" size="sm" render={<Link href="/portal/owner" />}>My Portal</Button>}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardWidget title="Owned Units" icon={Home}>
          <div className="text-2xl font-bold">{data.units.length}</div>
        </DashboardWidget>
        <DashboardWidget title="Monthly Income" icon={TrendingUp}>
          <div className="text-2xl font-bold"><CurrencyDisplay amount={data.monthlyIncome} /></div>
        </DashboardWidget>
        <DashboardWidget title="Payouts" icon={TrendingUp}>
          <div className="text-2xl font-bold">{data.payouts.length}</div>
        </DashboardWidget>
      </div>
      <div className="mt-4">
        <DataTable
          {...FULL_TABLE}
          data={data.units}
          searchKeys={["label", "buildingId"]}
          columns={[
            { key: "label", header: "Unit", sortable: true, cell: (r) => r.label },
            { key: "buildingId", header: "Building", sortable: true, cell: (r) => r.buildingId },
            { key: "tenancy", header: "Status", cell: (r) => (r.tenancyHistory.some((t) => !t.endDate) ? "Occupied" : "Vacant") },
          ]}
        />
      </div>
    </PageShell>
  );
}
