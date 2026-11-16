export interface InventoryItem {
  id: string;
  name: string;
  category: 'Dairy' | 'Meat & Poultry' | 'Vegetables' | 'Grains & Flour' | 'Spices & Oils' | 'Beverages & Syrups' | 'Packaging' | 'Bakery Raw' | 'Sweets Raw';
  currentStock: number;
  minStockLevel: number;
  unit: 'kg' | 'L' | 'packets' | 'pcs' | 'cans';
  purchasePrice: number; // per unit
  supplierName: string;
  supplierContact: string;
  lastRestockedDate: string;
  expiryDate?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  batchNumber: string;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  itemName: string;
  type: 'Stock In' | 'Stock Out' | 'Wastage';
  quantity: number;
  unit: string;
  reason: string;
  date: string;
  recordedBy: string;
}

export interface PurchaseOrderItem {
  itemId?: string;
  inventoryItemId?: string;
  name?: string;
  itemName?: string;
  quantity: number;
  unit: string;
  unitPrice?: number;
  costPerUnit?: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  supplierContact?: string;
  orderDate?: string;
  createdAt?: string;
  expectedDeliveryDate: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Pending' | 'Shipped' | 'Received' | 'Cancelled';
  notes?: string;
}
