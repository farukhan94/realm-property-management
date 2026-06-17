"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { guestbookService } from "@/lib/api/services/guestbook";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";
import type { GuestbookEntry } from "@/types/guestbook";

export function GuestbookView() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    visitorName: "",
    idNumber: "",
    purpose: "",
    hostUnitId: "",
    hostName: "",
    buildingId: "B-101",
    checkInTime: new Date().toISOString(),
    vehiclePlate: "",
  });

  const load = () => guestbookService.list().then(setEntries);

  useEffect(() => { load(); }, []);

  const handleCheckIn = async () => {
    await guestbookService.checkIn({
      visitorName: form.visitorName,
      idNumber: form.idNumber,
      purpose: form.purpose,
      hostUnitId: form.hostUnitId,
      hostName: form.hostName,
      buildingId: form.buildingId,
      checkInTime: new Date().toISOString(),
      vehiclePlate: form.vehiclePlate || undefined,
    });
    setShowForm(false);
    setForm({ visitorName: "", idNumber: "", purpose: "", hostUnitId: "", hostName: "", buildingId: "B-101", checkInTime: new Date().toISOString(), vehiclePlate: "" });
    load();
  };

  const handleCheckOut = async (id: string) => {
    await guestbookService.checkOut(id);
    load();
  };

  const activeCount = entries.filter((e) => e.status === "checked_in").length;

  return (
    <PageShell title="GuestBook" description="Visitor check-in and check-out log">
      <div className="mb-4 flex items-center justify-between">
        <Badge variant="outline">{activeCount} visitors on-site</Badge>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Check In Visitor"}</Button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardHeader><CardTitle>New Visitor</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Visitor name" value={form.visitorName} onChange={(e) => setForm({ ...form, visitorName: e.target.value })} />
            <Input placeholder="CPR / ID number" value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} />
            <Input placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
            <Input placeholder="Host unit ID" value={form.hostUnitId} onChange={(e) => setForm({ ...form, hostUnitId: e.target.value })} />
            <Input placeholder="Host name" value={form.hostName} onChange={(e) => setForm({ ...form, hostName: e.target.value })} />
            <Input placeholder="Vehicle plate (optional)" value={form.vehiclePlate} onChange={(e) => setForm({ ...form, vehiclePlate: e.target.value })} />
            <Button className="md:col-span-2" onClick={handleCheckIn}>Check In</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Visitor Log</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={entries}
            searchKeys={["visitorName", "hostName", "purpose"]}
            defaultSort={fullTableSort("checkInTime", "desc")}
            columns={[
              { key: "visitorName", header: "Visitor", sortable: true, cell: (r) => r.visitorName },
              { key: "idNumber", header: "ID", cell: (r) => r.idNumber },
              { key: "purpose", header: "Purpose", sortable: true, cell: (r) => r.purpose },
              { key: "hostUnitId", header: "Unit", cell: (r) => r.hostUnitId },
              { key: "checkInTime", header: "Check In", sortable: true, cell: (r) => new Date(r.checkInTime).toLocaleString() },
              { key: "status", header: "Status", sortable: true, filterKey: "status", filterValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
            ]}
            actions={[
              { label: "Check Out", onClick: (r) => { if (r.status === "checked_in") void handleCheckOut(r.id); }, hidden: (r) => r.status !== "checked_in" },
            ]}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
