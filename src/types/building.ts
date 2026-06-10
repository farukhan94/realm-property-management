export interface Building {
  id: string;
  name: string;
  nameAr?: string;
  location: string;
  road?: string;
  block?: string;
  floors: number;
  totalUnits: number;
  hoaId: string | null;
  underManagement: boolean;
  managingEntityId: string;
  occupancy: number;
  status: "Operational" | "Under Construction";
  areaSqm?: number;
}
