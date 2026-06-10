import { apiConfig } from "@/lib/api/config";
import {
  mockChequesAdapter,
  type ChequeWithNames,
} from "@/lib/api/adapters/mock/cheques";
import { notImplemented } from "@/lib/api/adapters/http/stub";
import type { CreateChequeInput, ChequeStatus, Cheque } from "@/types/cheque";

export const chequesService = {
  list: (entityId?: string): Promise<ChequeWithNames[]> =>
    apiConfig.useMock
      ? Promise.resolve(mockChequesAdapter.list(entityId))
      : notImplemented(),

  get: (id: string): Promise<ChequeWithNames | null> =>
    apiConfig.useMock
      ? Promise.resolve(mockChequesAdapter.get(id))
      : notImplemented(),

  create: (input: CreateChequeInput): Promise<ChequeWithNames> =>
    apiConfig.useMock
      ? Promise.resolve(mockChequesAdapter.create(input))
      : notImplemented(),

  updateStatus: (id: string, status: ChequeStatus, extra?: Partial<Cheque>): Promise<ChequeWithNames | null> =>
    apiConfig.useMock
      ? Promise.resolve(mockChequesAdapter.updateStatus(id, status, extra))
      : notImplemented(),
};
export type { ChequeWithNames };
