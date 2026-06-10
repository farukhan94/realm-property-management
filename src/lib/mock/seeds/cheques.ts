import type { Cheque } from "@/types/cheque";
import { LEASES } from "./leases";

export const CHEQUES: Cheque[] = [];

// Seed some cheques based on active leases
LEASES.filter((l) => l.status === "active").forEach((lease, i) => {
  const bankName = ["National Bank of Bahrain", "Bank of Bahrain and Kuwait", "Al Salam Bank"][i % 3];
    
  // Cheque 1: Cleared (past)
  CHEQUES.push({
    id: `CHQ-${lease.id}-01`,
    chequeNumber: String(1001 + i * 2),
    bankName,
    amount: lease.monthlyRent,
    dueDate: "2026-05-01",
    receivedDate: "2026-04-15",
    status: "cleared",
    tenantId: lease.tenantId,
    leaseId: lease.id,
    unitId: lease.unitId,
    entityId: lease.entityId,
    clearedDate: "2026-05-02",
  });

  // Cheque 2: Received / Post-Dated (future)
  CHEQUES.push({
    id: `CHQ-${lease.id}-02`,
    chequeNumber: String(1002 + i * 2),
    bankName,
    amount: lease.monthlyRent,
    dueDate: "2026-07-01",
    receivedDate: "2026-04-15",
    status: "received",
    tenantId: lease.tenantId,
    leaseId: lease.id,
    unitId: lease.unitId,
    entityId: lease.entityId,
  });

  // Cheque 3: Deposited / Pending Clearance
  if (i % 4 === 0) {
    CHEQUES.push({
      id: `CHQ-${lease.id}-03`,
      chequeNumber: String(1003 + i * 2),
      bankName,
      amount: lease.monthlyRent,
      dueDate: "2026-06-15",
      receivedDate: "2026-04-15",
      status: "deposited",
      tenantId: lease.tenantId,
      leaseId: lease.id,
      unitId: lease.unitId,
      entityId: lease.entityId,
    });
  }

  // Cheque 4: Bounced
  if (i % 7 === 0) {
    CHEQUES.push({
      id: `CHQ-${lease.id}-04`,
      chequeNumber: String(1004 + i * 2),
      bankName,
      amount: lease.monthlyRent,
      dueDate: "2026-06-01",
      receivedDate: "2026-04-15",
      status: "bounced",
      tenantId: lease.tenantId,
      leaseId: lease.id,
      unitId: lease.unitId,
      entityId: lease.entityId,
      bouncedDate: "2026-06-03",
      bouncedReason: "Insufficient Funds",
    });
  }
});
export const mockCheques = CHEQUES;
