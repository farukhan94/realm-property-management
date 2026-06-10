export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "partial" | "cancelled";

export interface Invoice {
  id: string;
  unitId: string;
  tenantId: string;
  leaseId: string;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  dueDate: string;
  status: InvoiceStatus;
  entityId: string;
  chequeDate?: string;
  virtualIbanRef?: string;
  paidAmount?: number;
  paidDate?: string;
}
