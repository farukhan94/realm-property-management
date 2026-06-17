import { apiConfig } from "@/lib/api/config";
import { mockDashboardAdapter } from "@/lib/api/adapters/mock/dashboard";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const dashboardService = {
  getKpis: (): Promise<ReturnType<typeof mockDashboardAdapter.getKpis>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getKpis()) : notImplemented(),
  getWidgetMetrics: (): Promise<ReturnType<typeof mockDashboardAdapter.getWidgetMetrics>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getWidgetMetrics()) : notImplemented(),
  getActivities: (): Promise<ReturnType<typeof mockDashboardAdapter.getActivities>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getActivities()) : notImplemented(),
  getPlatformMetrics: (): Promise<ReturnType<typeof mockDashboardAdapter.getPlatformMetrics>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getPlatformMetrics()) : notImplemented(),
  getSaasCustomers: (): Promise<ReturnType<typeof mockDashboardAdapter.getSaasCustomers>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getSaasCustomers()) : notImplemented(),
  getSubscriptionChart: (): Promise<ReturnType<typeof mockDashboardAdapter.getSubscriptionChart>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getSubscriptionChart()) : notImplemented(),
  getSuppliers: (): Promise<ReturnType<typeof mockDashboardAdapter.getSuppliers>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getSuppliers()) : notImplemented(),
  getSupplierBills: (): Promise<ReturnType<typeof mockDashboardAdapter.getSupplierBills>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getSupplierBills()) : notImplemented(),
  getVacantListings: (): Promise<ReturnType<typeof mockDashboardAdapter.getVacantListings>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getVacantListings()) : notImplemented(),
  getBuildingOwnerDashboard: (ownerId: string): Promise<ReturnType<typeof mockDashboardAdapter.getBuildingOwnerDashboard>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getBuildingOwnerDashboard(ownerId)) : notImplemented(),
  getFlatOwnerDashboard: (ownerId: string): Promise<ReturnType<typeof mockDashboardAdapter.getFlatOwnerDashboard>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getFlatOwnerDashboard(ownerId)) : notImplemented(),
  getSupplierDashboard: (supplierId: string): Promise<ReturnType<typeof mockDashboardAdapter.getSupplierDashboard>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getSupplierDashboard(supplierId)) : notImplemented(),
  getMaintenanceManagerDashboard: (managerId: string): Promise<ReturnType<typeof mockDashboardAdapter.getMaintenanceManagerDashboard>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getMaintenanceManagerDashboard(managerId)) : notImplemented(),
  getTenantDashboard: (tenantId: string): Promise<ReturnType<typeof mockDashboardAdapter.getTenantDashboard>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getTenantDashboard(tenantId)) : notImplemented(),
  getAuditorDashboard: (): Promise<ReturnType<typeof mockDashboardAdapter.getAuditorDashboard>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getAuditorDashboard()) : notImplemented(),
  getAccountingDashboard: (): Promise<ReturnType<typeof mockDashboardAdapter.getAccountingDashboard>> =>
    apiConfig.useMock ? Promise.resolve(mockDashboardAdapter.getAccountingDashboard()) : notImplemented(),
};
