"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import type { CostLine } from "@/types/work-order";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

interface JobCostingPanelProps {
  costLines: CostLine[];
  totalCost: number;
  totalRevenue: number;
  profit: number;
}

export function JobCostingPanel({
  costLines,
  totalCost,
  totalRevenue,
  profit,
}: JobCostingPanelProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total cost</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={totalCost} className="text-xl font-bold" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Billed amount</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={totalRevenue} className="text-xl font-bold" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Job P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay
              amount={profit}
              className={`text-xl font-bold ${profit >= 0 ? "text-revenue" : "text-destructive"}`}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cost lines</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={costLines}
            searchKeys={["type", "description"]}
            defaultSort={fullTableSort("description")}
            columns={[
              { key: "type", header: "Type", sortable: true, filterKey: "type", filterValue: (r) => r.type, cell: (r) => r.type },
              { key: "description", header: "Description", sortable: true, cell: (r) => r.description },
              { key: "quantity", header: "Qty", sortable: true, cell: (r) => r.quantity },
              { key: "unitCost", header: "Unit cost", sortable: true, cell: (r) => <CurrencyDisplay amount={r.unitCost} /> },
              { key: "markupPercent", header: "Markup", sortable: true, filterValue: (r) => `${r.markupPercent}%`, cell: (r) => `${r.markupPercent}%` },
              {
                key: "lineTotal",
                header: "Line total",
                sortable: true,
                sortValue: (r) => r.quantity * r.unitCost * (1 + r.markupPercent / 100),
                className: "text-right",
                cell: (r) => (
                  <CurrencyDisplay
                    amount={r.quantity * r.unitCost * (1 + r.markupPercent / 100)}
                  />
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
