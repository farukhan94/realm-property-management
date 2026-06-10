import { PERSONS } from "@/lib/mock/seed";
import type { Person, PersonRole } from "@/types/person";

export const mockPersonsAdapter = {
  list(role?: PersonRole): Person[] {
    if (!role) return PERSONS;
    return PERSONS.filter((p) => p.role === role);
  },

  get(id: string): Person | null {
    return PERSONS.find((p) => p.id === id) ?? null;
  },
};
