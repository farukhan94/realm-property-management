import { calcVat } from "@/lib/locale/format";
import type { Invoice } from "@/types/invoice";
import { LEASES } from "./leases";

function makeInvoice(
  id: string,
  leaseId: string,
  unitId: string,
  tenantId: string,
  amount: number,
  dueDate: string,
  status: Invoice["status"],
  extra?: Partial<Invoice>
): Invoice {
  const vat = calcVat(amount);
  return {
    id,
    leaseId,
    unitId,
    tenantId,
    amount,
    vatAmount: vat,
    totalAmount: amount + vat,
    dueDate,
    status,
    entityId: "ent-mgmt",
    ...extra,
  };
}

const MONTHS = [
  "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06",
  "2026-07", "2026-08", "2026-09",
];

const STATUS_CYCLE: Invoice["status"][] = ["paid", "paid", "sent", "overdue", "partial", "paid", "sent"];

export const INVOICES: Invoice[] = [];

const activeLeases = LEASES.filter((l) => l.status === "active" || l.status === "renewed");

activeLeases.forEach((lease, leaseIdx) => {
  MONTHS.forEach((period, monthIdx) => {
    const globalIdx = leaseIdx * MONTHS.length + monthIdx;
    const status = STATUS_CYCLE[globalIdx % STATUS_CYCLE.length];
    const dueDate = `${period}-01`;
    const invId = `INV-${lease.id}-${period.replace("-", "")}`;

    const paidAmount =
      status === "paid"
        ? lease.monthlyRent + calcVat(lease.monthlyRent)
        : status === "partial"
          ? Math.round((lease.monthlyRent / 2) * 1000) / 1000
          : undefined;

    INVOICES.push(
      makeInvoice(invId, lease.id, lease.unitId, lease.tenantId, lease.monthlyRent, dueDate, status, {
        paidAmount,
        paidDate: status === "paid" ? `${period}-03` : undefined,
        virtualIbanRef: status === "paid" ? `BH12NBOB0000000${String(globalIdx).padStart(5, "0")}` : undefined,
        chequeDate: globalIdx % 8 === 0 ? `${period}-15` : undefined,
      })
    );
  });
});

// Additional invoices for expired/terminated leases (historical)
LEASES.filter((l) => l.status === "expired" || l.status === "terminated").forEach((lease, i) => {
  ["2025-10", "2025-11", "2025-12"].forEach((period) => {
    INVOICES.push(
      makeInvoice(
        `INV-${lease.id}-${period.replace("-", "")}`,
        lease.id,
        lease.unitId,
        lease.tenantId,
        lease.monthlyRent,
        `${period}-01`,
        i % 2 === 0 ? "paid" : "overdue",
        { paidDate: i % 2 === 0 ? `${period}-05` : undefined }
      )
    );
  });
});
