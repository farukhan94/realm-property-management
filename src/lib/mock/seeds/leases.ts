import type { Lease } from "@/types/lease";
import { UNITS } from "./units";

/** Base rent by unit type (BHD) */
const RENT_BY_TYPE: Record<string, number> = {
  Studio: 280,
  "1BR": 350,
  "2BR": 420,
  "3BR": 550,
  Office: 680,
  Retail: 920,
};

/** Location multipliers for realistic Bahrain rents */
const BUILDING_RENT_MULTIPLIER: Record<string, number> = {
  "B-101": 1.15, // Bahrain Bay / Seef — premium
  "B-102": 1.05, // Amwaj Islands
  "B-103": 1.0,  // East Riffa
  "B-104": 1.08, // Juffair — expat hub
  "B-105": 0.92, // Sanabis
  "B-106": 0.95, // Diyar Al Muharraq
  "B-107": 0.88, // Hamala — coastal
  "B-108": 1.02, // Saar — executive
  "B-109": 1.2,  // Diplomatic Area — commercial premium
  "B-110": 0.9,  // Budaiya — waterfront villas
  "B-111": 0.85, // Isa Town — commercial
  "B-112": 0.8,  // Muharraq heritage — under construction
};

function rentForUnit(unitId: string): number {
  const unit = UNITS.find((u) => u.id === unitId);
  if (!unit) return 400;
  const type = unit.label.split("—")[1]?.trim() ?? "2BR";
  const base = RENT_BY_TYPE[type] ?? 400;
  const mult = BUILDING_RENT_MULTIPLIER[unit.buildingId] ?? 1;
  return Math.round(base * mult);
}

export const LEASES: Lease[] = [
  { id: "LSE-9910-R", unitId: "U-1001", tenantId: "ten-1", startDate: "2024-01-02", endDate: "2025-01-01", monthlyRent: 483, deposit: 966, status: "active", entityId: "ent-mgmt", escalationPercent: 5, vatInclusive: false, ewaAccount: "EWA-881201" },
  { id: "LSE-9911", unitId: "U-1005", tenantId: "ten-2", startDate: "2023-05-01", endDate: "2025-05-01", monthlyRent: 322, deposit: 322, status: "active", entityId: "ent-mgmt", ewaAccount: "EWA-881205" },
  { id: "LSE-9913", unitId: "U-204", tenantId: "ten-4", startDate: "2023-11-15", endDate: "2024-11-15", monthlyRent: 441, deposit: 441, status: "active", entityId: "ent-mgmt", ramadanAdjustment: true, ewaAccount: "EWA-770204" },
  { id: "LSE-9912", unitId: "U-204", tenantId: "ten-3", startDate: "2022-11-01", endDate: "2023-11-01", monthlyRent: 400, deposit: 400, status: "expired", entityId: "ent-mgmt" },
  { id: "LSE-9901", unitId: "U-1001", tenantId: "ten-1", startDate: "2023-01-01", endDate: "2024-01-01", monthlyRent: 460, deposit: 920, status: "renewed", entityId: "ent-mgmt" },
  { id: "LSE-TERM-01", unitId: "U-301", tenantId: "ten-5", startDate: "2023-01-01", endDate: "2024-06-30", monthlyRent: 550, deposit: 1100, status: "terminated", entityId: "ent-mgmt" },
];

// Generate leases for units with active tenancy
UNITS.filter((u) => u.tenancyHistory.length > 0).forEach((unit) => {
  const tenancy = unit.tenancyHistory.find((t) => !t.endDate);
  if (!tenancy || LEASES.some((l) => l.id === tenancy.leaseId)) return;
  const rent = rentForUnit(unit.id);
  LEASES.push({
    id: tenancy.leaseId ?? `LSE-${unit.id}`,
    unitId: unit.id,
    tenantId: tenancy.tenantId,
    startDate: tenancy.startDate,
    endDate: "2025-12-31",
    monthlyRent: rent,
    deposit: rent,
    status: "active",
    entityId: "ent-mgmt",
    ewaAccount: `EWA-${unit.id.replace(/-/g, "")}`,
    ...(unit.buildingId === "B-104" ? { ramadanAdjustment: true } : {}),
  });
});

// Historical leases for portfolio depth
const TENANT_POOL = [
  "ten-1", "ten-2", "ten-3", "ten-4", "ten-5", "ten-6", "ten-7", "ten-8",
  "ten-9", "ten-10", "ten-11", "ten-12", "ten-13", "ten-14", "ten-15",
  "ten-16", "ten-17", "ten-18", "ten-19", "ten-20",
];
const STATUSES: Lease["status"][] = ["active", "active", "active", "active", "expired", "renewed", "terminated"];

let leaseIdx = LEASES.length;
for (let i = leaseIdx; i < 85; i++) {
  const unit = UNITS[i % UNITS.length];
  const tenant = TENANT_POOL[i % TENANT_POOL.length];
  const rent = rentForUnit(unit.id);
  const status = STATUSES[i % STATUSES.length];
  const startYear = status === "expired" ? 2022 : status === "terminated" ? 2023 : 2024;
  const startMonth = (i % 12) + 1;
  const startDate = `${startYear}-${String(startMonth).padStart(2, "0")}-01`;
  const endYear = startYear + 1;
  const endDate = `${endYear}-${String(startMonth).padStart(2, "0")}-01`;

  LEASES.push({
    id: `LSE-GEN-${String(i).padStart(3, "0")}`,
    unitId: unit.id,
    tenantId: tenant,
    startDate,
    endDate,
    monthlyRent: rent,
    deposit: rent * 2,
    status,
    entityId: "ent-mgmt",
    ewaAccount: status === "active" || status === "renewed" ? `EWA-${unit.id.replace(/-/g, "")}` : undefined,
    escalationPercent: i % 3 === 0 ? 5 : undefined,
    ramadanAdjustment: unit.buildingId === "B-104" && i % 2 === 0,
  });
}
