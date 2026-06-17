import { mockStore } from "@/lib/mock/store";
import type { GuestbookEntry } from "@/types/guestbook";

export const mockGuestbookAdapter = {
  list() {
    return mockStore.guestbookEntries;
  },
  checkIn(entry: Omit<GuestbookEntry, "id" | "checkOutTime" | "status">) {
    return mockStore.checkInGuest(entry);
  },
  checkOut(id: string) {
    return mockStore.checkOutGuest(id);
  },
};
