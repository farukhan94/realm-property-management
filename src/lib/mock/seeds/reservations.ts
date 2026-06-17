import type { Reservation } from "@/types/reservation";

export const RESERVATIONS: Reservation[] = [
  { id: "RES-001", amenity: "pool", buildingId: "B-101", unitId: "U-1001", requestedBy: "Alice Cooper", date: "2026-06-20", startTime: "14:00", endTime: "16:00", guests: 4, status: "approved", notes: "Birthday party" },
  { id: "RES-002", amenity: "gym", buildingId: "B-101", unitId: "U-1005", requestedBy: "Charlie Davis", date: "2026-06-18", startTime: "07:00", endTime: "08:00", guests: 1, status: "approved" },
  { id: "RES-003", amenity: "bbq", buildingId: "B-102", unitId: "U-204", requestedBy: "Evan Ford", date: "2026-06-22", startTime: "17:00", endTime: "21:00", guests: 8, status: "pending", notes: "Family gathering" },
  { id: "RES-004", amenity: "party_hall", buildingId: "B-101", unitId: "U-1002", requestedBy: "Dana Al-Ghatam", date: "2026-06-28", startTime: "18:00", endTime: "23:00", guests: 30, status: "pending" },
  { id: "RES-005", amenity: "tennis_court", buildingId: "B-103", unitId: "U-301", requestedBy: "James Whitfield", date: "2026-06-19", startTime: "16:00", endTime: "17:30", guests: 2, status: "approved" },
  { id: "RES-006", amenity: "pool", buildingId: "B-102", unitId: "U-204", requestedBy: "Sara Al-Haddad", date: "2026-06-15", startTime: "10:00", endTime: "12:00", guests: 3, status: "cancelled" },
];
