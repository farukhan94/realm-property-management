export type PayoutStatus = "pending" | "processed" | "failed";

export interface Payout {
  id: string;
  ownerId: string;
  amount: number;
  status: PayoutStatus;
  iban: string;
  reference: string;
  processedDate: string;
  entityId: string;
  unitIds: string[];
}
