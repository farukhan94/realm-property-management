import { apiConfig } from "@/lib/api/config";
import { mockMaintenanceAdapter } from "@/lib/api/adapters/mock/maintenance";
import { notImplemented } from "@/lib/api/adapters/http/stub";

export const maintenanceService = {
  listSchedules: (
    entityId?: string
  ): Promise<ReturnType<typeof mockMaintenanceAdapter.listSchedules>> =>
    apiConfig.useMock ? Promise.resolve(mockMaintenanceAdapter.listSchedules(entityId)) : notImplemented(),
  listDispatch: (
    date?: string
  ): Promise<ReturnType<typeof mockMaintenanceAdapter.listDispatch>> =>
    apiConfig.useMock ? Promise.resolve(mockMaintenanceAdapter.listDispatch(date)) : notImplemented(),

  createSchedule: (
    input: Parameters<typeof mockMaintenanceAdapter.createSchedule>[0]
  ): Promise<ReturnType<typeof mockMaintenanceAdapter.createSchedule>> =>
    apiConfig.useMock ? Promise.resolve(mockMaintenanceAdapter.createSchedule(input)) : notImplemented(),

  assignDispatch: (
    slotId: string,
    technicianId: string
  ): Promise<ReturnType<typeof mockMaintenanceAdapter.assignDispatch>> =>
    apiConfig.useMock ? Promise.resolve(mockMaintenanceAdapter.assignDispatch(slotId, technicianId)) : notImplemented(),
};
