export type SubscriptionPlan = "Growth" | "Enterprise" | "Premium";

export interface SaasCustomer {
  id: string;
  name: string;
  plan: SubscriptionPlan;
  monthlyRevenue: number;
  activeUsers: number;
  buildings: number;
  status: "active" | "trial" | "churned";
  joinedDate: string;
}

export interface PlatformMetrics {
  mrr: number;
  arr: number;
  activeCompanies: number;
  totalUsers: number;
  apiCallsToday: number;
  churnRate: number;
}
