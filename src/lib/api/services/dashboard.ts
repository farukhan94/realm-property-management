import { apiConfig } from "@/lib/api/config";
import { mockDashboardAdapter } from "@/lib/api/adapters/mock/dashboard";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const dashboardService = {
  getKpis: (): Promise<ReturnType<typeof mockDashboardAdapter.getKpis>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getKpis()) : notImplemented(),
};
