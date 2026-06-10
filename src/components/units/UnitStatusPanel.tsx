"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerField } from "@/components/shared/DatePickerField";
import { unitsService } from "@/lib/api/services/units";

interface UnitStatusPanelProps {
  unitId: string;
}

export function UnitStatusPanel({ unitId }: UnitStatusPanelProps) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<{
    ownerName: string | null;
    tenantName: string | null;
    isManaged: boolean;
    managingEntityId: string | null;
  } | null>(null);

  useEffect(() => {
    unitsService.getUnitStatusAtDate(unitId, date).then(setStatus);
  }, [unitId, date]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Status as of date</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DatePickerField label="Select date" value={date} onChange={setDate} />
        {status && (
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Owner</dt>
              <dd className="font-medium">{status.ownerName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Occupant</dt>
              <dd className="font-medium">{status.tenantName ?? "Vacant"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Under management</dt>
              <dd className="font-medium">{status.isManaged ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Managing entity</dt>
              <dd className="font-mono text-xs">{status.managingEntityId ?? "—"}</dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  );
}
