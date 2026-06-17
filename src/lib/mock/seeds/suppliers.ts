import type { Supplier, SupplierBill } from "@/types/supplier";

export const SUPPLIERS: Supplier[] = [
  { id: "sup-1", name: "Delmon Elevators W.L.L.", category: "Elevator Maintenance", contactEmail: "service@delmon.bh", contactPhone: "+973 1771 5500", activeContracts: 4, pendingInvoices: 2, totalBilled: 18500 },
  { id: "sup-2", name: "Bahrain Plumbing & Electrical", category: "MEP Services", contactEmail: "ops@bpe.bh", contactPhone: "+973 1723 4400", activeContracts: 6, pendingInvoices: 3, totalBilled: 12400 },
  { id: "sup-3", name: "Gulf AC Maintenance", category: "HVAC", contactEmail: "dispatch@gulfac.bh", contactPhone: "+973 1788 2200", activeContracts: 8, pendingInvoices: 1, totalBilled: 22100 },
  { id: "sup-4", name: "Otis Bahrain", category: "Elevator OEM", contactEmail: "contracts@otis.bh", contactPhone: "+973 1773 8800", activeContracts: 3, pendingInvoices: 0, totalBilled: 9800 },
  { id: "sup-5", name: "SecureGuard FM", category: "Security & Cleaning", contactEmail: "billing@secureguard.bh", contactPhone: "+973 1700 3300", activeContracts: 5, pendingInvoices: 4, totalBilled: 15600 },
];

export const SUPPLIER_BILLS: SupplierBill[] = [
  { id: "SB-001", supplierId: "sup-1", description: "Elevator PM — B-101 Q2", amount: 1250, dueDate: "2026-05-15", daysOverdue: 33, status: "overdue" },
  { id: "SB-002", supplierId: "sup-2", description: "Plumbing repair — U-204", amount: 380, dueDate: "2026-06-01", daysOverdue: 16, status: "overdue" },
  { id: "SB-003", supplierId: "sup-3", description: "AC filter replacement — B-102", amount: 620, dueDate: "2026-06-10", daysOverdue: 7, status: "overdue" },
  { id: "SB-004", supplierId: "sup-5", description: "Security services — May 2026", amount: 2400, dueDate: "2026-06-05", daysOverdue: 12, status: "overdue" },
  { id: "SB-005", supplierId: "sup-2", description: "Electrical inspection — B-103", amount: 450, dueDate: "2026-06-20", daysOverdue: 0, status: "pending" },
];

export const MAINTENANCE_MANAGERS = [
  { id: "mm-1", name: "Youssef Al-Hajri", email: "y.hajri@manzil.bh", buildingIds: ["B-101", "B-102", "B-103"] },
  { id: "mm-2", name: "Sara Al-Khalifa", email: "s.khalifa@manzil.bh", buildingIds: ["B-104", "B-105", "B-106"] },
];
