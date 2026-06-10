export interface DatedRecord {
  startDate: string;
  endDate: string | null;
}

export interface OwnershipRecord extends DatedRecord {
  ownerId: string;
}

export interface TenancyRecord extends DatedRecord {
  tenantId: string;
  leaseId?: string;
}

export interface ManagementPeriod extends DatedRecord {
  managed: boolean;
  entityId: string;
}

export interface Unit {
  id: string;
  buildingId: string;
  label: string;
  ownershipHistory: OwnershipRecord[];
  tenancyHistory: TenancyRecord[];
  managementPeriods: ManagementPeriod[];
}

export interface UnitStatusAtDate {
  date: string;
  ownerId: string | null;
  tenantId: string | null;
  isManaged: boolean;
  managingEntityId: string | null;
}
