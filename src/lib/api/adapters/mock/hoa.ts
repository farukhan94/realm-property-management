import { mockStore } from "@/lib/mock/store";

export const mockHoaAdapter = {
  listServiceCharges(entityId?: string) {
    if (!entityId) return mockStore.hoaServiceCharges;
    return mockStore.hoaServiceCharges.filter((r) => r.entityId === entityId);
  },

  getSummary(entityId?: string) {
    const charges = entityId
      ? mockStore.hoaServiceCharges.filter((r) => r.entityId === entityId)
      : mockStore.hoaServiceCharges;
    return {
      activeHoas: new Set(charges.map((c) => c.building)).size,
      totalCollected: charges.reduce((s, c) => s + c.collected, 0),
      totalArrears: charges.reduce((s, c) => s + c.arrears, 0),
      operating: charges.filter((c) => c.fund === "Operating"),
      reserve: charges.filter((c) => c.fund === "Reserve"),
    };
  },

  getApportionment(hoaId?: string) {
    if (!hoaId) return mockStore.apportionmentRules;
    return mockStore.apportionmentRules.filter((r) => r.hoaId === hoaId);
  },

  getServiceChargeInvoices(hoaId?: string) {
    if (!hoaId) return mockStore.serviceChargeInvoices;
    return mockStore.serviceChargeInvoices.filter((i) => i.hoaId === hoaId);
  },

  getBudgets(hoaId?: string) {
    if (!hoaId) return mockStore.hoaBudgets;
    return mockStore.hoaBudgets.filter((b) => b.hoaId === hoaId);
  },

  getProcurement(hoaId?: string) {
    if (!hoaId) return mockStore.hoaProcurement;
    return mockStore.hoaProcurement.filter((p) => p.hoaId === hoaId);
  },

  createApportionment(input: Omit<import("@/types/hoa-charge").ApportionmentRule, "id">) {
    return mockStore.createApportionmentRule(input);
  },

  createServiceChargeInvoice(input: Omit<import("@/types/hoa-charge").ServiceChargeInvoice, "id" | "status">) {
    return mockStore.createServiceChargeInvoice(input);
  },

  createBudget(input: Omit<import("@/types/hoa-budget").HoaBudgetLine, "id" | "actualAmount">) {
    return mockStore.createHoaBudget(input);
  },

  createProcurement(input: Omit<import("@/types/hoa-budget").HoaProcurement, "id">) {
    return mockStore.createHoaProcurement(input);
  },

  updateProcurementStatus(id: string, status: import("@/types/hoa-budget").HoaProcurement["status"]) {
    return mockStore.updateHoaProcurementStatus(id, status);
  },
};
