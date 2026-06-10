"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { FormField, FormGrid } from "@/components/shared/FormGrid";
import { FormSheet } from "@/components/shared/FormSheet";
import { utilitiesService } from "@/lib/api/services/utilities";
import { useEntity } from "@/lib/entity-context";
import { getModuleEntity } from "@/lib/modules/entity-scope";
import { getLocaleByEntityId } from "@/lib/locale/resolver";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";
import { ComboboxField } from "@/components/shared/ComboboxField";
import { UtilityHighUsageAlerts } from "@/components/property/UtilityHighUsageAlerts";

export function UtilitiesView() {
  const { entityId } = useEntity();
  const locale = getLocaleByEntityId(entityId);
  const [accounts, setAccounts] = useState<Awaited<ReturnType<typeof utilitiesService.listAccounts>>>([]);
  const [formAccounts, setFormAccounts] = useState<Awaited<ReturnType<typeof utilitiesService.listAccounts>>>([]);
  const propertyEntityId = getModuleEntity("property");
  const [alerts, setAlerts] = useState<Awaited<ReturnType<typeof utilitiesService.getAlerts>>>([]);
  const [logOpen, setLogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [billPeriod, setBillPeriod] = useState("");
  const [billAmount, setBillAmount] = useState("");

  const load = useCallback(() => {
    utilitiesService.listAccounts(entityId).then(setAccounts);
    utilitiesService.getAlerts().then(setAlerts);
  }, [entityId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    utilitiesService.listAccounts(propertyEntityId).then(setFormAccounts);
  }, [propertyEntityId]);

  async function handleLogBill() {
    await utilitiesService.logBill(selectedAccount, billPeriod, Number(billAmount));
    setLogOpen(false);
    setBillPeriod("");
    setBillAmount("");
    setSelectedAccount("");
    load();
  }

  return (
    <PageShell
      title="Utilities"
      description={`${locale.utilityProvider} usage vs lease cap and recovery preview.`}
      actions={<Button size="sm" onClick={() => setLogOpen(true)}>Log {locale.utilityProvider} bill</Button>}
    >
<UtilityHighUsageAlerts alerts={alerts} accounts={accounts} />
      <Card>
        <CardHeader><CardTitle>{locale.utilityProvider} accounts</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={accounts}
            searchKeys={["unitLabel", "ewaAccount"]}
            defaultSort={fullTableSort("unitLabel")}
            columns={[
              { key: "unitLabel", header: "Unit", sortable: true, cell: (r) => r.unitLabel },
              { key: "ewaAccount", header: `${locale.utilityProvider} account`, sortable: true, cell: (r) => <span className="font-mono">{r.ewaAccount}</span> },
              { key: "monthlyCap", header: "Lease cap", sortable: true, cell: (r) => <CurrencyDisplay amount={r.monthlyCap} />, className: "text-right" },
              {
                key: "latestBill",
                header: "Latest bill",
                sortable: true,
                sortValue: (r) => r.bills[r.bills.length - 1]?.amount ?? 0,
                filterValue: (r) => {
                  const latest = r.bills[r.bills.length - 1];
                  return latest ? String(latest.amount) : "—";
                },
                cell: (r) => {
                  const latest = r.bills[r.bills.length - 1];
                  return latest ? <CurrencyDisplay amount={latest.amount} /> : "—";
                },
                className: "text-right",
              },
              {
                key: "status",
                header: "Status",
                sortable: true,
                filterValue: (r) => {
                  const latest = r.bills[r.bills.length - 1];
                  return latest?.exceedsCap ? "Over cap" : "OK";
                },
                cell: (r) => {
                  const latest = r.bills[r.bills.length - 1];
                  return latest?.exceedsCap ? <Badge variant="destructive">Over cap</Badge> : <Badge variant="secondary">OK</Badge>;
                },
              },
            ]}
            actions={[
              {
                label: "Log bill",
                onClick: (r) => {
                  setSelectedAccount(r.id);
                  setLogOpen(true);
                },
              },
            ]}
          />
        </CardContent>
      </Card>

      <FormSheet open={logOpen} onOpenChange={setLogOpen} title={`Log ${locale.utilityProvider} bill`} description="Record utility usage for recovery." onSubmit={handleLogBill} submitLabel="Log bill">
        <FormField span="full">
          <Label>Account</Label>
          <ComboboxField
            value={selectedAccount}
            onValueChange={setSelectedAccount}
            placeholder="Select account"
            options={formAccounts.map((a) => ({
              value: a.id,
              label: `${a.unitLabel} — ${a.ewaAccount}`,
            }))}
          />
        </FormField>
        <FormGrid>
          <FormField>
            <Label>Period</Label>
            <Input placeholder="2026-06" value={billPeriod} onChange={(e) => setBillPeriod(e.target.value)} />
          </FormField>
          <FormField>
            <Label>Amount ({locale.currency})</Label>
            <Input type="number" step={locale.currencyDecimals === 3 ? "0.001" : "0.01"} value={billAmount} onChange={(e) => setBillAmount(e.target.value)} />
          </FormField>
        </FormGrid>
      </FormSheet>
    </PageShell>
  );
}
