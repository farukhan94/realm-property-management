import { apiConfig } from "@/lib/api/config";
import { mockDepositsAdapter } from "@/lib/api/adapters/mock/deposits";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const depositsService = {
  list: (): Promise<ReturnType<typeof mockDepositsAdapter.list>> =>
    apiConfig.useMock ? Promise.resolve(mockDepositsAdapter.list()) : notImplemented(),
  getByLease: (leaseId: string): Promise<ReturnType<typeof mockDepositsAdapter.getByLease>> =>
    apiConfig.useMock ? Promise.resolve(mockDepositsAdapter.getByLease(leaseId)) : notImplemented(),
};
