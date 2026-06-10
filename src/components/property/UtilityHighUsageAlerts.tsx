"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";
import type { UtilityBill } from "@/types/utility";

export interface UtilityAccountRow {
  id: string;
  unitLabel: string;
  ewaAccount: string;
  monthlyCap: number;
}

export interface UtilityAlertRow {
  id: string;
  accountId: string;
  unitLabel: string;
  ewaAccount: string;
  period: string;
  amount: number;
  monthlyCap: number;
  excess: number;
}

function enrichAlerts(
  alerts: UtilityBill[],
  accounts: UtilityAccountRow[]
): UtilityAlertRow[] {
  const accountById = new Map(accounts.map((a) => [a.id, a]));

  return alerts.flatMap((alert) => {
    const account = accountById.get(alert.accountId);
    if (!account) return [];

    return [
      {
        id: alert.id,
        accountId: alert.accountId,
        unitLabel: account.unitLabel,
        ewaAccount: account.ewaAccount,
        period: alert.period,
        amount: alert.amount,
        monthlyCap: account.monthlyCap,
        excess: alert.amount - account.monthlyCap,
      },
    ];
  });
}

interface UtilityHighUsageAlertsProps {
  alerts: UtilityBill[];
  accounts: UtilityAccountRow[];
}

export function UtilityHighUsageAlerts({ alerts, accounts }: UtilityHighUsageAlertsProps) {
  const [expanded, setExpanded] = useState(false);

  const rows = useMemo(() => enrichAlerts(alerts, accounts), [alerts, accounts]);
  const totalExcess = useMemo(() => rows.reduce((sum, r) => sum + r.excess, 0), [rows]);

  if (rows.length === 0) return null;

  return (
    <div className="mb-4 overflow-hidden rounded-md border border-destructive/30 bg-destructive/5">
      <div
        className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${
          expanded ? "border-b border-destructive/20" : ""
        }`}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {rows.length} utility {rows.length === 1 ? "account" : "accounts"} exceeded lease caps
            </p>
            <p className="text-sm text-muted-foreground">
              Total excess to recover:{" "}
              <span className="font-medium text-foreground">
                <CurrencyDisplay amount={totalExcess} />
              </span>
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Hide details" : "View details"}
        </Button>
      </div>

      {expanded ? (
        <div className="p-4 pt-3">
          <DataTable
            {...FULL_TABLE}
            data={rows}
            defaultPageSize={5}
            pageSizeOptions={[5, 10, 25]}
            searchKeys={["unitLabel", "accountId", "ewaAccount", "period"]}
            searchPlaceholder="Search unit, account, period…"
            defaultSort={fullTableSort("excess", "desc")}
            columns={[
            {
              key: "unitLabel",
              header: "Unit",
              sortable: true,
              cell: (r) => <span className="font-medium">{r.unitLabel}</span>,
            },
            {
              key: "accountId",
              header: "Account ID",
              sortable: true,
              cell: (r) => <span className="font-mono text-muted-foreground">{r.accountId}</span>,
            },
            {
              key: "period",
              header: "Period",
              sortable: true,
              cell: (r) => r.period,
            },
            {
              key: "amount",
              header: "Bill amount",
              sortable: true,
              sortValue: (r) => r.amount,
              cell: (r) => <CurrencyDisplay amount={r.amount} />,
              className: "text-right",
            },
            {
              key: "monthlyCap",
              header: "Cap",
              sortable: true,
              sortValue: (r) => r.monthlyCap,
              cell: (r) => <CurrencyDisplay amount={r.monthlyCap} />,
              className: "text-right",
            },
            {
              key: "excess",
              header: "Excess",
              sortable: true,
              sortValue: (r) => r.excess,
              filterValue: (r) => String(r.excess),
              cell: (r) => (
                <span className="font-medium text-destructive">
                  +<CurrencyDisplay amount={r.excess} />
                </span>
              ),
              className: "text-right",
            },
            ]}
          />
        </div>
      ) : null}
    </div>
  );
}
