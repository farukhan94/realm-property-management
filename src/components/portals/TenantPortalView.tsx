"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { portalsService } from "@/lib/api/services/portals";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function TenantPortalView() {
  const [data, setData] = useState<Awaited<ReturnType<typeof portalsService.getForRole>>>(null);

  useEffect(() => {
    portalsService.getForRole("Tenant").then(setData);
  }, []);

  if (!data || !("leases" in data)) {
    return <PageShell title="Tenant portal" description="Loading..."><p className="text-muted-foreground">Loading...</p></PageShell>;
  }

  return (
    <PageShell
      title="Tenant portal"
      description="Your lease, invoices, and maintenance tickets."
      actions={<Button variant="outline" size="sm" render={<Link href="/" />}>Dashboard</Button>}
    >
      <Card>
        <CardHeader><CardTitle>Active lease</CardTitle></CardHeader>
        <CardContent>
          {data.leases.filter((l) => l.status === "active").map((l) => (
            <div key={l.id} className="text-sm space-y-1">
              <p>{l.unitLabel} — <CurrencyDisplay amount={l.monthlyRent} />/mo</p>
              <p className="text-muted-foreground">{l.startDate} → {l.endDate}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={data.invoices}
            searchKeys={["id"]}
            defaultSort={fullTableSort("dueDate")}
            columns={[
              { key: "id", header: "Invoice", sortable: true, cell: (r) => r.id },
              { key: "dueDate", header: "Due", sortable: true, cell: (r) => r.dueDate },
              { key: "totalAmount", header: "Total", sortable: true, cell: (r) => <CurrencyDisplay amount={r.totalAmount} />, className: "text-right" },
              { key: "status", header: "Status", sortable: true, filterKey: "status", filterValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
            ]}
            actions={[{ label: "View invoice", href: (r) => `/property/invoices?id=${r.id}` }]}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
