export type CustomerGroup = 'VIP' | 'Regular' | 'New' | 'Corporate' | 'Student' | 'High Spender';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  totalOrders: number;
  totalSpending: number;
  lastOrderDate: string;
  category: CustomerGroup;
  customerGroup?: CustomerGroup;
  loyaltyPoints: number;
  favoriteItems: string[];
  status: 'active' | 'inactive';
  birthday?: string;
  dateOfBirth?: string;
  anniversary?: string;
  anniversaryDate?: string;
  activeCoupons?: string[];
  notes?: string;
}
