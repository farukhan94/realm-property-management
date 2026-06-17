import type { GuestbookEntry } from "@/types/guestbook";

export const GUESTBOOK_ENTRIES: GuestbookEntry[] = [
  { id: "GB-001", visitorName: "Ahmed Hassan", idNumber: "760101234", purpose: "Delivery", hostUnitId: "U-1001", hostName: "Alice Cooper", buildingId: "B-101", checkInTime: "2026-06-17T09:15:00", checkOutTime: null, status: "checked_in", vehiclePlate: "12345" },
  { id: "GB-002", visitorName: "Maria Santos", idNumber: "PH112233", purpose: "Guest visit", hostUnitId: "U-1005", hostName: "Charlie Davis", buildingId: "B-101", checkInTime: "2026-06-17T10:30:00", checkOutTime: null, status: "checked_in" },
  { id: "GB-003", visitorName: "Omar Contractor", idNumber: "890512345", purpose: "Maintenance", hostUnitId: "U-204", hostName: "Building Management", buildingId: "B-102", checkInTime: "2026-06-17T08:00:00", checkOutTime: "2026-06-17T12:30:00", status: "checked_out" },
  { id: "GB-004", visitorName: "Priya Sharma", idNumber: "IN445566", purpose: "Interview", hostUnitId: "U-301", hostName: "James Whitfield", buildingId: "B-103", checkInTime: "2026-06-16T14:00:00", checkOutTime: "2026-06-16T15:45:00", status: "checked_out" },
  { id: "GB-005", visitorName: "Khalid Al-Mannai", idNumber: "820505678", purpose: "Owner visit", hostUnitId: "U-1002", hostName: "Khalid Al-Khalifa", buildingId: "B-101", checkInTime: "2026-06-17T11:00:00", checkOutTime: null, status: "checked_in" },
  { id: "GB-006", visitorName: "EWA Inspector", idNumber: "GOV-8821", purpose: "Utility inspection", hostUnitId: "U-101-05", hostName: "Building Management", buildingId: "B-101", checkInTime: "2026-06-16T09:00:00", checkOutTime: "2026-06-16T11:00:00", status: "checked_out" },
];
