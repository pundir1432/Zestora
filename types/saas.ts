export interface PlatformBranchRecord {
  id: string;
  name: string;
  code: string;
  restaurantId: string;
  restaurantName: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  managerName: string;
  managerPhone: string;
  seatingCapacity: number;
  tablesCount: number;
  status: 'active' | 'inactive';
  dailyRevenue: number;
  activeOrdersCount: number;
  joinedDate: string;
}

export interface SaaSInvoiceRecord {
  id: string;
  invoiceNumber: string;
  restaurantId: string;
  restaurantName: string;
  ownerName: string;
  ownerEmail: string;
  planName: 'Starter' | 'Basic' | 'Professional' | 'Business' | 'Enterprise' | 'Free Trial';
  billingCycle: 'Monthly' | 'Yearly';
  amount: number;
  gstAmount: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod?: string;
  transactionRef?: string;
}

export interface SupportTicketMessage {
  id: string;
  sender: 'tenant' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  restaurantId: string;
  restaurantName: string;
  ownerName: string;
  ownerEmail: string;
  subject: string;
  category: 'POS & Billing' | 'Hardware & Printer' | 'KOT & Kitchen' | 'Account & Billing' | 'Feature Request';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  messages: SupportTicketMessage[];
}

export interface PlatformNotificationRecord {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'maintenance' | 'feature';
  targetAudience: 'All Tenants' | 'Active Subscriptions' | 'Multi-Branch Only' | 'Cloud Kitchens';
  createdAt: string;
  scheduledFor?: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  deliveredCount: number;
  readCount: number;
}

export interface PlatformSettingsData {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  websiteUrl: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  saasGstRate: number;
  saasGstin: string;
  sacCode: string;
  razorpayKeyId: string;
  razorpayEnabled: boolean;
  stripeEnabled: boolean;
  smtpServer: string;
  smtpPort: number;
  senderEmail: string;
  maintenanceMode: boolean;
  twoFactorEnforced: boolean;
  sessionTimeoutMins: number;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  branchId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  partySize: number;
  date: string;
  timeSlot: string;
  tableNumber: string;
  status: 'Confirmed' | 'Arrived' | 'Seated' | 'Cancelled' | 'No Show';
  occasion?: 'Birthday' | 'Anniversary' | 'Business' | 'Family Dinner' | 'Casual';
  specialNotes?: string;
  assignedWaiter?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: 'Dairy' | 'Poultry & Meat' | 'Fresh Produce' | 'Beverages & Syrups' | 'Bakery Raw' | 'Packaging' | 'Spices & Groceries';
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  gstin?: string;
  paymentTerms: 'COD' | 'Net 7' | 'Net 15' | 'Net 30';
  outstandingBalance: number;
  status: 'Active' | 'On Hold';
  lastOrderDate: string;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  category: 'Rent' | 'Utilities' | 'Salaries & Wages' | 'Maintenance & Repairs' | 'Marketing & Ads' | 'Packaging Materials' | 'Kitchen Supplies' | 'Miscellaneous';
  amount: number;
  date: string;
  paidTo: string;
  paymentMode: 'Cash' | 'Bank Transfer' | 'UPI' | 'Company Card' | 'Cheque';
  branchId: string;
  branchName: string;
  status: 'Paid' | 'Approved' | 'Pending';
  receiptRef?: string;
  notes?: string;
}

export interface OfferCoupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'expired' | 'scheduled';
  applicableChannels: ('Dine In' | 'Takeaway' | 'Delivery')[];
}

/* =========================================================================
   NEW ADVANCED SAAS EXTENSIONS (INTELLIGENCE, AUTOMATION & MANAGEMENT)
   ========================================================================= */

export interface PaymentTransactionRecord {
  id: string;
  txnNumber: string;
  restaurantId: string;
  restaurantName: string;
  ownerName: string;
  amount: number;
  gateway: 'Razorpay' | 'Stripe' | 'Cashfree' | 'UPI AutoPay';
  status: 'Success' | 'Failed' | 'Refunded' | 'Processing';
  date: string;
  time: string;
  feeDeducted: number;
  netPayout: number;
  customerMethod: string;
}

export interface MarketplaceFeature {
  id: string;
  name: string;
  slug: string;
  category: 'Automation' | 'Integrations' | 'AI & Analytics' | 'Hardware' | 'Marketing';
  monthlyPrice: number;
  isInstalled: boolean;
  description: string;
  tagline: string;
  rating: number;
  installsCount: number;
  badge?: string;
  features: string[];
}

export interface SuperAdminCoupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount: number;
  applicablePlan: string;
  validUntil: string;
  totalUsed: number;
  maxUses: number;
  status: 'Active' | 'Expired';
}

export interface FoodWasteEntry {
  id: string;
  date: string;
  dishName: string;
  category: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  reason: 'Expired / Spoilage' | 'Preparation Error' | 'Dropped / Damaged' | 'Customer Return' | 'Overproduction';
  recordedBy: string;
  branchName: string;
}

export interface RecipeIngredientCost {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
}

export interface RecipeDetail {
  id: string;
  menuItemId: string;
  dishName: string;
  category: string;
  sellingPrice: number;
  ingredients: RecipeIngredientCost[];
  totalRawCost: number;
  foodCostPercentage: number;
  profitMargin: number;
  isVeg: boolean;
  preparationTimeMinutes: number;
}

export interface LoyaltyTier {
  name: 'Silver' | 'Gold' | 'Platinum';
  minSpend: number;
  cashbackPercent: number;
  perks: string[];
  color: string;
  memberCount: number;
}

export interface CustomerFeedbackRecord {
  id: string;
  guestName: string;
  phone: string;
  orderNumber: string;
  date: string;
  overallRating: number;
  foodRating: number;
  serviceRating: number;
  ambianceRating: number;
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  staffReply?: string;
}

export interface MarketingCampaignRecord {
  id: string;
  title: string;
  channel: 'WhatsApp' | 'SMS' | 'Email';
  audienceSegment: 'All Customers' | 'VIP & High Spenders' | 'Inactive (30+ Days)' | 'Biryani Lovers';
  scheduledDate: string;
  sentCount: number;
  deliveredCount: number;
  convertedOrders: number;
  revenueGenerated: number;
  status: 'Sent' | 'Scheduled' | 'Draft';
  messagePreview: string;
}

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  branchName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workHours: number;
  overtimeHours: number;
  status: 'Present' | 'Late' | 'Half Day' | 'Absent';
  verificationMethod: 'Biometric Scanner' | 'Manager PIN' | 'GPS Mobile App';
}

export interface StaffShiftRecord {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  assignedStaffCount: number;
  branchName: string;
  color: string;
}

export interface RolePermissionDefinition {
  roleName: string;
  description: string;
  allowDiscount: boolean;
  allowVoidBill: boolean;
  allowRefund: boolean;
  allowReportsView: boolean;
  allowMenuEdit: boolean;
  allowInventoryAdjust: boolean;
  allowStaffManage: boolean;
}

export interface FranchiseOutletRecord {
  id: string;
  franchiseCode: string;
  branchName: string;
  ownerName: string;
  city: string;
  monthlySales: number;
  royaltyPercentage: number;
  royaltyDue: number;
  royaltyStatus: 'Paid' | 'Pending' | 'Overdue';
  agreementEnd: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  message: string;
  timestamp: string;
  suggestions?: string[];
  metricsCard?: {
    label: string;
    value: string;
    sublabel: string;
    sentiment?: 'positive' | 'warning' | 'info';
  };
}

export interface DemandForecastRecord {
  date: string;
  dayOfWeek: string;
  predictedSales: number;
  expectedOrders: number;
  peakHour: string;
  confidenceScore: number;
  topStockRequirements: {
    ingredient: string;
    neededQty: string;
    stockRisk: 'Safe' | 'Low Stock Risk' | 'Critical Reorder';
  }[];
}

export interface ProfitLossMonth {
  month: string;
  grossSales: number;
  discounts: number;
  netRevenue: number;
  costOfIngredients: number; // COGS
  grossProfit: number;
  operatingExpenses: number; // Rent, Salaries, Electricity, Ads
  netOperatingProfit: number;
  netMarginPercentage: number;
  foodCostPercentage: number;
}

export interface FraudAlertRecord {
  id: string;
  timestamp: string;
  type: 'Voided Bill' | 'Excessive Discount' | 'Cash Drawer Variance' | 'Deleted KOT Item' | 'Unusual Refund';
  severity: 'Critical' | 'Warning' | 'Low';
  description: string;
  cashierName: string;
  orderNumber?: string;
  amount: number;
  status: 'Flagged' | 'Investigating' | 'Cleared';
}

export interface ThirdPartyIntegrationRecord {
  id: string;
  name: string;
  category: 'Food Aggregator' | 'Accounting & ERP' | 'Payment Gateway' | 'SMS & WhatsApp' | 'Loyalty';
  description: string;
  isConnected: boolean;
  iconName: string;
  lastSyncTime?: string;
  syncStatus?: 'Operational' | 'Syncing' | 'Action Needed';
}

export interface OnlineStoreBranding {
  businessId: string;
  storeName: string;
  slug: string;
  tagline: string;
  logo: string;
  coverImage: string;
  themeColor: string;
  accentColor: string;
  deliveryFee: number;
  minOrder: number;
  estimatedDeliveryMins: number;
  isOpen: boolean;
  announcementText?: string;
  phone: string;
  address: string;
}
