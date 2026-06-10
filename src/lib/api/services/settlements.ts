import { apiConfig } from "@/lib/api/config";
import {
  mockSettlementsAdapter,
  type SettlementWithNames,
} from "@/lib/api/adapters/mock/settlements";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const settlementsService = {
  list: (entityId?: string): Promise<SettlementWithNames[]> =>
    apiConfig.useMock
      ? Promise.resolve(mockSettlementsAdapter.list(entityId))
      : notImplemented(),

  get: (id: string): Promise<SettlementWithNames | null> =>
    apiConfig.useMock
      ? Promise.resolve(mockSettlementsAdapter.get(id))
      : notImplemented(),

  preview: (
    feePercent: number,
    entityId?: string
  ): Promise<SettlementWithNames[]> =>
    apiConfig.useMock
      ? Promise.resolve(mockSettlementsAdapter.preview(feePercent, entityId))
      : notImplemented(),
};
