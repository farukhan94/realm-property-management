"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComboboxField } from "@/components/shared/ComboboxField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, FormGrid } from "@/components/shared/FormGrid";
import { FormSheet } from "@/components/shared/FormSheet";
import { workOrdersService } from "@/lib/api/services/work-orders";
import { unitsService } from "@/lib/api/services/units";
import { getModuleEntity } from "@/lib/modules/entity-scope";
import type { WorkOrderPriority } from "@/types/work-order";

interface WorkOrderCreateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (workOrderId: string) => void;
}

export function WorkOrderCreateSheet({ open, onOpenChange, onSuccess }: WorkOrderCreateSheetProps) {
  const facilityEntityId = getModuleEntity("facility");
  const [units, setUnits] = useState<{ id: string; label: string; buildingId: string }[]>([]);
  const [title, setTitle] = useState("");
  const [unitId, setUnitId] = useState("");
  const [priority, setPriority] = useState<WorkOrderPriority>("medium");
  const [billTo, setBillTo] = useState<"owner" | "hoa" | "internal">("owner");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    unitsService.listUnits(undefined, facilityEntityId).then((u) =>
      setUnits(u.map((x) => ({ id: x.id, label: x.label, buildingId: x.buildingId })))
    );
  }, [open, facilityEntityId]);

  function resetForm() {
    setTitle("");
    setUnitId("");
    setPriority("medium");
    setBillTo("owner");
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    onOpenChange(next);
  }

  async function handleSubmit() {
    const unit = units.find((u) => u.id === unitId);
    if (!unit || !title) return;
    setLoading(true);
    try {
      const wo = await workOrdersService.create({
        title,
        unitId,
        buildingId: unit.buildingId,
        priority,
        entityId: facilityEntityId,
        billTo,
      });
      handleOpenChange(false);
      onSuccess(wo.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormSheet
      open={open}
      onOpenChange={handleOpenChange}
      title="New work order"
      description="Log a facility maintenance request."
      onSubmit={handleSubmit}
      submitLabel="Create work order"
      loading={loading}
    >
      <FormField span="full">
        <Label htmlFor="wo-title">Title</Label>
        <Input
          id="wo-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Describe the issue"
        />
      </FormField>

      <FormField span="full">
        <Label>Unit</Label>
        <ComboboxField
          value={unitId}
          onValueChange={setUnitId}
          placeholder="Select unit"
          options={units.map((u) => ({ value: u.id, label: u.label }))}
        />
      </FormField>

      <FormGrid>
        <FormField>
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(v) => v && setPriority(v as WorkOrderPriority)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField>
          <Label>Bill to</Label>
          <Select value={billTo} onValueChange={(v) => v && setBillTo(v as typeof billTo)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="hoa">HOA</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </FormGrid>
    </FormSheet>
  );
}
