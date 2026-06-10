export interface SettlementLine {
  id: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
}

export interface OwnerSettlement {
  id: string;
  ownerId: string;
  unitId: string;
  periodStart: string;
  periodEnd: string;
  grossRent: number;
  managementFeePercent: number;
  managementFee: number;
  utilityDeductions: number;
  otherDeductions: number;
  netPayable: number;
  lines: SettlementLine[];
  entityId: string;
}
