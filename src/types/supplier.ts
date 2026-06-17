export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactEmail: string;
  contactPhone: string;
  activeContracts: number;
  pendingInvoices: number;
  totalBilled: number;
}

export interface SupplierBill {
  id: string;
  supplierId: string;
  description: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  status: "pending" | "overdue" | "paid";
}
