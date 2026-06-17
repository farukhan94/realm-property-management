import type { SaasCustomer, PlatformMetrics } from "@/types/subscription";

export const SAAS_CUSTOMERS: SaasCustomer[] = [
  { id: "cust-1", name: "Al-Aali Properties W.L.L.", plan: "Enterprise", monthlyRevenue: 2499, activeUsers: 42, buildings: 8, status: "active", joinedDate: "2023-04-15" },
  { id: "cust-2", name: "Bahrain Bay Management", plan: "Premium", monthlyRevenue: 1899, activeUsers: 28, buildings: 5, status: "active", joinedDate: "2023-08-22" },
  { id: "cust-3", name: "Seef Real Estate Co.", plan: "Growth", monthlyRevenue: 899, activeUsers: 12, buildings: 3, status: "active", joinedDate: "2024-01-10" },
  { id: "cust-4", name: "Diyar Al Muharraq PM", plan: "Enterprise", monthlyRevenue: 2499, activeUsers: 56, buildings: 12, status: "active", joinedDate: "2022-11-05" },
  { id: "cust-5", name: "Amwaj Islands Realty", plan: "Premium", monthlyRevenue: 1899, activeUsers: 19, buildings: 4, status: "trial", joinedDate: "2026-05-01" },
];

export const PLATFORM_METRICS: PlatformMetrics = {
  mrr: 9695,
  arr: 116340,
  activeCompanies: 5,
  totalUsers: 157,
  apiCallsToday: 28450,
  churnRate: 1.2,
};

export const SUBSCRIPTION_REVENUE_CHART = [
  { month: "Jan", mrr: 7200 },
  { month: "Feb", mrr: 7450 },
  { month: "Mar", mrr: 7800 },
  { month: "Apr", mrr: 8100 },
  { month: "May", mrr: 8900 },
  { month: "Jun", mrr: 9695 },
];
