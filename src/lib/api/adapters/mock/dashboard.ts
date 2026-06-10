import { mockStore } from "@/lib/mock/store";

export const mockDashboardAdapter = {
  getKpis() {
    const kpis = mockStore.getDashboardKpis();
    return { ...kpis, buildingCount: mockStore.buildings.length };
  },
};
