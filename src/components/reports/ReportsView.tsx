"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { reportsService } from "@/lib/api/services/reports";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";

export function ReportsView() {
  const [propertyPnl, setPropertyPnl] = useState<Awaited<ReturnType<typeof reportsService.getPropertyPnl>> | null>(null);
  const [facilityPnl, setFacilityPnl] = useState<Awaited<ReturnType<typeof reportsService.getFacilityPnl>> | null>(null);
  const [hoa, setHoa] = useState<Awaited<ReturnType<typeof reportsService.getHoaSummary>> | null>(null);
  const [occupancy, setOccupancy] = useState<Awaited<ReturnType<typeof reportsService.getOccupancyByBuilding>>>([]);
  const [arrears, setArrears] = useState<Awaited<ReturnType<typeof reportsService.getArrearsAging>> | null>(null);

  useEffect(() => {
    reportsService.getPropertyPnl().then(setPropertyPnl);
    reportsService.getFacilityPnl().then(setFacilityPnl);
    reportsService.getHoaSummary().then(setHoa);
    reportsService.getOccupancyByBuilding().then(setOccupancy);
    reportsService.getArrearsAging().then(setArrears);
  }, []);

  return (
    <PageShell title="Reports" description="Per-service-line P&L, occupancy, and arrears aging (BHD).">
      <div className="grid gap-4 md:grid-cols-3">
        {propertyPnl && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Property P&L</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>Rent: <CurrencyDisplay amount={propertyPnl.rent} /></p>
              <p>Fees: <CurrencyDisplay amount={propertyPnl.fees} /></p>
              <p className="font-semibold">Net: <CurrencyDisplay amount={propertyPnl.net} /></p>
              <p className="text-muted-foreground">{propertyPnl.vacancies} vacant units</p>
            </CardContent>
          </Card>
        )}
        {facilityPnl && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Facility P&L</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>Revenue: <CurrencyDisplay amount={facilityPnl.revenue} /></p>
              <p>Cost: <CurrencyDisplay amount={facilityPnl.cost} /></p>
              <p className="font-semibold">Profit: <CurrencyDisplay amount={facilityPnl.profit} /></p>
              <p className="text-muted-foreground">{facilityPnl.jobCount} jobs</p>
            </CardContent>
          </Card>
        )}
        {hoa && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">HOA funds</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>Collected: <CurrencyDisplay amount={hoa.collected} /></p>
              <p>Arrears: <CurrencyDisplay amount={hoa.arrears} /></p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>Occupancy by building</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            {...FULL_TABLE}
            data={occupancy}
            searchKeys={["name"]}
            defaultSort={fullTableSort("name")}
            columns={[
              { key: "name", header: "Building", sortable: true, cell: (r) => r.name },
              { key: "units", header: "Units", sortable: true, cell: (r) => r.units, className: "text-right" },
              { key: "occupancy", header: "Occupancy %", sortable: true, filterValue: (r) => `${r.occupancy}%`, cell: (r) => `${r.occupancy}%`, className: "text-right" },
            ]}
          />
        </CardContent>
      </Card>

      {arrears && (
        <Card>
          <CardHeader><CardTitle>Arrears aging</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4 font-semibold">Total: <CurrencyDisplay amount={arrears.total} /></p>
            <DataTable
              {...FULL_TABLE}
              data={arrears.buckets.map((b, i) => ({ id: String(i), ...b }))}
              searchKeys={["label"]}
              defaultSort={fullTableSort("label")}
              columns={[
                { key: "label", header: "Bucket", sortable: true, cell: (r) => r.label },
                { key: "amount", header: "Amount", sortable: true, cell: (r) => <CurrencyDisplay amount={r.amount} />, className: "text-right" },
              ]}
            />
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
