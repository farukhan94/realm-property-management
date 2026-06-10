"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";
import { ContractPreviewDialog } from "./ContractPreviewDialog";
import { leasesService } from "@/lib/api/services/leases";
import { depositsService } from "@/lib/api/services/deposits";
import { invoicesService } from "@/lib/api/services/invoices";
import type { DepositRecord } from "@/types/deposit";

export function LeaseDetailView({ leaseId }: { leaseId: string }) {
  const router = useRouter();
  const [lease, setLease] = useState<Awaited<ReturnType<typeof leasesService.get>>>(null);
  const [deposit, setDeposit] = useState<DepositRecord | null>(null);
  const [invoices, setInvoices] = useState<Awaited<ReturnType<typeof invoicesService.list>>>([]);
  const [contractOpen, setContractOpen] = useState(false);
  const [contractText, setContractText] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [renewEnd, setRenewEnd] = useState("");
  const [renewRent, setRenewRent] = useState("");
  const [editRent, setEditRent] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editDeposit, setEditDeposit] = useState("");
  const [editEwa, setEditEwa] = useState("");

  const load = useCallback(() => {
    leasesService.get(leaseId).then(setLease);
    depositsService.getByLease(leaseId).then(setDeposit);
    invoicesService.list().then((all) => setInvoices(all.filter((i) => i.leaseId === leaseId)));
  }, [leaseId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (lease) {
      setEditRent(String(lease.monthlyRent));
      setEditEnd(lease.endDate);
      setEditDeposit(String(lease.deposit));
      setEditEwa(lease.ewaAccount ?? "");
    }
  }, [lease]);

  async function handleRenew() {
    const updated = await leasesService.renew(leaseId, renewEnd, Number(renewRent));
    if (updated) router.push(`/property/leases/${updated.id}`);
  }

  async function handleTerminate() {
    await leasesService.terminate(leaseId);
    setTerminateOpen(false);
    load();
  }

  async function handleEdit() {
    await leasesService.update(leaseId, {
      monthlyRent: Number(editRent),
      endDate: editEnd,
      deposit: Number(editDeposit),
      ewaAccount: editEwa || undefined,
    });
    setEditOpen(false);
    load();
  }

  async function showContract() {
    const text = await leasesService.generateContract(leaseId);
    setContractText(text);
    setContractOpen(true);
  }

  if (!lease) {
    return (
      <PageShell title="Lease" description="Loading...">
        <p className="text-muted-foreground">Loading lease...</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={`Lease ${lease.id}`}
      description={`${lease.unitLabel} — ${lease.tenantName}`}
      actions={
        <Button variant="outline" size="sm" render={<Link href="/property/leases" />}>
          Back to leases
        </Button>
      }
    >
<div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Lease details
              <StatusBadge status={lease.status} />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm md:grid-cols-2">
            <div><span className="text-muted-foreground">Unit</span><p className="font-medium">{lease.unitLabel}</p></div>
            <div><span className="text-muted-foreground">Tenant</span><p className="font-medium">{lease.tenantName}</p></div>
            <div><span className="text-muted-foreground">Period</span><p>{lease.startDate} → {lease.endDate}</p></div>
            <div><span className="text-muted-foreground">Monthly rent</span><p><CurrencyDisplay amount={lease.monthlyRent} /></p></div>
            <div><span className="text-muted-foreground">Deposit</span><p><CurrencyDisplay amount={lease.deposit} /></p></div>
            <div><span className="text-muted-foreground">EWA account</span><p className="font-mono">{lease.ewaAccount ?? "—"}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Deposit status</CardTitle></CardHeader>
          <CardContent>
            {deposit ? (
              <div className="space-y-2 text-sm">
                <p><CurrencyDisplay amount={deposit.amount} /></p>
                <StatusBadge status={deposit.status} />
              </div>
            ) : (
              <p className="text-muted-foreground">No deposit record</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={showContract}>View contract</Button>
        {lease.status === "active" && (
          <>
            <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>Edit lease</Button>
            <Button size="sm" variant="destructive" onClick={() => setTerminateOpen(true)}>Terminate</Button>
          </>
        )}
      </div>

      {lease.status === "active" && (
        <Card>
          <CardHeader><CardTitle>Renew lease</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <Label>New end date</Label>
              <Input type="date" value={renewEnd} onChange={(e) => setRenewEnd(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>New rent (BHD)</Label>
              <Input type="number" step="0.001" value={renewRent} onChange={(e) => setRenewRent(e.target.value)} />
            </div>
            <Button onClick={handleRenew} disabled={!renewEnd || !renewRent}>Renew</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Linked invoices</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={invoices}
            searchKeys={["id"]}
            defaultSort={fullTableSort("dueDate")}
            columns={[
              { key: "id", header: "Invoice", sortable: true, cell: (r) => <span className="font-mono">{r.id}</span> },
              { key: "dueDate", header: "Due", sortable: true, cell: (r) => r.dueDate },
              { key: "totalAmount", header: "Total", sortable: true, cell: (r) => <CurrencyDisplay amount={r.totalAmount} />, className: "text-right" },
              { key: "status", header: "Status", sortable: true, filterKey: "status", filterValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
            ]}
          />
        </CardContent>
      </Card>

      <FormSheet open={editOpen} onOpenChange={setEditOpen} title="Edit lease" description="Update lease terms." onSubmit={handleEdit} submitLabel="Save changes">
        <FormGrid>
          <FormField>
            <Label>Monthly rent (BHD)</Label>
            <Input type="number" step="0.001" value={editRent} onChange={(e) => setEditRent(e.target.value)} />
          </FormField>
          <FormField>
            <Label>End date</Label>
            <Input type="date" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} />
          </FormField>
          <FormField>
            <Label>Deposit (BHD)</Label>
            <Input type="number" step="0.001" value={editDeposit} onChange={(e) => setEditDeposit(e.target.value)} />
          </FormField>
          <FormField>
            <Label>EWA account</Label>
            <Input value={editEwa} onChange={(e) => setEditEwa(e.target.value)} placeholder="EWA-1234567" />
          </FormField>
        </FormGrid>
      </FormSheet>

      <ConfirmDialog
        open={terminateOpen}
        onOpenChange={setTerminateOpen}
        title="Terminate lease"
        description={`End the lease for ${lease.unitLabel}? This will close the tenancy record.`}
        confirmLabel="Terminate"
        variant="destructive"
        onConfirm={handleTerminate}
      />

      <ContractPreviewDialog open={contractOpen} onOpenChange={setContractOpen} contractText={contractText} />
    </PageShell>
  );
}
