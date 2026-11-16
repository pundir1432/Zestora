export interface PlatformOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  restaurantsCount: number;
  branchesCount: number;
  registeredDate: string;
  subscriptionPlan: 'Basic' | 'Professional' | 'Enterprise';
  status: 'active' | 'pending' | 'suspended';
  totalRevenueGenerated: number;
  city: string;
}

export const SAMPLE_PLATFORM_OWNERS: PlatformOwner[] = [
  {
    id: 'owner-1',
    name: 'Vikram Singhania',
    email: 'owner@foodpalace.com',
    phone: '+91 98765 43210',
    restaurantsCount: 1,
    branchesCount: 3,
    registeredDate: '2023-04-12',
    subscriptionPlan: 'Enterprise',
    status: 'active',
    totalRevenueGenerated: 8420000,
    city: 'Bengaluru',
  },
  {
    id: 'owner-2',
    name: 'Manish Chawla',
    email: 'manish@spicehub.in',
    phone: '+91 98220 99881',
    restaurantsCount: 1,
    branchesCount: 1,
    registeredDate: '2023-08-19',
    subscriptionPlan: 'Professional',
    status: 'active',
    totalRevenueGenerated: 3950000,
    city: 'Mumbai',
  },
  {
    id: 'owner-3',
    name: 'Sunita Aggarwal',
    email: 'sunita@pizzahouse.co',
    phone: '+91 98111 23456',
    restaurantsCount: 1,
    branchesCount: 1,
    registeredDate: '2024-01-10',
    subscriptionPlan: 'Professional',
    status: 'active',
    totalRevenueGenerated: 2840000,
    city: 'New Delhi',
  },
  {
    id: 'owner-4',
    name: 'Dharmesh Purohit',
    email: 'dharmesh@royalkitchen.com',
    phone: '+91 97230 45678',
    restaurantsCount: 1,
    branchesCount: 1,
    registeredDate: '2024-03-22',
    subscriptionPlan: 'Basic',
    status: 'active',
    totalRevenueGenerated: 1980000,
    city: 'Ahmedabad',
  },
  {
    id: 'owner-5',
    name: 'Tanvi Sehgal',
    email: 'tanvi@burgertown.com',
    phone: '+91 99887 76655',
    restaurantsCount: 1,
    branchesCount: 1,
    registeredDate: '2024-05-02',
    subscriptionPlan: 'Basic',
    status: 'pending',
    totalRevenueGenerated: 620000,
    city: 'Chandigarh',
  },
  {
    id: 'owner-6',
    name: 'Gurpreet Bhatia',
    email: 'gurpreet@amritsardhabas.com',
    phone: '+91 98140 12345',
    restaurantsCount: 2,
    branchesCount: 4,
    registeredDate: '2024-06-15',
    subscriptionPlan: 'Enterprise',
    status: 'active',
    totalRevenueGenerated: 4500000,
    city: 'Amritsar',
  },
  {
    id: 'owner-7',
    name: 'Karthik Subbaraj',
    email: 'karthik@chettinadexpress.in',
    phone: '+91 98400 88991',
    restaurantsCount: 1,
    branchesCount: 2,
    registeredDate: '2024-08-01',
    subscriptionPlan: 'Professional',
    status: 'suspended',
    totalRevenueGenerated: 1200000,
    city: 'Chennai',
  },
];

export const PLATFORM_OVERVIEW_STATS = {
  totalOwners: 1248,
  totalRestaurants: 2840,
  totalBranches: 4920,
  totalOrders: '1.82M',
  totalRevenue: '₹42.8 Cr',
  monthlyRecurringRevenue: '₹1.45 Cr',
  activeSubscriptions: 2410,
  pendingApprovals: 14,
  growthRates: {
    revenue: '+18.4%',
    restaurants: '+12.6%',
    orders: '+24.1%',
  },
};

export const PLATFORM_REVENUE_CHART_DATA = [
  { month: 'Jan', revenue: 98, subscriptions: 82, newOwners: 64 },
  { month: 'Feb', revenue: 105, subscriptions: 88, newOwners: 72 },
  { month: 'Mar', revenue: 118, subscriptions: 94, newOwners: 80 },
  { month: 'Apr', revenue: 112, subscriptions: 99, newOwners: 85 },
  { month: 'May', revenue: 126, subscriptions: 108, newOwners: 98 },
  { month: 'Jun', revenue: 135, subscriptions: 115, newOwners: 110 },
  { month: 'Jul', revenue: 142, subscriptions: 122, newOwners: 118 },
  { month: 'Aug', revenue: 138, subscriptions: 128, newOwners: 105 },
  { month: 'Sep', revenue: 149, subscriptions: 136, newOwners: 130 },
  { month: 'Oct', revenue: 158, subscriptions: 145, newOwners: 142 },
  { month: 'Nov', revenue: 168, subscriptions: 152, newOwners: 156 },
];

export const TOP_PERFORMING_RESTAURANTS = [
  { rank: 1, name: 'Food Palace', branches: 3, orders: '48,210', revenue: '₹84.2 L', rating: 4.8, city: 'Bengaluru' },
  { rank: 2, name: 'Spice Hub', branches: 1, orders: '26,450', revenue: '₹39.5 L', rating: 4.7, city: 'Mumbai' },
  { rank: 3, name: 'Amritsar Highway Dhaba', branches: 4, orders: '32,100', revenue: '₹45.0 L', rating: 4.9, city: 'Amritsar' },
  { rank: 4, name: 'Pizza House', branches: 1, orders: '19,800', revenue: '₹28.4 L', rating: 4.6, city: 'New Delhi' },
  { rank: 5, name: 'Royal Kitchen', branches: 1, orders: '16,200', revenue: '₹19.8 L', rating: 4.5, city: 'Ahmedabad' },
];

export const PLATFORM_ACTIVITIES = [
  { id: 'act-1', text: 'New branch "Whitefield Branch" added by Food Palace', time: '12 mins ago', type: 'branch', icon: 'branch' },
  { id: 'act-2', text: 'Subscription upgraded to Enterprise by Amritsar Dhaba', time: '34 mins ago', type: 'sub', icon: 'star' },
  { id: 'act-3', text: 'Burger Town submitted restaurant verification documents', time: '1 hour ago', type: 'kyc', icon: 'file' },
  { id: 'act-4', text: 'Monthly payout batch of ₹84.5 Lakhs cleared successfully', time: '3 hours ago', type: 'finance', icon: 'cash' },
  { id: 'act-5', text: 'New restaurant owner registration from Kolkata (Bengal Bites)', time: '5 hours ago', type: 'owner', icon: 'user' },
];

