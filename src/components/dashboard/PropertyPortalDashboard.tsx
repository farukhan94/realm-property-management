"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "@/lib/api/services/dashboard";

export function PropertyPortalDashboard() {
  const [listings, setListings] = useState<Awaited<ReturnType<typeof dashboardService.getVacantListings>>>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    dashboardService.getVacantListings().then(setListings);
  }, []);

  const filtered = listings.filter((l) => {
    const matchSearch = !search || l.label.toLowerCase().includes(search.toLowerCase()) || l.buildingName.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || l.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <PageShell title="Property Search" description="Browse available vacant properties across Bahrain">
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by building or unit…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} title="Filter by type">
          <option value="all">All types</option>
          <option value="Studio">Studio</option>
          <option value="1BR">1BR</option>
          <option value="2BR">2BR</option>
          <option value="3BR">3BR</option>
          <option value="Office">Office</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{listing.label}</CardTitle>
                <Badge>{listing.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{listing.buildingName}</p>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm">{listing.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold"><CurrencyDisplay amount={listing.monthlyRent} />/mo</span>
                <span className="text-xs text-muted-foreground">From {listing.availableFrom}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
