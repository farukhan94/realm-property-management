import { mockStore } from "@/lib/mock/store";
import { getPersonName, getUnit } from "@/lib/mock/seeds";
import type { Cheque, CreateChequeInput, ChequeStatus } from "@/types/cheque";

export interface ChequeWithNames extends Cheque {
  tenantName: string;
  unitLabel: string;
}

function enrich(cheque: Cheque): ChequeWithNames {
  const unit = getUnit(cheque.unitId);
  return {
    ...cheque,
    tenantName: getPersonName(cheque.tenantId),
    unitLabel: unit?.label ?? cheque.unitId,
  };
}

export const mockChequesAdapter = {
  list(entityId?: string): ChequeWithNames[] {
    let cheques = mockStore.cheques.map(enrich);
    if (entityId) {
      cheques = cheques.filter((c) => c.entityId === entityId);
    }
    return cheques;
  },

  get(id: string): ChequeWithNames | null {
    const cheque = mockStore.cheques.find((c) => c.id === id);
    return cheque ? enrich(cheque) : null;
  },

  create(input: CreateChequeInput): ChequeWithNames {
    const id = `CHQ-${Date.now()}`;
    const cheque: Cheque = {
      id,
      ...input,
      receivedDate: new Date().toISOString().slice(0, 10),
      status: "received",
    };
    mockStore.createCheque(cheque);
    return enrich(cheque);
  },

  updateStatus(id: string, status: ChequeStatus, extra?: Partial<Cheque>): ChequeWithNames | null {
    const cheque = mockStore.updateChequeStatus(id, status, extra);
    return cheque ? enrich(cheque) : null;
  },
};
