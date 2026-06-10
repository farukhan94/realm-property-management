import { mockStore } from "@/lib/mock/store";

export const mockDocumentsAdapter = {
  list(filters?: { entityId?: string; unitId?: string; hoaId?: string; role?: string }) {
    let docs = mockStore.documents;
    if (filters?.entityId) docs = docs.filter((d) => d.entityId === filters.entityId);
    if (filters?.unitId) docs = docs.filter((d) => d.unitId === filters.unitId);
    if (filters?.hoaId) docs = docs.filter((d) => d.hoaId === filters.hoaId);
    if (filters?.role) docs = docs.filter((d) => d.visibility.includes(filters.role!));
    return docs;
  },
};
