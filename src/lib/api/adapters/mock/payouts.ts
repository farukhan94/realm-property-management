import { mockStore } from "@/lib/mock/store";
import { getPersonName } from "@/lib/mock/seeds";

export const mockPayoutsAdapter = {
  list(entityId?: string) {
    let items = mockStore.payouts;
    if (entityId) items = items.filter((p) => p.entityId === entityId);
    return items.map((p) => ({ ...p, ownerName: getPersonName(p.ownerId) }));
  },

  listByOwner(ownerId: string) {
    return mockStore.payouts.filter((p) => p.ownerId === ownerId).map((p) => ({
      ...p,
      ownerName: getPersonName(p.ownerId),
    }));
  },

  create(input: {
    ownerId: string;
    amount: number;
    iban: string;
    reference: string;
    entityId: string;
    unitIds: string[];
  }) {
    const payout = mockStore.createPayout(input);
    return { ...payout, ownerName: getPersonName(payout.ownerId) };
  },
};
