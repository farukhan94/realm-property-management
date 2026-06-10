"use client";

import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlaceholderPageProps {
  title: string;
  description: string;
  module: string;
  features?: string[];
}

export function PlaceholderPage({
  title,
  description,
  module,
  features = [],
}: PlaceholderPageProps) {
  return (
    <PageShell title={title} description={description}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-2">
            <Badge>{module}</Badge>
            <span className="text-sm text-muted-foreground">
              Module scaffold ready
            </span>
          </div>
          {features.length > 0 && (
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
