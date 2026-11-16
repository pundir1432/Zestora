export type StaffRole = 
  | 'Restaurant Owner'
  | 'Branch Manager'
  | 'Cashier'
  | 'Waiter'
  | 'Kitchen Staff'
  | 'Inventory Manager'
  | 'Delivery Manager';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  branchId: string;
  branchName: string;
  email: string;
  phone: string;
  salary: number;
  joiningDate: string;
  status: 'active' | 'inactive';
  shift: 'Morning' | 'Evening' | 'Full Day';
  avatar: string;
  permissions?: string[];
}
