"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormField, FormGrid } from "@/components/shared/FormGrid";
import { FormSheet } from "@/components/shared/FormSheet";
import { JobCostingPanel } from "./JobCostingPanel";
import { workOrdersService } from "@/lib/api/services/work-orders";
import { inventoryService } from "@/lib/api/services/inventory";
import { personsService } from "@/lib/api/services/persons";
import { ComboboxField } from "@/components/shared/ComboboxField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { WorkOrder, WorkOrderStatus, WorkOrderPriority } from "@/types/work-order";

interface WorkOrderDetail extends WorkOrder {
  unitLabel: string;
  technicianName: string | null;
  totalCost: number;
  totalRevenue: number;
  profit: number;
}

const STATUS_FLOW: WorkOrderStatus[] = ["new", "assigned", "in_progress", "completed"];

export function WorkOrderDetailView({ workOrderId }: { workOrderId: string }) {
  const [wo, setWo] = useState<WorkOrderDetail | null>(null);
  const [parts, setParts] = useState<Awaited<ReturnType<typeof inventoryService.listParts>>>([]);
  const [technicians, setTechnicians] = useState<Awaited<ReturnType<typeof personsService.list>>>([]);
  const [selectedPart, setSelectedPart] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [costLineOpen, setCostLineOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<WorkOrderPriority>("medium");
  const [editBillTo, setEditBillTo] = useState<"owner" | "hoa" | "internal">("owner");
  const [editTech, setEditTech] = useState("");
  const [lineDesc, setLineDesc] = useState("");
  const [lineQty, setLineQty] = useState("1");
  const [lineCost, setLineCost] = useState("");
  const [lineMarkup, setLineMarkup] = useState("15");

  const load = useCallback(() => {
    workOrdersService.get(workOrderId).then(setWo);
    inventoryService.listParts().then(setParts);
    personsService.list("technician").then(setTechnicians);
  }, [workOrderId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (wo) {
      setEditTitle(wo.title);
      setEditPriority(wo.priority);
      setEditBillTo(wo.billTo);
      setEditTech(wo.assignedTechnicianId ?? "");
    }
  }, [wo]);

  async function consumePart() {
    if (!selectedPart || !wo) return;
    await inventoryService.consume(selectedPart, wo.id, 1);
    setSelectedPart("");
    load();
  }

  async function advanceStatus() {
    if (!wo) return;
    const idx = STATUS_FLOW.indexOf(wo.status);
    if (idx < STATUS_FLOW.length - 1) {
      const updated = await workOrdersService.updateStatus(wo.id, STATUS_FLOW[idx + 1]);
      if (updated) setWo(updated);
    }
  }

  async function handleEdit() {
    const updated = await workOrdersService.update(workOrderId, {
      title: editTitle,
      priority: editPriority,
      billTo: editBillTo,
      assignedTechnicianId: editTech || null,
    });
    if (updated) setWo(updated);
    setEditOpen(false);
  }

  async function handleAddCostLine() {
    const updated = await workOrdersService.addCostLine(workOrderId, {
      type: "material",
      description: lineDesc,
      quantity: Number(lineQty),
      unitCost: Number(lineCost),
      markupPercent: Number(lineMarkup),
    });
    if (updated) setWo(updated);
    setCostLineOpen(false);
    setLineDesc("");
    setLineQty("1");
    setLineCost("");
  }

  if (!wo) {
    return (
      <PageShell title="Loading..." description="">
        <p className="text-muted-foreground">Loading work order...</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={wo.title}
      description={`${wo.id} · ${wo.unitLabel}`}
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>Edit</Button>
          <Button variant="outline" size="sm" render={<Link href="/facility/work-orders" />}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      }
    >
<Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Status</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={wo.status} />
            <StatusBadge status={wo.priority} />
            {wo.status !== "completed" && (
              <Button size="sm" type="button" onClick={advanceStatus}>Advance status</Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setCostLineOpen(true)}>Add cost line</Button>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Technician: {wo.technicianName ?? "Unassigned"}</p>
          <p>Bill to: {wo.billTo}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Inventory consumption</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <ComboboxField
            className="w-64"
            value={selectedPart}
            onValueChange={setSelectedPart}
            placeholder="Select part"
            options={parts.map((p) => ({
              value: p.id,
              label: `${p.name} (stock: ${p.stockQty})`,
            }))}
          />
          <Button size="sm" onClick={consumePart} disabled={!selectedPart}>Consume 1 unit</Button>
        </CardContent>
      </Card>

      <JobCostingPanel costLines={wo.costLines} totalCost={wo.totalCost} totalRevenue={wo.totalRevenue} profit={wo.profit} />

      <FormSheet open={editOpen} onOpenChange={setEditOpen} title="Edit work order" onSubmit={handleEdit} submitLabel="Save">
        <FormField span="full">
          <Label>Title</Label>
          <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
        </FormField>
        <FormGrid>
          <FormField>
            <Label>Priority</Label>
            <Select value={editPriority} onValueChange={(v) => v && setEditPriority(v as WorkOrderPriority)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["low", "medium", "high", "critical"] as const).map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField>
            <Label>Bill to</Label>
            <Select value={editBillTo} onValueChange={(v) => v && setEditBillTo(v as typeof editBillTo)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="hoa">HOA</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField span="full">
            <Label>Technician</Label>
            <ComboboxField
              value={editTech || "__none__"}
              onValueChange={(v) => setEditTech(v === "__none__" ? "" : v)}
              placeholder="Unassigned"
              options={[
                { value: "__none__", label: "Unassigned" },
                ...technicians.map((t) => ({ value: t.id, label: t.name })),
              ]}
            />
          </FormField>
        </FormGrid>
      </FormSheet>

      <Dialog open={costLineOpen} onOpenChange={setCostLineOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add cost line</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label>Description</Label><Input value={lineDesc} onChange={(e) => setLineDesc(e.target.value)} /></div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1"><Label>Qty</Label><Input type="number" value={lineQty} onChange={(e) => setLineQty(e.target.value)} /></div>
              <div className="space-y-1"><Label>Unit cost</Label><Input type="number" step="0.001" value={lineCost} onChange={(e) => setLineCost(e.target.value)} /></div>
              <div className="space-y-1"><Label>Markup %</Label><Input type="number" value={lineMarkup} onChange={(e) => setLineMarkup(e.target.value)} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCostLineOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCostLine} disabled={!lineDesc || !lineCost}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
