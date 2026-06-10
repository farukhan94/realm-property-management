import type { Asset } from "@/types/asset";
import { BUILDINGS } from "./buildings";
import { UNITS } from "./units";

const ASSET_TEMPLATES = [
  { name: "HVAC Unit — Carrier 42Q", category: "HVAC", status: "needs_service" as const, health: 72 },
  { name: "EWA Smart Meter", category: "Utilities", status: "healthy" as const, health: 95 },
  { name: "Fire Panel — Honeywell", category: "Safety", status: "healthy" as const, health: 88 },
  { name: "Elevator — Otis Gen2", category: "Elevator", status: "healthy" as const, health: 91 },
  { name: "Water Heater — Rheem 80L", category: "Plumbing", status: "critical" as const, health: 28 },
  { name: "Generator — Cummins 500kVA", category: "Electrical", status: "healthy" as const, health: 85 },
  { name: "Chiller Plant — Trane", category: "HVAC", status: "needs_service" as const, health: 68 },
  { name: "CCTV NVR — Hikvision 32ch", category: "Security", status: "healthy" as const, health: 92 },
  { name: "Pool Filtration Pump — Pentair", category: "Plumbing", status: "healthy" as const, health: 78 },
  { name: "BMS Controller — Schneider", category: "Electrical", status: "healthy" as const, health: 90 },
  { name: "Parking Barrier — FAAC", category: "Security", status: "needs_service" as const, health: 65 },
  { name: "Kitchen Exhaust Fan", category: "HVAC", status: "healthy" as const, health: 80 },
];

export const ASSETS: Asset[] = [];

let astIdx = 1;
BUILDINGS.forEach((building, bIdx) => {
  const buildingUnits = UNITS.filter((u) => u.buildingId === building.id);
  const count = Math.min(3, buildingUnits.length || 1);
  for (let i = 0; i < count; i++) {
    const template = ASSET_TEMPLATES[(bIdx + i) % ASSET_TEMPLATES.length];
    const unit = buildingUnits[i] ?? buildingUnits[0];
    ASSETS.push({
      id: `AST-${String(astIdx).padStart(3, "0")}`,
      name: `${template.name} — ${building.name.split(" ")[0]}`,
      unitId: unit?.id ?? `U-${building.id.replace("B-", "")}-01`,
      buildingId: building.id,
      category: template.category,
      status: template.status,
      installed: `202${(bIdx + i) % 4}-0${((bIdx + i) % 9) + 1}-15`,
      health: template.health + (i % 5) - 2,
    });
    astIdx++;
  }
});
