import type { Unit } from "@/types/unit";
import { BUILDINGS } from "./buildings";

const UNIT_TYPES = ["Studio", "1BR", "2BR", "3BR", "Office", "Retail"] as const;
const OWNERS = [
  "own-1", "own-2", "own-3", "own-4", "own-5", "own-6", "own-7", "own-8",
  "own-9", "own-10", "own-11", "own-12", "own-13", "own-14", "own-15",
  "own-16", "own-17", "own-18", "own-19", "own-20",
];
const TENANTS = [
  "ten-1", "ten-2", "ten-3", "ten-4", "ten-5", "ten-6", "ten-7", "ten-8",
  "ten-9", "ten-10", "ten-11", "ten-12", "ten-13", "ten-14", "ten-15",
  "ten-16", "ten-17", "ten-18", "ten-19", "ten-20",
];

/** Units per building — larger towers get more units */
const UNITS_PER_BUILDING: Record<string, number> = {
  "B-101": 22, "B-102": 16, "B-103": 19, "B-104": 12, "B-105": 10,
  "B-106": 12, "B-107": 10, "B-108": 10, "B-109": 18, "B-110": 10,
  "B-111": 10, "B-112": 10,
};

function generateUnitsForBuilding(buildingId: string, count: number): Unit[] {
  const units: Unit[] = [];
  for (let i = 0; i < count; i++) {
    const num = i + 1;
    const type = UNIT_TYPES[i % UNIT_TYPES.length];
    const ownerId = OWNERS[i % OWNERS.length];
    const unitId = `U-${buildingId.replace("B-", "")}-${String(num).padStart(2, "0")}`;
    const hasTenant = i % 4 !== 0; // ~75% occupancy
    const tenantId = TENANTS[i % TENANTS.length];

    units.push({
      id: unitId,
      buildingId,
      label: `Unit ${num} — ${type}`,
      ownershipHistory: [
        { ownerId, startDate: "2019-01-01", endDate: i % 9 === 0 ? "2023-06-01" : null },
        ...(i % 9 === 0 ? [{ ownerId: OWNERS[(i + 1) % OWNERS.length], startDate: "2023-06-02", endDate: null }] : []),
      ],
      tenancyHistory: hasTenant
        ? [{ tenantId, leaseId: `LSE-${unitId}`, startDate: "2024-01-01", endDate: null }]
        : [],
      managementPeriods: [
        { managed: true, entityId: "ent-mgmt", startDate: "2020-01-01", endDate: null },
      ],
    });
  }
  return units;
}

const DETAILED_UNITS: Unit[] = [
  {
    id: "U-1001",
    buildingId: "B-101",
    label: "Unit 1001 — 2BR",
    ownershipHistory: [
      { ownerId: "own-1", startDate: "2018-06-01", endDate: "2022-03-15" },
      { ownerId: "own-2", startDate: "2022-03-16", endDate: null },
    ],
    tenancyHistory: [
      { tenantId: "ten-1", leaseId: "LSE-9910", startDate: "2023-01-01", endDate: "2024-01-01" },
      { tenantId: "ten-1", leaseId: "LSE-9910-R", startDate: "2024-01-02", endDate: null },
    ],
    managementPeriods: [{ managed: true, entityId: "ent-mgmt", startDate: "2020-01-01", endDate: null }],
  },
  {
    id: "U-1002",
    buildingId: "B-101",
    label: "Unit 1002 — 1BR",
    ownershipHistory: [{ ownerId: "own-1", startDate: "2019-01-01", endDate: null }],
    tenancyHistory: [],
    managementPeriods: [{ managed: true, entityId: "ent-mgmt", startDate: "2020-01-01", endDate: null }],
  },
  {
    id: "U-1005",
    buildingId: "B-101",
    label: "Unit 1005 — Studio",
    ownershipHistory: [{ ownerId: "own-3", startDate: "2021-04-01", endDate: null }],
    tenancyHistory: [{ tenantId: "ten-2", leaseId: "LSE-9911", startDate: "2023-05-01", endDate: null }],
    managementPeriods: [{ managed: true, entityId: "ent-mgmt", startDate: "2021-04-01", endDate: null }],
  },
  {
    id: "U-204",
    buildingId: "B-102",
    label: "Unit 204 — 2BR",
    ownershipHistory: [{ ownerId: "own-2", startDate: "2017-08-01", endDate: null }],
    tenancyHistory: [
      { tenantId: "ten-3", leaseId: "LSE-9912", startDate: "2022-11-01", endDate: "2023-11-01" },
      { tenantId: "ten-4", leaseId: "LSE-9913", startDate: "2023-11-15", endDate: null },
    ],
    managementPeriods: [{ managed: true, entityId: "ent-mgmt", startDate: "2018-01-01", endDate: null }],
  },
  {
    id: "U-301",
    buildingId: "B-103",
    label: "Unit 301 — 3BR",
    ownershipHistory: [{ ownerId: "own-3", startDate: "2022-02-01", endDate: null }],
    tenancyHistory: [],
    managementPeriods: [
      { managed: false, entityId: "ent-mgmt", startDate: "2022-02-01", endDate: "2023-06-30" },
      { managed: true, entityId: "ent-mgmt", startDate: "2023-07-01", endDate: null },
    ],
  },
];

const GENERATED = BUILDINGS.flatMap((b) =>
  generateUnitsForBuilding(b.id, UNITS_PER_BUILDING[b.id] ?? 12)
).filter((u) => !DETAILED_UNITS.some((d) => d.id === u.id));

export const UNITS: Unit[] = [...DETAILED_UNITS, ...GENERATED];
