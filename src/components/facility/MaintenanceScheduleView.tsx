"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import { FormField, FormGrid } from "@/components/shared/FormGrid";
import { FormSheet } from "@/components/shared/FormSheet";
import { getModuleEntity } from "@/lib/modules/entity-scope";
import { maintenanceService } from "@/lib/api/services/maintenance";
import { personsService } from "@/lib/api/services/persons";
import { useEntity } from "@/lib/entity-context";
import { ComboboxField } from "@/components/shared/ComboboxField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function MaintenanceScheduleView() {
  const { entityId } = useEntity();
  const [schedules, setSchedules] = useState<Awaited<ReturnType<typeof maintenanceService.listSchedules>>>([]);
  const [technicians, setTechnicians] = useState<Awaited<ReturnType<typeof personsService.list>>>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<"monthly" | "quarterly" | "annual">("quarterly");
  const [nextDue, setNextDue] = useState("");
  const [buildingId, setBuildingId] = useState("B-101");
  const [techId, setTechId] = useState("");

  const load = useCallback(() => {
    maintenanceService.listSchedules(entityId).then(setSchedules);
    personsService.list("technician").then(setTechnicians);
  }, [entityId]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    await maintenanceService.createSchedule({
      title,
      frequency,
      nextDue,
      buildingId,
      assetId: `AST-NEW-${Date.now()}`,
      assignedTechnicianId: techId || null,
      entityId: getModuleEntity("facility"),
    });
    setCreateOpen(false);
    setTitle("");
    setNextDue("");
    load();
  }

  return (
    <PageShell
      title="Preventive maintenance"
      description="PM schedules for HVAC, EWA meters, and building systems."
      actions={<Button size="sm" onClick={() => setCreateOpen(true)}>Create schedule</Button>}
    >
<Card>
        <CardHeader><CardTitle>Schedules</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={schedules}
            searchKeys={["title", "frequency", "technicianName"]}
            defaultSort={fullTableSort("nextDue")}
            columns={[
              { key: "title", header: "Task", sortable: true, cell: (r) => r.title },
              { key: "frequency", header: "Frequency", sortable: true, filterKey: "frequency", filterValue: (r) => r.frequency, cell: (r) => r.frequency },
              { key: "nextDue", header: "Next due", sortable: true, cell: (r) => r.nextDue },
              { key: "technicianName", header: "Technician", sortable: true, filterValue: (r) => r.technicianName ?? "Unassigned", cell: (r) => r.technicianName ?? "Unassigned" },
            ]}
          />
        </CardContent>
      </Card>

      <FormSheet open={createOpen} onOpenChange={setCreateOpen} title="Create PM schedule" onSubmit={handleCreate} submitLabel="Create">
        <FormField span="full">
          <Label>Task title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quarterly HVAC service" />
        </FormField>
        <FormGrid>
          <FormField>
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={(v) => v && setFrequency(v as typeof frequency)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField>
            <Label>Next due date</Label>
            <Input type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} />
          </FormField>
          <FormField>
            <Label>Building ID</Label>
            <Input value={buildingId} onChange={(e) => setBuildingId(e.target.value)} />
          </FormField>
          <FormField>
            <Label>Technician</Label>
            <ComboboxField
              value={techId || "__none__"}
              onValueChange={(v) => setTechId(v === "__none__" ? "" : v)}
              placeholder="Unassigned"
              options={[
                { value: "__none__", label: "Unassigned" },
                ...technicians.map((t) => ({ value: t.id, label: t.name })),
              ]}
            />
          </FormField>
        </FormGrid>
      </FormSheet>
    </PageShell>
  );
}
