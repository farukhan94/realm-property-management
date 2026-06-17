import { apiConfig } from "@/lib/api/config";
import { mockGuestbookAdapter } from "@/lib/api/adapters/mock/guestbook";
import { notImplemented } from "@/lib/api/adapters/http/stub";
import type { GuestbookEntry } from "@/types/guestbook";

export const guestbookService = {
  list: (): Promise<ReturnType<typeof mockGuestbookAdapter.list>> =>
    apiConfig.useMock ? Promise.resolve(mockGuestbookAdapter.list()) : notImplemented(),
  checkIn: (entry: Omit<GuestbookEntry, "id" | "checkOutTime" | "status">): Promise<ReturnType<typeof mockGuestbookAdapter.checkIn>> =>
    apiConfig.useMock ? Promise.resolve(mockGuestbookAdapter.checkIn(entry)) : notImplemented(),
  checkOut: (id: string): Promise<ReturnType<typeof mockGuestbookAdapter.checkOut>> =>
    apiConfig.useMock ? Promise.resolve(mockGuestbookAdapter.checkOut(id)) : notImplemented(),
};
