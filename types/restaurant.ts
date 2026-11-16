export type BusinessType = 
  | 'Cafe / Coffee Shop'
  | 'Fine Dining Restaurant'
  | 'Casual Dining Restaurant'
  | 'Fast Food / QSR'
  | 'Cloud Kitchen'
  | 'Bakery'
  | 'Food Truck'
  | 'Sweet Shop / Mithai Shop'
  | 'Hotel Restaurant'
  | 'Food Court'
  | 'Pizza Shop'
  | 'Juice Bar'
  | 'Ice Cream Parlour'
  | 'Bar / Pub'
  | 'Catering Business';

export interface BusinessFeatures {
  posBilling: boolean;
  dineIn: boolean;
  tableManagement: boolean;
  onlineOrdering: boolean;
  takeaway: boolean;
  delivery: boolean;
  reservations: boolean;
  kitchenKot: boolean;
  kitchenKds: boolean;
  inventory: boolean;
  staffManagement: boolean;
  customerCrm: boolean;
  loyaltyProgram: boolean;
  offersDiscounts: boolean;
  splitBilling: boolean;
  multiplePayments: boolean;
  gstConfiguration: boolean;
  purchaseManagement: boolean;
  recipeManagement: boolean;
  reportsAnalytics: boolean;
  // Specific operational modules:
  weightBasedBilling: boolean;      // For Sweet Shops, Bakeries
  customCakeOrders: boolean;        // For Bakeries
  coffeeCustomization: boolean;     // For Cafes / Coffee Shops
  alcoholBarTab: boolean;           // For Bars / Pubs
  packagingCharges: boolean;        // For Cloud Kitchens, Takeaways
  courseOrdering: boolean;          // For Fine Dining
}

export interface Floor {
  id: string;
  name: string;
  code: string;
  restaurantId: string;
  tablesCount: number;
}

export interface RestaurantTable {
  id: string;
  number: string;
  floorId: string;
  floorName: string;
  capacity: number;
  section: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrderId?: string;
  assignedWaiter?: string;
  activeGuests?: number;
  seatedAt?: string;
  currentBillAmount?: number;
  mergedWithTable?: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  restaurantId: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  openingHours: string;
  seatingCapacity: number;
  tablesCount: number;
  status: 'active' | 'inactive';
  dailyRevenue: number;
  activeOrdersCount: number;
}

export interface Restaurant {
  id: string;
  name: string;
  businessType: BusinessType;
  tagline: string;
  description?: string;
  cuisine: string[];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  logo: string;
  coverImage?: string;
  fssaiNumber: string;
  gstin: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  openingHours?: string;
  status: 'active' | 'pending' | 'suspended';
  subscriptionPlan: 'Starter' | 'Professional' | 'Business' | 'Enterprise' | 'Basic' | 'Free Trial';
  subscriptionStatus?: 'Trial' | 'Active' | 'Payment Due' | 'Grace Period' | 'Expired' | 'Suspended' | 'Cancelled';
  trialDaysRemaining?: number;
  trialTotalDays?: number;
  graceDaysRemaining?: number;
  nextBillingDate?: string;
  autoRenew?: boolean;
  createdAt: string;
  features: BusinessFeatures;
  branches: Branch[];
}
