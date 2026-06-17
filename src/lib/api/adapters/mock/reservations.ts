import { mockStore } from "@/lib/mock/store";
import type { Reservation } from "@/types/reservation";

export const mockReservationsAdapter = {
  list() {
    return mockStore.reservations;
  },
  create(input: Omit<Reservation, "id" | "status">) {
    return mockStore.createReservation(input);
  },
  updateStatus(id: string, status: Reservation["status"]) {
    return mockStore.updateReservationStatus(id, status);
  },
};
