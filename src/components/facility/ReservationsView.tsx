"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { reservationsService } from "@/lib/api/services/reservations";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";
import type { AmenityType, Reservation } from "@/types/reservation";

const AMENITY_LABELS: Record<AmenityType, string> = {
  gym: "Gym",
  pool: "Swimming Pool",
  bbq: "BBQ Area",
  party_hall: "Party Hall",
  tennis_court: "Tennis Court",
};

export function ReservationsView() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    amenity: "pool" as AmenityType,
    buildingId: "B-101",
    unitId: "U-1001",
    requestedBy: "Alice Cooper",
    date: "",
    startTime: "10:00",
    endTime: "12:00",
    guests: 2,
    notes: "",
  });

  const load = () => reservationsService.list().then(setReservations);

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.date) return;
    await reservationsService.create(form);
    setShowForm(false);
    load();
  };

  const handleStatus = async (id: string, status: Reservation["status"]) => {
    await reservationsService.updateStatus(id, status);
    load();
  };

  return (
    <PageShell title="Reservations" description="Amenity bookings — gym, pool, BBQ, party hall">
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "New Reservation"}</Button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardHeader><CardTitle>Book Amenity</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <select className="rounded-md border border-input px-3 py-2 text-sm" value={form.amenity} onChange={(e) => setForm({ ...form, amenity: e.target.value as AmenityType })} title="Amenity">
              {Object.entries(AMENITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            <Input type="number" placeholder="Guests" value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} />
            <Input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <Button className="md:col-span-2" onClick={handleCreate}>Submit Request</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>All Reservations</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={reservations}
            searchKeys={["requestedBy", "amenity"]}
            defaultSort={fullTableSort("date", "desc")}
            columns={[
              { key: "amenity", header: "Amenity", sortable: true, cell: (r) => AMENITY_LABELS[r.amenity] },
              { key: "requestedBy", header: "Requested By", sortable: true, cell: (r) => r.requestedBy },
              { key: "date", header: "Date", sortable: true, cell: (r) => r.date },
              { key: "startTime", header: "Time", cell: (r) => `${r.startTime}–${r.endTime}` },
              { key: "guests", header: "Guests", cell: (r) => r.guests, className: "text-right" },
              { key: "status", header: "Status", sortable: true, filterKey: "status", filterValue: (r) => r.status, cell: (r) => (
                <Badge variant={r.status === "approved" ? "default" : r.status === "pending" ? "secondary" : "outline"}>{r.status}</Badge>
              ) },
            ]}
            actions={[
              { label: "Approve", onClick: (r) => { if (r.status === "pending") void handleStatus(r.id, "approved"); }, hidden: (r) => r.status !== "pending" },
              { label: "Reject", onClick: (r) => { if (r.status === "pending") void handleStatus(r.id, "rejected"); }, hidden: (r) => r.status !== "pending" },
              { label: "Cancel", onClick: (r) => { if (r.status === "approved") void handleStatus(r.id, "cancelled"); }, hidden: (r) => r.status !== "approved" },
            ]}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
