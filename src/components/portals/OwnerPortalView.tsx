"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, FileText, LandPlot } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { portalsService } from "@/lib/api/services/portals";
import { useRole } from "@/lib/role-context";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";
import { cn } from "@/lib/utils";
import type { ApprovalStageStatus } from "@/types/portal-extras";

type Tab = "portfolio" | "land";

function stageBadge(status: ApprovalStageStatus) {
  const variants: Record<ApprovalStageStatus, "default" | "secondary" | "destructive" | "outline"> = {
    approved: "default",
    in_review: "secondary",
    pending: "outline",
    rejected: "destructive",
  };
  return variants[status];
}

export function OwnerPortalView() {
  const { role } = useRole();
  const portalRole = role === "Building Owner" ? "Building Owner" : "Flat Owner";
  const [tab, setTab] = useState<Tab>("portfolio");
  const [data, setData] = useState<Awaited<ReturnType<typeof portalsService.getForRole>>>(null);

  useEffect(() => {
    portalsService.getForRole(portalRole).then(setData);
  }, [portalRole]);

  if (!data || !("units" in data)) {
    return <PageShell title="Owner Portal" description="Loading…"><p className="text-muted-foreground">Loading…</p></PageShell>;
  }

  const occupied = data.units.filter((u) => u.tenancyHistory.some((t) => !t.endDate)).length;

  return (
    <PageShell
      title="Owner Portal"
      description={data.isBuildingOwner ? "Building owner — full tower portfolio" : "Flat owner — units across buildings"}
      actions={<Button variant="outline" size="sm" render={<Link href="/" />}>Dashboard</Button>}
    >
      <div className="mb-4 flex gap-2">
        <Button variant={tab === "portfolio" ? "default" : "outline"} size="sm" onClick={() => setTab("portfolio")}>
          <Building2 className="mr-1 h-4 w-4" /> Ready Units
        </Button>
        <Button variant={tab === "land" ? "default" : "outline"} size="sm" onClick={() => setTab("land")}>
          <LandPlot className="mr-1 h-4 w-4" /> Land Approvals
        </Button>
      </div>

      {tab === "portfolio" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Owned Units</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.units.length}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Occupied</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{occupied}</div></CardContent>
            </Card>
            {data.isBuildingOwner && "buildings" in data && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Buildings</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{data.buildings.length}</div></CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader><CardTitle>Units</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm space-y-1">
                {data.units.map((u) => (
                  <li key={u.id}>{u.label} — {u.buildingId} {u.tenancyHistory.some((t) => !t.endDate) ? "(Occupied)" : "(Vacant)"}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Settlements</CardTitle></CardHeader>
            <CardContent>
              <DataTable
                {...FULL_TABLE}
                data={data.settlements}
                searchKeys={["unitLabel"]}
                defaultSort={fullTableSort("unitLabel")}
                columns={[
                  { key: "unitLabel", header: "Unit", sortable: true, cell: (r) => r.unitLabel },
                  { key: "netPayable", header: "Net payable", sortable: true, cell: (r) => <CurrencyDisplay amount={r.netPayable} />, className: "text-right" },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Payouts</CardTitle></CardHeader>
            <CardContent>
              <DataTable
                {...FULL_TABLE}
                data={data.payouts}
                searchKeys={["id"]}
                defaultSort={fullTableSort("processedDate", "desc")}
                columns={[
                  { key: "id", header: "Batch", sortable: true, cell: (r) => r.id },
                  { key: "amount", header: "Amount", sortable: true, cell: (r) => <CurrencyDisplay amount={r.amount} />, className: "text-right" },
                  { key: "processedDate", header: "Date", sortable: true, cell: (r) => r.processedDate },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "land" && (
        <div className="space-y-6">
          {"landProjects" in data && data.landProjects.length > 0 ? data.landProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {project.plotReference}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{project.location}</p>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-0">
                  {project.stages.map((stage, idx) => (
                    <div key={stage.id} className="flex gap-4 pb-6 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                          stage.status === "approved" ? "bg-primary text-primary-foreground" :
                          stage.status === "in_review" ? "bg-primary/20 text-primary" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {stage.stage}
                        </div>
                        {idx < project.stages.length - 1 && <div className="w-px flex-1 bg-border" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{stage.title}</p>
                          <Badge variant={stageBadge(stage.status)}>{stage.status.replace("_", " ")}</Badge>
                        </div>
                        {stage.reviewer && <p className="text-xs text-muted-foreground">Reviewer: {stage.reviewer}</p>}
                        {stage.submittedDate && <p className="text-xs text-muted-foreground">Submitted: {stage.submittedDate}</p>}
                        {stage.comments && <p className="mt-1 text-sm text-muted-foreground">{stage.comments}</p>}
                        {stage.status === "pending" && (
                          <Button size="sm" variant="outline" className="mt-2">Submit Documents</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No land development projects on file. Contact MANZIL to register a new plot.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </PageShell>
  );
}
