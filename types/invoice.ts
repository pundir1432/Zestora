import { PaymentMethod, PaymentStatus } from './order';

export interface InvoiceItem {
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g., "INV-2026-8812"
  orderId: string;
  orderNumber: string;
  restaurantName: string;
  branchName: string;
  gstin: string;
  fssaiNumber: string;
  customerName: string;
  customerPhone: string;
  customerGstin?: string;
  date: string;
  time: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  cgst: number; // 2.5%
  sgst: number; // 2.5%
  serviceCharge: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  cashierName: string;
}

