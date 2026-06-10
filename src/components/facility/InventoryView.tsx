"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { FormField, FormGrid } from "@/components/shared/FormGrid";
import { FormSheet } from "@/components/shared/FormSheet";
import { inventoryService } from "@/lib/api/services/inventory";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function InventoryView() {
  const [parts, setParts] = useState<Awaited<ReturnType<typeof inventoryService.listParts>>>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState("");
  const [adjustDelta, setAdjustDelta] = useState("");
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("HVAC");
  const [stockQty, setStockQty] = useState("10");
  const [unitCost, setUnitCost] = useState("");

  const load = useCallback(() => {
    inventoryService.listParts().then(setParts);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    await inventoryService.createPart({
      sku,
      name,
      category,
      stockQty: Number(stockQty),
      unitCost: Number(unitCost),
      reorderLevel: 5,
    });
    setCreateOpen(false);
    setSku("");
    setName("");
    setUnitCost("");
    load();
  }

  async function handleAdjust() {
    await inventoryService.adjustStock(selectedPartId, Number(adjustDelta));
    setAdjustOpen(false);
    setAdjustDelta("");
    load();
  }

  function openAdjust(partId: string) {
    setSelectedPartId(partId);
    setAdjustOpen(true);
  }

  return (
    <PageShell
      title="Inventory"
      description="Spare parts stock and consumption tracking."
      actions={<Button size="sm" onClick={() => setCreateOpen(true)}>Add part</Button>}
    >
<Card>
        <CardHeader><CardTitle>Parts catalog</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={parts}
            searchPlaceholder="Search SKU or part name…"
            searchKeys={["sku", "name", "category"]}
            defaultSort={fullTableSort("name")}
            columns={[
              { key: "sku", header: "SKU", sortable: true, cell: (r) => <span className="font-mono">{r.sku}</span> },
              { key: "name", header: "Part", sortable: true, cell: (r) => r.name },
              { key: "category", header: "Category", sortable: true, cell: (r) => r.category },
              { key: "stockQty", header: "Stock", sortable: true, className: "text-right", cell: (r) => r.stockQty },
              {
                key: "unitCost",
                header: "Unit cost",
                sortable: true,
                className: "text-right",
                cell: (r) => <CurrencyDisplay amount={r.unitCost} />,
              },
            ]}
            actions={[
              {
                label: "Adjust stock",
                onClick: (r) => openAdjust(r.id),
              },
            ]}
          />
        </CardContent>
      </Card>

      <FormSheet open={createOpen} onOpenChange={setCreateOpen} title="Add part" onSubmit={handleCreate} submitLabel="Create">
        <FormGrid>
          <FormField>
            <Label>SKU</Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="HVAC-FLT-99" />
          </FormField>
          <FormField>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>
          <FormField>
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
          </FormField>
          <FormField>
            <Label>Stock qty</Label>
            <Input type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)} />
          </FormField>
          <FormField>
            <Label>Unit cost (BHD)</Label>
            <Input type="number" step="0.001" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
          </FormField>
        </FormGrid>
      </FormSheet>

      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adjust stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Quantity change (+/-)</Label>
            <Input type="number" value={adjustDelta} onChange={(e) => setAdjustDelta(e.target.value)} placeholder="e.g. -2 or 10" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>Cancel</Button>
            <Button onClick={handleAdjust}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
