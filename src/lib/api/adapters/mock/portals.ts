import { ROLE_PERSON_MAP, type Role } from "@/types/role";
import { mockInvoicesAdapter } from "./invoices";
import { mockPayoutsAdapter } from "./payouts";
import { mockSettlementsAdapter } from "./settlements";
import { mockWorkOrdersAdapter } from "./work-orders";
import { mockLeasesAdapter } from "./leases";
import { getOwnerUnits } from "@/lib/mock/seeds";
import { mockDocumentsAdapter } from "./documents";

export const mockPortalsAdapter = {
  getOwnerPortal(personId: string) {
    return {
      units: getOwnerUnits(personId),
      settlements: mockSettlementsAdapter.consolidated(personId),
      payouts: mockPayoutsAdapter.listByOwner(personId),
      documents: mockDocumentsAdapter.list({ role: "Owner" }),
    };
  },

  getTenantPortal(personId: string) {
    return {
      leases: mockLeasesAdapter.list().filter((l) => l.tenantId === personId),
      invoices: mockInvoicesAdapter.listByTenant(personId),
      tickets: mockWorkOrdersAdapter.list().filter((w) => w.status !== "completed").slice(0, 5),
    };
  },

  getTechnicianPortal(personId: string) {
    return {
      jobs: mockWorkOrdersAdapter.list().filter((w) => w.assignedTechnicianId === personId || w.status === "new"),
    };
  },

  getForRole(role: Role) {
    const personId = ROLE_PERSON_MAP[role];
    if (!personId) return null;
    if (role === "Owner") return mockPortalsAdapter.getOwnerPortal(personId);
    if (role === "Tenant") return mockPortalsAdapter.getTenantPortal(personId);
    if (role === "Technician") return mockPortalsAdapter.getTechnicianPortal(personId);
    return null;
  },
};
