import { FoodAddon, FoodVariant } from './menu';

export type OrderType = 
  | 'Dine In' 
  | 'Takeaway' 
  | 'Delivery' 
  | 'Online Orders' 
  | 'Counter Orders' 
  | 'Scheduled Orders';

export type OrderStatus = 
  | 'New'
  | 'Accepted'
  | 'Preparing'
  | 'Ready'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected';

export type PaymentMethod = 
  | 'Cash' 
  | 'UPI' 
  | 'Card' 
  | 'Online Payment' 
  | 'Split Payment';

export type PaymentStatus = 'Paid' | 'Unpaid' | 'Refunded';

export interface SplitPaymentDetail {
  cashAmount: number;
  upiAmount: number;
  cardAmount: number;
  splitCount?: number;
}

export interface ItemCoffeeCustomization {
  milkType?: string; // Oat, Almond, Whole
  sugarLevel?: string; // None, Low, Normal
  temperature?: string; // Iced, Hot
  extraShots?: number;
}

export interface CartItem {
  id: string; // unique cart item id
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  selectedVariant?: FoodVariant;
  selectedAddons?: FoodAddon[];
  specialInstructions?: string;
  // Multi-business customization:
  selectedWeightGrams?: number;
  weightLabel?: string;
  coffeeCustomization?: ItemCoffeeCustomization;
  customCakeMessage?: string;
  isEggless?: boolean;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  variantName?: string;
  addonNames?: string[];
  total: number;
  weightLabel?: string;
  coffeeCustomization?: ItemCoffeeCustomization;
  customCakeMessage?: string;
  kitchenStation?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  branchId: string;
  branchName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: OrderType;
  tableNumber?: string;
  floorName?: string;
  assignedWaiter?: string;
  deliveryAddress?: string;
  deliveryPartner?: 'Direct Rider' | 'Swiggy' | 'Zomato' | 'Dunzo';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  taxGst: number; // 5% (or 18% for bar)
  serviceCharge: number;
  packagingCharge?: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  splitPaymentDetails?: SplitPaymentDetail;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  elapsedMinutes?: number;
  specialInstructions?: string;
  kotPrinted?: boolean;
  scheduledTime?: string;
}
