import { apiConfig } from "@/lib/api/config";
import { mockMigrationAdapter } from "@/lib/api/adapters/mock/migration";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const migrationService = {
  listSteps: (): Promise<ReturnType<typeof mockMigrationAdapter.listSteps>> =>
    apiConfig.useMock
      ? Promise.resolve(mockMigrationAdapter.listSteps())
      : notImplemented(),

  generateMappingSuggestion: (target: string): Promise<string> =>
    apiConfig.useMock
      ? Promise.resolve(mockMigrationAdapter.generateMappingSuggestion(target))
      : notImplemented(),
};
