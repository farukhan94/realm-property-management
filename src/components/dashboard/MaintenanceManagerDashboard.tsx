"use client";

import { useEffect, useState } from "react";
import { Calendar, Package, Users, Wrench } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { dashboardService } from "@/lib/api/services/dashboard";
import { ROLE_PERSON_MAP } from "@/types/role";
import { DashboardWidget } from "./DashboardWidget";
import { FULL_TABLE } from "@/lib/data-table/full-table";

export function MaintenanceManagerDashboard() {
  const managerId = ROLE_PERSON_MAP["Maintenance Manager"]!;
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboardService.getMaintenanceManagerDashboard>> | null>(null);

  useEffect(() => {
    dashboardService.getMaintenanceManagerDashboard(managerId).then(setData);
  }, [managerId]);

  if (!data) return <PageShell title="Maintenance Manager" description="Loading…"><p className="text-muted-foreground">Loading…</p></PageShell>;

  return (
    <PageShell title="Facility Operations" description={`${data.manager?.name} — buildings ${data.buildingIds.join(", ")}`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <DashboardWidget title="Work Orders" icon={Wrench}>
          <div className="text-2xl font-bold">{data.workOrders.length}</div>
        </DashboardWidget>
        <DashboardWidget title="Buildings" icon={Package}>
          <div className="text-2xl font-bold">{data.buildingIds.length}</div>
        </DashboardWidget>
        <DashboardWidget title="Guests On-Site" icon={Users}>
          <div className="text-2xl font-bold">{data.guestbookActive}</div>
        </DashboardWidget>
        <DashboardWidget title="PM Schedules" icon={Calendar}>
          <div className="text-2xl font-bold">12</div>
        </DashboardWidget>
      </div>
      <div className="mt-4">
        <DataTable
          {...FULL_TABLE}
          data={data.workOrders}
          searchKeys={["title", "unitId"]}
          columns={[
            { key: "title", header: "Work Order", sortable: true, cell: (r) => r.title },
            { key: "unitId", header: "Unit", sortable: true, cell: (r) => r.unitId ?? "—" },
            { key: "priority", header: "Priority", sortable: true, cell: (r) => <Badge variant={r.priority === "critical" ? "destructive" : "outline"}>{r.priority}</Badge> },
            { key: "status", header: "Status", sortable: true, cell: (r) => r.status },
          ]}
        />
      </div>
    </PageShell>
  );
}
