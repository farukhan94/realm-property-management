import { mockStore } from "@/lib/mock/store";
import { getPersonName, getUnit } from "@/lib/mock/seeds";
import type { OwnerSettlement } from "@/types/settlement";

export interface SettlementWithNames extends OwnerSettlement {
  ownerName: string;
  unitLabel: string;
}

function enrich(s: OwnerSettlement): SettlementWithNames {
  return {
    ...s,
    ownerName: getPersonName(s.ownerId),
    unitLabel: getUnit(s.unitId)?.label ?? s.unitId,
  };
}

export const mockSettlementsAdapter = {
  list(entityId?: string): SettlementWithNames[] {
    let items = mockStore.settlements.map(enrich);
    if (entityId) items = items.filter((s) => s.entityId === entityId);
    return items;
  },

  get(id: string): SettlementWithNames | null {
    const s = mockStore.settlements.find((x) => x.id === id);
    return s ? enrich(s) : null;
  },

  preview(feePercent: number, entityId?: string): SettlementWithNames[] {
    return mockStore.settlements.map((s) => {
      const fee = Math.round(s.grossRent * (feePercent / 100) * 1000) / 1000;
      const net = s.grossRent - fee - s.utilityDeductions - s.otherDeductions;
      return enrich({ ...s, managementFeePercent: feePercent, managementFee: fee, netPayable: net });
    }).filter((s) => !entityId || s.entityId === entityId);
  },

  consolidated(ownerId: string): SettlementWithNames[] {
    return mockStore.settlements.filter((s) => s.ownerId === ownerId).map(enrich);
  },
};
