export type ActivityType = "task" | "job" | "inspection" | "email" | "sms" | "document";

export type ActivityBucket = "due" | "up_next" | "past";

export interface DashboardActivity {
  id: string;
  type: ActivityType;
  title: string;
  dueDate: string;
  bucket: ActivityBucket;
  daysUntilDue: number;
  assignee?: string;
}

export interface InspectionMetric {
  id: string;
  unitId: string;
  buildingId: string;
  type: "entry" | "exit" | "routine";
  scheduledDate: string;
  status: "scheduled" | "completed" | "overdue";
  inspector?: string;
}

export interface DashboardWidgetMetrics {
  rentArrears: {
    tenantCount: number;
    totalOwing: number;
    avgDaysOverdue: number;
  };
  trustReconciliation: {
    status: "in_balance" | "out_of_balance";
    trustBalance: number;
    lastReconciled: string;
    pendingMonths: number;
  };
  maintenanceJobs: {
    reported: number;
    approved: number;
    assigned: number;
    inProgress: number;
  };
  supplierBills: {
    overdueCount: number;
    avgDaysOverdue: number;
    totalAmount: number;
  };
  vacancies: {
    vacantCount: number;
    vacancyRate: number;
    avgDaysVacant: number;
  };
  invoiceArrears: {
    tenantCount: number;
    avgDaysOverdue: number;
    totalAmount: number;
  };
  leaseRenewals: {
    pending: number;
    expiring: number;
    renewed: number;
  };
  inspections: {
    scheduled: number;
    completed: number;
    overdue: number;
  };
  agentFees: {
    totalThisMonth: number;
    lastMonth: number;
  };
}
