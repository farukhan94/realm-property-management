import { mockStore } from "@/lib/mock/store";
import { getPersonName, getUnit } from "@/lib/mock/seeds";
import type { Invoice } from "@/types/invoice";

export interface InvoiceWithNames extends Invoice {
  tenantName: string;
  unitLabel: string;
}

function enrich(inv: Invoice): InvoiceWithNames {
  return {
    ...inv,
    tenantName: getPersonName(inv.tenantId),
    unitLabel: getUnit(inv.unitId)?.label ?? inv.unitId,
  };
}

export const mockInvoicesAdapter = {
  list(entityId?: string): InvoiceWithNames[] {
    let items = mockStore.invoices.map(enrich);
    if (entityId) items = items.filter((i) => i.entityId === entityId);
    return items;
  },

  listByTenant(tenantId: string) {
    return mockStore.invoices.filter((i) => i.tenantId === tenantId).map(enrich);
  },

  getArrearsSummary() {
    const overdue = mockStore.invoices.filter((i) => i.status === "overdue" || i.status === "partial");
    return {
      total: overdue.reduce((s, i) => s + i.totalAmount - (i.paidAmount ?? 0), 0),
      count: overdue.length,
      aging: {
        d0_30: overdue.filter((_, i) => i % 3 === 0).length,
        d31_60: overdue.filter((_, i) => i % 3 === 1).length,
        d61_90: overdue.filter((_, i) => i % 3 === 2).length,
      },
    };
  },

  recordPayment(id: string, amount: number) {
    const inv = mockStore.recordPayment(id, amount);
    return inv ? enrich(inv) : null;
  },

  create(input: {
    unitId: string;
    tenantId: string;
    leaseId: string;
    amount: number;
    dueDate: string;
    entityId: string;
    chequeDate?: string;
    virtualIbanRef?: string;
  }) {
    const inv = mockStore.createInvoice({ ...input, status: "sent" });
    return enrich(inv);
  },
};
