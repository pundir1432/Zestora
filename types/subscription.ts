export type SubscriptionPlanTier = 'Starter' | 'Professional' | 'Business' | 'Enterprise' | 'Basic' | 'Free Trial';

export type SubscriptionLifecycleStatus = 
  | 'Trial' 
  | 'Active' 
  | 'Payment Due' 
  | 'Grace Period' 
  | 'Expired' 
  | 'Suspended' 
  | 'Cancelled'
  | 'Expiring Soon'
  | 'Past Due';

export interface SubscriptionPlan {
  id: string;
  name: SubscriptionPlanTier;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  maxBranches: number;
  maxStaff: number;
  isPopular?: boolean;
  recommendedFor?: string;
  badge?: string;
}

export interface OwnerSubscription {
  id: string;
  ownerId: string;
  ownerName: string;
  restaurantId?: string;
  restaurantName: string;
  planName: SubscriptionPlanTier;
  billingCycle: 'Monthly' | 'Yearly';
  amount: number;
  startDate: string;
  nextBillingDate: string;
  status: SubscriptionLifecycleStatus;
  paymentMethod: string;
  trialDaysRemaining?: number;
  trialTotalDays?: number;
  graceDaysRemaining?: number;
  trialEndDate?: string;
  autoRenew?: boolean;
  isRestrictedMode?: boolean;
  lastReminderSent?: string;
  gstAmount?: number;
  sacCode?: string;
  lastPaymentDate?: string;
  couponApplied?: string;
  discountAmount?: number;
}
