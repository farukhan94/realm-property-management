import { mockStore } from "@/lib/mock/store";

export const mockIntegrationsAdapter = {
  list() {
    return mockStore.integrations;
  },
};
