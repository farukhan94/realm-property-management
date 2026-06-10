import { mockStore } from "@/lib/mock/store";
import { getPersonName, getUnit } from "@/lib/mock/seeds";
import type { CostLine, CreateWorkOrderInput, WorkOrder } from "@/types/work-order";

export interface WorkOrderWithNames extends WorkOrder {
  unitLabel: string;
  technicianName: string | null;
  totalCost: number;
  totalRevenue: number;
  profit: number;
}

function calcLineTotal(line: CostLine) {
  const cost = line.quantity * line.unitCost;
  return { cost, revenue: cost * (1 + line.markupPercent / 100) };
}

function enrich(wo: WorkOrder): WorkOrderWithNames {
  const totals = wo.costLines.reduce(
    (acc, line) => {
      const { cost, revenue } = calcLineTotal(line);
      return { cost: acc.cost + cost, revenue: acc.revenue + revenue };
    },
    { cost: 0, revenue: 0 }
  );
  return {
    ...wo,
    unitLabel: getUnit(wo.unitId)?.label ?? wo.unitId,
    technicianName: wo.assignedTechnicianId ? getPersonName(wo.assignedTechnicianId) : null,
    totalCost: totals.cost,
    totalRevenue: totals.revenue,
    profit: totals.revenue - totals.cost,
  };
}

export const mockWorkOrdersAdapter = {
  list(entityId?: string): WorkOrderWithNames[] {
    let orders = mockStore.workOrders.map(enrich);
    if (entityId) orders = orders.filter((o) => o.entityId === entityId);
    return orders;
  },

  get(id: string): WorkOrderWithNames | null {
    const wo = mockStore.workOrders.find((w) => w.id === id);
    return wo ? enrich(wo) : null;
  },

  create(input: CreateWorkOrderInput): WorkOrderWithNames {
    const id = `WO-${Date.now()}`;
    const wo: WorkOrder = {
      id, ...input, status: "new", assignedTechnicianId: null, costLines: [],
      createdAt: new Date().toISOString(), completedAt: null,
    };
    mockStore.workOrders.push(wo);
    mockStore.addAudit({ actor: "Property Manager", action: "work_order.created", entityType: "work_order", entityId: id, details: input.title });
    return enrich(wo);
  },

  updateStatus(id: string, status: WorkOrder["status"]): WorkOrderWithNames | null {
    const idx = mockStore.workOrders.findIndex((w) => w.id === id);
    if (idx === -1) return null;
    mockStore.workOrders[idx] = {
      ...mockStore.workOrders[idx],
      status,
      completedAt: status === "completed" ? new Date().toISOString() : mockStore.workOrders[idx].completedAt,
    };
    if (status === "completed") {
      mockStore.addAudit({ actor: "Technician", action: "work_order.completed", entityType: "work_order", entityId: id, details: "Work order completed" });
    }
    return enrich(mockStore.workOrders[idx]);
  },

  addCostLine(id: string, line: Omit<CostLine, "id">): WorkOrderWithNames | null {
    const wo = mockStore.addWorkOrderCostLine(id, line);
    return wo ? enrich(wo) : null;
  },

  update(id: string, updates: Parameters<typeof mockStore.updateWorkOrder>[1]): WorkOrderWithNames | null {
    const wo = mockStore.updateWorkOrder(id, updates);
    return wo ? enrich(wo) : null;
  },
};
