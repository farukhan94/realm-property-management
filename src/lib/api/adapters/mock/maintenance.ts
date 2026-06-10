import { mockStore } from "@/lib/mock/store";
import { getPersonName } from "@/lib/mock/seeds";

export const mockMaintenanceAdapter = {
  listSchedules(entityId?: string) {
    let items = mockStore.maintenanceSchedules;
    if (entityId) items = items.filter((s) => s.entityId === entityId);
    return items.map((s) => ({
      ...s,
      technicianName: s.assignedTechnicianId ? getPersonName(s.assignedTechnicianId) : undefined,
    }));
  },

  listDispatch(date?: string) {
    const d = date ?? new Date().toISOString().slice(0, 10);
    return mockStore.dispatchSlots
      .filter((s) => s.date === d)
      .map((s) => ({
        ...s,
        technicianName: getPersonName(s.technicianId),
        workOrder: mockStore.workOrders.find((w) => w.id === s.workOrderId),
      }));
  },

  createSchedule(input: Omit<import("@/types/maintenance").MaintenanceSchedule, "id">) {
    return mockStore.createMaintenanceSchedule(input);
  },

  assignDispatch(slotId: string, technicianId: string) {
    return mockStore.assignDispatch(slotId, technicianId);
  },
};
