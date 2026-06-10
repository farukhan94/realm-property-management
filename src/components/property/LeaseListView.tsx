"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { leasesService } from "@/lib/api/services/leases";
import { useEntity } from "@/lib/entity-context";
import type { Lease } from "@/types/lease";
import { LeaseCreateSheet } from "./LeaseCreateSheet";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

interface LeaseRow extends Lease {
  tenantName: string;
  unitLabel: string;
}

export function LeaseListView() {
  const router = useRouter();
  const { entityId } = useEntity();
  const [leases, setLeases] = useState<LeaseRow[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [terminateId, setTerminateId] = useState<string | null>(null);
  const [terminating, setTerminating] = useState(false);

  const load = useCallback(() => {
    leasesService.list(entityId).then(setLeases);
  }, [entityId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleTerminate() {
    if (!terminateId) return;
    setTerminating(true);
    await leasesService.terminate(terminateId);
    setTerminating(false);
    setTerminateId(null);
    load();
  }

  return (
    <PageShell
      title="Leases"
      description="Lease lifecycle: create, renew, terminate."
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          New lease
        </Button>
      }
    >
<Card>
        <CardHeader>
          <CardTitle>Active leases</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={leases}
            searchPlaceholder="Search lease, unit, or tenant…"
            searchKeys={["id", "unitLabel", "tenantName"]}
            defaultSort={fullTableSort("endDate")}
            columns={[
              {
                key: "id",
                header: "Lease ID",
                sortable: true,
                cell: (r) => (
                  <Link href={`/property/leases/${r.id}`} className="font-mono text-primary hover:underline">{r.id}</Link>
                ),
              },
              { key: "unitLabel", header: "Unit", sortable: true, cell: (r) => r.unitLabel },
              { key: "tenantName", header: "Tenant", sortable: true, cell: (r) => r.tenantName },
              { key: "status", header: "Status", sortable: true, filterKey: "status", filterValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
              {
                key: "monthlyRent",
                header: "Rent",
                sortable: true,
                className: "text-right",
                cell: (r) => <CurrencyDisplay amount={r.monthlyRent} />,
              },
              {
                key: "endDate",
                header: "Period",
                sortable: true,
                sortValue: (r) => r.endDate,
                cell: (r) => `${r.startDate} → ${r.endDate}`,
              },
            ]}
            actions={[
              {
                label: "View details",
                href: (r) => `/property/leases/${r.id}`,
              },
              {
                label: "Renew",
                hidden: (r) => r.status !== "active",
                onClick: (r) => router.push(`/property/leases/${r.id}?action=renew`),
              },
              {
                label: "Terminate",
                variant: "destructive",
                hidden: (r) => r.status !== "active",
                onClick: (r) => setTerminateId(r.id),
              },
            ]}
          />
        </CardContent>
      </Card>

      <LeaseCreateSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => {
          load();
        }}
      />

      <ConfirmDialog
        open={terminateId !== null}
        onOpenChange={(open) => !open && setTerminateId(null)}
        title="Terminate lease"
        description="This will mark the lease as terminated. This action should be recorded in the audit log."
        confirmLabel="Terminate"
        variant="destructive"
        loading={terminating}
        onConfirm={handleTerminate}
      />
    </PageShell>
  );
}
