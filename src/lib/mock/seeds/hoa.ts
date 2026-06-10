import type { ApportionmentRule, ServiceChargeInvoice } from "@/types/hoa-charge";
import type { HoaBudgetLine, HoaProcurement } from "@/types/hoa-budget";
import { COMPANY_ID } from "@/lib/mock/navigation";
import { UNITS } from "./units";
import { BUILDINGS } from "./buildings";

export const HOA_SERVICE_CHARGES = [
  { entityId: "ent-mgmt", building: "Bahrain Bay Residences HOA", collected: 185000, arrears: 4200, fund: "Operating" as const },
  { entityId: "ent-mgmt", building: "Bahrain Bay Residences HOA", collected: 52000, arrears: 0, fund: "Reserve" as const },
  { entityId: "ent-mgmt", building: "Juffair Heights HOA", collected: 98000, arrears: 2100, fund: "Operating" as const },
  { entityId: "ent-mgmt", building: "Amwaj Lagoon Villas HOA", collected: 142000, arrears: 1800, fund: "Operating" as const },
  { entityId: "ent-mgmt", building: "Amwaj Lagoon Villas HOA", collected: 38000, arrears: 0, fund: "Reserve" as const },
  { entityId: "ent-mgmt", building: "Budaiya Waterfront HOA", collected: 72000, arrears: 950, fund: "Operating" as const },
  { entityId: "ent-mgmt", building: "Riffa Views HOA", collected: 198000, arrears: 5600, fund: "Operating" as const },
  { entityId: "ent-mgmt", building: "Riffa Views HOA", collected: 45000, arrears: 0, fund: "Reserve" as const },
  { entityId: "ent-mgmt", building: "Diyar Al Muharraq HOA", collected: 95000, arrears: 0, fund: "Operating" as const },
  { entityId: "ent-mgmt", building: "Diyar Al Muharraq HOA", collected: 28000, arrears: 0, fund: "Reserve" as const },
  { entityId: "ent-mgmt", building: "Muharraq Heritage Lofts HOA", collected: 42000, arrears: 1200, fund: "Operating" as const },
];

const HOA_IDS = [COMPANY_ID] as const;

function unitsForHoa(hoaId: string): typeof UNITS {
  const buildingIds = BUILDINGS.filter((b) => b.hoaId === hoaId).map((b) => b.id);
  return UNITS.filter((u) => buildingIds.includes(u.buildingId));
}

export const APPORTIONMENT_RULES: ApportionmentRule[] = HOA_IDS.flatMap((hoaId) => {
  const units = unitsForHoa(hoaId).slice(0, 25);
  const share = units.length > 0 ? Math.round((100 / units.length) * 100) / 100 : 5;
  return units.map((u, i) => ({
    id: `APR-${u.id}`,
    hoaId,
    unitId: u.id,
    areaSqm: 80 + (i % 8) * 25,
    sharePercent: share,
  }));
});

export const SERVICE_CHARGE_INVOICES: ServiceChargeInvoice[] = [];

HOA_IDS.forEach((hoaId) => {
  const units = unitsForHoa(hoaId).slice(0, 20);
  ["2026-Q1", "2026-Q2", "2026-Q3"].forEach((period, periodIdx) => {
    units.forEach((u, i) => {
      SERVICE_CHARGE_INVOICES.push({
        id: `SCI-${period}-${u.id}`,
        hoaId,
        unitId: u.id,
        ownerId: u.ownershipHistory.at(-1)?.ownerId ?? "own-1",
        period,
        amount: 180 + (i % 5) * 40 + periodIdx * 15,
        fund: i % 4 === 0 ? "reserve" : "operating",
        status: i % 5 === 0 ? "overdue" : i % 3 === 0 ? "paid" : "sent",
      });
    });
  });
});

export const HOA_BUDGETS: HoaBudgetLine[] = [
  // ent-mgmt — Bahrain Bay / Juffair
  { id: "HB-1", hoaId: "ent-mgmt", category: "Security", budgetAmount: 45000, actualAmount: 43200, year: 2026 },
  { id: "HB-2", hoaId: "ent-mgmt", category: "Landscaping", budgetAmount: 28000, actualAmount: 29500, year: 2026 },
  { id: "HB-3", hoaId: "ent-mgmt", category: "Elevator maintenance", budgetAmount: 35000, actualAmount: 34800, year: 2026 },
  { id: "HB-3b", hoaId: "ent-mgmt", category: "Pool & amenities", budgetAmount: 42000, actualAmount: 40100, year: 2026 },
  { id: "HB-3c", hoaId: "ent-mgmt", category: "Common area utilities (EWA)", budgetAmount: 55000, actualAmount: 58200, year: 2026 },
  // Northern — Amwaj / Budaiya
  { id: "HB-4", hoaId: "ent-mgmt", category: "Pool & lagoon maintenance", budgetAmount: 52000, actualAmount: 48900, year: 2026 },
  { id: "HB-5", hoaId: "ent-mgmt", category: "Common area utilities", budgetAmount: 38000, actualAmount: 40100, year: 2026 },
  { id: "HB-5b", hoaId: "ent-mgmt", category: "Marina & waterfront safety", budgetAmount: 22000, actualAmount: 21500, year: 2026 },
  { id: "HB-5c", hoaId: "ent-mgmt", category: "Landscaping — Amwaj", budgetAmount: 31000, actualAmount: 29800, year: 2026 },
  // ent-mgmt — Riffa Views
  { id: "HB-6", hoaId: "ent-mgmt", category: "Security", budgetAmount: 52000, actualAmount: 49800, year: 2026 },
  { id: "HB-7", hoaId: "ent-mgmt", category: "Road maintenance", budgetAmount: 41000, actualAmount: 42500, year: 2026 },
  { id: "HB-8", hoaId: "ent-mgmt", category: "Waste management", budgetAmount: 22000, actualAmount: 21800, year: 2026 },
  { id: "HB-8b", hoaId: "ent-mgmt", category: "Street lighting", budgetAmount: 18000, actualAmount: 19200, year: 2026 },
  // Southern — Diyar / Muharraq
  { id: "HB-9", hoaId: "ent-mgmt", category: "Community centre ops", budgetAmount: 18000, actualAmount: 17200, year: 2026 },
  { id: "HB-10", hoaId: "ent-mgmt", category: "Playground safety", budgetAmount: 12000, actualAmount: 11400, year: 2026 },
  { id: "HB-11", hoaId: "ent-mgmt", category: "Street lighting", budgetAmount: 15000, actualAmount: 15300, year: 2026 },
  { id: "HB-11b", hoaId: "ent-mgmt", category: "Mosque & community facilities", budgetAmount: 14000, actualAmount: 13800, year: 2026 },
];

export const HOA_PROCUREMENT: HoaProcurement[] = [
  { id: "PO-001", hoaId: "ent-mgmt", vendor: "Otis Bahrain W.L.L.", description: "Elevator annual maintenance contract — Bahrain Bay", amount: 12500, status: "approved", orderDate: "2026-01-15" },
  { id: "PO-002", hoaId: "ent-mgmt", vendor: "GreenScape BH", description: "Landscaping — Q2 Seef district", amount: 7200, status: "paid", orderDate: "2026-04-01" },
  { id: "PO-003", hoaId: "ent-mgmt", vendor: "SecureGuard Services W.L.L.", description: "Security staffing — June Amwaj", amount: 9800, status: "approved", orderDate: "2026-05-28" },
  { id: "PO-004", hoaId: "ent-mgmt", vendor: "CoolAir HVAC W.L.L.", description: "Chiller plant service — Riffa Views", amount: 15600, status: "draft", orderDate: "2026-06-05" },
  { id: "PO-005", hoaId: "ent-mgmt", vendor: "Bahrain Lighting Co.", description: "Common area LED upgrade — Diyar", amount: 4200, status: "paid", orderDate: "2026-03-20" },
  { id: "PO-006", hoaId: "ent-mgmt", vendor: "Gulf Paving W.L.L.", description: "Road resurfacing — Phase 1 Riffa Views", amount: 28500, status: "approved", orderDate: "2026-05-10" },
  { id: "PO-007", hoaId: "ent-mgmt", vendor: "CleanCo Bahrain W.L.L.", description: "Waste collection — H2 2026 Diyar", amount: 6400, status: "draft", orderDate: "2026-06-08" },
  { id: "PO-008", hoaId: "ent-mgmt", vendor: "Bahrain Fire Systems W.L.L.", description: "Annual fire panel certification — Civil Defence", amount: 8900, status: "approved", orderDate: "2026-06-01" },
  { id: "PO-009", hoaId: "ent-mgmt", vendor: "AquaFlow Pool Services", description: "Lagoon filtration overhaul — Amwaj", amount: 11200, status: "approved", orderDate: "2026-05-15" },
  { id: "PO-010", hoaId: "ent-mgmt", vendor: "Al Salam Security W.L.L.", description: "CCTV upgrade — Juffair Heights lobby", amount: 6800, status: "paid", orderDate: "2026-02-20" },
  { id: "PO-011", hoaId: "ent-mgmt", vendor: "Bahrain Waste Management", description: "Skip hire — community clean-up day", amount: 3200, status: "paid", orderDate: "2026-04-10" },
  { id: "PO-012", hoaId: "ent-mgmt", vendor: "PlaySafe Bahrain", description: "Playground equipment inspection & repair", amount: 4800, status: "approved", orderDate: "2026-06-02" },
];
