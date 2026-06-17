import type { DashboardActivity, InspectionMetric } from "@/types/dashboard-widgets";

export const DASHBOARD_ACTIVITIES: DashboardActivity[] = [
  { id: "ACT-001", type: "task", title: "Approve lease renewal — U-1001", dueDate: "2026-06-17", bucket: "due", daysUntilDue: 0, assignee: "Property Manager" },
  { id: "ACT-002", type: "job", title: "Elevator repair — B-101", dueDate: "2026-06-17", bucket: "due", daysUntilDue: 0, assignee: "Delmon Elevators" },
  { id: "ACT-003", type: "inspection", title: "Routine inspection — U-204", dueDate: "2026-06-18", bucket: "up_next", daysUntilDue: 1, assignee: "Marcus Webb" },
  { id: "ACT-004", type: "email", title: "Send arrears notice — ten-3", dueDate: "2026-06-19", bucket: "up_next", daysUntilDue: 2 },
  { id: "ACT-005", type: "document", title: "Upload EWA certificate — U-1005", dueDate: "2026-06-20", bucket: "up_next", daysUntilDue: 3 },
  { id: "ACT-006", type: "job", title: "AC maintenance — B-102", dueDate: "2026-06-14", bucket: "past", daysUntilDue: -3, assignee: "Gulf AC" },
  { id: "ACT-007", type: "inspection", title: "Entry inspection — U-1002", dueDate: "2026-06-12", bucket: "past", daysUntilDue: -5, assignee: "Ahmed Al-Fardan" },
  { id: "ACT-008", type: "sms", title: "Rent reminder — ten-1", dueDate: "2026-06-15", bucket: "past", daysUntilDue: -2 },
];

export const INSPECTION_METRICS: InspectionMetric[] = [
  { id: "INS-001", unitId: "U-1001", buildingId: "B-101", type: "routine", scheduledDate: "2026-06-20", status: "scheduled", inspector: "Ahmed Al-Fardan" },
  { id: "INS-002", unitId: "U-204", buildingId: "B-102", type: "routine", scheduledDate: "2026-06-18", status: "scheduled", inspector: "Marcus Webb" },
  { id: "INS-003", unitId: "U-1002", buildingId: "B-101", type: "entry", scheduledDate: "2026-06-12", status: "completed", inspector: "Ahmed Al-Fardan" },
  { id: "INS-004", unitId: "U-301", buildingId: "B-103", type: "exit", scheduledDate: "2026-06-10", status: "completed", inspector: "Priya Sharma" },
  { id: "INS-005", unitId: "U-1005", buildingId: "B-101", type: "routine", scheduledDate: "2026-06-08", status: "overdue", inspector: "Marcus Webb" },
  { id: "INS-006", unitId: "U-101-05", buildingId: "B-101", type: "routine", scheduledDate: "2026-06-05", status: "overdue" },
];
