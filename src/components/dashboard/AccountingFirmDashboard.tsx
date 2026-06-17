"use client";

import { useEffect, useState } from "react";
import { Building2, FileBarChart } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardService } from "@/lib/api/services/dashboard";
import { DashboardWidget } from "./DashboardWidget";

export function AccountingFirmDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboardService.getAccountingDashboard>> | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");

  useEffect(() => {
    dashboardService.getAccountingDashboard().then((d) => {
      setData(d);
      if (d.buildings[0]) setSelectedBuilding(d.buildings[0].id);
    });
  }, []);

  if (!data) return <PageShell title="Accounting" description="Loading…"><p className="text-muted-foreground">Loading…</p></PageShell>;

  const building = data.buildings.find((b) => b.id === selectedBuilding);

  return (
    <PageShell title="Accounting Firm" description="Financial reporting and Statements of Account (SOA)">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DashboardWidget title="Portfolio Arrears" icon={FileBarChart}>
          <div className="text-2xl font-bold"><CurrencyDisplay amount={data.totalArrears} /></div>
        </DashboardWidget>
        <DashboardWidget title="Payouts This Month" icon={Building2}>
          <div className="text-2xl font-bold"><CurrencyDisplay amount={data.payoutsThisMonth} /></div>
        </DashboardWidget>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Generate Statement of Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedBuilding} onChange={(e) => setSelectedBuilding(e.target.value)} title="Select building">
            {data.buildings.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          {building && (
            <div className="rounded-md border border-border bg-muted/30 p-4 text-sm">
              <h4 className="font-semibold">{building.name} — SOA Preview</h4>
              <p className="mt-2 text-muted-foreground">Period: June 2026</p>
              <ul className="mt-3 space-y-1 font-mono text-xs">
                <li className="flex justify-between"><span>Rent collected</span><CurrencyDisplay amount={12450} /></li>
                <li className="flex justify-between"><span>Service charges</span><CurrencyDisplay amount={3200} /></li>
                <li className="flex justify-between"><span>Management fees</span><CurrencyDisplay amount={1867} /></li>
                <li className="flex justify-between border-t border-border pt-1 font-bold"><span>Net payable to owners</span><CurrencyDisplay amount={7383} /></li>
              </ul>
            </div>
          )}
          <div className="flex gap-2">
            <Button size="sm">Download SOA (PDF)</Button>
            <Button size="sm" variant="outline">Balance Sheet</Button>
            <Button size="sm" variant="outline">Service Charge Report</Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
