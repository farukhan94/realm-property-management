import { apiConfig } from "@/lib/api/config";
import { mockPayoutsAdapter } from "@/lib/api/adapters/mock/payouts";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const payoutsService = {
  list: (entityId?: string): Promise<ReturnType<typeof mockPayoutsAdapter.list>> =>
    apiConfig.useMock ? Promise.resolve(mockPayoutsAdapter.list(entityId)) : notImplemented(),

  create: (
    input: Parameters<typeof mockPayoutsAdapter.create>[0]
  ): Promise<ReturnType<typeof mockPayoutsAdapter.create>> =>
    apiConfig.useMock ? Promise.resolve(mockPayoutsAdapter.create(input)) : notImplemented(),
};
