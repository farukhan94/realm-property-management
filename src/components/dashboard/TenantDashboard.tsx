"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Bell, FileText } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "@/lib/api/services/dashboard";
import { ROLE_PERSON_MAP } from "@/types/role";
import { DashboardWidget } from "./DashboardWidget";

export function TenantDashboard() {
  const tenantId = ROLE_PERSON_MAP.Tenant!;
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboardService.getTenantDashboard>> | null>(null);

  useEffect(() => {
    dashboardService.getTenantDashboard(tenantId).then(setData);
  }, [tenantId]);

  if (!data) return <PageShell title="Tenant" description="Loading…"><p className="text-muted-foreground">Loading…</p></PageShell>;

  return (
    <PageShell
      title="Tenant Dashboard"
      description="What's due and your active requests"
      actions={<Button size="sm" render={<Link href="/portal/tenant" />}>Open Portal</Button>}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardWidget title="Amount Due" icon={AlertCircle}>
          <div className="text-2xl font-bold text-destructive"><CurrencyDisplay amount={data.due} /></div>
        </DashboardWidget>
        <DashboardWidget title="Active Lease" icon={FileText}>
          <div className="text-2xl font-bold">{data.leases.length}</div>
        </DashboardWidget>
        <DashboardWidget title="Notifications" icon={Bell}>
          <div className="text-2xl font-bold">{data.notifications.filter((n) => !n.read).length}</div>
          <p className="text-xs text-muted-foreground">unread</p>
        </DashboardWidget>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.notifications.map((n) => (
              <div key={n.id} className="flex items-start justify-between border-b border-border pb-2 text-sm">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
                {!n.read && <Badge variant="default" className="text-[10px]">New</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Open Tickets</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.tickets.map((t) => (
              <div key={t.id} className="flex justify-between border-b border-border pb-2 text-sm">
                <span>{t.title}</span>
                <Badge variant="outline">{t.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
