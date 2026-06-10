import type { UtilityAccount, UtilityBill } from "@/types/utility";
import { LEASES } from "./leases";

export const UTILITY_ACCOUNTS: UtilityAccount[] = LEASES.filter(
  (l) => (l.status === "active" || l.status === "renewed") && l.ewaAccount
).map((lease) => ({
  id: `UA-${lease.id}`,
  leaseId: lease.id,
  unitId: lease.unitId,
  ewaAccount: lease.ewaAccount!,
  monthlyCap: 80,
  entityId: "ent-mgmt",
}));

/** Seasonal EWA amounts (BHD) — Bahrain summer peak May–Sep */
function ewaAmountForMonth(month: number, unitIdx: number): number {
  const variance = (unitIdx % 5) * 8;
  if (month >= 5 && month <= 9) {
    // Summer peak: 60–120 BHD
    return 60 + variance + (month === 7 || month === 8 ? 15 : 0);
  }
  if (month >= 12 || month <= 3) {
    // Winter low: 15–30 BHD
    return 15 + (unitIdx % 4) * 4;
  }
  // Shoulder: Apr, Oct, Nov
  return 35 + variance;
}

const MONTHS_2026 = [
  { period: "2026-01", month: 1 },
  { period: "2026-02", month: 2 },
  { period: "2026-03", month: 3 },
  { period: "2026-04", month: 4 },
  { period: "2026-05", month: 5 },
  { period: "2026-06", month: 6 },
  { period: "2026-07", month: 7 },
  { period: "2026-08", month: 8 },
  { period: "2026-09", month: 9 },
  { period: "2026-10", month: 10 },
  { period: "2026-11", month: 11 },
  { period: "2026-12", month: 12 },
];

export const UTILITY_BILLS: UtilityBill[] = UTILITY_ACCOUNTS.flatMap((acc, i) =>
  MONTHS_2026.map(({ period, month }) => {
    const amount = ewaAmountForMonth(month, i);
    const exceedsCap = amount > acc.monthlyCap;
    const isPast = month <= 6;
    return {
      id: `UB-${acc.id}-${period.replace("-", "")}`,
      accountId: acc.id,
      period,
      amount,
      recovered: isPast && !exceedsCap,
      exceedsCap,
    };
  })
);
