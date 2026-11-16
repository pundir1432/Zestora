export type UserRole = 
  | 'super_admin' 
  | 'restaurant_owner' 
  | 'branch_manager' 
  | 'cashier' 
  | 'waiter'
  | 'kitchen_staff'
  | 'accountant';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  phone: string;
  restaurantId?: string;
  restaurantName?: string;
  branchId?: string;
  branchName?: string;
}

export interface DemoAccount {
  role: UserRole;
  email: string;
  password: string;
  name: string;
  roleTitle: string;
  description: string;
  badgeColor: string;
  defaultPath: string;
  restaurantName?: string;
  branchName?: string;
}
