"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UnitQuickPreviewProps {
  unitId: string;
  label: string;
  buildingName: string;
  ownershipCount: number;
  tenancyCount: number;
}

export function UnitQuickPreview({
  unitId,
  label,
  buildingName,
  ownershipCount,
  tenancyCount,
}: UnitQuickPreviewProps) {
  return (
    <Popover>
      <PopoverTrigger className="font-medium text-primary hover:underline">
        {unitId}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <PopoverHeader>
          <PopoverTitle>{label}</PopoverTitle>
          <PopoverDescription>{buildingName}</PopoverDescription>
        </PopoverHeader>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>{ownershipCount} ownership records</p>
          <p>{tenancyCount} tenancy records</p>
        </div>
        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="outline" render={<Link href={`/portfolio/units/${unitId}`} />}>
            View unit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            render={<Link href={`/portfolio/units/${unitId}?tab=timeline`} />}
          >
            Timeline
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
