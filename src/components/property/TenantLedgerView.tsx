"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { FormField, FormGrid } from "@/components/shared/FormGrid";
import { FormSheet } from "@/components/shared/FormSheet";
import { InvoicePreviewDialog } from "./InvoicePreviewDialog";
import { invoicesService } from "@/lib/api/services/invoices";
import { leasesService } from "@/lib/api/services/leases";
import { useEntity } from "@/lib/entity-context";
import { getModuleEntity } from "@/lib/modules/entity-scope";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ComboboxField } from "@/components/shared/ComboboxField";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function TenantLedgerView() {
  const { entityId } = useEntity();
  const [invoices, setInvoices] = useState<Awaited<ReturnType<typeof invoicesService.list>>>([]);
  const [formLeases, setFormLeases] = useState<Awaited<ReturnType<typeof leasesService.list>>>([]);
  const propertyEntityId = getModuleEntity("property");
  const [arrears, setArrears] = useState<Awaited<ReturnType<typeof invoicesService.getArrearsSummary>> | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentInvoiceId, setPaymentInvoiceId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedLeaseId, setSelectedLeaseId] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDue, setInvoiceDue] = useState("");

  const load = useCallback(() => {
    invoicesService.list(entityId).then(setInvoices);
    invoicesService.getArrearsSummary().then(setArrears);
  }, [entityId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    leasesService.list(propertyEntityId).then(setFormLeases);
  }, [propertyEntityId]);

  const previewInvoice = invoices.find((i) => i.id === previewId) ?? null;
  const activeFormLeases = formLeases.filter((l) => l.status === "active");
  const selectedLease = formLeases.find((l) => l.id === selectedLeaseId);

  async function handleCreateInvoice() {
    if (!selectedLease) return;
    await invoicesService.create({
      unitId: selectedLease.unitId,
      tenantId: selectedLease.tenantId,
      leaseId: selectedLease.id,
      amount: Number(invoiceAmount),
      dueDate: invoiceDue,
      entityId: propertyEntityId,
    });
    setCreateOpen(false);
    setInvoiceAmount("");
    setInvoiceDue("");
    setSelectedLeaseId("");
    load();
  }

  async function handleRecordPayment() {
    await invoicesService.recordPayment(paymentInvoiceId, Number(paymentAmount));
    setPaymentOpen(false);
    setPaymentAmount("");
    setPaymentInvoiceId("");
    load();
  }

  function openPayment(invId: string, balance: number) {
    setPaymentInvoiceId(invId);
    setPaymentAmount(String(balance));
    setPaymentOpen(true);
  }

  return (
    <PageShell
      title="Tenant ledger"
      description="Invoices, receipts, arrears aging, and post-dated cheques."
      actions={
        <Button size="sm" onClick={() => setCreateOpen(true)}>Create invoice</Button>
      }
    >
{arrears && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total arrears</CardTitle></CardHeader>
            <CardContent><CurrencyDisplay amount={arrears.total} className="text-xl font-bold" /></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Overdue count</CardTitle></CardHeader>
            <CardContent><p className="text-xl font-bold">{arrears.count}</p></CardContent>
          </Card>
        </div>
      )}
      <Card>
        <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={invoices}
            searchKeys={["id", "tenantName", "unitLabel"]}
            defaultSort={fullTableSort("dueDate")}
            columns={[
              { key: "id", header: "Invoice", sortable: true, cell: (r) => <span className="font-mono text-primary">{r.id}</span> },
              { key: "tenantName", header: "Tenant", sortable: true, cell: (r) => r.tenantName },
              { key: "unitLabel", header: "Unit", sortable: true, cell: (r) => r.unitLabel },
              { key: "dueDate", header: "Due", sortable: true, cell: (r) => r.dueDate },
              { key: "totalAmount", header: "Total", sortable: true, cell: (r) => <CurrencyDisplay amount={r.totalAmount} />, className: "text-right" },
              { key: "chequeDate", header: "PDC", sortable: true, filterValue: (r) => r.chequeDate ?? "—", cell: (r) => r.chequeDate ?? "—" },
              { key: "status", header: "Status", sortable: true, filterKey: "status", filterValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
            ]}
            actions={[
              { label: "View VAT invoice", onClick: (r) => setPreviewId(r.id) },
              {
                label: "Record payment",
                hidden: (r) => r.status === "paid",
                onClick: (r) => openPayment(r.id, r.totalAmount - (r.paidAmount ?? 0)),
              },
            ]}
          />
        </CardContent>
      </Card>

      <FormSheet open={createOpen} onOpenChange={setCreateOpen} title="Create invoice" description="Manual rent invoice." onSubmit={handleCreateInvoice} submitLabel="Create">
        <FormField span="full">
          <Label>Lease</Label>
          <ComboboxField
            value={selectedLeaseId}
            onValueChange={setSelectedLeaseId}
            placeholder="Select lease"
            options={activeFormLeases.map((l) => ({
              value: l.id,
              label: `${l.unitLabel} — ${l.tenantName}`,
            }))}
          />
          {activeFormLeases.length === 0 && (
            <p className="text-xs text-muted-foreground">No active leases found for the management entity.</p>
          )}
        </FormField>
        <FormGrid>
          <FormField>
            <Label>Amount (BHD excl. VAT)</Label>
            <Input type="number" step="0.001" value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} />
          </FormField>
          <FormField>
            <Label>Due date</Label>
            <Input type="date" value={invoiceDue} onChange={(e) => setInvoiceDue(e.target.value)} />
          </FormField>
        </FormGrid>
      </FormSheet>

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Record payment</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label>Amount (BHD)</Label><Input type="number" step="0.001" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>Cancel</Button>
            <Button onClick={handleRecordPayment} disabled={!paymentAmount}>Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {previewInvoice && (
        <InvoicePreviewDialog open={!!previewId} onOpenChange={(o) => !o && setPreviewId(null)} invoice={previewInvoice} />
      )}
    </PageShell>
  );
}
