import { mockStore } from "@/lib/mock/store";
import { getPersonName } from "@/lib/mock/seeds";

export const mockDepositsAdapter = {
  list() {
    return mockStore.deposits.map((d) => ({
      ...d,
      tenantName: getPersonName(d.tenantId),
    }));
  },

  getByLease(leaseId: string) {
    return mockStore.deposits.find((d) => d.leaseId === leaseId) ?? null;
  },
};
