import { apiConfig } from "@/lib/api/config";
import { mockInvoicesAdapter, type InvoiceWithNames } from "@/lib/api/adapters/mock/invoices";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const invoicesService = {
  list: (entityId?: string): Promise<InvoiceWithNames[]> =>
    apiConfig.useMock ? Promise.resolve(mockInvoicesAdapter.list(entityId)) : notImplemented(),
  getArrearsSummary: (): Promise<ReturnType<typeof mockInvoicesAdapter.getArrearsSummary>> =>
    apiConfig.useMock ? Promise.resolve(mockInvoicesAdapter.getArrearsSummary()) : notImplemented(),
  recordPayment: (
    id: string,
    amount: number
  ): Promise<ReturnType<typeof mockInvoicesAdapter.recordPayment>> =>
    apiConfig.useMock ? Promise.resolve(mockInvoicesAdapter.recordPayment(id, amount)) : notImplemented(),

  create: (
    input: Parameters<typeof mockInvoicesAdapter.create>[0]
  ): Promise<ReturnType<typeof mockInvoicesAdapter.create>> =>
    apiConfig.useMock ? Promise.resolve(mockInvoicesAdapter.create(input)) : notImplemented(),
};
