"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { documentsService } from "@/lib/api/services/documents";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";
import { useEntity } from "@/lib/entity-context";

export function DocumentsView() {
  const { entityId } = useEntity();
  const [docs, setDocs] = useState<Awaited<ReturnType<typeof documentsService.list>>>([]);

  useEffect(() => {
    documentsService.list({ entityId }).then(setDocs);
  }, [entityId]);

  return (
    <PageShell title="Documents" description="Leases, title deeds, board packs — filterable library.">
      <Card>
        <CardHeader><CardTitle>Document library</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={docs}
            searchKeys={["name", "type", "unitId", "hoaId"]}
            defaultSort={fullTableSort("date", "desc")}
            columns={[
              { key: "name", header: "Name", sortable: true, cell: (r) => r.name },
              { key: "type", header: "Type", sortable: true, filterKey: "type", filterValue: (r) => r.type, cell: (r) => <Badge variant="outline">{r.type}</Badge> },
              { key: "unitId", header: "Unit", sortable: true, filterValue: (r) => r.unitId ?? "—", cell: (r) => r.unitId ?? "—" },
              { key: "hoaId", header: "HOA", sortable: true, filterValue: (r) => r.hoaId ?? "—", cell: (r) => r.hoaId ?? "—" },
              { key: "visibility", header: "Visibility", sortable: true, filterValue: (r) => r.visibility.join(", "), cell: (r) => r.visibility.join(", ") },
              { key: "date", header: "Uploaded", sortable: true, cell: (r) => r.date },
            ]}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
