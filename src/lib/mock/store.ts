import * as seeds from "./seeds";
import type { Lease } from "@/types/lease";
import type { Cheque } from "@/types/cheque";
import type { Invoice } from "@/types/invoice";
import type { WorkOrder, CostLine } from "@/types/work-order";
import type { Unit } from "@/types/unit";
import type { AuditEntry } from "@/types/audit";
import type { Payout } from "@/types/payout";
import type { UtilityBill } from "@/types/utility";
import type { MaintenanceSchedule } from "@/types/maintenance";
import type { InventoryPart } from "@/types/inventory";
import type { ApportionmentRule, ServiceChargeInvoice } from "@/types/hoa-charge";
import type { HoaBudgetLine, HoaProcurement } from "@/types/hoa-budget";
import { calcVat } from "@/lib/locale/format";

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

class MockStore {
  buildings = clone(seeds.BUILDINGS);
  persons = clone(seeds.PERSONS);
  units = clone(seeds.UNITS);
  leases = clone(seeds.LEASES);
  invoices = clone(seeds.INVOICES);
  deposits = clone(seeds.DEPOSITS);
  utilityAccounts = clone(seeds.UTILITY_ACCOUNTS);
  utilityBills = clone(seeds.UTILITY_BILLS);
  settlements = clone(seeds.SETTLEMENTS);
  payouts = clone(seeds.PAYOUTS);
  workOrders = clone(seeds.WORK_ORDERS);
  inventoryParts = clone(seeds.INVENTORY_PARTS);
  inventoryConsumptions = clone(seeds.INVENTORY_CONSUMPTIONS);
  maintenanceSchedules = clone(seeds.MAINTENANCE_SCHEDULES);
  dispatchSlots = clone(seeds.DISPATCH_SLOTS);
  hoaServiceCharges = clone(seeds.HOA_SERVICE_CHARGES);
  apportionmentRules = clone(seeds.APPORTIONMENT_RULES);
  serviceChargeInvoices = clone(seeds.SERVICE_CHARGE_INVOICES);
  hoaBudgets = clone(seeds.HOA_BUDGETS);
  hoaProcurement = clone(seeds.HOA_PROCUREMENT);
  documents = clone(seeds.DOCUMENTS);
  assets = clone(seeds.ASSETS);
  auditLog = clone(seeds.AUDIT_LOG);
  integrations = clone(seeds.INTEGRATIONS);
  migrationSteps = clone(seeds.MIGRATION_STEPS);
  cheques = clone(seeds.CHEQUES);

  addAudit(entry: Omit<AuditEntry, "id" | "timestamp">) {
    this.auditLog.unshift({
      ...entry,
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
  }

  createLease(lease: Lease) {
    this.leases.push(lease);
    const unit = this.units.find((u) => u.id === lease.unitId);
    if (unit) {
      unit.tenancyHistory.push({
        tenantId: lease.tenantId,
        leaseId: lease.id,
        startDate: lease.startDate,
        endDate: null,
      });
    }
    const vat = calcVat(lease.monthlyRent);
    this.invoices.push({
      id: `INV-${lease.id}-INIT`,
      leaseId: lease.id,
      unitId: lease.unitId,
      tenantId: lease.tenantId,
      amount: lease.monthlyRent,
      vatAmount: vat,
      totalAmount: lease.monthlyRent + vat,
      dueDate: lease.startDate,
      status: "sent",
      entityId: lease.entityId,
    });
    this.deposits.push({
      id: `DEP-${lease.id}`,
      leaseId: lease.id,
      unitId: lease.unitId,
      tenantId: lease.tenantId,
      amount: lease.deposit,
      status: "held",
      heldDate: lease.startDate,
    });
    this.addAudit({
      actor: "Property Manager",
      action: "lease.created",
      entityType: "lease",
      entityId: lease.id,
      details: `Lease created for ${lease.unitId}`,
      amount: lease.monthlyRent,
    });
    return lease;
  }

  renewLease(id: string, newEndDate: string, newRent: number) {
    const lease = this.leases.find((l) => l.id === id);
    if (!lease) return null;
    lease.status = "renewed";
    const newId = `${id}-R`;
    const renewed: Lease = {
      ...lease,
      id: newId,
      endDate: newEndDate,
      monthlyRent: newRent,
      status: "active",
      startDate: lease.endDate,
    };
    return this.createLease(renewed);
  }

  terminateLease(id: string) {
    const lease = this.leases.find((l) => l.id === id);
    if (!lease) return null;
    lease.status = "terminated";
    const unit = this.units.find((u) => u.id === lease.unitId);
    const tenancy = unit?.tenancyHistory.find((t) => t.leaseId === id);
    if (tenancy) tenancy.endDate = new Date().toISOString().slice(0, 10);
    this.addAudit({ actor: "Property Manager", action: "lease.terminated", entityType: "lease", entityId: id, details: "Lease terminated" });
    return lease;
  }

  recordPayment(invoiceId: string, amount: number) {
    const inv = this.invoices.find((i) => i.id === invoiceId);
    if (!inv) return null;
    inv.paidAmount = (inv.paidAmount ?? 0) + amount;
    inv.status = inv.paidAmount >= inv.totalAmount ? "paid" : "partial";
    inv.paidDate = new Date().toISOString().slice(0, 10);
    this.addAudit({ actor: "System", action: "invoice.paid", entityType: "invoice", entityId: invoiceId, details: "Payment recorded", amount });
    return inv;
  }

  updateLease(id: string, updates: Partial<Pick<Lease, "monthlyRent" | "endDate" | "deposit" | "ewaAccount" | "escalationPercent">>) {
    const lease = this.leases.find((l) => l.id === id);
    if (!lease) return null;
    Object.assign(lease, updates);
    this.addAudit({ actor: "Property Manager", action: "lease.updated", entityType: "lease", entityId: id, details: "Lease terms updated" });
    return lease;
  }

  createInvoice(input: Omit<Invoice, "id" | "vatAmount" | "totalAmount"> & { amount: number }) {
    const vat = calcVat(input.amount);
    const inv: Invoice = {
      ...input,
      id: `INV-${Date.now()}`,
      vatAmount: vat,
      totalAmount: input.amount + vat,
      status: input.status ?? "sent",
    };
    this.invoices.push(inv);
    this.addAudit({ actor: "Property Manager", action: "invoice.created", entityType: "invoice", entityId: inv.id, details: "Manual invoice created", amount: inv.totalAmount });
    return inv;
  }

  logUtilityBill(accountId: string, period: string, amount: number) {
    const account = this.utilityAccounts.find((a) => a.id === accountId);
    if (!account) return null;
    const exceedsCap = amount > account.monthlyCap;
    const bill: UtilityBill = {
      id: `UB-${Date.now()}`,
      accountId,
      period,
      amount,
      recovered: false,
      exceedsCap,
    };
    this.utilityBills.push(bill);
    const settlement = this.settlements.find((s) => s.unitId === account.unitId);
    if (settlement) {
      settlement.utilityDeductions += amount;
      settlement.netPayable = settlement.grossRent - settlement.managementFee - settlement.utilityDeductions - settlement.otherDeductions;
    }
    this.addAudit({ actor: "System", action: "utility.recovered", entityType: "utility", entityId: bill.id, details: `EWA bill logged for ${account.unitId}`, amount });
    return bill;
  }

  createPayout(input: Omit<Payout, "id" | "status" | "processedDate">) {
    const payout: Payout = {
      ...input,
      id: `PAY-${Date.now()}`,
      status: "processed",
      processedDate: new Date().toISOString().slice(0, 10),
    };
    this.payouts.unshift(payout);
    this.addAudit({ actor: "Property Manager", action: "payout.processed", entityType: "payout", entityId: payout.id, details: `Payout to ${input.ownerId}`, amount: payout.amount });
    return payout;
  }

  updateWorkOrder(id: string, updates: Partial<Pick<WorkOrder, "title" | "priority" | "billTo" | "assignedTechnicianId" | "status">>) {
    const wo = this.workOrders.find((w) => w.id === id);
    if (!wo) return null;
    Object.assign(wo, updates);
    if (updates.status === "completed") {
      wo.completedAt = new Date().toISOString();
      this.addAudit({ actor: "Technician", action: "work_order.completed", entityType: "work_order", entityId: id, details: "Work order completed" });
    }
    this.addAudit({ actor: "Property Manager", action: "work_order.updated", entityType: "work_order", entityId: id, details: "Work order updated" });
    return wo;
  }

  addWorkOrderCostLine(workOrderId: string, line: Omit<CostLine, "id">) {
    const wo = this.workOrders.find((w) => w.id === workOrderId);
    if (!wo) return null;
    const costLine: CostLine = { ...line, id: `cl-${Date.now()}` };
    wo.costLines.push(costLine);
    return wo;
  }

  createMaintenanceSchedule(input: Omit<MaintenanceSchedule, "id">) {
    const schedule: MaintenanceSchedule = { ...input, id: `PM-${Date.now()}` };
    this.maintenanceSchedules.push(schedule);
    this.addAudit({ actor: "Property Manager", action: "maintenance.created", entityType: "maintenance", entityId: schedule.id, details: schedule.title });
    return schedule;
  }

  assignDispatch(slotId: string, technicianId: string) {
    const slot = this.dispatchSlots.find((s) => s.id === slotId);
    if (!slot) return null;
    slot.technicianId = technicianId;
    const wo = this.workOrders.find((w) => w.id === slot.workOrderId);
    if (wo) {
      wo.assignedTechnicianId = technicianId;
      if (wo.status === "new") wo.status = "assigned";
    }
    this.addAudit({ actor: "Property Manager", action: "dispatch.assigned", entityType: "dispatch", entityId: slotId, details: `Technician ${technicianId} assigned` });
    return slot;
  }

  createInventoryPart(input: Omit<InventoryPart, "id">) {
    const part: InventoryPart = { ...input, id: `INV-${Date.now()}` };
    this.inventoryParts.push(part);
    this.addAudit({ actor: "Property Manager", action: "inventory.created", entityType: "inventory", entityId: part.id, details: part.name });
    return part;
  }

  adjustStock(partId: string, delta: number) {
    const part = this.inventoryParts.find((p) => p.id === partId);
    if (!part) return null;
    part.stockQty = Math.max(0, part.stockQty + delta);
    this.addAudit({ actor: "Technician", action: "inventory.adjusted", entityType: "inventory", entityId: partId, details: `Stock adjusted by ${delta}` });
    return part;
  }

  createApportionmentRule(input: Omit<ApportionmentRule, "id">) {
    const rule: ApportionmentRule = { ...input, id: `APR-${Date.now()}` };
    this.apportionmentRules.push(rule);
    this.addAudit({ actor: "Property Manager", action: "hoa.apportionment.created", entityType: "hoa", entityId: rule.id, details: `Rule for ${input.unitId}` });
    return rule;
  }

  createServiceChargeInvoice(input: Omit<ServiceChargeInvoice, "id" | "status">) {
    const invoice: ServiceChargeInvoice = { ...input, id: `SCI-${Date.now()}`, status: "sent" };
    this.serviceChargeInvoices.push(invoice);
    this.addAudit({ actor: "Property Manager", action: "hoa.invoice.created", entityType: "hoa", entityId: invoice.id, details: `SC invoice ${input.period}`, amount: input.amount });
    return invoice;
  }

  createHoaBudget(input: Omit<HoaBudgetLine, "id" | "actualAmount">) {
    const budget: HoaBudgetLine = { ...input, id: `HB-${Date.now()}`, actualAmount: 0 };
    this.hoaBudgets.push(budget);
    this.addAudit({ actor: "Property Manager", action: "hoa.budget.created", entityType: "hoa", entityId: budget.id, details: budget.category, amount: budget.budgetAmount });
    return budget;
  }

  createHoaProcurement(input: Omit<HoaProcurement, "id">) {
    const po: HoaProcurement = { ...input, id: `PO-${Date.now()}` };
    this.hoaProcurement.push(po);
    this.addAudit({ actor: "Property Manager", action: "hoa.procurement.created", entityType: "hoa", entityId: po.id, details: po.description, amount: po.amount });
    return po;
  }

  updateHoaProcurementStatus(id: string, status: HoaProcurement["status"]) {
    const po = this.hoaProcurement.find((p) => p.id === id);
    if (!po) return null;
    po.status = status;
    this.addAudit({ actor: "Property Manager", action: "hoa.procurement.updated", entityType: "hoa", entityId: po.id, details: `Status → ${status}`, amount: po.amount });
    return po;
  }

  getTickets() {
    return this.workOrders
      .filter((wo) => wo.status !== "completed")
      .map((wo) => ({
        id: wo.id,
        title: wo.title,
        unit: wo.unitId,
        priority: wo.priority === "critical" ? "Critical" : wo.priority === "high" ? "High" : wo.priority === "medium" ? "Medium" : "Low",
        status: wo.status === "new" ? "Open" : wo.status === "in_progress" ? "In Progress" : "Assigned",
        submitted: "recent",
        author: "Tenant",
      }));
  }

  getDashboardKpis() {
    const totalUnits = this.units.length;
    const occupied = this.units.filter((u: Unit) => u.tenancyHistory.some((t) => !t.endDate)).length;
    const occupancy = totalUnits > 0 ? Math.round((occupied / totalUnits) * 1000) / 10 : 0;
    const monthlyRevenue = this.leases.filter((l) => l.status === "active").reduce((s, l) => s + l.monthlyRent, 0);
    const arrears = this.invoices.filter((i) => i.status === "overdue" || i.status === "partial").reduce((s, i) => s + i.totalAmount - (i.paidAmount ?? 0), 0);
    const urgentTickets = this.workOrders.filter((w) => w.status !== "completed" && (w.priority === "critical" || w.priority === "high")).length;
    const portfolioValue = this.buildings.reduce((s, b) => s + (b.areaSqm ?? 1000) * 85, 0);
    return { occupancy, monthlyRevenue, arrears, urgentTickets, portfolioValue, totalUnits, occupied };
  }

  createCheque(cheque: Cheque) {
    this.cheques.push(cheque);
    this.addAudit({
      actor: "Property Manager",
      action: "cheque.created",
      entityType: "cheque",
      entityId: cheque.id,
      details: `Cheque ${cheque.chequeNumber} received for ${cheque.unitId}`,
      amount: cheque.amount,
    });
    return cheque;
  }

  updateChequeStatus(id: string, status: Cheque["status"], extra?: Partial<Cheque>) {
    const cheque = this.cheques.find((c) => c.id === id);
    if (!cheque) return null;
    cheque.status = status;
    if (status === "cleared") {
      cheque.clearedDate = new Date().toISOString().slice(0, 10);
      if (cheque.invoiceId) {
        this.recordPayment(cheque.invoiceId, cheque.amount);
      }
    } else if (status === "bounced") {
      cheque.bouncedDate = new Date().toISOString().slice(0, 10);
      cheque.bouncedReason = extra?.bouncedReason ?? "Insufficient Funds";
    }
    Object.assign(cheque, extra);
    this.addAudit({
      actor: "System",
      action: `cheque.${status}`,
      entityType: "cheque",
      entityId: id,
      details: `Cheque ${cheque.chequeNumber} status updated to ${status}`,
      amount: cheque.amount,
    });
    return cheque;
  }
}

export const mockStore = new MockStore();
