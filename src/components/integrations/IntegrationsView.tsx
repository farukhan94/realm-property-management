"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { integrationsService } from "@/lib/api/services/integrations";

export function IntegrationsView() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof integrationsService.list>>>([]);

  useEffect(() => {
    integrationsService.list().then(setItems);
  }, []);

  return (
    <PageShell title="Integrations" description="Bank feeds, payment gateways, utilities, and listing portals.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{item.name}</CardTitle>
                <Badge variant={item.status === "connected" ? "default" : "secondary"}>
                  {item.status === "connected" ? "Connected (mock)" : item.status}
                </Badge>
              </div>
              <CardDescription>{item.category}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Last sync: {item.lastSync ?? "Never"}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
