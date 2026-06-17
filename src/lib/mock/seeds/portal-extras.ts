import type {
  LandDevelopmentProject,
  TenantNotification,
  TenantFeedback,
  TenantMessage,
  VacantListing,
} from "@/types/portal-extras";

export const LAND_DEVELOPMENT_PROJECTS: LandDevelopmentProject[] = [
  {
    id: "LDP-001",
    ownerId: "own-3",
    plotReference: "Plot 284 — Diyar Al Muharraq",
    location: "Diyar Al Muharraq, Block 284",
    stages: [
      { id: "st-1", stage: 1, title: "Architectural Design Approval", status: "approved", submittedDate: "2025-09-15", completedDate: "2025-11-20", reviewer: "Internal Design Team" },
      { id: "st-2", stage: 2, title: "HOA Board Approval", status: "in_review", submittedDate: "2025-12-01", reviewer: "Diyar HOA Board" },
      { id: "st-3", stage: 3, title: "Municipal / Government Approvals", status: "pending" },
      { id: "st-4", stage: 4, title: "Utility Connection (EWA)", status: "pending" },
    ],
  },
  {
    id: "LDP-002",
    ownerId: "own-1",
    plotReference: "Plot 112 — Amwaj Islands",
    location: "Amwaj Islands, North Lagoon",
    stages: [
      { id: "st-5", stage: 1, title: "Architectural Design Approval", status: "in_review", submittedDate: "2026-03-10", reviewer: "Internal Design Team" },
      { id: "st-6", stage: 2, title: "HOA Board Approval", status: "pending" },
      { id: "st-7", stage: 3, title: "Municipal / Government Approvals", status: "pending" },
      { id: "st-8", stage: 4, title: "Utility Connection (EWA)", status: "pending" },
    ],
  },
];

export const TENANT_NOTIFICATIONS: TenantNotification[] = [
  { id: "TN-001", tenantId: "ten-1", type: "rent_due", title: "Rent due in 3 days", message: "Your June rent of BHD 450.000 is due on 20 Jun 2026.", date: "2026-06-17", read: false },
  { id: "TN-002", tenantId: "ten-1", type: "maintenance", title: "Water maintenance scheduled", message: "Building water supply maintenance on 19 Jun, 10:00–14:00.", date: "2026-06-16", read: false },
  { id: "TN-003", tenantId: "ten-1", type: "lease", title: "Lease renewal reminder", message: "Your lease expires 31 Dec 2026. Contact management to renew.", date: "2026-06-10", read: true },
  { id: "TN-004", tenantId: "ten-1", type: "general", title: "Pool reservation approved", message: "Your pool booking for 20 Jun 14:00–16:00 is confirmed.", date: "2026-06-15", read: true },
];

export const TENANT_FEEDBACK: TenantFeedback[] = [
  { id: "FB-001", tenantId: "ten-1", category: "Maintenance", rating: 4, message: "Quick response to AC issue last week.", submittedAt: "2026-06-01" },
];

export const TENANT_MESSAGES: TenantMessage[] = [
  { id: "MSG-001", tenantId: "ten-1", ownerId: "own-2", subject: "Lease renewal inquiry", body: "Hi, I would like to discuss renewing my lease for another year.", sentAt: "2026-06-10T10:00:00", direction: "to_owner" },
  { id: "MSG-002", tenantId: "ten-1", ownerId: "own-2", subject: "Re: Lease renewal inquiry", body: "Thank you Alice. We will send renewal terms by end of week.", sentAt: "2026-06-10T14:30:00", direction: "from_owner" },
];

export const VACANT_LISTINGS: VacantListing[] = [
  { id: "VL-001", unitId: "U-1002", buildingId: "B-101", buildingName: "Bahrain Bay Residences", label: "Unit 1002 — 1BR", type: "1BR", monthlyRent: 380, bedrooms: 1, areaSqm: 72, description: "Bright 1BR with sea view, fully furnished.", availableFrom: "2026-07-01" },
  { id: "VL-002", unitId: "U-301", buildingId: "B-103", buildingName: "Seef Gateway Tower", label: "Unit 301 — 3BR", type: "3BR", monthlyRent: 650, bedrooms: 3, areaSqm: 145, description: "Spacious 3BR penthouse with parking.", availableFrom: "2026-06-20" },
  { id: "VL-003", unitId: "U-108-01", buildingId: "B-108", buildingName: "Riffa Views", label: "Unit 01 — Studio", type: "Studio", monthlyRent: 220, bedrooms: 0, areaSqm: 42, description: "Modern studio near shopping district.", availableFrom: "2026-06-25" },
  { id: "VL-004", unitId: "U-104-03", buildingId: "B-104", buildingName: "Juffair Heights", label: "Unit 03 — 2BR", type: "2BR", monthlyRent: 480, bedrooms: 2, areaSqm: 98, description: "2BR with balcony, EWA included.", availableFrom: "2026-07-15" },
  { id: "VL-005", unitId: "U-107-02", buildingId: "B-107", buildingName: "Adliya Lofts", label: "Unit 02 — Office", type: "Office", monthlyRent: 550, bedrooms: 0, areaSqm: 65, description: "Ground floor office space, high foot traffic.", availableFrom: "2026-06-18" },
];

/** Building Owner owns entire buildings */
export const BUILDING_OWNER_MAP: Record<string, string[]> = {
  "own-1": ["B-101", "B-102"],
};
