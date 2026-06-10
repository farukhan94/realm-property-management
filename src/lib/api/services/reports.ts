import { apiConfig } from "@/lib/api/config";
import { mockReportsAdapter } from "@/lib/api/adapters/mock/reports";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const reportsService = {
  getPropertyPnl: (): Promise<ReturnType<typeof mockReportsAdapter.getPropertyPnl>> =>
    apiConfig.useMock ? Promise.resolve(mockReportsAdapter.getPropertyPnl()) : notImplemented(),
  getFacilityPnl: (): Promise<ReturnType<typeof mockReportsAdapter.getFacilityPnl>> =>
    apiConfig.useMock ? Promise.resolve(mockReportsAdapter.getFacilityPnl()) : notImplemented(),
  getHoaSummary: (): Promise<ReturnType<typeof mockReportsAdapter.getHoaSummary>> =>
    apiConfig.useMock ? Promise.resolve(mockReportsAdapter.getHoaSummary()) : notImplemented(),
  getOccupancyByBuilding: (): Promise<ReturnType<typeof mockReportsAdapter.getOccupancyByBuilding>> =>
    apiConfig.useMock ? Promise.resolve(mockReportsAdapter.getOccupancyByBuilding()) : notImplemented(),
  getFinancialMetrics: (): Promise<ReturnType<typeof mockReportsAdapter.getFinancialMetrics>> =>
    apiConfig.useMock ? Promise.resolve(mockReportsAdapter.getFinancialMetrics()) : notImplemented(),
  getArrearsAging: (): Promise<ReturnType<typeof mockReportsAdapter.getArrearsAging>> =>
    apiConfig.useMock ? Promise.resolve(mockReportsAdapter.getArrearsAging()) : notImplemented(),
};
