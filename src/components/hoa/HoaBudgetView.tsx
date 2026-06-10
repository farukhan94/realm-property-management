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
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function HoaBudgetView() {
  const [budgets, setBudgets] = useState<Awaited<ReturnType<typeof hoaService.getBudgets>>>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [year, setYear] = useState("2026");

  const load = useCallback(() => {
    hoaService.getBudgets().then(setBudgets);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    await hoaService.createBudget({
      hoaId: COMPANY_ID,
      category,
      budgetAmount: Number(budgetAmount),
      year: Number(year),
    });
    setCreateOpen(false);
    setCategory("");
    setBudgetAmount("");
    load();
  }

  return (
    <PageShell
      title="HOA budgets"
      description="Annual budget vs actual by line item."
      actions={<Button size="sm" onClick={() => setCreateOpen(true)}>Add budget line</Button>}
    >
<Card>
        <CardHeader><CardTitle>Budget lines</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={budgets}
            searchKeys={["category"]}
            defaultSort={fullTableSort("category")}
            columns={[
              { key: "category", header: "Category", sortable: true, cell: (r) => r.category },
              { key: "year", header: "Year", sortable: true, cell: (r) => r.year },
              { key: "budgetAmount", header: "Budget", sortable: true, cell: (r) => <CurrencyDisplay amount={r.budgetAmount} />, className: "text-right" },
              { key: "actualAmount", header: "Actual", sortable: true, cell: (r) => <CurrencyDisplay amount={r.actualAmount} />, className: "text-right" },
              { key: "variance", header: "Variance", sortable: true, sortValue: (r) => r.budgetAmount - r.actualAmount, filterValue: (r) => String(r.budgetAmount - r.actualAmount), cell: (r) => <CurrencyDisplay amount={r.budgetAmount - r.actualAmount} />, className: "text-right" },
            ]}
          />
        </CardContent>
      </Card>

      <FormSheet open={createOpen} onOpenChange={setCreateOpen} title="Add budget line" onSubmit={handleCreate} submitLabel="Create">
        <FormGrid>
          <FormField>
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Security" />
          </FormField>
          <FormField>
            <Label>Budget (BHD)</Label>
            <Input type="number" step="0.001" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} />
          </FormField>
          <FormField>
            <Label>Year</Label>
            <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
          </FormField>
        </FormGrid>
      </FormSheet>
    </PageShell>
  );
}
