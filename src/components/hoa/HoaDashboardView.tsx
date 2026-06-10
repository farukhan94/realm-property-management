"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { hoaService } from "@/lib/api/services/hoa";
import { useEntity } from "@/lib/entity-context";

export function HoaDashboardView() {
  const { entityId } = useEntity();
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof hoaService.getSummary>> | null>(null);

  useEffect(() => {
    hoaService.getSummary(entityId).then(setSummary);
  }, [entityId]);

  if (!summary) {
    return (
      <PageShell title="HOA Management" description="Loading...">
        <p className="text-muted-foreground">Loading HOA data...</p>
      </PageShell>
    );
  }

  const renderTable = (
    rows: Array<{
      entityId: string;
      building: string;
      collected: number;
      arrears: number;
      fund: string;
    }>
  ) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Community</TableHead>
            <TableHead>Fund</TableHead>
            <TableHead>Collected</TableHead>
            <TableHead>Arrears</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`${row.entityId}-${row.fund}`}>
              <TableCell className="font-medium">{row.building}</TableCell>
              <TableCell>{row.fund}</TableCell>
              <TableCell>
                <CurrencyDisplay amount={row.collected} />
              </TableCell>
              <TableCell className="text-destructive">
                <CurrencyDisplay amount={row.arrears} />
              </TableCell>
              <TableCell className="text-right">
                <Badge variant={row.arrears === 0 ? "default" : "destructive"}>
                  {row.arrears === 0 ? "Current" : "Attention"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <PageShell
      title="HOA Management"
      description="Service charges, segregated funds, and per-HOA financials."
    >
<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Managed communities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.activeHoas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Collected (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={summary.totalCollected} className="text-3xl font-bold text-revenue" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding Arrears
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={summary.totalArrears} className="text-3xl font-bold text-destructive" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service charge summary</CardTitle>
          <CardDescription>
            Operating and reserve funds by community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="operating">
            <TabsList>
              <TabsTrigger value="operating">Operating fund</TabsTrigger>
              <TabsTrigger value="reserve">Reserve fund</TabsTrigger>
            </TabsList>
            <TabsContent value="operating" className="mt-4">
              {renderTable(summary.operating)}
            </TabsContent>
            <TabsContent value="reserve" className="mt-4">
              {summary.reserve.length > 0 ? (
                renderTable(summary.reserve)
              ) : (
                <p className="text-sm text-muted-foreground">No reserve fund records for selected entity.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageShell>
  );
}
