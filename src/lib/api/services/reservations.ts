import { apiConfig } from "@/lib/api/config";
import { mockReservationsAdapter } from "@/lib/api/adapters/mock/reservations";
import { notImplemented } from "@/lib/api/adapters/http/stub";
import type { Reservation } from "@/types/reservation";

export const reservationsService = {
  list: (): Promise<ReturnType<typeof mockReservationsAdapter.list>> =>
    apiConfig.useMock ? Promise.resolve(mockReservationsAdapter.list()) : notImplemented(),
  create: (input: Omit<Reservation, "id" | "status">): Promise<ReturnType<typeof mockReservationsAdapter.create>> =>
    apiConfig.useMock ? Promise.resolve(mockReservationsAdapter.create(input)) : notImplemented(),
  updateStatus: (id: string, status: Reservation["status"]): Promise<ReturnType<typeof mockReservationsAdapter.updateStatus>> =>
    apiConfig.useMock ? Promise.resolve(mockReservationsAdapter.updateStatus(id, status)) : notImplemented(),
};
