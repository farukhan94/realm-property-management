export type WorkOrderStatus =
  | "new"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type WorkOrderPriority = "low" | "medium" | "high" | "critical";

export interface CostLine {
  id: string;
  type: "labour" | "material" | "subcontractor";
  description: string;
  quantity: number;
  unitCost: number;
  markupPercent: number;
}

export interface WorkOrder {
  id: string;
  title: string;
  unitId: string;
  buildingId: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  assignedTechnicianId: string | null;
  entityId: string;
  billTo: "owner" | "hoa" | "internal";
  costLines: CostLine[];
  createdAt: string;
  completedAt: string | null;
}

export interface CreateWorkOrderInput {
  title: string;
  unitId: string;
  buildingId: string;
  priority: WorkOrderPriority;
  entityId: string;
  billTo: "owner" | "hoa" | "internal";
}
