"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { portalsService } from "@/lib/api/services/portals";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function OwnerPortalView() {
  const [data, setData] = useState<Awaited<ReturnType<typeof portalsService.getForRole>>>(null);

  useEffect(() => {
    portalsService.getForRole("Owner").then(setData);
  }, []);

  if (!data || !("units" in data)) {
    return <PageShell title="Owner portal" description="Loading..."><p className="text-muted-foreground">Loading...</p></PageShell>;
  }

  return (
    <PageShell
      title="Owner portal"
      description="Your units, settlements, payouts, and documents."
      actions={<Button variant="outline" size="sm" render={<Link href="/" />}>Dashboard</Button>}
    >
      <Card>
        <CardHeader><CardTitle>Owned units ({data.units.length})</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-inside list-disc text-sm">
            {data.units.map((u) => (
              <li key={u.id}>{u.label} — {u.buildingId}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Settlements</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={data.settlements}
            searchKeys={["unitLabel"]}
            defaultSort={fullTableSort("unitLabel")}
            columns={[
              { key: "unitLabel", header: "Unit", sortable: true, cell: (r) => r.unitLabel },
              { key: "netPayable", header: "Net payable", sortable: true, cell: (r) => <CurrencyDisplay amount={r.netPayable} />, className: "text-right" },
            ]}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Payouts</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={data.payouts}
            searchKeys={["id"]}
            defaultSort={fullTableSort("processedDate", "desc")}
            columns={[
              { key: "id", header: "Batch", sortable: true, cell: (r) => r.id },
              { key: "amount", header: "Amount", sortable: true, cell: (r) => <CurrencyDisplay amount={r.amount} />, className: "text-right" },
              { key: "processedDate", header: "Date", sortable: true, cell: (r) => r.processedDate },
            ]}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
