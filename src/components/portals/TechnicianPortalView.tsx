"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { portalsService } from "@/lib/api/services/portals";

export function TechnicianPortalView() {
  const [data, setData] = useState<Awaited<ReturnType<typeof portalsService.getForRole>>>(null);

  useEffect(() => {
    portalsService.getForRole("Technician").then(setData);
  }, []);

  if (!data || !("jobs" in data)) {
    return <PageShell title="Technician portal" description="Loading..."><p className="text-muted-foreground">Loading...</p></PageShell>;
  }

  return (
    <PageShell
      title="Technician portal"
      description="Today's jobs — mobile-friendly view."
      actions={<Button variant="outline" size="sm" render={<Link href="/" />}>Dashboard</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {data.jobs.map((job) => (
          <Card key={job.id} className="touch-manipulation">
            <CardContent className="space-y-3 p-6">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <StatusBadge status={job.status} />
              </div>
              <p className="text-sm text-muted-foreground">Unit: {job.unitId ?? "Common area"}</p>
              <Badge variant={job.priority === "critical" ? "destructive" : "secondary"}>
                {job.priority}
              </Badge>
              <Button className="w-full min-h-12 text-base" render={<Link href={`/facility/work-orders/${job.id}`} />}>
                Open job
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
