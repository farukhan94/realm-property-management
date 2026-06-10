export type DepositStatus = "held" | "partial_refund" | "refunded" | "forfeited";

export interface DepositRecord {
  id: string;
  leaseId: string;
  unitId: string;
  tenantId: string;
  amount: number;
  status: DepositStatus;
  heldDate: string;
  refundDate?: string;
}
