import type { Payout } from "@/types/payout";
import { SETTLEMENTS } from "./settlements";

const OWNER_IBANS: Record<string, string> = {
  "own-1": "BH12NBOB00000000000001",
  "own-2": "BH12NBOB00000000000001",
  "own-3": "BH12BBKU00000000000002",
  "own-4": "BH12KHCB00000000000004",
  "own-5": "BH12NBOB00000000000005",
  "own-6": "BH12BBKU00000000000006",
  "own-7": "BH12AUBB00000000000007",
  "own-8": "BH12NBOB00000000000008",
  "own-9": "BH12AUBB00000000000009",
  "own-10": "BH12NBOB00000000000010",
  "own-11": "BH12BBKU00000000000011",
  "own-12": "BH12KHCB00000000000012",
  "own-13": "BH12NBOB00000000000013",
  "own-14": "BH12AUBB00000000000014",
  "own-15": "BH12BBKU00000000000015",
  "own-16": "BH12NBOB00000000000016",
  "own-17": "BH12KHCB00000000000017",
  "own-18": "BH12AUBB00000000000018",
  "own-19": "BH12NBOB00000000000019",
  "own-20": "BH12BBKU00000000000020",
};

export const PAYOUTS: Payout[] = [
  {
    id: "PAY-2026-05-001",
    ownerId: "own-2",
    amount: 700,
    status: "processed",
    iban: "BH12NBOB00000000000001",
    reference: "STL-2026-05-CONSOL",
    processedDate: "2026-06-05",
    entityId: "ent-mgmt",
    unitIds: ["U-1001", "U-204"],
  },
  {
    id: "PAY-2026-05-002",
    ownerId: "own-3",
    amount: 265,
    status: "processed",
    iban: "BH12BBKU00000000000002",
    reference: "STL-2026-05-U1005",
    processedDate: "2026-06-05",
    entityId: "ent-mgmt",
    unitIds: ["U-1005"],
  },
];

// Group settlements by owner + month and create payouts
const byOwnerMonth = new Map<string, { ownerId: string; period: string; amount: number; unitIds: string[] }>();

SETTLEMENTS.forEach((s) => {
  const period = s.periodStart.slice(0, 7);
  const key = `${s.ownerId}-${period}`;
  const existing = byOwnerMonth.get(key);
  if (existing) {
    existing.amount += s.netPayable;
    if (!existing.unitIds.includes(s.unitId)) existing.unitIds.push(s.unitId);
  } else {
    byOwnerMonth.set(key, { ownerId: s.ownerId, period, amount: s.netPayable, unitIds: [s.unitId] });
  }
});

let payIdx = PAYOUTS.length;
byOwnerMonth.forEach((group) => {
  const id = `PAY-${group.period}-${String(payIdx).padStart(3, "0")}`;
  if (PAYOUTS.some((p) => p.reference === `STL-${group.period}-${group.ownerId}`)) return;
  const isProcessed = group.period < "2026-06" || payIdx % 3 !== 0;
  PAYOUTS.push({
    id,
    ownerId: group.ownerId,
    amount: Math.round(group.amount * 1000) / 1000,
    status: isProcessed ? "processed" : "pending",
    iban: OWNER_IBANS[group.ownerId] ?? "BH12NBOB000000000099",
    reference: `STL-${group.period}-${group.ownerId}`,
    processedDate: isProcessed ? `${group.period}-08` : "2026-06-15",
    entityId: "ent-mgmt",
    unitIds: group.unitIds,
  });
  payIdx++;
});
