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
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";
import { payoutsService } from "@/lib/api/services/payouts";
import { personsService } from "@/lib/api/services/persons";
import { useEntity } from "@/lib/entity-context";
import { getModuleEntity } from "@/lib/modules/entity-scope";
import { ComboboxField } from "@/components/shared/ComboboxField";

export function PayoutsView() {
  const { entityId } = useEntity();
  const propertyEntityId = getModuleEntity("property");
  const [payouts, setPayouts] = useState<Awaited<ReturnType<typeof payoutsService.list>>>([]);
  const [owners, setOwners] = useState<Awaited<ReturnType<typeof personsService.list>>>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [ownerId, setOwnerId] = useState("");
  const [amount, setAmount] = useState("");
  const [iban, setIban] = useState("BH12NBOB00000000000001");
  const [reference, setReference] = useState("");

  const load = useCallback(() => {
    payoutsService.list(entityId).then(setPayouts);
    personsService.list("owner").then(setOwners);
  }, [entityId]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    const owner = owners.find((o) => o.id === ownerId);
    await payoutsService.create({
      ownerId,
      amount: Number(amount),
      iban,
      reference: reference || `STL-${new Date().toISOString().slice(0, 7)}`,
      entityId: propertyEntityId,
      unitIds: owner?.ownedUnitIds ?? [],
    });
    setCreateOpen(false);
    setOwnerId("");
    setAmount("");
    setReference("");
    load();
  }

  return (
    <PageShell
      title="Owner payouts"
      description="Payout batches with virtual IBAN matching (mock)."
      actions={<Button size="sm" onClick={() => setCreateOpen(true)}>Generate payout</Button>}
    >
<Card>
        <CardHeader><CardTitle>Payout history</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={payouts}
            searchKeys={["id", "ownerName", "iban"]}
            defaultSort={fullTableSort("processedDate", "desc")}
            columns={[
              { key: "id", header: "Batch", sortable: true, cell: (r) => <span className="font-mono">{r.id}</span> },
              { key: "ownerName", header: "Owner", sortable: true, cell: (r) => r.ownerName },
              { key: "amount", header: "Amount", sortable: true, cell: (r) => <CurrencyDisplay amount={r.amount} />, className: "text-right" },
              { key: "processedDate", header: "Date", sortable: true, cell: (r) => r.processedDate },
              { key: "iban", header: "IBAN", sortable: true, cell: (r) => <span className="font-mono text-xs">{r.iban}</span> },
              { key: "status", header: "Status", sortable: true, filterKey: "status", filterValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
            ]}
          />
        </CardContent>
      </Card>

      <FormSheet open={createOpen} onOpenChange={setCreateOpen} title="Generate payout batch" description="Process owner settlement payout." onSubmit={handleCreate} submitLabel="Process payout">
        <FormField span="full">
          <Label>Owner</Label>
          <ComboboxField
            value={ownerId}
            onValueChange={setOwnerId}
            placeholder="Select owner"
            options={owners.map((o) => ({ value: o.id, label: o.name }))}
          />
        </FormField>
        <FormGrid>
          <FormField>
            <Label>Amount (BHD)</Label>
            <Input type="number" step="0.001" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </FormField>
          <FormField>
            <Label>Reference</Label>
            <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="STL-2026-06" />
          </FormField>
          <FormField span="full">
            <Label>IBAN</Label>
            <Input value={iban} onChange={(e) => setIban(e.target.value)} className="font-mono text-sm" />
          </FormField>
        </FormGrid>
      </FormSheet>
    </PageShell>
  );
}
