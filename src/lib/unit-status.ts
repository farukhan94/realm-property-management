import type {
  ManagementPeriod,
  OwnershipRecord,
  TenancyRecord,
  Unit,
  UnitStatusAtDate,
} from "@/types/unit";

function isActiveOnDate(
  record: { startDate: string; endDate: string | null },
  date: string
): boolean {
  const d = new Date(date).getTime();
  const start = new Date(record.startDate).getTime();
  const end = record.endDate ? new Date(record.endDate).getTime() : Infinity;
  return d >= start && d <= end;
}

function findActive<T extends { startDate: string; endDate: string | null }>(
  records: T[],
  date: string
): T | null {
  return records.find((r) => isActiveOnDate(r, date)) ?? null;
}

export function getUnitStatusAtDate(unit: Unit, date: string): UnitStatusAtDate {
  const ownership = findActive<OwnershipRecord>(unit.ownershipHistory, date);
  const tenancy = findActive<TenancyRecord>(unit.tenancyHistory, date);
  const management = findActive<ManagementPeriod>(unit.managementPeriods, date);

  return {
    date,
    ownerId: ownership?.ownerId ?? null,
    tenantId: tenancy?.tenantId ?? null,
    isManaged: management?.managed ?? false,
    managingEntityId: management?.entityId ?? null,
  };
}
