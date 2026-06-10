import { mockStore } from "@/lib/mock/store";
import { getPersonName, getUnit } from "@/lib/mock/seeds";
import { getLocaleByEntityId } from "@/lib/locale/resolver";
import { formatCurrency } from "@/lib/locale/format";
import type { CreateLeaseInput, Lease } from "@/types/lease";

export interface LeaseWithNames extends Lease {
  tenantName: string;
  unitLabel: string;
}

function enrich(lease: Lease): LeaseWithNames {
  const unit = getUnit(lease.unitId);
  return {
    ...lease,
    tenantName: getPersonName(lease.tenantId),
    unitLabel: unit?.label ?? lease.unitId,
  };
}

export const mockLeasesAdapter = {
  list(entityId?: string): LeaseWithNames[] {
    let leases = mockStore.leases.map(enrich);
    if (entityId) leases = leases.filter((l) => l.entityId === entityId);
    return leases;
  },

  get(id: string): LeaseWithNames | null {
    const lease = mockStore.leases.find((l) => l.id === id);
    return lease ? enrich(lease) : null;
  },

  create(input: CreateLeaseInput): LeaseWithNames {
    const id = `LSE-${Date.now()}`;
    const lease: Lease = { id, ...input, status: "active", vatInclusive: false };
    mockStore.createLease(lease);
    return enrich(lease);
  },

  renew(id: string, endDate: string, rent: number): LeaseWithNames | null {
    const renewed = mockStore.renewLease(id, endDate, rent);
    return renewed ? enrich(renewed) : null;
  },

  terminate(id: string): LeaseWithNames | null {
    const lease = mockStore.terminateLease(id);
    return lease ? enrich(lease) : null;
  },

  update(id: string, updates: Parameters<typeof mockStore.updateLease>[1]): LeaseWithNames | null {
    const lease = mockStore.updateLease(id, updates);
    return lease ? enrich(lease) : null;
  },

  generateContractText(leaseId: string): string {
    const lease = mockStore.leases.find((l) => l.id === leaseId);
    if (!lease) return "Lease not found.";
    const tenant = getPersonName(lease.tenantId);
    const unit = getUnit(lease.unitId);
    const locale = getLocaleByEntityId(lease.entityId);

    return `RESIDENTIAL LEASE AGREEMENT
Kingdom of Bahrain

This Agreement is governed by the laws of the Kingdom of Bahrain.

Landlord: ${locale.company.name} (CR: ${locale.company.crNumber})
Tenant: ${tenant}
Property: ${unit?.label ?? lease.unitId}

1. TERM: ${lease.startDate} to ${lease.endDate}
2. RENT: ${formatCurrency(lease.monthlyRent, { entityId: lease.entityId })} per month, due on the 1st
3. SECURITY DEPOSIT: ${formatCurrency(lease.deposit, { entityId: lease.entityId })}, refundable per local rental regulations
4. VAT: ${locale.vatRate * 100}% VAT applies where applicable (TRN: ${locale.company.vatNumber})
5. UTILITIES: ${locale.utilityProvider} account ${lease.ewaAccount ?? "TBD"} — tenant responsible within agreed cap
6. ESCALATION: ${lease.escalationPercent ?? 0}% annual increase upon renewal

[AI-generated draft — review with legal counsel before execution.]`;
  },
};
