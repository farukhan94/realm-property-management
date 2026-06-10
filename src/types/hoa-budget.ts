export interface HoaBudgetLine {
  id: string;
  hoaId: string;
  category: string;
  budgetAmount: number;
  actualAmount: number;
  year: number;
}

export interface HoaProcurement {
  id: string;
  hoaId: string;
  vendor: string;
  description: string;
  amount: number;
  status: "draft" | "approved" | "paid";
  orderDate: string;
}
