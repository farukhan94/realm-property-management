"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { hoaService } from "@/lib/api/services/hoa";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function OwnerServiceChargeStatementView() {
  const [invoices, setInvoices] = useState<Awaited<ReturnType<typeof hoaService.getServiceChargeInvoices>>>([]);

  useEffect(() => {
    hoaService.getServiceChargeInvoices().then(setInvoices);
  }, []);

  const byOwner = invoices.reduce<Record<string, typeof invoices>>((acc, inv) => {
    const key = inv.ownerId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(inv);
    return acc;
  }, {});

  const rows = Object.entries(byOwner).map(([ownerId, invs]) => ({
    id: ownerId,
    ownerId,
    count: invs.length,
    total: invs.reduce((s, i) => s + i.amount, 0),
    paid: invs.filter((i) => i.status === "paid").length,
  }));

  return (
    <PageShell title="Owner statements" description="Consolidated service charge statements per owner.">
<Card>
        <CardHeader><CardTitle>Owner summary</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={rows}
            searchKeys={["ownerId"]}
            defaultSort={fullTableSort("ownerId")}
            columns={[
              { key: "ownerId", header: "Owner", sortable: true, cell: (r) => r.ownerId },
              { key: "count", header: "Invoices", sortable: true, cell: (r) => r.count, className: "text-right" },
              { key: "paid", header: "Paid", sortable: true, cell: (r) => r.paid, className: "text-right" },
              { key: "total", header: "Total due", sortable: true, cell: (r) => <CurrencyDisplay amount={r.total} />, className: "text-right" },
            ]}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
