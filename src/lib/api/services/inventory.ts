import { apiConfig } from "@/lib/api/config";
import { mockInventoryAdapter } from "@/lib/api/adapters/mock/inventory";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const inventoryService = {
  listParts: (): Promise<ReturnType<typeof mockInventoryAdapter.listParts>> =>
    apiConfig.useMock ? Promise.resolve(mockInventoryAdapter.listParts()) : notImplemented(),
  consume: (
    partId: string,
    workOrderId: string,
    quantity: number
  ): Promise<ReturnType<typeof mockInventoryAdapter.consume>> =>
    apiConfig.useMock
      ? Promise.resolve(mockInventoryAdapter.consume(partId, workOrderId, quantity))
      : notImplemented(),

  createPart: (
    input: Parameters<typeof mockInventoryAdapter.createPart>[0]
  ): Promise<ReturnType<typeof mockInventoryAdapter.createPart>> =>
    apiConfig.useMock ? Promise.resolve(mockInventoryAdapter.createPart(input)) : notImplemented(),

  adjustStock: (
    partId: string,
    delta: number
  ): Promise<ReturnType<typeof mockInventoryAdapter.adjustStock>> =>
    apiConfig.useMock ? Promise.resolve(mockInventoryAdapter.adjustStock(partId, delta)) : notImplemented(),
};
