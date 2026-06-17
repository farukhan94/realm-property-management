import { mockStore } from "@/lib/mock/store";
import {
  DASHBOARD_ACTIVITIES,
  INSPECTION_METRICS,
  PLATFORM_METRICS,
  SAAS_CUSTOMERS,
  SUBSCRIPTION_REVENUE_CHART,
  SUPPLIER_BILLS,
  SUPPLIERS,
  VACANT_LISTINGS,
  BUILDING_OWNER_MAP,
  MAINTENANCE_MANAGERS,
  TENANT_NOTIFICATIONS,
} from "@/lib/mock/seeds";
import { BUILDINGS, UNITS, LEASES, INVOICES, WORK_ORDERS, AUDIT_LOG, PAYOUTS, SETTLEMENTS } from "@/lib/mock/seeds";
import { mockSettlementsAdapter } from "./settlements";

export const mockDashboardAdapter = {
  getKpis() {
    const kpis = mockStore.getDashboardKpis();
    return { ...kpis, buildingCount: mockStore.buildings.length };
  },

  getWidgetMetrics() {
    return mockStore.getWidgetMetrics();
  },

  getActivities() {
    return DASHBOARD_ACTIVITIES;
  },

  getInspections() {
    return INSPECTION_METRICS;
  },

  getPlatformMetrics() {
    return PLATFORM_METRICS;
  },

  getSaasCustomers() {
    return SAAS_CUSTOMERS;
  },

  getSubscriptionChart() {
    return SUBSCRIPTION_REVENUE_CHART;
  },

  getSuppliers() {
    return SUPPLIERS;
  },

  getSupplierBills() {
    return SUPPLIER_BILLS;
  },

  getVacantListings() {
    return VACANT_LISTINGS;
  },

  getBuildingOwnerDashboard(ownerId: string) {
    const buildingIds = BUILDING_OWNER_MAP[ownerId] ?? [];
    const buildings = BUILDINGS.filter((b) => buildingIds.includes(b.id));
    const units = UNITS.filter((u) => buildingIds.includes(u.buildingId));
    const occupied = units.filter((u) => u.tenancyHistory.some((t) => !t.endDate)).length;
    const monthlyIncome = LEASES.filter((l) => l.status === "active" && units.some((u) => u.id === l.unitId)).reduce((s, l) => s + l.monthlyRent, 0);
    const maintenance = WORK_ORDERS.filter((w) => units.some((u) => u.id === w.unitId) && w.status !== "completed").length;
    const settlements = mockSettlementsAdapter.list().filter((s) => units.some((u) => u.id === s.unitId));
    return { buildings, units, occupied, totalUnits: units.length, monthlyIncome, maintenance, settlements };
  },

  getFlatOwnerDashboard(ownerId: string) {
    const units = UNITS.filter((u) => u.ownershipHistory.some((o) => o.ownerId === ownerId && !o.endDate));
    const payouts = PAYOUTS.filter((p) => p.ownerId === ownerId);
    const settlements = mockSettlementsAdapter.consolidated(ownerId);
    const monthlyIncome = LEASES.filter((l) => l.status === "active" && units.some((u) => u.id === l.unitId)).reduce((s, l) => s + l.monthlyRent, 0);
    return { units, payouts, settlements, monthlyIncome };
  },

  getSupplierDashboard(supplierId: string) {
    const supplier = SUPPLIERS.find((s) => s.id === supplierId);
    const jobs = WORK_ORDERS.filter((w) => w.assignedTechnicianId || w.status !== "completed").slice(0, 8);
    const bills = SUPPLIER_BILLS.filter((b) => b.supplierId === supplierId);
    return { supplier, jobs, bills };
  },

  getMaintenanceManagerDashboard(managerId: string) {
    const manager = MAINTENANCE_MANAGERS.find((m) => m.id === managerId);
    const buildingIds = manager?.buildingIds ?? [];
    const workOrders = WORK_ORDERS.filter((w) => {
      const unit = UNITS.find((u) => u.id === w.unitId);
      return unit && buildingIds.includes(unit.buildingId);
    });
    return { manager, buildingIds, workOrders, guestbookActive: mockStore.guestbookEntries.filter((e) => e.status === "checked_in").length };
  },

  getTenantDashboard(tenantId: string) {
    const leases = LEASES.filter((l) => l.tenantId === tenantId && l.status === "active");
    const invoices = INVOICES.filter((i) => i.tenantId === tenantId);
    const due = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.totalAmount - (i.paidAmount ?? 0), 0);
    const notifications = TENANT_NOTIFICATIONS.filter((n) => n.tenantId === tenantId);
    const tickets = WORK_ORDERS.filter((w) => w.status !== "completed").slice(0, 5);
    return { leases, invoices, due, notifications, tickets };
  },

  getAuditorDashboard() {
    return {
      totalEntries: AUDIT_LOG.length,
      financialActions: AUDIT_LOG.filter((a) => a.amount).length,
      recentLog: AUDIT_LOG.slice(0, 15),
    };
  },

  getAccountingDashboard() {
    return {
      buildings: BUILDINGS,
      totalArrears: INVOICES.filter((i) => i.status === "overdue").reduce((s, i) => s + i.totalAmount, 0),
      payoutsThisMonth: PAYOUTS.filter((p) => p.processedDate?.startsWith("2026-06")).reduce((s, p) => s + p.amount, 0),
    };
  },
};
