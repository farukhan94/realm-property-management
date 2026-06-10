import { mockStore } from "@/lib/mock/store";

export const mockInventoryAdapter = {
  listParts() {
    return mockStore.inventoryParts;
  },

  getConsumptions(workOrderId?: string) {
    if (!workOrderId) return mockStore.inventoryConsumptions;
    return mockStore.inventoryConsumptions.filter((c) => c.workOrderId === workOrderId);
  },

  consume(partId: string, workOrderId: string, quantity: number) {
    const part = mockStore.inventoryParts.find((p) => p.id === partId);
    if (!part || part.stockQty < quantity) return null;
    part.stockQty -= quantity;
    const consumption = { id: `IC-${Date.now()}`, partId, workOrderId, quantity, consumedAt: new Date().toISOString() };
    mockStore.inventoryConsumptions.push(consumption);
    return consumption;
  },

  createPart(input: Omit<import("@/types/inventory").InventoryPart, "id">) {
    return mockStore.createInventoryPart(input);
  },

  adjustStock(partId: string, delta: number) {
    return mockStore.adjustStock(partId, delta);
  },
};
