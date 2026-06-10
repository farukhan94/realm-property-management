export type IntegrationStatus = "connected" | "disconnected" | "error";

export interface Integration {
  id: string;
  name: string;
  category: "bank" | "payment" | "utility" | "listing" | "email" | "government";
  status: IntegrationStatus;
  lastSync: string;
  description: string;
}
