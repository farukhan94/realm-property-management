import type { AuditEntry } from "@/types/audit";

const ACTIONS: Array<{ action: string; entityType: string; details: string; amount?: boolean }> = [
  { action: "lease.created", entityType: "lease", details: "New residential lease registered — SLRB compliant" },
  { action: "lease.renewed", entityType: "lease", details: "Lease renewed with 5% escalation per Bahrain regulations", amount: true },
  { action: "lease.terminated", entityType: "lease", details: "Lease terminated — deposit reconciliation pending" },
  { action: "invoice.paid", entityType: "invoice", details: "Rent payment received via BenefitPay", amount: true },
  { action: "invoice.paid", entityType: "invoice", details: "Rent payment received via NBB virtual IBAN", amount: true },
  { action: "invoice.created", entityType: "invoice", details: "Monthly rent invoice generated with 10% VAT", amount: true },
  { action: "settlement.generated", entityType: "settlement", details: "Owner statement generated — May 2026", amount: true },
  { action: "payout.processed", entityType: "payout", details: "Owner payout processed via NBB corporate banking", amount: true },
  { action: "payout.pending", entityType: "payout", details: "Owner payout queued for BBK transfer", amount: true },
  { action: "work_order.created", entityType: "work_order", details: "Tenant maintenance request logged" },
  { action: "work_order.assigned", entityType: "work_order", details: "Technician assigned — dispatch slot confirmed" },
  { action: "work_order.completed", entityType: "work_order", details: "Work order marked completed — cost lines finalised", amount: true },
  { action: "utility.recovered", entityType: "utility", details: "EWA bill recovered from rent settlement", amount: true },
  { action: "utility.imported", entityType: "utility", details: "EWA bulk bill import — 42 accounts processed" },
  { action: "hoa.invoice.created", entityType: "hoa", details: "Service charge invoice issued — Q2 2026", amount: true },
  { action: "hoa.procurement.approved", entityType: "hoa", details: "Procurement PO approved — Otis Bahrain W.L.L.", amount: true },
  { action: "inventory.adjusted", entityType: "inventory", details: "AC filter stock adjusted after WO consumption" },
  { action: "dispatch.assigned", entityType: "dispatch", details: "Technician dispatched to Juffair Heights" },
  { action: "integration.synced", entityType: "integration", details: "BenefitPay gateway sync completed" },
  { action: "integration.synced", entityType: "integration", details: "LMRA permit status refreshed for 18 tenants" },
];

const ACTORS = ["Admin", "Property Manager", "System", "Technician", "HOA Secretary"];

export const AUDIT_LOG: AuditEntry[] = [];

for (let i = 0; i < 160; i++) {
  const act = ACTIONS[i % ACTIONS.length];
  const day = (i % 28) + 1;
  const month = (i % 6) + 1;
  AUDIT_LOG.push({
    id: `AUD-${String(i + 1).padStart(4, "0")}`,
    timestamp: `2026-0${month}-${String(day).padStart(2, "0")}T${String(8 + (i % 10)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}:00Z`,
    actor: ACTORS[i % ACTORS.length],
    action: act.action,
    entityType: act.entityType,
    entityId: `${act.entityType.toUpperCase()}-${String(i).padStart(4, "0")}`,
    details: act.details,
    amount: act.amount ? 350 + (i % 20) * 45 : undefined,
  });
}
