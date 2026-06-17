export type ReservationStatus = "pending" | "approved" | "rejected" | "cancelled";

export type AmenityType = "gym" | "pool" | "bbq" | "party_hall" | "tennis_court";

export interface Reservation {
  id: string;
  amenity: AmenityType;
  buildingId: string;
  unitId: string;
  requestedBy: string;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  status: ReservationStatus;
  notes?: string;
}
