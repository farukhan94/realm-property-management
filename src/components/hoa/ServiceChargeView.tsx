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
import { hoaService } from "@/lib/api/services/hoa";
import { COMPANY_ID } from "@/lib/mock/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function ServiceChargeView() {
  const [rules, setRules] = useState<Awaited<ReturnType<typeof hoaService.getApportionment>>>([]);
  const [invoices, setInvoices] = useState<Awaited<ReturnType<typeof hoaService.getServiceChargeInvoices>>>([]);
  const [ruleOpen, setRuleOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [unitId, setUnitId] = useState("");
  const [areaSqm, setAreaSqm] = useState("");
  const [sharePercent, setSharePercent] = useState("");
  const [invUnitId, setInvUnitId] = useState("");
  const [invOwnerId, setInvOwnerId] = useState("own-1");
  const [invPeriod, setInvPeriod] = useState("2026-Q3");
  const [invAmount, setInvAmount] = useState("");
  const [invFund, setInvFund] = useState<"operating" | "reserve">("operating");

  const load = useCallback(() => {
    hoaService.getApportionment().then(setRules);
    hoaService.getServiceChargeInvoices().then(setInvoices);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreateRule() {
    await hoaService.createApportionment({
      hoaId: COMPANY_ID,
      unitId,
      areaSqm: Number(areaSqm),
      sharePercent: Number(sharePercent),
    });
    setRuleOpen(false);
    setUnitId("");
    setAreaSqm("");
    setSharePercent("");
    load();
  }

  async function handleCreateInvoice() {
    await hoaService.createServiceChargeInvoice({
      hoaId: COMPANY_ID,
      unitId: invUnitId,
      ownerId: invOwnerId,
      period: invPeriod,
      amount: Number(invAmount),
      fund: invFund,
    });
    setInvoiceOpen(false);
    setInvUnitId("");
    setInvAmount("");
    load();
  }

  return (
    <PageShell
      title="Service charges"
      description="Apportionment rules and quarterly invoice generation."
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setRuleOpen(true)}>Add rule</Button>
          <Button size="sm" onClick={() => setInvoiceOpen(true)}>Generate invoice</Button>
        </div>
      }
    >
<Card>
        <CardHeader><CardTitle>Apportionment rules</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={rules}
            searchKeys={["unitId"]}
            defaultSort={fullTableSort("unitId")}
            columns={[
              { key: "unitId", header: "Unit", sortable: true, cell: (r) => r.unitId },
              { key: "areaSqm", header: "Area (sqm)", sortable: true, cell: (r) => r.areaSqm, className: "text-right" },
              { key: "sharePercent", header: "Share %", sortable: true, filterValue: (r) => `${r.sharePercent}%`, cell: (r) => `${r.sharePercent}%`, className: "text-right" },
            ]}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Service charge invoices</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={invoices}
            searchKeys={["id", "unitId", "period"]}
            defaultSort={fullTableSort("period", "desc")}
            columns={[
              { key: "id", header: "Invoice", sortable: true, cell: (r) => <span className="font-mono">{r.id}</span> },
              { key: "unitId", header: "Unit", sortable: true, cell: (r) => r.unitId },
              { key: "period", header: "Period", sortable: true, cell: (r) => r.period },
              { key: "amount", header: "Amount", sortable: true, cell: (r) => <CurrencyDisplay amount={r.amount} />, className: "text-right" },
              { key: "status", header: "Status", sortable: true, filterKey: "status", filterValue: (r) => r.status, cell: (r) => r.status },
            ]}
          />
        </CardContent>
      </Card>

      <FormSheet open={ruleOpen} onOpenChange={setRuleOpen} title="Create apportionment rule" onSubmit={handleCreateRule} submitLabel="Create">
        <FormGrid>
          <FormField>
            <Label>Unit ID</Label>
            <Input value={unitId} onChange={(e) => setUnitId(e.target.value)} placeholder="U-1001" />
          </FormField>
          <FormField>
            <Label>Area (sqm)</Label>
            <Input type="number" value={areaSqm} onChange={(e) => setAreaSqm(e.target.value)} />
          </FormField>
          <FormField>
            <Label>Share %</Label>
            <Input type="number" step="0.01" value={sharePercent} onChange={(e) => setSharePercent(e.target.value)} />
          </FormField>
        </FormGrid>
      </FormSheet>

      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Generate service charge invoice</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label>Unit ID</Label><Input value={invUnitId} onChange={(e) => setInvUnitId(e.target.value)} /></div>
            <div className="space-y-1"><Label>Owner ID</Label><Input value={invOwnerId} onChange={(e) => setInvOwnerId(e.target.value)} /></div>
            <div className="space-y-1"><Label>Period</Label><Input value={invPeriod} onChange={(e) => setInvPeriod(e.target.value)} /></div>
            <div className="space-y-1"><Label>Amount (BHD)</Label><Input type="number" step="0.001" value={invAmount} onChange={(e) => setInvAmount(e.target.value)} /></div>
            <div className="space-y-1">
              <Label>Fund</Label>
              <Select value={invFund} onValueChange={(v) => v && setInvFund(v as typeof invFund)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="operating">Operating</SelectItem>
                  <SelectItem value="reserve">Reserve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateInvoice} disabled={!invUnitId || !invAmount}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
