import { apiConfig } from "@/lib/api/config";
import {
  mockWorkOrdersAdapter,
  type WorkOrderWithNames,
} from "@/lib/api/adapters/mock/work-orders";
import { notImplemented } from "@/lib/api/adapters/http/stub";
import type { CostLine, CreateWorkOrderInput, WorkOrder } from "@/types/work-order";

export const workOrdersService = {
  list: (entityId?: string): Promise<WorkOrderWithNames[]> =>
    apiConfig.useMock
      ? Promise.resolve(mockWorkOrdersAdapter.list(entityId))
      : notImplemented(),

  get: (id: string): Promise<WorkOrderWithNames | null> =>
    apiConfig.useMock
      ? Promise.resolve(mockWorkOrdersAdapter.get(id))
      : notImplemented(),

  create: (input: CreateWorkOrderInput): Promise<WorkOrderWithNames> =>
    apiConfig.useMock
      ? Promise.resolve(mockWorkOrdersAdapter.create(input))
      : notImplemented(),

  updateStatus: (
    id: string,
    status: WorkOrder["status"]
  ): Promise<WorkOrderWithNames | null> =>
    apiConfig.useMock
      ? Promise.resolve(mockWorkOrdersAdapter.updateStatus(id, status))
      : notImplemented(),

  addCostLine: (
    id: string,
    line: Omit<CostLine, "id">
  ): Promise<WorkOrderWithNames | null> =>
    apiConfig.useMock
      ? Promise.resolve(mockWorkOrdersAdapter.addCostLine(id, line))
      : notImplemented(),

  update: (
    id: string,
    updates: Parameters<typeof mockWorkOrdersAdapter.update>[1]
  ): Promise<WorkOrderWithNames | null> =>
    apiConfig.useMock
      ? Promise.resolve(mockWorkOrdersAdapter.update(id, updates))
      : notImplemented(),
};
