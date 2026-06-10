"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { FormField, FormGrid } from "@/components/shared/FormGrid";
import { FormSheet } from "@/components/shared/FormSheet";
import { hoaService } from "@/lib/api/services/hoa";
import { COMPANY_ID } from "@/lib/mock/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function ProcurementView() {
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof hoaService.getProcurement>>>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"draft" | "approved" | "paid">("draft");

  const load = useCallback(() => {
    hoaService.getProcurement().then(setOrders);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    await hoaService.createProcurement({
      hoaId: COMPANY_ID,
      vendor,
      description,
      amount: Number(amount),
      status,
      orderDate: new Date().toISOString().slice(0, 10),
    });
    setCreateOpen(false);
    setVendor("");
    setDescription("");
    setAmount("");
    load();
  }

  async function approvePo(id: string) {
    await hoaService.updateProcurementStatus(id, "approved");
    load();
  }

  async function markPaid(id: string) {
    await hoaService.updateProcurementStatus(id, "paid");
    load();
  }

  return (
    <PageShell
      title="Procurement"
      description="Purchase orders for HOA services and contracts."
      actions={<Button size="sm" onClick={() => setCreateOpen(true)}>Create PO</Button>}
    >
<Card>
        <CardHeader><CardTitle>Purchase orders</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={orders}
            searchPlaceholder="Search vendor or description…"
            searchKeys={["id", "vendor", "description"]}
            defaultSort={fullTableSort("orderDate", "desc")}
            columns={[
              { key: "id", header: "PO", sortable: true, cell: (r) => <span className="font-mono">{r.id}</span> },
              { key: "vendor", header: "Vendor", sortable: true, cell: (r) => r.vendor },
              { key: "description", header: "Description", sortable: true, cell: (r) => r.description },
              {
                key: "amount",
                header: "Amount",
                sortable: true,
                className: "text-right",
                cell: (r) => <CurrencyDisplay amount={r.amount} />,
              },
              { key: "status", header: "Status", sortable: true, filterKey: "status", filterValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
              { key: "orderDate", header: "Order date", sortable: true, cell: (r) => r.orderDate },
            ]}
            actions={[
              {
                label: "Approve",
                hidden: (r) => r.status !== "draft",
                onClick: (r) => approvePo(r.id),
              },
              {
                label: "Mark paid",
                hidden: (r) => r.status !== "approved",
                onClick: (r) => markPaid(r.id),
              },
            ]}
          />
        </CardContent>
      </Card>

      <FormSheet open={createOpen} onOpenChange={setCreateOpen} title="Create purchase order" onSubmit={handleCreate} submitLabel="Create PO">
        <FormGrid>
          <FormField>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => v && setStatus(v as typeof status)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField>
            <Label>Vendor</Label>
            <Input value={vendor} onChange={(e) => setVendor(e.target.value)} />
          </FormField>
          <FormField>
            <Label>Amount (BHD)</Label>
            <Input type="number" step="0.001" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </FormField>
          <FormField span="full">
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormField>
        </FormGrid>
      </FormSheet>
    </PageShell>
  );
}
