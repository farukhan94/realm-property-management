import type { DispatchSlot, MaintenanceSchedule } from "@/types/maintenance";
import { COMPANY_ID } from "@/lib/mock/navigation";
import { WORK_ORDERS } from "./work-orders";

const TECHS = ["tech-1", "tech-2", "tech-3", "tech-4", "tech-5"];

const FAC_SCHEDULES = [
  { assetId: "AST-001", buildingId: "B-101", title: "Quarterly HVAC service — chiller plant", frequency: "quarterly" as const, nextDue: "2026-07-15" },
  { assetId: "AST-002", buildingId: "B-101", title: "Annual EWA meter inspection", frequency: "annual" as const, nextDue: "2026-09-01" },
  { assetId: "AST-003", buildingId: "B-102", title: "Fire safety system check — Civil Defence cert", frequency: "annual" as const, nextDue: "2026-08-20" },
  { assetId: "AST-004", buildingId: "B-103", title: "Elevator maintenance — Otis Bahrain", frequency: "monthly" as const, nextDue: "2026-07-01" },
  { assetId: "AST-005", buildingId: "B-104", title: "Pool filtration service — Juffair tower", frequency: "monthly" as const, nextDue: "2026-06-25" },
  { assetId: "AST-006", buildingId: "B-101", title: "Generator load test — 500kVA", frequency: "quarterly" as const, nextDue: "2026-08-10" },
  { assetId: "AST-007", buildingId: "B-102", title: "Water pump inspection — lagoon supply", frequency: "monthly" as const, nextDue: "2026-07-05" },
  { assetId: "AST-008", buildingId: "B-103", title: "CCTV system audit", frequency: "annual" as const, nextDue: "2026-10-15" },
  { assetId: "AST-009", buildingId: "B-104", title: "Parking barrier service", frequency: "quarterly" as const, nextDue: "2026-07-20" },
  { assetId: "AST-010", buildingId: "B-101", title: "Kitchen exhaust cleaning — retail podium", frequency: "monthly" as const, nextDue: "2026-06-28" },
];

const MGMT_SCHEDULES = [
  { assetId: "AST-011", buildingId: "B-104", title: "Quarterly AC servicing — managed apartments", frequency: "quarterly" as const, nextDue: "2026-07-10" },
  { assetId: "AST-012", buildingId: "B-105", title: "Tenant unit HVAC filter replacement programme", frequency: "monthly" as const, nextDue: "2026-07-01" },
  { assetId: "AST-013", buildingId: "B-107", title: "Water heater anode inspection — Hamala block", frequency: "annual" as const, nextDue: "2026-11-01" },
  { assetId: "AST-014", buildingId: "B-108", title: "Executive suite fire extinguisher check", frequency: "annual" as const, nextDue: "2026-09-15" },
];

const HOA_SCHEDULES = [
  { assetId: "AST-015", buildingId: "B-101", title: "Monthly pool cleaning — Bahrain Bay", frequency: "monthly" as const, nextDue: "2026-07-01" },
  { assetId: "AST-016", buildingId: "B-101", title: "Quarterly elevator maintenance — Otis", frequency: "quarterly" as const, nextDue: "2026-08-01" },
  { assetId: "AST-017", buildingId: "B-104", title: "Annual generator load test — Juffair Heights", frequency: "annual" as const, nextDue: "2026-10-01" },
  { assetId: "AST-018", buildingId: "B-102", title: "Monthly lagoon pump service — Amwaj", frequency: "monthly" as const, nextDue: "2026-07-05" },
  { assetId: "AST-019", buildingId: "B-110", title: "Quarterly landscaping irrigation audit — Budaiya", frequency: "quarterly" as const, nextDue: "2026-08-15" },
  { assetId: "AST-020", buildingId: "B-103", title: "Monthly street lighting inspection — Riffa Views", frequency: "monthly" as const, nextDue: "2026-07-08" },
  { assetId: "AST-021", buildingId: "B-103", title: "Annual road maintenance survey", frequency: "annual" as const, nextDue: "2026-12-01" },
  { assetId: "AST-022", buildingId: "B-106", title: "Monthly playground safety check — Diyar", frequency: "monthly" as const, nextDue: "2026-07-03" },
  { assetId: "AST-023", buildingId: "B-106", title: "Quarterly community centre HVAC — Diyar", frequency: "quarterly" as const, nextDue: "2026-09-01" },
];

export const MAINTENANCE_SCHEDULES: MaintenanceSchedule[] = [];

let pmIdx = 1;
FAC_SCHEDULES.forEach((s, i) => {
  MAINTENANCE_SCHEDULES.push({
    id: `PM-${String(pmIdx++).padStart(3, "0")}`,
    ...s,
    assignedTechnicianId: TECHS[i % TECHS.length],
    entityId: COMPANY_ID,
  });
});

MGMT_SCHEDULES.forEach((s, i) => {
  MAINTENANCE_SCHEDULES.push({
    id: `PM-${String(pmIdx++).padStart(3, "0")}`,
    ...s,
    assignedTechnicianId: TECHS[(i + 1) % TECHS.length],
    entityId: COMPANY_ID,
  });
});

HOA_SCHEDULES.forEach((s, i) => {
  MAINTENANCE_SCHEDULES.push({
    id: `PM-${String(pmIdx++).padStart(3, "0")}`,
    ...s,
    assignedTechnicianId: TECHS[(i + 2) % TECHS.length],
    entityId: COMPANY_ID,
  });
});

// Dispatch slots for open work orders
const openOrders = WORK_ORDERS.filter((w) => w.status !== "completed" && w.status !== "cancelled");
const DATES = ["2026-06-10", "2026-06-11", "2026-06-12", "2026-06-13"];
const TIME_SLOTS = [
  { start: "08:00", end: "10:00" },
  { start: "10:30", end: "12:30" },
  { start: "13:00", end: "15:00" },
  { start: "15:30", end: "17:30" },
];

export const DISPATCH_SLOTS: DispatchSlot[] = openOrders.slice(0, 40).map((wo, i) => {
  const slot = TIME_SLOTS[i % TIME_SLOTS.length];
  const tech = wo.assignedTechnicianId ?? TECHS[i % TECHS.length];
  return {
    id: `DS-${String(i + 1).padStart(3, "0")}`,
    technicianId: tech,
    workOrderId: wo.id,
    date: DATES[i % DATES.length],
    startTime: slot.start,
    endTime: slot.end,
  };
});
