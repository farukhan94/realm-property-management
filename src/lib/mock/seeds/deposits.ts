import type { DepositRecord } from "@/types/deposit";
import { LEASES } from "./leases";

export const DEPOSITS: DepositRecord[] = LEASES.filter((l) =>
  ["active", "renewed"].includes(l.status)
).map((lease) => ({
  id: `DEP-${lease.id}`,
  leaseId: lease.id,
  unitId: lease.unitId,
  tenantId: lease.tenantId,
  amount: lease.deposit,
  status: "held" as const,
  heldDate: lease.startDate,
}));
