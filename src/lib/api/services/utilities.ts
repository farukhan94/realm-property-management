import { apiConfig } from "@/lib/api/config";
import { mockUtilitiesAdapter } from "@/lib/api/adapters/mock/utilities";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const utilitiesService = {
  listAccounts: (
    entityId?: string
  ): Promise<ReturnType<typeof mockUtilitiesAdapter.listAccounts>> =>
    apiConfig.useMock ? Promise.resolve(mockUtilitiesAdapter.listAccounts(entityId)) : notImplemented(),
  getAlerts: (): Promise<ReturnType<typeof mockUtilitiesAdapter.getAlerts>> =>
    apiConfig.useMock ? Promise.resolve(mockUtilitiesAdapter.getAlerts()) : notImplemented(),

  logBill: (
    accountId: string,
    period: string,
    amount: number
  ): Promise<ReturnType<typeof mockUtilitiesAdapter.logBill>> =>
    apiConfig.useMock ? Promise.resolve(mockUtilitiesAdapter.logBill(accountId, period, amount)) : notImplemented(),
};
