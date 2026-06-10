"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import { maintenanceService } from "@/lib/api/services/maintenance";
import { personsService } from "@/lib/api/services/persons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ComboboxField } from "@/components/shared/ComboboxField";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function DispatchView() {
  const [slots, setSlots] = useState<Awaited<ReturnType<typeof maintenanceService.listDispatch>>>([]);
  const [technicians, setTechnicians] = useState<Awaited<ReturnType<typeof personsService.list>>>([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [selectedTechId, setSelectedTechId] = useState("");

  const load = useCallback(() => {
    maintenanceService.listDispatch().then(setSlots);
    personsService.list("technician").then(setTechnicians);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAssign() {
    await maintenanceService.assignDispatch(selectedSlotId, selectedTechId);
    setAssignOpen(false);
    setSelectedSlotId("");
    setSelectedTechId("");
    load();
  }

  function openAssign(slotId: string) {
    setSelectedSlotId(slotId);
    setAssignOpen(true);
  }

  return (
    <PageShell title="Technician dispatch" description="Daily schedule and job assignments.">
<Card>
        <CardHeader><CardTitle>Today&apos;s dispatch</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={slots}
            searchKeys={["technicianName", "workOrderId"]}
            defaultSort={fullTableSort("startTime")}
            columns={[
              {
                key: "startTime",
                header: "Time",
                sortable: true,
                filterValue: (r) => `${r.startTime} – ${r.endTime}`,
                cell: (r) => `${r.startTime} – ${r.endTime}`,
              },
              { key: "technicianName", header: "Technician", sortable: true, cell: (r) => r.technicianName },
              {
                key: "workOrderId",
                header: "Work order",
                sortable: true,
                filterValue: (r) => r.workOrder?.title ?? r.workOrderId,
                cell: (r) => r.workOrder?.title ?? r.workOrderId,
              },
              {
                key: "unitId",
                header: "Unit",
                sortable: true,
                filterValue: (r) => r.workOrder?.unitId ?? "—",
                cell: (r) => r.workOrder?.unitId ?? "—",
              },
            ]}
            actions={[{ label: "Reassign", onClick: (r) => openAssign(r.id) }]}
          />
        </CardContent>
      </Card>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Assign technician</DialogTitle></DialogHeader>
          <div className="space-y-1">
            <Label>Technician</Label>
            <ComboboxField
              value={selectedTechId}
              onValueChange={setSelectedTechId}
              placeholder="Select technician"
              options={technicians.map((t) => ({ value: t.id, label: t.name }))}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign} disabled={!selectedTechId}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
