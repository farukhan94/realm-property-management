import { ROLE_PERSON_MAP, type Role } from "@/types/role";
import { mockInvoicesAdapter } from "./invoices";
import { mockPayoutsAdapter } from "./payouts";
import { mockSettlementsAdapter } from "./settlements";
import { mockWorkOrdersAdapter } from "./work-orders";
import { mockLeasesAdapter } from "./leases";
import { getOwnerUnits, PERSONS } from "@/lib/mock/seeds";
import { mockDocumentsAdapter } from "./documents";
import {
  LAND_DEVELOPMENT_PROJECTS,
  TENANT_NOTIFICATIONS,
  TENANT_MESSAGES,
  TENANT_FEEDBACK,
  BUILDING_OWNER_MAP,
} from "@/lib/mock/seeds/portal-extras";
import { BUILDINGS, UNITS } from "@/lib/mock/seeds";
import { SUPPLIERS, SUPPLIER_BILLS } from "@/lib/mock/seeds/suppliers";

export const mockPortalsAdapter = {
  getOwnerPortal(personId: string, mode: "building" | "flat" = "flat") {
    const isBuildingOwner = BUILDING_OWNER_MAP[personId];
    const buildingIds = isBuildingOwner ?? [];
    const units = mode === "building" && buildingIds.length > 0
      ? UNITS.filter((u) => buildingIds.includes(u.buildingId))
      : getOwnerUnits(personId);
    const landProjects = LAND_DEVELOPMENT_PROJECTS.filter((p) => p.ownerId === personId);
    return {
      mode,
      isBuildingOwner: Boolean(isBuildingOwner),
      buildings: BUILDINGS.filter((b) => buildingIds.includes(b.id)),
      units,
      settlements: mockSettlementsAdapter.consolidated(personId),
      payouts: mockPayoutsAdapter.listByOwner(personId),
      documents: mockDocumentsAdapter.list(),
      landProjects,
    };
  },

  getTenantPortal(personId: string) {
    const person = PERSONS.find((p) => p.id === personId);
    return {
      leases: mockLeasesAdapter.list().filter((l) => l.tenantId === personId),
      invoices: mockInvoicesAdapter.listByTenant(personId),
      tickets: mockWorkOrdersAdapter.list().filter((w) => w.status !== "completed").slice(0, 5),
      notifications: TENANT_NOTIFICATIONS.filter((n) => n.tenantId === personId),
      messages: TENANT_MESSAGES.filter((m) => m.tenantId === personId),
      feedback: TENANT_FEEDBACK.filter((f) => f.tenantId === personId),
      profile: person ? { name: person.name, email: person.email, phone: person.phone, nationality: person.nationality } : null,
    };
  },

  getTechnicianPortal(personId: string) {
    return {
      jobs: mockWorkOrdersAdapter.list().filter((w) => w.assignedTechnicianId === personId || w.status === "new"),
    };
  },

  getSupplierPortal(supplierId: string) {
    const supplier = SUPPLIERS.find((s) => s.id === supplierId);
    const jobs = mockWorkOrdersAdapter.list().filter((w) => w.status !== "completed").slice(0, 10);
    const bills = SUPPLIER_BILLS.filter((b) => b.supplierId === supplierId);
    return { supplier, jobs, bills };
  },

  getForRole(role: Role) {
    const personId = ROLE_PERSON_MAP[role];
    if (role === "Building Owner" && personId) return mockPortalsAdapter.getOwnerPortal(personId, "building");
    if (role === "Flat Owner" && personId) return mockPortalsAdapter.getOwnerPortal(personId, "flat");
    if (role === "Tenant" && personId) return mockPortalsAdapter.getTenantPortal(personId);
    if (role === "Providers / Suppliers" && personId) return mockPortalsAdapter.getSupplierPortal(personId);
    if (!personId) return null;
    return null;
  },
};
