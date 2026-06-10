import { apiConfig } from "@/lib/api/config";
import { mockDocumentsAdapter } from "@/lib/api/adapters/mock/documents";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const documentsService = {
  list: (
    filters?: Parameters<typeof mockDocumentsAdapter.list>[0]
  ): Promise<ReturnType<typeof mockDocumentsAdapter.list>> =>
    apiConfig.useMock ? Promise.resolve(mockDocumentsAdapter.list(filters)) : notImplemented(),
};
