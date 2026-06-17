"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { portalsService } from "@/lib/api/services/portals";
import { FULL_TABLE } from "@/lib/data-table/full-table";

export function SupplierPortalView() {
  const [data, setData] = useState<Awaited<ReturnType<typeof portalsService.getForRole>>>(null);
  const [invoiceForm, setInvoiceForm] = useState({ description: "", amount: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    portalsService.getForRole("Providers / Suppliers").then(setData);
  }, []);

  if (!data || !("supplier" in data) || !data.supplier) {
    return <PageShell title="Supplier Portal" description="Loading…"><p className="text-muted-foreground">Loading…</p></PageShell>;
  }

  return (
    <PageShell
      title={data.supplier.name}
      description="Work orders, contracts, and invoice submission"
      actions={<Button variant="outline" size="sm" render={<Link href="/" />}>Dashboard</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Assigned Work Orders</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              {...FULL_TABLE}
              data={data.jobs}
              searchKeys={["title"]}
              columns={[
                { key: "title", header: "Job", sortable: true, cell: (r) => r.title },
                { key: "status", header: "Status", cell: (r) => <Badge variant="outline">{r.status}</Badge> },
                { key: "unitId", header: "Unit", cell: (r) => r.unitId ?? "—" },
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Submit Invoice</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {submitted ? (
              <p className="text-sm text-primary">Invoice submitted for review.</p>
            ) : (
              <>
                <Input placeholder="Description" value={invoiceForm.description} onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })} />
                <Input placeholder="Amount (BHD)" type="number" value={invoiceForm.amount} onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })} />
                <Button onClick={() => setSubmitted(true)}>Submit Invoice</Button>
              </>
            )}
            <div className="mt-4 border-t border-border pt-4">
              <h4 className="mb-2 text-sm font-semibold">Pending Bills</h4>
              {data.bills.map((b) => (
                <div key={b.id} className="flex justify-between py-1 text-sm">
                  <span>{b.description}</span>
                  <CurrencyDisplay amount={b.amount} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
