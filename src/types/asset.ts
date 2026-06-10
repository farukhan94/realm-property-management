export interface Asset {
  id: string;
  name: string;
  unitId: string;
  buildingId: string;
  category: string;
  status: "healthy" | "needs_service" | "critical";
  installed: string;
  health: number;
}
