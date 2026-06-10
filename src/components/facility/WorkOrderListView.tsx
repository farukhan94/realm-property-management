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
import { workOrdersService } from "@/lib/api/services/work-orders";
import { useEntity } from "@/lib/entity-context";
import type { WorkOrder } from "@/types/work-order";
import { WorkOrderCreateSheet } from "./WorkOrderCreateSheet";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

interface WorkOrderRow extends WorkOrder {
  unitLabel: string;
  technicianName: string | null;
  totalCost: number;
  totalRevenue: number;
  profit: number;
}

export function WorkOrderListView() {
  const router = useRouter();
  const { entityId } = useEntity();
  const [orders, setOrders] = useState<WorkOrderRow[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(() => {
    workOrdersService.list(entityId).then(setOrders);
  }, [entityId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCancel() {
    if (!cancelId) return;
    setCancelling(true);
    await workOrdersService.updateStatus(cancelId, "cancelled");
    setCancelling(false);
    setCancelId(null);
    load();
  }

  async function markComplete(id: string) {
    await workOrdersService.updateStatus(id, "completed");
    load();
  }

  return (
    <PageShell
      title="Work orders"
      description="Facility requests, assignment, and job costing."
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          New work order
        </Button>
      }
    >
<Card>
        <CardHeader>
          <CardTitle>All work orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={orders}
            searchPlaceholder="Search ID, title, or unit…"
            searchKeys={["id", "title", "unitLabel", "technicianName"]}
            defaultSort={fullTableSort("createdAt", "desc")}
            columns={[
              {
                key: "id",
                header: "ID",
                sortable: true,
                cell: (r) => (
                  <Link href={`/facility/work-orders/${r.id}`} className="font-mono text-primary hover:underline">
                    {r.id}
                  </Link>
                ),
              },
              { key: "title", header: "Title", sortable: true, cell: (r) => r.title },
              { key: "unitLabel", header: "Unit", sortable: true, cell: (r) => r.unitLabel },
              { key: "status", header: "Status", sortable: true, filterKey: "status", filterValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
              { key: "priority", header: "Priority", sortable: true, filterKey: "priority", filterValue: (r) => r.priority, cell: (r) => <StatusBadge status={r.priority} /> },
              {
                key: "profit",
                header: "P&L",
                sortable: true,
                className: "text-right",
                cell: (r) => <CurrencyDisplay amount={r.profit} />,
              },
            ]}
            actions={[
              {
                label: "View details",
                href: (r) => `/facility/work-orders/${r.id}`,
              },
              {
                label: "Assign",
                hidden: (r) => r.status !== "new",
                onClick: (r) => router.push(`/facility/work-orders/${r.id}?action=assign`),
              },
              {
                label: "Mark complete",
                hidden: (r) => r.status === "completed" || r.status === "cancelled",
                onClick: (r) => markComplete(r.id),
              },
              {
                label: "Cancel",
                variant: "destructive",
                hidden: (r) => r.status === "completed" || r.status === "cancelled",
                onClick: (r) => setCancelId(r.id),
              },
            ]}
          />
        </CardContent>
      </Card>

      <WorkOrderCreateSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={(id) => {
          load();
          router.push(`/facility/work-orders/${id}`);
        }}
      />

      <ConfirmDialog
        open={cancelId !== null}
        onOpenChange={(open) => !open && setCancelId(null)}
        title="Cancel work order"
        description="This will mark the work order as cancelled. Open tasks will be closed."
        confirmLabel="Cancel work order"
        variant="destructive"
        loading={cancelling}
        onConfirm={handleCancel}
      />
    </PageShell>
  );
}
