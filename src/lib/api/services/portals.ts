import { apiConfig } from "@/lib/api/config";
import { mockPortalsAdapter } from "@/lib/api/adapters/mock/portals";
import { notImplemented } from "@/lib/api/adapters/http/stub";
import type { Role } from "@/types/role";

export const portalsService = {
  getForRole: (role: Role): Promise<ReturnType<typeof mockPortalsAdapter.getForRole>> =>
    apiConfig.useMock ? Promise.resolve(mockPortalsAdapter.getForRole(role)) : notImplemented(),
};
