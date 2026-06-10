import { mockStore } from "@/lib/mock/store";

export const mockAuditAdapter = {
  list(limit = 50) {
    return mockStore.auditLog.slice(0, limit);
  },

  exportCsv() {
    const header = "id,timestamp,actor,action,entityType,entityId,details,amount\n";
    const rows = mockStore.auditLog.map((e) =>
      `${e.id},${e.timestamp},${e.actor},${e.action},${e.entityType},${e.entityId},"${e.details}",${e.amount ?? ""}`
    ).join("\n");
    return header + rows;
  },
};
