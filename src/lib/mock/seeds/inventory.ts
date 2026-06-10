import type { InventoryPart, InventoryConsumption } from "@/types/inventory";
import { WORK_ORDERS } from "./work-orders";

export const INVENTORY_PARTS: InventoryPart[] = [
  { id: "INV-001", sku: "HVAC-FLT-01", name: "AC Filter — Standard (Gree/Carrier)", category: "HVAC", stockQty: 48, unitCost: 8.5, reorderLevel: 20 },
  { id: "INV-002", sku: "EWA-MTR-02", name: "EWA Smart Meter Module", category: "Utilities", stockQty: 12, unitCost: 65, reorderLevel: 5 },
  { id: "INV-003", sku: "LOCK-YL-03", name: "Yale Smart Lock Battery Pack", category: "Security", stockQty: 24, unitCost: 12, reorderLevel: 10 },
  { id: "INV-004", sku: "PLM-TAP-04", name: "Grohe Mixer Tap Cartridge", category: "Plumbing", stockQty: 18, unitCost: 15, reorderLevel: 8 },
  { id: "INV-005", sku: "ELC-LED-05", name: "LED Panel 60x60 — Philips", category: "Electrical", stockQty: 30, unitCost: 22, reorderLevel: 12 },
  { id: "INV-006", sku: "HVAC-REF-06", name: "R410A Refrigerant (1kg)", category: "HVAC", stockQty: 8, unitCost: 42, reorderLevel: 4 },
  { id: "INV-007", sku: "PLM-VAL-07", name: "Pressure Relief Valve — Water Heater", category: "Plumbing", stockQty: 14, unitCost: 18, reorderLevel: 6 },
  { id: "INV-008", sku: "ELC-MCB-08", name: "Schneider MCB 32A", category: "Electrical", stockQty: 22, unitCost: 9.5, reorderLevel: 10 },
  { id: "INV-009", sku: "SEC-CAM-09", name: "Hikvision Dome Camera", category: "Security", stockQty: 6, unitCost: 85, reorderLevel: 3 },
  { id: "INV-010", sku: "HVAC-DRV-10", name: "AC Inverter Driver Board", category: "HVAC", stockQty: 5, unitCost: 120, reorderLevel: 2 },
  { id: "INV-011", sku: "PLM-SEAL-11", name: "Bathroom Silicone Sealant (EWA-rated)", category: "Plumbing", stockQty: 36, unitCost: 4.5, reorderLevel: 15 },
  { id: "INV-012", sku: "ELC-DRV-12", name: "LED Driver 40W — Lobby panels", category: "Electrical", stockQty: 16, unitCost: 18, reorderLevel: 8 },
  { id: "INV-013", sku: "GEN-FUSE-13", name: "Generator Fuse Set — 500kVA", category: "Electrical", stockQty: 4, unitCost: 55, reorderLevel: 2 },
  { id: "INV-014", sku: "POOL-SND-14", name: "Pool Sand Filter Media (25kg)", category: "Plumbing", stockQty: 10, unitCost: 28, reorderLevel: 4 },
  { id: "INV-015", sku: "HVAC-CLN-15", name: "Coil Cleaning Solution (5L)", category: "HVAC", stockQty: 12, unitCost: 32, reorderLevel: 5 },
  { id: "INV-016", sku: "SEC-IC-16", name: "Building Intercom Handset", category: "Security", stockQty: 8, unitCost: 45, reorderLevel: 4 },
  { id: "INV-017", sku: "PLM-PMP-17", name: "Grundfos Water Pump Impeller", category: "Plumbing", stockQty: 3, unitCost: 95, reorderLevel: 2 },
  { id: "INV-018", sku: "ELC-CONT-18", name: "Contactor 3P 40A — Chiller", category: "Electrical", stockQty: 2, unitCost: 145, reorderLevel: 1 },
  { id: "INV-019", sku: "HVAC-BELT-19", name: "Fan Belt — Carrier Chiller", category: "HVAC", stockQty: 6, unitCost: 22, reorderLevel: 3 },
  { id: "INV-020", sku: "GEN-KEY-20", name: "Parking Remote — FAAC Barrier", category: "Security", stockQty: 15, unitCost: 8, reorderLevel: 8 },
];

export const INVENTORY_CONSUMPTIONS: InventoryConsumption[] = [
  { id: "IC-1", partId: "INV-001", workOrderId: "WO-8092", quantity: 2, consumedAt: "2026-06-08T14:00:00Z" },
  { id: "IC-2", partId: "INV-005", workOrderId: "WO-8091", quantity: 2, consumedAt: "2026-06-05T15:00:00Z" },
  { id: "IC-3", partId: "INV-006", workOrderId: "WO-8092", quantity: 1, consumedAt: "2026-06-08T15:30:00Z" },
  { id: "IC-4", partId: "INV-012", workOrderId: "WO-8091", quantity: 2, consumedAt: "2026-06-05T16:00:00Z" },
];

// Link consumptions to additional work orders
WORK_ORDERS.filter((w) => w.costLines.some((c) => c.type === "material")).slice(0, 15).forEach((wo, i) => {
  if (INVENTORY_CONSUMPTIONS.some((c) => c.workOrderId === wo.id)) return;
  const part = INVENTORY_PARTS[i % INVENTORY_PARTS.length];
  INVENTORY_CONSUMPTIONS.push({
    id: `IC-${INVENTORY_CONSUMPTIONS.length + 1}`,
    partId: part.id,
    workOrderId: wo.id,
    quantity: 1 + (i % 3),
    consumedAt: wo.createdAt,
  });
});
