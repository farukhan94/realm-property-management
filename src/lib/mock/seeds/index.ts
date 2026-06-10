import type { Unit } from "@/types/unit";
import { BUILDINGS } from "./buildings";
import { PERSONS } from "./persons";
import { UNITS } from "./units";
import { LEASES } from "./leases";
import { INVOICES } from "./invoices";
import { DEPOSITS } from "./deposits";
import { UTILITY_ACCOUNTS, UTILITY_BILLS } from "./utilities";
import { SETTLEMENTS } from "./settlements";
import { PAYOUTS } from "./payouts";
import { WORK_ORDERS } from "./work-orders";
import { INVENTORY_PARTS, INVENTORY_CONSUMPTIONS } from "./inventory";
import { MAINTENANCE_SCHEDULES, DISPATCH_SLOTS } from "./maintenance";
import {
  HOA_SERVICE_CHARGES,
  APPORTIONMENT_RULES,
  SERVICE_CHARGE_INVOICES,
  HOA_BUDGETS,
  HOA_PROCUREMENT,
} from "./hoa";
import { DOCUMENTS } from "./documents";
import { ASSETS } from "./assets";
import { AUDIT_LOG } from "./audit-log";
import { INTEGRATIONS } from "./integrations";
import { FINANCIAL_METRICS } from "./financial-metrics";
import { MIGRATION_STEPS } from "./migration";
import { CHEQUES } from "./cheques";

export {
  BUILDINGS,
  PERSONS,
  UNITS,
  LEASES,
  INVOICES,
  DEPOSITS,
  UTILITY_ACCOUNTS,
  UTILITY_BILLS,
  SETTLEMENTS,
  PAYOUTS,
  WORK_ORDERS,
  INVENTORY_PARTS,
  INVENTORY_CONSUMPTIONS,
  MAINTENANCE_SCHEDULES,
  DISPATCH_SLOTS,
  HOA_SERVICE_CHARGES,
  APPORTIONMENT_RULES,
  SERVICE_CHARGE_INVOICES,
  HOA_BUDGETS,
  HOA_PROCUREMENT,
  DOCUMENTS,
  ASSETS,
  AUDIT_LOG,
  INTEGRATIONS,
  FINANCIAL_METRICS,
  MIGRATION_STEPS,
  CHEQUES,
};

export const TICKETS = WORK_ORDERS.filter((wo) => wo.status !== "completed").map((wo) => ({
  id: wo.id,
  title: wo.title,
  unit: wo.unitId,
  priority: wo.priority === "critical" ? "Critical" : wo.priority === "high" ? "High" : wo.priority === "medium" ? "Medium" : "Low",
  status: wo.status === "new" ? "Open" : wo.status === "in_progress" ? "In Progress" : wo.status === "assigned" ? "Assigned" : "Open",
  submitted: "recent",
  author: "Tenant",
}));

export function getPersonName(id: string): string {
  return PERSONS.find((p) => p.id === id)?.name ?? id;
}

export function getUnit(id: string): Unit | undefined {
  return UNITS.find((u) => u.id === id);
}

export function getBuildingName(id: string): string {
  return BUILDINGS.find((b) => b.id === id)?.name ?? id;
}

export function getOwnerUnits(ownerId: string): Unit[] {
  return UNITS.filter((u) => u.ownershipHistory.some((o) => o.ownerId === ownerId && !o.endDate));
}

export function getDashboardKpis() {
  const totalUnits = UNITS.length;
  const occupied = UNITS.filter((u) => u.tenancyHistory.some((t) => !t.endDate)).length;
  const occupancy = totalUnits > 0 ? Math.round((occupied / totalUnits) * 1000) / 10 : 0;
  const monthlyRevenue = LEASES.filter((l) => l.status === "active").reduce((s, l) => s + l.monthlyRent, 0);
  const arrears = INVOICES.filter((i) => i.status === "overdue").reduce((s, i) => s + i.totalAmount - (i.paidAmount ?? 0), 0);
  const urgentTickets = WORK_ORDERS.filter((w) => w.status !== "completed" && (w.priority === "critical" || w.priority === "high")).length;
  const portfolioValue = BUILDINGS.reduce((s, b) => s + (b.areaSqm ?? 1000) * 85, 0);

  return {
    occupancy,
    monthlyRevenue,
    arrears,
    urgentTickets,
    portfolioValue,
    totalUnits,
    occupied,
  };
}
