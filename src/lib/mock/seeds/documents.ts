import type { DocumentRecord } from "@/types/document";

export const DOCUMENTS: DocumentRecord[] = [
  { id: "DOC-001", name: "Lease Agreement — Alice Cooper (U-1001)", type: "lease", unitId: "U-1001", buildingId: "B-101", date: "2024-01-05", size: "2.4 MB", visibility: ["Admin", "Property Manager", "Tenant"], entityId: "ent-mgmt" },
  { id: "DOC-002", name: "Property Title Deed — Bahrain Bay Residences", type: "title_deed", buildingId: "B-101", date: "2018-06-12", size: "15.1 MB", visibility: ["Admin"], entityId: "ent-mgmt" },
  { id: "DOC-003", name: "HOA Board Pack Q1 2026 — Bahrain Bay", type: "board_pack", hoaId: "ent-mgmt", date: "2026-03-15", size: "8.5 MB", visibility: ["Admin", "Property Manager"], entityId: "ent-mgmt" },
  { id: "DOC-004", name: "EWA Connection Certificate — U-1005", type: "report", unitId: "U-1005", buildingId: "B-101", date: "2023-04-28", size: "0.8 MB", visibility: ["Admin", "Property Manager", "Tenant"], entityId: "ent-mgmt" },
  { id: "DOC-005", name: "Building Plan — Amwaj Lagoon Villas", type: "report", buildingId: "B-102", date: "2020-11-20", size: "45.0 MB", visibility: ["Admin"], entityId: "ent-mgmt" },
  { id: "DOC-006", name: "Maintenance Policy 2026", type: "policy", buildingId: "B-101", date: "2026-01-01", size: "1.2 MB", visibility: ["Admin", "Property Manager", "Tenant"], entityId: "ent-mgmt" },
  { id: "DOC-007", name: "RERA Broker License — Manzel Bahrain W.L.L.", type: "policy", date: "2025-12-01", size: "0.5 MB", visibility: ["Admin"], entityId: "ent-mgmt" },
  { id: "DOC-008", name: "Sijilat CR Copy — Manzel Property Management", type: "report", date: "2026-01-10", size: "0.3 MB", visibility: ["Admin"], entityId: "ent-mgmt" },
  { id: "DOC-009", name: "Otis Elevator Safety Certificate — B-101", type: "report", buildingId: "B-101", date: "2026-05-20", size: "1.1 MB", visibility: ["Admin", "Property Manager"], entityId: "ent-mgmt" },
  { id: "DOC-010", name: "NBB Bank Statement — Owner Payouts May 2026", type: "invoice", date: "2026-06-05", size: "0.6 MB", visibility: ["Admin", "Property Manager"], entityId: "ent-mgmt" },
  { id: "DOC-011", name: "BenefitPay Transaction Report — June 2026", type: "invoice", date: "2026-06-08", size: "0.9 MB", visibility: ["Admin", "Property Manager"], entityId: "ent-mgmt" },
  { id: "DOC-012", name: "Civil Defence Fire Safety Certificate — B-102", type: "report", buildingId: "B-102", date: "2026-04-15", size: "2.0 MB", visibility: ["Admin", "Property Manager"], entityId: "ent-mgmt" },
  { id: "DOC-013", name: "HOA AGM Minutes — Amwaj Lagoon Q1 2026", type: "board_pack", hoaId: "ent-mgmt", date: "2026-03-22", size: "3.2 MB", visibility: ["Admin", "Property Manager"], entityId: "ent-mgmt" },
  { id: "DOC-014", name: "LMRA Expat Lease Registration — U-204", type: "lease", unitId: "U-204", buildingId: "B-102", date: "2023-11-20", size: "1.0 MB", visibility: ["Admin", "Property Manager"], entityId: "ent-mgmt" },
  { id: "DOC-015", name: "SLRB Tenancy Contract Template — Kingdom of Bahrain", type: "policy", date: "2025-06-01", size: "0.7 MB", visibility: ["Admin", "Property Manager"], entityId: "ent-mgmt" },
  { id: "DOC-016", name: "EWA Bulk Bill Import — Q2 2026", type: "report", date: "2026-06-01", size: "4.5 MB", visibility: ["Admin", "Property Manager"], entityId: "ent-mgmt" },
  { id: "DOC-017", name: "Service Charge Invoice — Q2 2026 U-101-03", type: "invoice", unitId: "U-101-03", hoaId: "ent-mgmt", date: "2026-04-01", size: "0.4 MB", visibility: ["Admin", "Property Manager", "Owner"], entityId: "ent-mgmt" },
  { id: "DOC-018", name: "Procurement PO — Otis Elevator Maintenance", type: "report", hoaId: "ent-mgmt", date: "2026-01-15", size: "0.8 MB", visibility: ["Admin", "Property Manager"], entityId: "ent-mgmt" },
  { id: "DOC-019", name: "Insurance Certificate — Building All-Risk B-103", type: "report", buildingId: "B-103", date: "2026-02-01", size: "1.5 MB", visibility: ["Admin"], entityId: "ent-mgmt" },
  { id: "DOC-020", name: "Tamkeen Training Grant — Technician Certification", type: "report", date: "2025-11-10", size: "0.5 MB", visibility: ["Admin"], entityId: "ent-mgmt" },
];
