import type { WorkOrder } from "@/types/work-order";
import { COMPANY_ID } from "@/lib/mock/navigation";
import { UNITS } from "./units";

const TECHS = ["tech-1", "tech-2", "tech-3", "tech-4", "tech-5"] as const;
const STATUSES = ["new", "assigned", "in_progress", "completed"] as const;
const PRIORITIES = ["low", "medium", "high", "critical"] as const;

const MGMT_TITLES = [
  "AC blowing warm air — tenant complaint",
  "Water heater leak — urgent",
  "Kitchen extractor fault",
  "Door lock jammed — Yale smart lock",
  "Intercom static on handset",
  "Window seal repair — sea humidity damage",
  "Plumbing leak under sink",
  "EWA smart meter display fault",
  "Paint touch-up after move-out",
  "BenefitPay payment gateway sync issue",
  "Balcony drain blocked",
  "Bathroom exhaust fan failure",
];

const FAC_TITLES = [
  "Chiller plant compressor failure — B-101",
  "Elevator annual inspection — Otis Bahrain",
  "Generator load test — basement plant room",
  "Fire alarm panel zone fault",
  "Parking barrier motor replacement",
  "CCTV camera offline — lobby",
  "Water pump cavitation noise",
  "HVAC duct cleaning — commercial floor",
  "Emergency lighting battery swap",
  "BMS controller firmware update",
];

const HOA_TITLES = [
  "Lobby marble polishing — Bahrain Bay",
  "Swimming pool filtration maintenance",
  "Landscaping irrigation repair — Seef",
  "Common area LED upgrade — corridor B",
  "Elevator cab refurbishment",
  "Security gate intercom repair",
  "Lagoon walkway tile repair — Amwaj",
  "Pool pump noise investigation",
  "Clubhouse AC compressor service",
  "Marina lighting pole replacement",
  "Beach access gate motor fault",
  "Road resurfacing follow-up — Riffa Views",
  "Street lighting outage — Block 913",
  "Playground safety inspection",
  "Waste collection area clean-up",
  "Community centre HVAC service",
  "Dragon City access road pothole repair",
  "Community mosque AC service",
  "Playground equipment safety check",
  "Street sweeper route obstruction",
  "Common area generator test",
];

function makeWo(
  id: string,
  title: string,
  unit: { id: string; buildingId: string },
  entityId: string,
  status: (typeof STATUSES)[number],
  priority: (typeof PRIORITIES)[number],
  techIdx: number | null,
  billTo: WorkOrder["billTo"],
  day: number,
  withCosts: boolean
): WorkOrder {
  const tech = techIdx !== null ? TECHS[techIdx % TECHS.length] : null;
  const completed = status === "completed";
  return {
    id,
    title,
    unitId: unit.id,
    buildingId: unit.buildingId,
    status,
    priority,
    assignedTechnicianId: tech,
    entityId,
    billTo,
    createdAt: `2026-06-${String(day).padStart(2, "0")}T${String(8 + (techIdx ?? 0)).padStart(2, "0")}:00:00Z`,
    completedAt: completed ? `2026-06-${String(Math.min(day + 1, 10)).padStart(2, "0")}T16:00:00Z` : null,
    costLines: withCosts
      ? [
          {
            id: `cl-${id}-1`,
            type: "labour",
            description: "Field labour (2h)",
            quantity: 2,
            unitCost: 25,
            markupPercent: 15,
          },
          ...(priority === "critical" || priority === "high"
            ? [{
                id: `cl-${id}-2`,
                type: "material" as const,
                description: "Replacement parts",
                quantity: 1,
                unitCost: 45,
                markupPercent: 20,
              }]
            : []),
        ]
      : [],
  };
}

export const WORK_ORDERS: WorkOrder[] = [
  makeWo("WO-8092", "AC blowing warm air", UNITS.find((u) => u.id === "U-1001")!, COMPANY_ID, "in_progress", "high", 0, "owner", 8, true),
  makeWo("WO-8094", "Water heater leak", UNITS.find((u) => u.id === "U-204")!, COMPANY_ID, "assigned", "critical", 1, "owner", 10, true),
  makeWo("WO-8091", "Lobby lights flickering", UNITS.find((u) => u.id === "U-1001")!, COMPANY_ID, "completed", "low", 0, "hoa", 4, true),
  makeWo("WO-8095", "EWA meter fault", UNITS.find((u) => u.id === "U-1005")!, COMPANY_ID, "new", "medium", null, "owner", 10, false),
  makeWo("WO-8096", "Elevator annual inspection — Otis Bahrain", UNITS.find((u) => u.id === "U-1001")!, COMPANY_ID, "in_progress", "medium", 2, "hoa", 7, true),
];

// ent-mgmt — tenant / property management requests
const mgmtUnits = UNITS.filter((u) => u.buildingId.startsWith("B-10")).slice(0, 20);
MGMT_TITLES.forEach((title, i) => {
  const unit = mgmtUnits[i % mgmtUnits.length] ?? UNITS[0];
  WORK_ORDERS.push(
    makeWo(
      `WO-MGMT-${String(i + 1).padStart(3, "0")}`,
      title,
      unit,
      COMPANY_ID,
      STATUSES[i % STATUSES.length],
      PRIORITIES[i % PRIORITIES.length],
      i % 4 === 0 ? null : i,
      "owner",
      (i % 9) + 1,
      i % 2 === 0
    )
  );
});

// Facility contractor jobs
const facUnits = UNITS.slice(0, 25);
FAC_TITLES.forEach((title, i) => {
  const unit = facUnits[i % facUnits.length];
  WORK_ORDERS.push(
    makeWo(
      `WO-FAC-${String(i + 1).padStart(3, "0")}`,
      title,
      unit,
      COMPANY_ID,
      STATUSES[(i + 1) % STATUSES.length],
      PRIORITIES[(i + 2) % PRIORITIES.length],
      i,
      i % 3 === 0 ? "hoa" : "owner",
      (i % 8) + 2,
      true
    )
  );
});

// Common area maintenance
const hoaBuildings = ["B-101", "B-103"];
HOA_TITLES.forEach((title, i) => {
  const buildingId = hoaBuildings[i % hoaBuildings.length];
  const unit = UNITS.find((u) => u.buildingId === buildingId) ?? UNITS[0];
  WORK_ORDERS.push(
    makeWo(
      `WO-HOA-${String(i + 1).padStart(2, "0")}`,
      title,
      unit,
      COMPANY_ID,
      STATUSES[i % STATUSES.length],
      i === 0 ? "high" : PRIORITIES[i % PRIORITIES.length],
      i % 5,
      "hoa",
      (i % 7) + 3,
      i % 2 === 0
    )
  );
});
