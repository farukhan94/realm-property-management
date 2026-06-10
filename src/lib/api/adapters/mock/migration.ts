import { mockStore } from "@/lib/mock/store";

export const mockMigrationAdapter = {
  listSteps() {
    return mockStore.migrationSteps;
  },

  generateMappingSuggestion(target: string): string {
    return `[AI Mapping Suggestion for "${target}"]

Kingdom of Bahrain field mappings:
- source.cpr → manzel.tenant.cpr (10-digit)
- source.block → manzel.building.block
- source.road → manzel.building.road
- source.ewa_account → manzel.lease.ewaAccount
- source.rent_bhd → manzel.lease.monthlyRent (3 decimal places)

Validation: 8 conflicts in sample. Run dry-import before cutover.`;
  },
};
