export type ChequeStatus = "received" | "deposited" | "cleared" | "bounced" | "returned";

export interface Cheque {
  id: string;
  chequeNumber: string;
  bankName: string;
  amount: number;
  dueDate: string;
  receivedDate: string;
  status: ChequeStatus;
  tenantId: string;
  leaseId: string;
  unitId: string;
  invoiceId?: string;
  entityId: string;
  clearedDate?: string;
  bouncedDate?: string;
  bouncedReason?: string;
}

export interface CreateChequeInput {
  chequeNumber: string;
  bankName: string;
  amount: number;
  dueDate: string;
  tenantId: string;
  leaseId: string;
  unitId: string;
  entityId: string;
}
