import type { OwnerSettlement, SettlementLine } from "@/types/settlement";
import { BAHRAIN_LOCALE } from "@/lib/locale/bahrain";
import { LEASES } from "./leases";
import { UNITS } from "./units";

const MONTHS = [
  { start: "2026-01-01", end: "2026-01-31", label: "January 2026" },
  { start: "2026-02-01", end: "2026-02-28", label: "February 2026" },
  { start: "2026-03-01", end: "2026-03-31", label: "March 2026" },
  { start: "2026-04-01", end: "2026-04-30", label: "April 2026" },
  { start: "2026-05-01", end: "2026-05-31", label: "May 2026" },
  { start: "2026-06-01", end: "2026-06-30", label: "June 2026" },
];

const OTHER_DEDUCTIONS = [
  { desc: "Minor repair recharge", amount: 15 },
  { desc: "Key replacement recharge", amount: 8 },
  { desc: "AC service recharge", amount: 12 },
  { desc: "Lobby access card replacement", amount: 20 },
  { desc: "Parking remote replacement", amount: 5 },
  { desc: "Intercom handset replacement", amount: 10 },
  { desc: "Plumbing callout recharge", amount: 18 },
  { desc: "Deep clean recharge", amount: 25 },
];

function ewaForMonth(monthIdx: number, unitIdx: number): number {
  // Jan=0 winter low, May=4 summer start
  if (monthIdx >= 4 && monthIdx <= 5) return 55 + (unitIdx % 5) * 12;
  if (monthIdx <= 2) return 22 + (unitIdx % 4) * 5;
  return 38 + (unitIdx % 3) * 8;
}

function buildSettlement(
  id: string,
  ownerId: string,
  unitId: string,
  periodStart: string,
  periodEnd: string,
  monthLabel: string,
  grossRent: number,
  monthIdx: number,
  unitIdx: number,
  feePercent: number
): OwnerSettlement {
  const managementFee = Math.round(grossRent * (feePercent / 100) * 1000) / 1000;
  const vatOnFee = Math.round(managementFee * 0.1 * 1000) / 1000;
  const utilityDeductions = ewaForMonth(monthIdx, unitIdx);
  const other = monthIdx % 3 === 0 ? OTHER_DEDUCTIONS[unitIdx % OTHER_DEDUCTIONS.length] : null;
  const otherDeductions = other?.amount ?? 0;
  const netPayable = Math.round((grossRent - managementFee - vatOnFee - utilityDeductions - otherDeductions) * 1000) / 1000;

  const lines: SettlementLine[] = [
    { id: `${id}-l1`, description: `Rent collected — ${monthLabel}`, amount: grossRent, type: "credit" },
    { id: `${id}-l2`, description: `Management fee (${feePercent}%)`, amount: managementFee, type: "debit" },
    { id: `${id}-l3`, description: `VAT on management fee (10%)`, amount: vatOnFee, type: "debit" },
    { id: `${id}-l4`, description: `${BAHRAIN_LOCALE.utilityProvider} — paid on behalf`, amount: utilityDeductions, type: "debit" },
  ];
  if (other) {
    lines.push({ id: `${id}-l5`, description: other.desc, amount: other.amount, type: "debit" });
  }

  return {
    id,
    ownerId,
    unitId,
    periodStart,
    periodEnd,
    grossRent,
    managementFeePercent: feePercent,
    managementFee,
    utilityDeductions,
    otherDeductions,
    netPayable,
    entityId: "ent-mgmt",
    lines,
  };
}

// Manual high-detail settlements (kept for demos)
const MANUAL_SETTLEMENTS: OwnerSettlement[] = [
  buildSettlement("STL-2026-05", "own-2", "U-1001", "2026-05-01", "2026-05-31", "May 2026", 483, 4, 0, 5),
  buildSettlement("STL-2026-05-02", "own-2", "U-204", "2026-05-01", "2026-05-31", "May 2026", 441, 4, 1, 5),
  buildSettlement("STL-2026-05-03", "own-3", "U-1005", "2026-05-01", "2026-05-31", "May 2026", 322, 4, 2, 5),
];

export const SETTLEMENTS: OwnerSettlement[] = [...MANUAL_SETTLEMENTS];

// Generate settlements for active leases × months
const activeLeases = LEASES.filter((l) => l.status === "active").slice(0, 45);

activeLeases.forEach((lease, leaseIdx) => {
  const unit = UNITS.find((u) => u.id === lease.unitId);
  if (!unit) return;
  const ownerId = unit.ownershipHistory.at(-1)?.ownerId ?? "own-1";
  const feePercent = leaseIdx % 4 === 0 ? 8 : 5;

  MONTHS.forEach((month, monthIdx) => {
    const id = `STL-${month.start.slice(0, 7)}-${lease.unitId}`;
    if (SETTLEMENTS.some((s) => s.id === id)) return;
    SETTLEMENTS.push(
      buildSettlement(
        id,
        ownerId,
        lease.unitId,
        month.start,
        month.end,
        month.label,
        lease.monthlyRent,
        monthIdx,
        leaseIdx,
        feePercent
      )
    );
  });
});
