"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { FormField, FormGrid } from "@/components/shared/FormGrid";
import { FormSheet } from "@/components/shared/FormSheet";
import { PropertySubNav } from "./PropertySubNav";
import { chequesService, type ChequeWithNames } from "@/lib/api/services/cheques";
import { leasesService } from "@/lib/api/services/leases";
import { useEntity } from "@/lib/entity-context";
import { getModuleEntity } from "@/lib/modules/entity-scope";
import { getLocaleByEntityId } from "@/lib/locale/resolver";
import { formatCurrency } from "@/lib/locale/format";
import { ComboboxField } from "@/components/shared/ComboboxField";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function ChequesView() {
  const { entityId } = useEntity();
  const locale = getLocaleByEntityId(entityId);
  const propertyEntityId = getModuleEntity("property");

  const [cheques, setCheques] = useState<ChequeWithNames[]>([]);
  const [leases, setLeases] = useState<Awaited<ReturnType<typeof leasesService.list>>>([]);
  
  const [createOpen, setCreateOpen] = useState(false);
  const [bounceOpen, setBounceOpen] = useState(false);
  const [selectedCheque, setSelectedCheque] = useState<ChequeWithNames | null>(null);

  // Form states for creating a cheque
  const [chequeNumber, setChequeNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [leaseId, setLeaseId] = useState("");

  // Form states for bouncing a cheque
  const [bouncedReason, setBouncedReason] = useState("");

  const load = useCallback(() => {
    chequesService.list(entityId).then(setCheques);
    leasesService.list(propertyEntityId).then(setLeases);
  }, [entityId, propertyEntityId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate() {
    const lease = leases.find((l) => l.id === leaseId);
    if (!lease) return;

    await chequesService.create({
      chequeNumber,
      bankName,
      amount: Number(amount),
      dueDate,
      tenantId: lease.tenantId,
      leaseId: lease.id,
      unitId: lease.unitId,
      entityId: propertyEntityId,
    });

    setCreateOpen(false);
    setChequeNumber("");
    setBankName("");
    setAmount("");
    setDueDate("");
    setLeaseId("");
    load();
  }

  async function handleBounceSubmit() {
    if (!selectedCheque) return;
    await chequesService.updateStatus(selectedCheque.id, "bounced", {
      bouncedReason,
    });
    setBounceOpen(false);
    setBouncedReason("");
    setSelectedCheque(null);
    load();
  }

  async function handleUpdateStatus(id: string, status: ChequeWithNames["status"]) {
    await chequesService.updateStatus(id, status);
    load();
  }

  // Calculate KPIs
  const receivedCheques = cheques.filter((c) => c.status === "received");
  const depositedCheques = cheques.filter((c) => c.status === "deposited");
  const clearedCheques = cheques.filter((c) => c.status === "cleared");
  const bouncedCheques = cheques.filter((c) => c.status === "bounced");

  const totalPendingAmount = [...receivedCheques, ...depositedCheques].reduce((sum, c) => sum + c.amount, 0);
  const totalClearedAmount = clearedCheques.reduce((sum, c) => sum + c.amount, 0);
  const totalBouncedAmount = bouncedCheques.reduce((sum, c) => sum + c.amount, 0);

  return (
    <PageShell
      title="Post-Dated Cheque (PDC) Registry"
      description="Manage physical rental cheques, bank deposits, and clearance lifecycles."
      actions={
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Record Cheque
        </Button>
      }
    >
      <PropertySubNav />

      {/* KPI Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Clearance (PDC)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              <CurrencyDisplay amount={totalPendingAmount} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {receivedCheques.length} received, {depositedCheques.length} deposited
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cleared
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-revenue">
              <CurrencyDisplay amount={totalClearedAmount} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {clearedCheques.length} cleared cheques successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bounced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              <CurrencyDisplay amount={totalBouncedAmount} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {bouncedCheques.length} bounced cheques requiring action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cheques DataTable */}
      <Card>
        <CardHeader>
          <CardTitle>Cheque Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={cheques}
            searchKeys={["chequeNumber", "bankName", "tenantName", "unitLabel"]}
            defaultSort={fullTableSort("dueDate", "asc")}
            columns={[
              {
                key: "chequeNumber",
                header: "Cheque No.",
                sortable: true,
                cell: (r) => <span className="font-mono font-medium">{r.chequeNumber}</span>,
              },
              {
                key: "unitLabel",
                header: "Unit",
                sortable: true,
                cell: (r) => r.unitLabel,
              },
              {
                key: "tenantName",
                header: "Tenant",
                sortable: true,
                cell: (r) => r.tenantName,
              },
              {
                key: "bankName",
                header: "Bank",
                sortable: true,
                cell: (r) => r.bankName,
              },
              {
                key: "amount",
                header: "Amount",
                sortable: true,
                cell: (r) => <CurrencyDisplay amount={r.amount} />,
                className: "text-right",
              },
              {
                key: "dueDate",
                header: "Cheque Date",
                sortable: true,
                cell: (r) => r.dueDate,
              },
              {
                key: "status",
                header: "Status",
                sortable: true,
                filterKey: "status",
                filterValue: (r) => r.status,
                cell: (r) => {
                  const variants: Record<typeof r.status, "default" | "secondary" | "destructive" | "outline"> = {
                    received: "outline",
                    deposited: "secondary",
                    cleared: "default",
                    bounced: "destructive",
                    returned: "outline",
                  };
                  return (
                    <Badge variant={variants[r.status]}>
                      {r.status.toUpperCase()}
                    </Badge>
                  );
                },
              },
            ]}
            actions={[
              {
                label: "Deposit to Bank",
                onClick: (r) => handleUpdateStatus(r.id, "deposited"),
                disabled: (r) => r.status !== "received",
              },
              {
                label: "Mark as Cleared",
                onClick: (r) => handleUpdateStatus(r.id, "cleared"),
                disabled: (r) => r.status !== "deposited",
              },
              {
                label: "Mark as Bounced",
                onClick: (r) => {
                  setSelectedCheque(r);
                  setBounceOpen(true);
                },
                disabled: (r) => r.status !== "deposited" && r.status !== "received",
              },
              {
                label: "Return to Tenant",
                onClick: (r) => handleUpdateStatus(r.id, "returned"),
                disabled: (r) => r.status !== "received" && r.status !== "bounced",
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Form Sheet: Record Cheque */}
      <FormSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Record Post-Dated Cheque"
        description="Record a physical cheque received from a tenant."
        onSubmit={handleCreate}
        submitLabel="Record Cheque"
      >
        <FormField span="full">
          <Label>Lease / Tenant</Label>
          <ComboboxField
            value={leaseId}
            onValueChange={setLeaseId}
            placeholder="Select lease"
            options={leases.map((l) => ({
              value: l.id,
              label: `${l.unitLabel} — ${l.tenantName} (${formatCurrency(l.monthlyRent, { entityId: l.entityId })}/mo)`,
            }))}
          />
        </FormField>
        <FormGrid>
          <FormField>
            <Label>Cheque Number</Label>
            <Input
              placeholder="e.g. 000123"
              value={chequeNumber}
              onChange={(e) => setChequeNumber(e.target.value)}
            />
          </FormField>
          <FormField>
            <Label>Bank Name</Label>
            <Input
              placeholder="e.g. Emirates NBD"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </FormField>
          <FormField>
            <Label>Amount ({locale.currency})</Label>
            <Input
              type="number"
              step={locale.currencyDecimals === 3 ? "0.001" : "0.01"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormField>
          <FormField>
            <Label>Cheque Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </FormField>
        </FormGrid>
      </FormSheet>

      {/* Form Sheet: Bounce Reason */}
      <FormSheet
        open={bounceOpen}
        onOpenChange={setBounceOpen}
        title="Record Bounced Cheque"
        description={`Record details for bounced cheque #${selectedCheque?.chequeNumber}.`}
        onSubmit={handleBounceSubmit}
        submitLabel="Mark Bounced"
      >
        <FormField span="full">
          <Label>Reason for Bouncing</Label>
          <Input
            placeholder="e.g. Insufficient Funds, Signature Mismatch"
            value={bouncedReason}
            onChange={(e) => setBouncedReason(e.target.value)}
          />
        </FormField>
      </FormSheet>
    </PageShell>
  );
}
