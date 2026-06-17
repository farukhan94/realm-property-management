"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Wrench } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { dashboardService } from "@/lib/api/services/dashboard";
import { ROLE_PERSON_MAP } from "@/types/role";
import { DashboardWidget } from "./DashboardWidget";
import { FULL_TABLE } from "@/lib/data-table/full-table";

export function SupplierDashboard() {
  const supplierId = ROLE_PERSON_MAP["Providers / Suppliers"]!;
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboardService.getSupplierDashboard>> | null>(null);

  useEffect(() => {
    dashboardService.getSupplierDashboard(supplierId).then(setData);
  }, [supplierId]);

  if (!data?.supplier) return <PageShell title="Supplier" description="Loading…"><p className="text-muted-foreground">Loading…</p></PageShell>;

  return (
    <PageShell
      title={data.supplier.name}
      description={`${data.supplier.category} — assigned work orders and billing`}
      actions={<Button variant="outline" size="sm" render={<Link href="/portal/supplier" />}>Supplier Portal</Button>}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardWidget title="Active Contracts" icon={FileText}>
          <div className="text-2xl font-bold">{data.supplier.activeContracts}</div>
        </DashboardWidget>
        <DashboardWidget title="Pending Invoices" icon={FileText}>
          <div className="text-2xl font-bold">{data.supplier.pendingInvoices}</div>
        </DashboardWidget>
        <DashboardWidget title="Assigned Jobs" icon={Wrench}>
          <div className="text-2xl font-bold">{data.jobs.length}</div>
        </DashboardWidget>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DataTable
          {...FULL_TABLE}
          data={data.jobs}
          searchKeys={["title"]}
          columns={[
            { key: "title", header: "Job", sortable: true, cell: (r) => r.title },
            { key: "status", header: "Status", sortable: true, cell: (r) => <Badge variant="outline">{r.status}</Badge> },
            { key: "unitId", header: "Unit", cell: (r) => r.unitId ?? "—" },
          ]}
        />
        <DataTable
          {...FULL_TABLE}
          data={data.bills}
          searchKeys={["description"]}
          columns={[
            { key: "description", header: "Bill", sortable: true, cell: (r) => r.description },
            { key: "amount", header: "Amount", sortable: true, cell: (r) => <CurrencyDisplay amount={r.amount} />, className: "text-right" },
            { key: "status", header: "Status", cell: (r) => <Badge variant={r.status === "overdue" ? "destructive" : "secondary"}>{r.status}</Badge> },
          ]}
        />
      </div>
    </PageShell>
  );
}
