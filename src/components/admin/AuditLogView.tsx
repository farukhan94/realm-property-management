"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { auditService } from "@/lib/api/services/audit";
import { Download } from "lucide-react";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function AuditLogView() {
  const [entries, setEntries] = useState<Awaited<ReturnType<typeof auditService.list>>>([]);

  useEffect(() => {
    auditService.list(50).then(setEntries);
  }, []);

  async function handleExport() {
    const csv = await auditService.exportCsv();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-log.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PageShell
      title="Audit log"
      description="Immutable trail of financial mutations."
      actions={
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      }
    >
      <Card>
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={entries}
            searchKeys={["actor", "action", "entityType", "entityId", "details"]}
            defaultSort={fullTableSort("timestamp", "desc")}
            columns={[
              { key: "timestamp", header: "Timestamp", sortable: true, filterValue: (r) => new Date(r.timestamp).toLocaleString("en-BH"), cell: (r) => new Date(r.timestamp).toLocaleString("en-BH") },
              { key: "actor", header: "Actor", sortable: true, cell: (r) => r.actor },
              { key: "action", header: "Action", sortable: true, cell: (r) => <span className="font-mono text-xs">{r.action}</span> },
              { key: "entityType", header: "Entity", sortable: true, filterValue: (r) => `${r.entityType}:${r.entityId}`, cell: (r) => `${r.entityType}:${r.entityId}` },
              { key: "details", header: "Details", sortable: true, cell: (r) => r.details },
              { key: "amount", header: "Amount", sortable: true, sortValue: (r) => r.amount ?? 0, filterValue: (r) => (r.amount != null ? String(r.amount) : "—"), cell: (r) => r.amount != null ? <CurrencyDisplay amount={r.amount} /> : "—", className: "text-right" },
            ]}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
