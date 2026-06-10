import { mockStore } from "@/lib/mock/store";
import { getUnit } from "@/lib/mock/seeds";

export const mockUtilitiesAdapter = {
  listAccounts(entityId?: string) {
    let accounts = mockStore.utilityAccounts;
    if (entityId) accounts = accounts.filter((a) => a.entityId === entityId);
    return accounts.map((a) => ({
      ...a,
      unitLabel: getUnit(a.unitId)?.label ?? a.unitId,
      bills: mockStore.utilityBills.filter((b) => b.accountId === a.id),
    }));
  },

  getAlerts() {
    return mockStore.utilityBills.filter((b) => b.exceedsCap);
  },

  logBill(accountId: string, period: string, amount: number) {
    return mockStore.logUtilityBill(accountId, period, amount);
  },
};
