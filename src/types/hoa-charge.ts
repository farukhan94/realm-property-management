export interface ApportionmentRule {
  id: string;
  hoaId: string;
  unitId: string;
  areaSqm: number;
  sharePercent: number;
}

export interface ServiceChargeInvoice {
  id: string;
  hoaId: string;
  unitId: string;
  ownerId: string;
  period: string;
  amount: number;
  fund: "operating" | "reserve";
  status: "sent" | "paid" | "overdue";
}
