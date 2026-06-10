import { mockStore } from "@/lib/mock/store";
import { FINANCIAL_METRICS } from "@/lib/mock/seeds/financial-metrics";

export const mockReportsAdapter = {
  getPropertyPnl() {
    const rent = mockStore.leases.filter((l) => l.status === "active").reduce((s, l) => s + l.monthlyRent, 0);
    const fees = mockStore.settlements.reduce((s, x) => s + x.managementFee, 0);
    const vacancies = mockStore.units.filter((u) => !u.tenancyHistory.some((t) => !t.endDate)).length;
    return { rent, fees, vacancies, net: rent - fees };
  },

  getFacilityPnl() {
    const orders = mockStore.workOrders;
    let revenue = 0;
    let cost = 0;
    orders.forEach((wo) => {
      wo.costLines.forEach((line) => {
        const c = line.quantity * line.unitCost;
        cost += c;
        revenue += c * (1 + line.markupPercent / 100);
      });
    });
    return { revenue, cost, profit: revenue - cost, jobCount: orders.length };
  },

  getHoaSummary() {
    return mockStore.hoaServiceCharges.reduce(
      (acc, c) => ({
        collected: acc.collected + c.collected,
        arrears: acc.arrears + c.arrears,
      }),
      { collected: 0, arrears: 0 }
    );
  },

  getOccupancyByBuilding() {
    return mockStore.buildings.map((b) => ({
      id: b.id,
      name: b.name,
      occupancy: b.occupancy,
      units: b.totalUnits,
    }));
  },

  getFinancialMetrics() {
    return FINANCIAL_METRICS;
  },

  getArrearsAging() {
    const overdue = mockStore.invoices.filter((i) => ["overdue", "partial"].includes(i.status));
    const total = overdue.reduce((s, i) => s + i.totalAmount - (i.paidAmount ?? 0), 0);
    return { total, buckets: [
      { label: "0-30 days", amount: total * 0.5 },
      { label: "31-60 days", amount: total * 0.3 },
      { label: "61-90+ days", amount: total * 0.2 },
    ]};
  },
};
