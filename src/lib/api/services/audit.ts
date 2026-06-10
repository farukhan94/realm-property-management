import { apiConfig } from "@/lib/api/config";
import { mockAuditAdapter } from "@/lib/api/adapters/mock/audit";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const auditService = {
  list: (limit?: number): Promise<ReturnType<typeof mockAuditAdapter.list>> =>
    apiConfig.useMock ? Promise.resolve(mockAuditAdapter.list(limit)) : notImplemented(),
  exportCsv: (): Promise<string> =>
    apiConfig.useMock ? Promise.resolve(mockAuditAdapter.exportCsv()) : notImplemented(),
};
