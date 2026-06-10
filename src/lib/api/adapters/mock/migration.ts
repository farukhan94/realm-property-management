import { mockStore } from "@/lib/mock/store";

export const mockMigrationAdapter = {
  listSteps() {
    return mockStore.migrationSteps;
  },

  generateMappingSuggestion(target: string): string {
    return `[AI Mapping Suggestion for "${target}"]

Kingdom of Bahrain field mappings:
- source.cpr → realm.tenant.cpr (10-digit)
- source.block → realm.building.block
- source.road → realm.building.road
- source.ewa_account → realm.lease.ewaAccount
- source.rent_bhd → realm.lease.monthlyRent (3 decimal places)

Validation: 8 conflicts in sample. Run dry-import before cutover.`;
  },
};
