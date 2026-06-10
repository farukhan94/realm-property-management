import { apiConfig } from "@/lib/api/config";
import {
  mockLeasesAdapter,
  type LeaseWithNames,
} from "@/lib/api/adapters/mock/leases";
import { notImplemented } from "@/lib/api/adapters/http/stub";
import type { CreateLeaseInput } from "@/types/lease";

export const leasesService = {
  list: (entityId?: string): Promise<LeaseWithNames[]> =>
    apiConfig.useMock
      ? Promise.resolve(mockLeasesAdapter.list(entityId))
      : notImplemented(),

  get: (id: string): Promise<LeaseWithNames | null> =>
    apiConfig.useMock
      ? Promise.resolve(mockLeasesAdapter.get(id))
      : notImplemented(),

  create: (input: CreateLeaseInput): Promise<LeaseWithNames> =>
    apiConfig.useMock
      ? Promise.resolve(mockLeasesAdapter.create(input))
      : notImplemented(),

  generateContract: (leaseId: string): Promise<string> =>
    apiConfig.useMock
      ? Promise.resolve(mockLeasesAdapter.generateContractText(leaseId))
      : notImplemented(),

  renew: (id: string, endDate: string, rent: number): Promise<LeaseWithNames | null> =>
    apiConfig.useMock ? Promise.resolve(mockLeasesAdapter.renew(id, endDate, rent)) : notImplemented(),

  terminate: (id: string): Promise<LeaseWithNames | null> =>
    apiConfig.useMock ? Promise.resolve(mockLeasesAdapter.terminate(id)) : notImplemented(),

  update: (id: string, updates: Parameters<typeof mockLeasesAdapter.update>[1]): Promise<LeaseWithNames | null> =>
    apiConfig.useMock ? Promise.resolve(mockLeasesAdapter.update(id, updates)) : notImplemented(),
};
