"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComboboxField } from "@/components/shared/ComboboxField";
import { AiActionButton } from "@/components/shared/AiActionButton";
import { FormField, FormGrid } from "@/components/shared/FormGrid";
import { FormSheet } from "@/components/shared/FormSheet";
import { ContractPreviewDialog } from "./ContractPreviewDialog";
import { leasesService } from "@/lib/api/services/leases";
import { personsService } from "@/lib/api/services/persons";
import { unitsService } from "@/lib/api/services/units";
import { getModuleEntity } from "@/lib/modules/entity-scope";
import type { Person } from "@/types/person";

interface LeaseCreateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (leaseId: string) => void;
}

export function LeaseCreateSheet({ open, onOpenChange, onSuccess }: LeaseCreateSheetProps) {
  const propertyEntityId = getModuleEntity("property");
  const [tenants, setTenants] = useState<Person[]>([]);
  const [units, setUnits] = useState<{ id: string; label: string }[]>([]);
  const [unitId, setUnitId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2027-06-30");
  const [monthlyRent, setMonthlyRent] = useState("420");
  const [deposit, setDeposit] = useState("840");
  const [createdLeaseId, setCreatedLeaseId] = useState<string | null>(null);
  const [contractOpen, setContractOpen] = useState(false);
  const [contractText, setContractText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    personsService.list("tenant").then(setTenants);
    unitsService.listUnits(undefined, propertyEntityId).then((u) =>
      setUnits(u.map((x) => ({ id: x.id, label: x.label })))
    );
  }, [open, propertyEntityId]);

  function resetForm() {
    setUnitId("");
    setTenantId("");
    setStartDate("2026-07-01");
    setEndDate("2027-06-30");
    setMonthlyRent("420");
    setDeposit("840");
    setCreatedLeaseId(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    onOpenChange(next);
  }

  async function handleCreate() {
    if (!unitId || !tenantId || createdLeaseId) return;
    setLoading(true);
    try {
      const lease = await leasesService.create({
        unitId,
        tenantId,
        startDate,
        endDate,
        monthlyRent: Number(monthlyRent),
        deposit: Number(deposit),
        entityId: propertyEntityId,
      });
      setCreatedLeaseId(lease.id);
      onSuccess(lease.id);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateContract() {
    if (!createdLeaseId) return;
    const text = await leasesService.generateContract(createdLeaseId);
    setContractText(text);
    setContractOpen(true);
  }

  function handleDone() {
    handleOpenChange(false);
  }

  return (
    <>
      <FormSheet
        open={open}
        onOpenChange={handleOpenChange}
        title="New lease"
        description="Create a lease and generate contract draft."
        onSubmit={createdLeaseId ? undefined : handleCreate}
        submitLabel="Create lease"
        loading={loading}
        hideDefaultFooter={!!createdLeaseId}
        footer={
          createdLeaseId ? (
            <div className="flex flex-row justify-end gap-2">
              <AiActionButton label="Generate contract" onClick={handleGenerateContract} />
              <Button onClick={handleDone}>Done</Button>
            </div>
          ) : undefined
        }
      >
        <FormField span="full">
          <Label>Unit</Label>
          <ComboboxField
            value={unitId}
            onValueChange={setUnitId}
            placeholder="Select unit"
            disabled={!!createdLeaseId}
            options={units.map((u) => ({ value: u.id, label: u.label }))}
          />
        </FormField>

        <FormField span="full">
          <Label>Tenant</Label>
          <ComboboxField
            value={tenantId}
            onValueChange={setTenantId}
            placeholder="Select tenant"
            disabled={!!createdLeaseId}
            options={tenants.map((t) => ({ value: t.id, label: t.name }))}
          />
        </FormField>

        <FormGrid>
          <FormField>
            <Label htmlFor="lease-start">Start date</Label>
            <Input id="lease-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={!!createdLeaseId} />
          </FormField>
          <FormField>
            <Label htmlFor="lease-end">End date</Label>
            <Input id="lease-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={!!createdLeaseId} />
          </FormField>
          <FormField>
            <Label htmlFor="lease-rent">Monthly rent (BHD)</Label>
            <Input id="lease-rent" type="number" step="0.001" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} disabled={!!createdLeaseId} />
          </FormField>
          <FormField>
            <Label htmlFor="lease-deposit">Deposit (BHD)</Label>
            <Input id="lease-deposit" type="number" step="0.001" value={deposit} onChange={(e) => setDeposit(e.target.value)} disabled={!!createdLeaseId} />
          </FormField>
        </FormGrid>

        {createdLeaseId && (
          <p className="text-sm text-muted-foreground">
            Lease <span className="font-mono text-foreground">{createdLeaseId}</span> created. Generate a contract draft or close this panel.
          </p>
        )}
      </FormSheet>

      <ContractPreviewDialog
        open={contractOpen}
        onOpenChange={setContractOpen}
        contractText={contractText}
      />
    </>
  );
}
