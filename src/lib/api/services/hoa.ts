import { apiConfig } from "@/lib/api/config";
import { mockHoaAdapter } from "@/lib/api/adapters/mock/hoa";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const hoaService = {
  listServiceCharges: (
    entityId?: string
  ): Promise<ReturnType<typeof mockHoaAdapter.listServiceCharges>> =>
    apiConfig.useMock
      ? Promise.resolve(mockHoaAdapter.listServiceCharges(entityId))
      : notImplemented(),

  getSummary: (
    entityId?: string
  ): Promise<ReturnType<typeof mockHoaAdapter.getSummary>> =>
    apiConfig.useMock
      ? Promise.resolve(mockHoaAdapter.getSummary(entityId))
      : notImplemented(),

  getApportionment: (
    hoaId?: string
  ): Promise<ReturnType<typeof mockHoaAdapter.getApportionment>> =>
    apiConfig.useMock ? Promise.resolve(mockHoaAdapter.getApportionment(hoaId)) : notImplemented(),

  getServiceChargeInvoices: (
    hoaId?: string
  ): Promise<ReturnType<typeof mockHoaAdapter.getServiceChargeInvoices>> =>
    apiConfig.useMock ? Promise.resolve(mockHoaAdapter.getServiceChargeInvoices(hoaId)) : notImplemented(),

  getBudgets: (hoaId?: string): Promise<ReturnType<typeof mockHoaAdapter.getBudgets>> =>
    apiConfig.useMock ? Promise.resolve(mockHoaAdapter.getBudgets(hoaId)) : notImplemented(),

  getProcurement: (hoaId?: string): Promise<ReturnType<typeof mockHoaAdapter.getProcurement>> =>
    apiConfig.useMock ? Promise.resolve(mockHoaAdapter.getProcurement(hoaId)) : notImplemented(),

  createApportionment: (
    input: Parameters<typeof mockHoaAdapter.createApportionment>[0]
  ): Promise<ReturnType<typeof mockHoaAdapter.createApportionment>> =>
    apiConfig.useMock ? Promise.resolve(mockHoaAdapter.createApportionment(input)) : notImplemented(),

  createServiceChargeInvoice: (
    input: Parameters<typeof mockHoaAdapter.createServiceChargeInvoice>[0]
  ): Promise<ReturnType<typeof mockHoaAdapter.createServiceChargeInvoice>> =>
    apiConfig.useMock ? Promise.resolve(mockHoaAdapter.createServiceChargeInvoice(input)) : notImplemented(),

  createBudget: (
    input: Parameters<typeof mockHoaAdapter.createBudget>[0]
  ): Promise<ReturnType<typeof mockHoaAdapter.createBudget>> =>
    apiConfig.useMock ? Promise.resolve(mockHoaAdapter.createBudget(input)) : notImplemented(),

  createProcurement: (
    input: Parameters<typeof mockHoaAdapter.createProcurement>[0]
  ): Promise<ReturnType<typeof mockHoaAdapter.createProcurement>> =>
    apiConfig.useMock ? Promise.resolve(mockHoaAdapter.createProcurement(input)) : notImplemented(),

  updateProcurementStatus: (
    id: string,
    status: Parameters<typeof mockHoaAdapter.updateProcurementStatus>[1]
  ): Promise<ReturnType<typeof mockHoaAdapter.updateProcurementStatus>> =>
    apiConfig.useMock ? Promise.resolve(mockHoaAdapter.updateProcurementStatus(id, status)) : notImplemented(),
};
