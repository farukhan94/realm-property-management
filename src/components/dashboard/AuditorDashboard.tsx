"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { DataTable } from "@/components/shared/DataTable";
import { dashboardService } from "@/lib/api/services/dashboard";
import { DashboardWidget } from "./DashboardWidget";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function AuditorDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboardService.getAuditorDashboard>> | null>(null);

  useEffect(() => {
    dashboardService.getAuditorDashboard().then(setData);
  }, []);

  if (!data) return <PageShell title="Auditor" description="Loading…"><p className="text-muted-foreground">Loading…</p></PageShell>;

  return (
    <PageShell title="Audit & Compliance" description="Read-only audit trail and compliance KPIs">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DashboardWidget title="Total Audit Entries" icon={Shield}>
          <div className="text-2xl font-bold">{data.totalEntries}</div>
        </DashboardWidget>
        <DashboardWidget title="Financial Actions" icon={Shield}>
          <div className="text-2xl font-bold">{data.financialActions}</div>
        </DashboardWidget>
      </div>
      <div className="mt-4">
        <DataTable
          {...FULL_TABLE}
          data={data.recentLog}
          searchKeys={["action", "actor", "details"]}
          defaultSort={fullTableSort("timestamp", "desc")}
          columns={[
            { key: "timestamp", header: "Time", sortable: true, cell: (r) => new Date(r.timestamp).toLocaleString() },
            { key: "actor", header: "Actor", sortable: true, cell: (r) => r.actor },
            { key: "action", header: "Action", sortable: true, cell: (r) => r.action },
            { key: "details", header: "Details", cell: (r) => r.details },
            { key: "amount", header: "Amount", cell: (r) => r.amount ? <CurrencyDisplay amount={r.amount} /> : "—", className: "text-right" },
          ]}
        />
      </div>
    </PageShell>
  );
}
