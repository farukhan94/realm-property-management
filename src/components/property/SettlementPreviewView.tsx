"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { settlementsService } from "@/lib/api/services/settlements";
import { useEntity } from "@/lib/entity-context";
import type { OwnerSettlement } from "@/types/settlement";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

interface SettlementRow extends OwnerSettlement {
  ownerName: string;
  unitLabel: string;
}

export function SettlementPreviewView() {
  const { entityId } = useEntity();
  const [feePercent, setFeePercent] = useState("5");
  const [settlements, setSettlements] = useState<SettlementRow[]>([]);
  const [selected, setSelected] = useState<SettlementRow | null>(null);

  useEffect(() => {
    settlementsService.preview(Number(feePercent), entityId).then((data) => {
      setSettlements(data);
      setSelected(data[0] ?? null);
    });
  }, [feePercent, entityId]);

  return (
    <PageShell
      title="Owner settlement"
      description="Preview owner statements with configurable management fee."
      actions={
        <Button variant="outline" size="sm" render={<Link href="/property/leases" />}>
          Leases
        </Button>
      }
    >
<div className="flex max-w-xs flex-col gap-1.5">
        <Label htmlFor="fee">Management fee %</Label>
        <Input
          id="fee"
          type="number"
          min={0}
          max={20}
          step={0.5}
          value={feePercent}
          onChange={(e) => setFeePercent(e.target.value)}
        />
      </div>

      {selected && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Gross rent</CardTitle>
            </CardHeader>
            <CardContent>
              <CurrencyDisplay amount={selected.grossRent} className="text-2xl font-bold" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Management fee</CardTitle>
            </CardHeader>
            <CardContent>
              <CurrencyDisplay amount={selected.managementFee} className="text-2xl font-bold text-destructive" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <CurrencyDisplay
                amount={selected.utilityDeductions + selected.otherDeductions}
                className="text-2xl font-bold text-destructive"
              />
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Net payable</CardTitle>
            </CardHeader>
            <CardContent>
              <CurrencyDisplay amount={selected.netPayable} className="text-2xl font-bold text-revenue" />
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Owner ledger — {selected?.ownerName}</CardTitle>
        </CardHeader>
        <CardContent>
          {selected && (
            <DataTable
              {...FULL_TABLE}
              data={selected.lines}
              searchKeys={["description", "type"]}
              defaultSort={fullTableSort("description")}
              columns={[
                { key: "description", header: "Description", sortable: true, cell: (r) => r.description },
                {
                  key: "type",
                  header: "Type",
                  sortable: true,
                  filterKey: "type",
                  filterValue: (r) => r.type,
                  cell: (r) => (
                    <span className={r.type === "credit" ? "text-revenue" : "text-destructive"}>
                      {r.type}
                    </span>
                  ),
                },
                {
                  key: "amount",
                  header: "Amount",
                  sortable: true,
                  className: "text-right",
                  cell: (r) => <CurrencyDisplay amount={r.amount} />,
                },
              ]}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All settlements</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={settlements}
            searchKeys={["ownerName", "unitLabel"]}
            defaultSort={fullTableSort("ownerName")}
            columns={[
              { key: "ownerName", header: "Owner", sortable: true, cell: (r) => r.ownerName },
              { key: "unitLabel", header: "Unit", sortable: true, cell: (r) => r.unitLabel },
              { key: "grossRent", header: "Gross", sortable: true, cell: (r) => <CurrencyDisplay amount={r.grossRent} /> },
              { key: "netPayable", header: "Net", sortable: true, cell: (r) => <CurrencyDisplay amount={r.netPayable} /> },
            ]}
            actions={[
              {
                label: "View ledger",
                onClick: (r) => setSelected(r),
              },
            ]}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
