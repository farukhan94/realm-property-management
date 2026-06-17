export type GuestbookStatus = "checked_in" | "checked_out";

export interface GuestbookEntry {
  id: string;
  visitorName: string;
  idNumber: string;
  purpose: string;
  hostUnitId: string;
  hostName: string;
  buildingId: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: GuestbookStatus;
  vehiclePlate?: string;
}
