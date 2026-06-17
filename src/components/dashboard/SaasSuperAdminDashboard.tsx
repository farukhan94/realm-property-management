"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Banknote,
  Building2,
  ClipboardCheck,
  FileText,
  Home,
  Receipt,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { Badge } from "@/components/ui/badge";
import { dashboardService } from "@/lib/api/services/dashboard";
import { DashboardWidget, MetricRow } from "./DashboardWidget";

export function SaasSuperAdminDashboard() {
  const [metrics, setMetrics] = useState<Awaited<ReturnType<typeof dashboardService.getWidgetMetrics>> | null>(null);
  const [activities, setActivities] = useState<Awaited<ReturnType<typeof dashboardService.getActivities>>>([]);

  useEffect(() => {
    dashboardService.getWidgetMetrics().then(setMetrics);
    dashboardService.getActivities().then(setActivities);
  }, []);

  if (!metrics) {
    return <PageShell title="Dashboard" description="Loading portfolio overview…"><p className="text-muted-foreground">Loading…</p></PageShell>;
  }

  return (
    <PageShell title="Portfolio Dashboard" description="Real-time overview of your MANZIL portfolio — Bahrain">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <DashboardWidget title="Rent Arrears" icon={AlertCircle}>
          <div className="text-2xl font-bold">{metrics.rentArrears.tenantCount}</div>
          <p className="text-xs text-muted-foreground">tenants in arrears</p>
          <MetricRow label="Total owing" value={<CurrencyDisplay amount={metrics.rentArrears.totalOwing} />} highlight />
          <MetricRow label="Avg days overdue" value={`${metrics.rentArrears.avgDaysOverdue}d`} />
        </DashboardWidget>

        <DashboardWidget title="Trust Reconciliation" icon={ShieldCheck}>
          <Badge variant={metrics.trustReconciliation.status === "in_balance" ? "default" : "destructive"}>
            {metrics.trustReconciliation.status === "in_balance" ? "In Balance" : "Out of Balance"}
          </Badge>
          <MetricRow label="Trust balance" value={<CurrencyDisplay amount={metrics.trustReconciliation.trustBalance} />} highlight />
          <MetricRow label="Last reconciled" value={metrics.trustReconciliation.lastReconciled} />
        </DashboardWidget>

        <DashboardWidget title="Maintenance Jobs" icon={Wrench}>
          <MetricRow label="Reported" value={metrics.maintenanceJobs.reported} />
          <MetricRow label="Approved" value={metrics.maintenanceJobs.approved} />
          <MetricRow label="Assigned" value={metrics.maintenanceJobs.assigned} highlight />
          <MetricRow label="In progress" value={metrics.maintenanceJobs.inProgress} />
        </DashboardWidget>

        <DashboardWidget title="Supplier Bills" icon={Receipt}>
          <div className="text-2xl font-bold text-destructive">{metrics.supplierBills.overdueCount}</div>
          <p className="text-xs text-muted-foreground">overdue bills</p>
          <MetricRow label="Total amount" value={<CurrencyDisplay amount={metrics.supplierBills.totalAmount} />} highlight />
          <MetricRow label="Avg days overdue" value={`${metrics.supplierBills.avgDaysOverdue}d`} />
        </DashboardWidget>

        <DashboardWidget title="Property Vacancies" icon={Home}>
          <div className="text-2xl font-bold">{metrics.vacancies.vacantCount}</div>
          <p className="text-xs text-muted-foreground">vacant units</p>
          <MetricRow label="Vacancy rate" value={`${metrics.vacancies.vacancyRate}%`} highlight />
          <MetricRow label="Avg days vacant" value={`${metrics.vacancies.avgDaysVacant}d`} />
        </DashboardWidget>

        <DashboardWidget title="Invoice Arrears" icon={FileText}>
          <MetricRow label="Tenants" value={metrics.invoiceArrears.tenantCount} />
          <MetricRow label="Total amount" value={<CurrencyDisplay amount={metrics.invoiceArrears.totalAmount} />} highlight />
          <MetricRow label="Avg days overdue" value={`${metrics.invoiceArrears.avgDaysOverdue}d`} />
        </DashboardWidget>

        <DashboardWidget title="Lease Renewals" icon={ClipboardCheck}>
          <MetricRow label="Pending" value={metrics.leaseRenewals.pending} />
          <MetricRow label="Expiring (90d)" value={metrics.leaseRenewals.expiring} highlight />
          <MetricRow label="Renewed" value={metrics.leaseRenewals.renewed} />
        </DashboardWidget>

        <DashboardWidget title="Inspections" icon={Building2}>
          <MetricRow label="Scheduled" value={metrics.inspections.scheduled} />
          <MetricRow label="Completed" value={metrics.inspections.completed} />
          <MetricRow label="Overdue" value={metrics.inspections.overdue} highlight />
        </DashboardWidget>

        <DashboardWidget title="Agent Fees" icon={Banknote}>
          <div className="text-2xl font-bold"><CurrencyDisplay amount={metrics.agentFees.totalThisMonth} /></div>
          <p className="text-xs text-muted-foreground">collected this month</p>
          <MetricRow label="Last month" value={<CurrencyDisplay amount={metrics.agentFees.lastMonth} />} />
        </DashboardWidget>
      </div>

      <DashboardWidget title="Activity Panel" className="mt-4">
        <div className="grid gap-4 md:grid-cols-3">
          {(["due", "up_next", "past"] as const).map((bucket) => (
            <div key={bucket}>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {bucket === "due" ? "Due" : bucket === "up_next" ? "Up Next" : "Past"}
              </h4>
              <div className="space-y-2">
                {activities.filter((a) => a.bucket === bucket).map((act) => (
                  <div key={act.id} className="rounded-md border border-border p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">{act.type}</Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {act.daysUntilDue === 0 ? "Today" : act.daysUntilDue > 0 ? `+${act.daysUntilDue}d` : `${act.daysUntilDue}d`}
                      </span>
                    </div>
                    <p className="mt-1 font-medium">{act.title}</p>
                    {act.assignee && <p className="text-xs text-muted-foreground">{act.assignee}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DashboardWidget>
    </PageShell>
  );
}
