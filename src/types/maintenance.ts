export interface MaintenanceSchedule {
  id: string;
  assetId: string;
  buildingId: string;
  title: string;
  frequency: "monthly" | "quarterly" | "annual";
  nextDue: string;
  assignedTechnicianId: string | null;
  entityId: string;
}

export interface DispatchSlot {
  id: string;
  technicianId: string;
  workOrderId: string;
  date: string;
  startTime: string;
  endTime: string;
}
