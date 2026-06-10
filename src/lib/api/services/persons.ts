import { apiConfig } from "@/lib/api/config";
import { mockPersonsAdapter } from "@/lib/api/adapters/mock/persons";
import { notImplemented } from "@/lib/api/adapters/http/stub";
import type { Person, PersonRole } from "@/types/person";

export const personsService = {
  list: (role?: PersonRole): Promise<Person[]> =>
    apiConfig.useMock
      ? Promise.resolve(mockPersonsAdapter.list(role))
      : notImplemented(),

  get: (id: string): Promise<Person | null> =>
    apiConfig.useMock
      ? Promise.resolve(mockPersonsAdapter.get(id))
      : notImplemented(),
};
