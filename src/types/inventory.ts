export interface InventoryPart {
  id: string;
  sku: string;
  name: string;
  category: string;
  stockQty: number;
  unitCost: number;
  reorderLevel: number;
}

export interface InventoryConsumption {
  id: string;
  partId: string;
  workOrderId: string;
  quantity: number;
  consumedAt: string;
}
