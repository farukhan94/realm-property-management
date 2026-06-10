export type LeaseStatus = "draft" | "active" | "renewed" | "terminated" | "expired";

export interface Lease {
  id: string;
  unitId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  status: LeaseStatus;
  entityId: string;
  escalationPercent?: number;
  vatInclusive?: boolean;
  ramadanAdjustment?: boolean;
  ewaAccount?: string;
}

export interface CreateLeaseInput {
  unitId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  entityId: string;
}
