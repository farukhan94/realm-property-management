import { apiConfig } from "@/lib/api/config";
import { mockIntegrationsAdapter } from "@/lib/api/adapters/mock/integrations";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const integrationsService = {
  list: (): Promise<ReturnType<typeof mockIntegrationsAdapter.list>> =>
    apiConfig.useMock ? Promise.resolve(mockIntegrationsAdapter.list()) : notImplemented(),
};
