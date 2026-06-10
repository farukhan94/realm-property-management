export interface UtilityAccount {
  id: string;
  leaseId: string;
  unitId: string;
  ewaAccount: string;
  monthlyCap: number;
  entityId: string;
}

export interface UtilityBill {
  id: string;
  accountId: string;
  period: string;
  amount: number;
  recovered: boolean;
  exceedsCap: boolean;
}
