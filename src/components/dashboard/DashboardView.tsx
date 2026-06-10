"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Building, TrendingUp, Users, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageShell } from "@/components/layout/PageShell";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { formatCompactBhd } from "@/lib/locale/format";
import { dashboardService } from "@/lib/api/services/dashboard";
import { reportsService } from "@/lib/api/services/reports";
import { useRole } from "@/lib/role-context";
import { workOrdersService } from "@/lib/api/services/work-orders";

export function DashboardView() {
  const { role } = useRole();
  const [kpis, setKpis] = useState<Awaited<ReturnType<typeof dashboardService.getKpis>> | null>(null);
  const [metrics, setMetrics] = useState<Awaited<ReturnType<typeof reportsService.getFinancialMetrics>>>([]);
  const [tickets, setTickets] = useState<Array<{ id: string; title: string; unit: string; priority: string; author: string; submitted: string }>>([]);

  useEffect(() => {
    dashboardService.getKpis().then(setKpis);
    reportsService.getFinancialMetrics().then(setMetrics);
    workOrdersService.list().then((orders) =>
      setTickets(
        orders
          .filter((o) => o.status !== "completed")
          .slice(0, 8)
          .map((o) => ({
            id: o.id,
            title: o.title,
            unit: o.unitId ?? "—",
            priority: o.priority === "critical" ? "Critical" : o.priority === "high" ? "High" : "Medium",
            author: "Tenant",
            submitted: "recent",
          }))
      )
    );
  }, []);

  return (
    <PageShell
      title="Overview"
      description="Metrics and performance across your Bahrain portfolio."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {role !== "Tenant" && role !== "Technician" && kpis && (
          <>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Card className="cursor-default">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Properties
                      </CardTitle>
                      <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{kpis.buildingCount}</div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {kpis.totalUnits} units across Kingdom of Bahrain
                      </p>
                    </CardContent>
                  </Card>
                }
              />
              <TooltipContent>Active buildings under management for the selected entity</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Card className="cursor-default">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Portfolio Value
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCompactBhd(kpis.portfolioValue)}</div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Estimated asset value (BHD)
                      </p>
                    </CardContent>
                  </Card>
                }
              />
              <TooltipContent>Book value estimate based on unit mix and market rates</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Card className="cursor-default">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Occupancy
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{kpis.occupancy}%</div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {kpis.occupied} of {kpis.totalUnits} units occupied
                      </p>
                    </CardContent>
                  </Card>
                }
              />
              <TooltipContent>Occupied units divided by leasable inventory</TooltipContent>
            </Tooltip>
          </>
        )}
        <Card
          className={
            role === "Tenant" || role === "Technician" ? "md:col-span-2 xl:col-span-4" : ""
          }
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {role === "Tenant" ? "My Active Tickets" : "Critical Tickets"}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {role === "Tenant"
                ? tickets.filter((t) => t.author === "Tenant").length
                : tickets.filter((t) => t.priority === "Critical").length}
            </div>
            {kpis && role !== "Tenant" && role !== "Technician" && (
              <p className="mt-1 text-xs text-muted-foreground">
                Arrears: <CurrencyDisplay amount={kpis.arrears} />
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div
        className={`grid grid-cols-1 gap-6 lg:gap-8 ${
          role !== "Tenant" && role !== "Technician" ? "lg:grid-cols-3" : ""
        }`}
      >
        {role !== "Tenant" && role !== "Technician" && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Financial performance over the last 6 months (BHD)</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[280px] h-[280px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-xs text-muted-foreground"
                    tickFormatter={(value) => formatCompactBhd(value)}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                    }}
                    itemStyle={{ fontSize: "12px" }}
                    formatter={(value) => formatCompactBhd(Number(value))}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Open Tickets</CardTitle>
            <CardDescription>Maintenance operations waiting for assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets
                .filter((t) => role !== "Tenant" || t.author === "Tenant")
                .slice(0, 5)
                .map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{ticket.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {ticket.unit} • {ticket.submitted}
                      </span>
                    </div>
                    <Badge
                      variant={ticket.priority === "Critical" ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
