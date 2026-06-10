import type { Integration } from "@/types/integration";

export const INTEGRATIONS: Integration[] = [
  { id: "int-bbk", name: "BBK Bank Feed", category: "bank", status: "connected", lastSync: "2026-06-10T08:00:00Z", description: "Bank of Bahrain and Kuwait — account reconciliation" },
  { id: "int-nbb", name: "NBB Corporate Banking", category: "bank", status: "connected", lastSync: "2026-06-10T07:30:00Z", description: "National Bank of Bahrain — owner payout processing" },
  { id: "int-aub", name: "Ahli United Bank", category: "bank", status: "connected", lastSync: "2026-06-10T07:45:00Z", description: "AUB corporate account — rent collection reconciliation" },
  { id: "int-ila", name: "ila Bank", category: "bank", status: "connected", lastSync: "2026-06-09T18:00:00Z", description: "ila Bank — virtual IBAN rent collection" },
  { id: "int-khcb", name: "Khaleeji Commercial Bank", category: "bank", status: "disconnected", lastSync: "2026-05-15T10:00:00Z", description: "KHCB — legacy payout account" },
  { id: "int-benefit", name: "BenefitPay", category: "payment", status: "connected", lastSync: "2026-06-10T09:15:00Z", description: "Tenant rent collection gateway — Benefit Company" },
  { id: "int-ewa", name: "EWA Utility Portal", category: "utility", status: "connected", lastSync: "2026-06-09T22:00:00Z", description: "Electricity & Water Authority — bulk bill import" },
  { id: "int-pf", name: "PropertyFinder Bahrain", category: "listing", status: "connected", lastSync: "2026-06-08T14:00:00Z", description: "Vacancy listing sync — Bahrain market" },
  { id: "int-dub", name: "Dubizzle Bahrain", category: "listing", status: "disconnected", lastSync: "2026-05-20T10:00:00Z", description: "Classified listings integration" },
  { id: "int-sijilat", name: "Sijilat (MOIC)", category: "government", status: "connected", lastSync: "2026-06-07T12:00:00Z", description: "Ministry of Industry & Commerce — CR verification" },
  { id: "int-lmra", name: "LMRA Expat Portal", category: "government", status: "connected", lastSync: "2026-06-09T16:00:00Z", description: "Labour Market Regulatory Authority — permit status" },
  { id: "int-rera", name: "RERA Bahrain", category: "government", status: "connected", lastSync: "2026-06-06T11:00:00Z", description: "Real Estate Regulatory Authority — broker license" },
  { id: "int-slrb", name: "SLRB Tenancy", category: "government", status: "connected", lastSync: "2026-06-05T09:00:00Z", description: "Survey & Land Registration Bureau — lease registration" },
  { id: "int-tamkeen", name: "Tamkeen", category: "government", status: "disconnected", lastSync: "2026-04-01T08:00:00Z", description: "Labour Fund — training grant applications" },
  { id: "int-smtp", name: "Email (SMTP)", category: "email", status: "connected", lastSync: "2026-06-10T09:00:00Z", description: "Invoice and reminder notifications" },
];
