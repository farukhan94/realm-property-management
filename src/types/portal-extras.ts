export type ApprovalStageStatus = "pending" | "in_review" | "approved" | "rejected";

export interface LandApprovalStage {
  id: string;
  stage: number;
  title: string;
  status: ApprovalStageStatus;
  submittedDate?: string;
  completedDate?: string;
  reviewer?: string;
  comments?: string;
}

export interface LandDevelopmentProject {
  id: string;
  ownerId: string;
  plotReference: string;
  location: string;
  stages: LandApprovalStage[];
}

export type TenantNotificationType = "rent_due" | "maintenance" | "lease" | "general";

export interface TenantNotification {
  id: string;
  tenantId: string;
  type: TenantNotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface TenantFeedback {
  id: string;
  tenantId: string;
  category: string;
  rating: number;
  message: string;
  submittedAt: string;
}

export interface TenantMessage {
  id: string;
  tenantId: string;
  ownerId: string;
  subject: string;
  body: string;
  sentAt: string;
  direction: "to_owner" | "from_owner";
}

export interface VacantListing {
  id: string;
  unitId: string;
  buildingId: string;
  buildingName: string;
  label: string;
  type: string;
  monthlyRent: number;
  bedrooms: number;
  areaSqm: number;
  description: string;
  availableFrom: string;
}
