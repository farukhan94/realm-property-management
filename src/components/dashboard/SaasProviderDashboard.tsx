"use client";

import { useEffect, useState } from "react";
import { Building2, TrendingUp, Users, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageShell } from "@/components/layout/PageShell";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { dashboardService } from "@/lib/api/services/dashboard";
import { DashboardWidget, MetricRow } from "./DashboardWidget";
import { FULL_TABLE } from "@/lib/data-table/full-table";

export function SaasProviderDashboard() {
  const [metrics, setMetrics] = useState<Awaited<ReturnType<typeof dashboardService.getPlatformMetrics>> | null>(null);
  const [customers, setCustomers] = useState<Awaited<ReturnType<typeof dashboardService.getSaasCustomers>>>([]);
  const [chart, setChart] = useState<Awaited<ReturnType<typeof dashboardService.getSubscriptionChart>>>([]);

  useEffect(() => {
    dashboardService.getPlatformMetrics().then(setMetrics);
    dashboardService.getSaasCustomers().then(setCustomers);
    dashboardService.getSubscriptionChart().then(setChart);
  }, []);

  if (!metrics) return <PageShell title="Platform Dashboard" description="Loading…"><p className="text-muted-foreground">Loading…</p></PageShell>;

  return (
    <PageShell title="MANZIL Platform" description="SaaS provider overview — subscriptions and platform health">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardWidget title="MRR" icon={TrendingUp}>
          <div className="text-2xl font-bold"><CurrencyDisplay amount={metrics.mrr} /></div>
          <MetricRow label="ARR" value={<CurrencyDisplay amount={metrics.arr} />} highlight />
        </DashboardWidget>
        <DashboardWidget title="Active Companies" icon={Building2}>
          <div className="text-2xl font-bold">{metrics.activeCompanies}</div>
        </DashboardWidget>
        <DashboardWidget title="Total Users" icon={Users}>
          <div className="text-2xl font-bold">{metrics.totalUsers}</div>
        </DashboardWidget>
        <DashboardWidget title="API Calls Today" icon={Zap}>
          <div className="text-2xl font-bold">{metrics.apiCallsToday.toLocaleString()}</div>
          <MetricRow label="Churn rate" value={`${metrics.churnRate}%`} />
        </DashboardWidget>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DashboardWidget title="MRR Growth">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="mrr" stroke="var(--primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardWidget>

        <DashboardWidget title="Customer Companies">
          <DataTable
            {...FULL_TABLE}
            data={customers}
            searchKeys={["name"]}
            columns={[
              { key: "name", header: "Company", sortable: true, cell: (r) => r.name },
              { key: "plan", header: "Plan", sortable: true, cell: (r) => <Badge variant="outline">{r.plan}</Badge> },
              { key: "monthlyRevenue", header: "MRR", sortable: true, cell: (r) => <CurrencyDisplay amount={r.monthlyRevenue} />, className: "text-right" },
              { key: "activeUsers", header: "Users", sortable: true, cell: (r) => r.activeUsers, className: "text-right" },
              { key: "status", header: "Status", sortable: true, cell: (r) => <Badge variant={r.status === "active" ? "default" : "secondary"}>{r.status}</Badge> },
            ]}
          />
        </DashboardWidget>
      </div>
    </PageShell>
  );
}
