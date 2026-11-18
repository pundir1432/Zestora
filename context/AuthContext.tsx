'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, UserProfile } from '@/types/auth';
import { DEMO_ACCOUNTS } from '@/data/authData';
import { SAMPLE_RESTAURANTS, SAMPLE_TABLES } from '@/data/restaurantData';
import { SAMPLE_ORDERS } from '@/data/ordersData';
import { SAMPLE_INVENTORY } from '@/data/inventoryData';
import { SAMPLE_MENU_ITEMS } from '@/data/menuData';
import { Restaurant, Branch, BusinessFeatures, RestaurantTable, BusinessType } from '@/types/restaurant';
import { Order, OrderStatus } from '@/types/order';
import { InventoryItem } from '@/types/inventory';
import { getDefaultFeaturesForBusinessType } from '@/data/businessTypesData';

export interface RecipeDeductionLog {
  id: string;
  orderNumber?: string;
  timestamp: string;
  details: string;
  itemsCount: number;
}

export interface OnboardingDraftData {
  step: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  businessName: string;
  businessType: BusinessType;
  businessCategory: string;
  branchCount: number;
  businessAddress: string;
  city: string;
  state: string;
  gstin: string;
  fssaiNumber: string;
  openingHours: string;
  subscriptionPlan: 'Free Trial' | 'Starter' | 'Professional' | 'Business' | 'Enterprise';
  features: BusinessFeatures;
  savedAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  businesses: Restaurant[];
  currentRestaurant: Restaurant;
  currentBranch: Branch | null; // null means 'All Branches'
  isStoreOnline: boolean;
  loginAsRole: (role: UserRole) => void;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchRestaurant: (restId: string) => void;
  switchBranch: (branchId: string | 'all') => void;
  toggleStoreOnline: () => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;

  // Multi-Tenant SaaS Operations
  registerBusiness: (data: {
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    password?: string;
    businessName: string;
    businessType: BusinessType;
    businessCategory?: string;
    branchCount?: number;
    businessAddress?: string;
    city?: string;
    state?: string;
    gstin?: string;
    fssaiNumber?: string;
    features?: BusinessFeatures;
    subscriptionPlan?: 'Free Trial' | 'Starter' | 'Professional' | 'Business' | 'Enterprise';
  }) => Restaurant;

  updateRestaurant: (updated: Partial<Restaurant>) => void;
  updateRestaurantFeatures: (newFeatures: Partial<BusinessFeatures>) => void;
  isFeatureEnabled: (featureKey: keyof BusinessFeatures) => boolean;

  // Multi-Branch Management
  addBranch: (branchData: Omit<Branch, 'id' | 'restaurantId' | 'dailyRevenue' | 'activeOrdersCount'>) => Branch;
  updateBranch: (branchId: string, updated: Partial<Branch>) => void;
  deleteBranch: (branchId: string) => void;

  // Onboarding Wizard Draft State
  saveOnboardingDraft: (data: Partial<OnboardingDraftData>) => void;
  getOnboardingDraft: () => OnboardingDraftData | null;
  clearOnboardingDraft: () => void;

  // Orders State
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Tables State
  tables: RestaurantTable[];
  updateTableStatus: (tableId: string, status: 'available' | 'occupied' | 'reserved' | 'cleaning', extra?: Partial<RestaurantTable>) => void;
  assignWaiterToTable: (tableId: string, waiter: string) => void;
  transferTable: (sourceTableId: string, targetTableId: string) => void;
  mergeTables: (sourceTableId: string, targetTableId: string) => void;

  // Inventory & Recipe Auto-Deduction State
  inventory: InventoryItem[];
  recentDeductions: RecipeDeductionLog[];
  deductRecipeIngredients: (orderedItems: { menuItemId: string; quantity: number }[], orderNumber?: string) => { itemName: string; deducted: { ingredientName: string; amount: number; unit: string }[] }[];

  // Subscription & Free Trial Lifecycle
  subscriptionStatus: 'Trial' | 'Active' | 'Payment Due' | 'Grace Period' | 'Expired' | 'Suspended' | 'Cancelled';
  subscriptionPlan: 'Starter' | 'Professional' | 'Business' | 'Enterprise' | 'Free Trial';
  trialDaysRemaining: number;
  trialTotalDays: number;
  graceDaysRemaining: number;
  nextPaymentDate: string;
  autoRenew: boolean;
  trialConfig: { defaultTrialDays: number; defaultGraceDays: number };
  updateTrialConfig: (trialDays: number, graceDays: number) => void;
  activateSubscription: (plan: 'Starter' | 'Professional' | 'Business' | 'Enterprise', cycle: 'Monthly' | 'Yearly', paymentMethod: string, amount: number) => void;
  setSubscriptionStatus: (status: 'Trial' | 'Active' | 'Payment Due' | 'Grace Period' | 'Expired' | 'Suspended' | 'Cancelled') => void;
  extendSubscription: (days: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  // Multi-tenant businesses state
  const [businesses, setBusinesses] = useState<Restaurant[]>(SAMPLE_RESTAURANTS);
  const defaultRestaurant = SAMPLE_RESTAURANTS[0];
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant>(defaultRestaurant);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(defaultRestaurant.branches[0] || null);
  const [isStoreOnline, setIsStoreOnline] = useState<boolean>(true);

  // User & Role State (starts unauthenticated until signed in for this browser session)
  const [role, setRole] = useState<UserRole>('restaurant_owner');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  // Live Shared State
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [tables, setTables] = useState<RestaurantTable[]>(SAMPLE_TABLES);
  const [inventory, setInventory] = useState<InventoryItem[]>(SAMPLE_INVENTORY);
  const [recentDeductions, setRecentDeductions] = useState<RecipeDeductionLog[]>([
    {
      id: 'deduct-init-1',
      orderNumber: 'ORD-8804',
      timestamp: 'Just now',
      details: 'Deducted 0.25kg Paneer, 0.05L Oil for Paneer Tikka',
      itemsCount: 2,
    },
    {
      id: 'deduct-init-2',
      orderNumber: 'ORD-8803',
      timestamp: '15 mins ago',
      details: 'Deducted 0.3kg Chicken, 0.02kg Masala for Tandoori Chicken',
      itemsCount: 1,
    }
  ]);

  // Subscription Lifecycle State
  const [subscriptionStatus, setSubStatus] = useState<'Trial' | 'Active' | 'Payment Due' | 'Grace Period' | 'Expired' | 'Suspended' | 'Cancelled'>('Active');
  const [subscriptionPlan, setSubPlan] = useState<'Starter' | 'Professional' | 'Business' | 'Enterprise' | 'Free Trial'>('Professional');
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number>(5);
  const [trialTotalDays, setTrialTotalDays] = useState<number>(7);
  const [graceDaysRemaining, setGraceDaysRemaining] = useState<number>(7);
  const [nextPaymentDate, setNextPaymentDate] = useState<string>('2027-04-12');
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [trialConfig, setTrialConfig] = useState<{ defaultTrialDays: number; defaultGraceDays: number }>({
    defaultTrialDays: 7,
    defaultGraceDays: 7,
  });

  // Hydrate from sessionStorage (auth) and localStorage (tenant data) on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSession = sessionStorage.getItem('zestora_auth_session');
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          if (parsedSession && parsedSession.user && parsedSession.role) {
            setRole(parsedSession.role);
            setUser(parsedSession.user);
            setIsAuthenticated(true);
          }
        }

        const storedBusinesses = localStorage.getItem('saas_businesses');
        if (storedBusinesses) {
          const parsed = JSON.parse(storedBusinesses);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBusinesses(parsed);
            setCurrentRestaurant(parsed[0]);
            setCurrentBranch(parsed[0].branches[0] || null);
            if (parsed[0].subscriptionStatus) {
              setSubStatus(parsed[0].subscriptionStatus);
            }
            if (parsed[0].subscriptionPlan) {
              setSubPlan(parsed[0].subscriptionPlan as any);
            }
          }
        }
        const storedTrialConfig = localStorage.getItem('saas_trial_config');
        if (storedTrialConfig) {
          setTrialConfig(JSON.parse(storedTrialConfig));
        }
        const storedSubStatus = localStorage.getItem('saas_tenant_sub_status');
        if (storedSubStatus) {
          setSubStatus(storedSubStatus as any);
        }
        const storedSubPlan = localStorage.getItem('saas_tenant_sub_plan');
        if (storedSubPlan) {
          setSubPlan(storedSubPlan as any);
        }
      } catch (err) {
        console.error('Failed to load session or businesses from storage', err);
      } finally {
        setIsAuthReady(true);
      }
    }
  }, []);

  // Sync businesses to localStorage
  const persistBusinesses = (updatedList: Restaurant[]) => {
    setBusinesses(updatedList);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('saas_businesses', JSON.stringify(updatedList));
      } catch (err) {
        console.error('Failed to persist businesses to localStorage', err);
      }
    }
  };

  // Persist active auth session in sessionStorage (cleared automatically when tab/browser is closed)
  const persistAuthSession = (nextUser: UserProfile, nextRole: UserRole) => {
    setRole(nextRole);
    setUser(nextUser);
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('zestora_auth_session', JSON.stringify({ user: nextUser, role: nextRole }));
      } catch (err) {
        console.error('Failed to persist auth session', err);
      }
    }
  };

  // Quick switch role
  const switchRole = (newRole: UserRole) => {
    const demo = DEMO_ACCOUNTS.find(a => a.role === newRole);
    if (demo) {
      const nextUser: UserProfile = {
        id: `user-${newRole}`,
        name: demo.name,
        email: demo.email,
        role: newRole,
        roleTitle: demo.roleTitle,
        avatar: newRole === 'super_admin' 
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80'
          : newRole === 'kitchen_staff'
          ? 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=120&h=120&q=80'
          : newRole === 'cashier'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'
          : newRole === 'waiter'
          ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80'
          : newRole === 'accountant'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        phone: '+91 98765 43210',
        restaurantId: currentRestaurant.id,
        restaurantName: currentRestaurant.name,
        branchId: currentBranch?.id,
        branchName: currentBranch?.name,
      };
      persistAuthSession(nextUser, newRole);

      // Role specific redirects
      if (newRole === 'super_admin') {
        router.push('/super-admin/dashboard');
      } else if (newRole === 'kitchen_staff') {
        router.push('/owner/kot');
      } else if (newRole === 'cashier') {
        router.push('/owner/pos');
      } else if (newRole === 'waiter') {
        router.push('/owner/tables');
      } else if (newRole === 'accountant') {
        router.push('/owner/reports');
      } else {
        router.push('/owner/dashboard');
      }
    }
  };

  const loginAsRole = (selectedRole: UserRole) => {
    switchRole(selectedRole);
  };

  const login = (email: string, pass: string): boolean => {
    const found = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (found) {
      switchRole(found.role);
      return true;
    }
    // Fallback: login as owner
    switchRole('restaurant_owner');
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('zestora_auth_session');
      } catch (err) {
        console.error('Failed to clear auth session', err);
      }
    }
    router.push('/login');
  };

  const switchRestaurant = (restId: string) => {
    const found = businesses.find(r => r.id === restId);
    if (found) {
      setCurrentRestaurant(found);
      setCurrentBranch(found.branches.length > 0 ? found.branches[0] : null);
      if (user) {
        const updatedUser: UserProfile = {
          ...user,
          restaurantId: found.id,
          restaurantName: found.name,
          branchId: found.branches[0]?.id,
          branchName: found.branches[0]?.name,
        };
        persistAuthSession(updatedUser, role);
      }
    }
  };

  const switchBranch = (branchId: string | 'all') => {
    if (branchId === 'all') {
      setCurrentBranch(null);
    } else {
      const found = currentRestaurant.branches.find(b => b.id === branchId);
      if (found) {
        setCurrentBranch(found);
        if (user) {
          const updatedUser: UserProfile = {
            ...user,
            branchId: found.id,
            branchName: found.name,
          };
          persistAuthSession(updatedUser, role);
        }
      }
    }
  };

  const toggleStoreOnline = () => {
    setIsStoreOnline(prev => !prev);
  };

  const hasRole = (allowedRoles: UserRole[]) => {
    return allowedRoles.includes(role);
  };

  // Feature Check Helper
  const isFeatureEnabled = (featureKey: keyof BusinessFeatures): boolean => {
    if (!currentRestaurant || !currentRestaurant.features) return true;
    return !!currentRestaurant.features[featureKey];
  };

  // Update Features dynamically with persistence
  const updateRestaurantFeatures = (newFeatures: Partial<BusinessFeatures>) => {
    const updatedRest: Restaurant = {
      ...currentRestaurant,
      features: {
        ...currentRestaurant.features,
        ...newFeatures,
      },
    };
    setCurrentRestaurant(updatedRest);
    const updatedList = businesses.map(b => b.id === updatedRest.id ? updatedRest : b);
    persistBusinesses(updatedList);
  };

  // Update Restaurant details with persistence
  const updateRestaurant = (updated: Partial<Restaurant>) => {
    const updatedRest: Restaurant = {
      ...currentRestaurant,
      ...updated,
    };
    setCurrentRestaurant(updatedRest);
    const updatedList = businesses.map(b => b.id === updatedRest.id ? updatedRest : b);
    persistBusinesses(updatedList);
  };

  // Multi-Tenant Business Registration
  const registerBusiness = (data: {
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    password?: string;
    businessName: string;
    businessType: BusinessType;
    businessCategory?: string;
    branchCount?: number;
    businessAddress?: string;
    city?: string;
    state?: string;
    gstin?: string;
    fssaiNumber?: string;
    features?: BusinessFeatures;
    subscriptionPlan?: 'Free Trial' | 'Starter' | 'Professional' | 'Business' | 'Enterprise';
  }): Restaurant => {
    const businessId = `rest-${Date.now()}`;
    const branchId = `branch-${Date.now()}-1`;
    const defaultFeatures = data.features || getDefaultFeaturesForBusinessType(data.businessType);

    const firstBranch: Branch = {
      id: branchId,
      name: `${data.businessName} (Main Branch)`,
      code: 'MB-1',
      restaurantId: businessId,
      address: data.businessAddress || 'Main High Street',
      city: data.city || 'Bengaluru',
      pincode: '560001',
      phone: data.ownerPhone,
      managerName: data.ownerName,
      managerPhone: data.ownerPhone,
      managerEmail: data.ownerEmail,
      openingHours: '10:00 AM - 11:00 PM',
      seatingCapacity: defaultFeatures.tableManagement ? 40 : 0,
      tablesCount: defaultFeatures.tableManagement ? 10 : 0,
      status: 'active',
      dailyRevenue: 28500,
      activeOrdersCount: 2,
    };

    const newBusiness: Restaurant = {
      id: businessId,
      name: data.businessName,
      businessType: data.businessType,
      tagline: `Modern ${data.businessType} Management`,
      description: `Registered on Zestora SaaS Multi-Tenant Platform`,
      cuisine: [data.businessCategory || 'Multi-Cuisine'],
      ownerId: `owner-${Date.now()}`,
      ownerName: data.ownerName,
      ownerEmail: data.ownerEmail,
      ownerPhone: data.ownerPhone,
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&h=120&q=80',
      fssaiNumber: data.fssaiNumber || '11223344000999',
      gstin: data.gstin || '29ABCDE1234F1Z5',
      address: data.businessAddress || 'Main High Street',
      city: data.city || 'Bengaluru',
      state: data.state || 'Karnataka',
      country: 'India',
      openingHours: '10:00 AM - 11:00 PM',
      status: 'active',
      subscriptionPlan: (data.subscriptionPlan as any) || 'Starter',
      subscriptionStatus: 'Trial',
      trialDaysRemaining: trialConfig.defaultTrialDays,
      trialTotalDays: trialConfig.defaultTrialDays,
      graceDaysRemaining: trialConfig.defaultGraceDays,
      nextBillingDate: new Date(Date.now() + trialConfig.defaultTrialDays * 86400000).toISOString().split('T')[0],
      autoRenew: false,
      createdAt: new Date().toISOString().split('T')[0],
      features: defaultFeatures,
      branches: [firstBranch],
    };

    const updatedBusinesses = [newBusiness, ...businesses];
    persistBusinesses(updatedBusinesses);
    setCurrentRestaurant(newBusiness);
    setCurrentBranch(firstBranch);
    setSubStatus('Trial');
    setSubPlan((data.subscriptionPlan as any) || 'Starter');
    setTrialDaysRemaining(trialConfig.defaultTrialDays);
    setTrialTotalDays(trialConfig.defaultTrialDays);
    setGraceDaysRemaining(trialConfig.defaultGraceDays);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('saas_tenant_sub_status', 'Trial');
        localStorage.setItem('saas_tenant_sub_plan', (data.subscriptionPlan as any) || 'Starter');
      } catch (e) {
        console.error(e);
      }
    }

    const newOwnerUser: UserProfile = {
      id: `user-${newBusiness.ownerId}`,
      name: data.ownerName,
      email: data.ownerEmail,
      role: 'restaurant_owner',
      roleTitle: 'Business Owner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      phone: data.ownerPhone,
      restaurantId: newBusiness.id,
      restaurantName: newBusiness.name,
      branchId: firstBranch.id,
      branchName: firstBranch.name,
    };
    persistAuthSession(newOwnerUser, 'restaurant_owner');

    return newBusiness;
  };

  // Branch Operations
  const addBranch = (branchData: Omit<Branch, 'id' | 'restaurantId' | 'dailyRevenue' | 'activeOrdersCount'>): Branch => {
    const newBranch: Branch = {
      ...branchData,
      id: `branch-${Date.now()}`,
      restaurantId: currentRestaurant.id,
      dailyRevenue: 0,
      activeOrdersCount: 0,
    };

    const updatedBranches = [...currentRestaurant.branches, newBranch];
    updateRestaurant({ branches: updatedBranches });
    return newBranch;
  };

  const updateBranch = (branchId: string, updated: Partial<Branch>) => {
    const updatedBranches = currentRestaurant.branches.map(b =>
      b.id === branchId ? { ...b, ...updated } : b
    );
    updateRestaurant({ branches: updatedBranches });
    if (currentBranch?.id === branchId) {
      setCurrentBranch({ ...currentBranch, ...updated });
    }
  };

  const deleteBranch = (branchId: string) => {
    const updatedBranches = currentRestaurant.branches.filter(b => b.id !== branchId);
    updateRestaurant({ branches: updatedBranches });
    if (currentBranch?.id === branchId) {
      setCurrentBranch(updatedBranches[0] || null);
    }
  };

  // Onboarding Wizard Draft Storage
  const saveOnboardingDraft = (data: Partial<OnboardingDraftData>) => {
    if (typeof window !== 'undefined') {
      try {
        const existing = getOnboardingDraft() || {
          step: 1,
          ownerName: '',
          ownerEmail: '',
          ownerPhone: '',
          businessName: '',
          businessType: 'Cafe / Coffee Shop',
          businessCategory: 'Beverages & Bakery',
          branchCount: 1,
          businessAddress: '',
          city: '',
          state: '',
          gstin: '',
          fssaiNumber: '',
          openingHours: '09:00 AM - 10:00 PM',
          subscriptionPlan: 'Professional',
          features: getDefaultFeaturesForBusinessType('Cafe / Coffee Shop'),
          savedAt: new Date().toISOString(),
        };

        const merged = { ...existing, ...data, savedAt: new Date().toISOString() };
        localStorage.setItem('saas_onboarding_draft', JSON.stringify(merged));
      } catch (err) {
        console.error('Failed to save onboarding draft', err);
      }
    }
  };

  const getOnboardingDraft = (): OnboardingDraftData | null => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('saas_onboarding_draft');
        if (item) return JSON.parse(item);
      } catch (err) {
        console.error('Failed to get onboarding draft', err);
      }
    }
    return null;
  };

  const clearOnboardingDraft = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('saas_onboarding_draft');
      } catch (err) {
        console.error('Failed to clear draft', err);
      }
    }
  };

  // Live Orders Management
  const addOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    if (newOrder.tableNumber && newOrder.orderType === 'Dine In') {
      setTables(prev =>
        prev.map(t =>
          t.number === newOrder.tableNumber
            ? {
                ...t,
                status: 'occupied',
                currentOrderId: newOrder.id,
                currentBillAmount: newOrder.grandTotal,
                seatedAt: 'Just now',
                assignedWaiter: newOrder.assignedWaiter || t.assignedWaiter || 'Ramesh Kumar',
              }
            : t
        )
      );
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updated = { ...o, orderStatus: status };
          if (status === 'Completed') {
            updated.paymentStatus = 'Paid';
            if (o.tableNumber) {
              setTables(tbls =>
                tbls.map(t =>
                  t.number === o.tableNumber
                    ? {
                        ...t,
                        status: 'cleaning',
                        currentOrderId: undefined,
                        currentBillAmount: 0,
                      }
                    : t
                )
              );
            }
          }
          return updated;
        }
        return o;
      })
    );
  };

  // Live Tables Management
  const updateTableStatus = (
    tableId: string,
    status: 'available' | 'occupied' | 'reserved' | 'cleaning',
    extra?: Partial<RestaurantTable>
  ) => {
    setTables(prev =>
      prev.map(t => (t.id === tableId ? { ...t, status, ...(extra || {}) } : t))
    );
  };

  const assignWaiterToTable = (tableId: string, waiter: string) => {
    setTables(prev =>
      prev.map(t => (t.id === tableId ? { ...t, assignedWaiter: waiter } : t))
    );
  };

  const transferTable = (sourceTableId: string, targetTableId: string) => {
    const source = tables.find(t => t.id === sourceTableId);
    if (!source) return;

    setTables(prev =>
      prev.map(t => {
        if (t.id === sourceTableId) {
          return {
            ...t,
            status: 'cleaning',
            currentOrderId: undefined,
            currentBillAmount: 0,
            activeGuests: undefined,
            seatedAt: undefined,
          };
        }
        if (t.id === targetTableId) {
          return {
            ...t,
            status: 'occupied',
            currentOrderId: source.currentOrderId,
            currentBillAmount: source.currentBillAmount,
            activeGuests: source.activeGuests,
            seatedAt: source.seatedAt,
            assignedWaiter: source.assignedWaiter,
          };
        }
        return t;
      })
    );
  };

  const mergeTables = (sourceTableId: string, targetTableId: string) => {
    const source = tables.find(t => t.id === sourceTableId);
    const target = tables.find(t => t.id === targetTableId);
    if (!source || !target) return;

    setTables(prev =>
      prev.map(t => {
        if (t.id === sourceTableId) {
          return {
            ...t,
            mergedWithTable: target.number,
            status: 'occupied',
          };
        }
        if (t.id === targetTableId) {
          return {
            ...t,
            mergedWithTable: source.number,
            status: 'occupied',
            capacity: target.capacity + source.capacity,
          };
        }
        return t;
      })
    );
  };

  // Recipe Auto-Deduction Engine
  const deductRecipeIngredients = (
    orderedItems: { menuItemId: string; quantity: number }[],
    orderNumber: string = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
  ) => {
    const results: {
      itemName: string;
      deducted: { ingredientName: string; amount: number; unit: string }[];
    }[] = [];

    const deductionSummaryList: string[] = [];

    orderedItems.forEach(cartItem => {
      const menuItem = SAMPLE_MENU_ITEMS.find(m => m.id === cartItem.menuItemId);
      if (menuItem && menuItem.recipeIngredients && menuItem.recipeIngredients.length > 0) {
        const itemDeductions: { ingredientName: string; amount: number; unit: string }[] = [];

        menuItem.recipeIngredients.forEach(ing => {
          const totalDeduct = ing.quantity * cartItem.quantity;
          itemDeductions.push({
            ingredientName: ing.ingredientName,
            amount: Number(totalDeduct.toFixed(3)),
            unit: ing.unit,
          });

          setInventory(prevInv =>
            prevInv.map(invItem => {
              if (invItem.id === ing.inventoryItemId) {
                const newStock = Math.max(0, Number((invItem.currentStock - totalDeduct).toFixed(2)));
                const isLow = newStock <= invItem.minStockLevel;
                return {
                  ...invItem,
                  currentStock: newStock,
                  status: newStock === 0 ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock',
                };
              }
              return invItem;
            })
          );
        });

        results.push({
          itemName: menuItem.name,
          deducted: itemDeductions,
        });

        const detailStr = itemDeductions
          .map(d => `${d.amount}${d.unit} ${d.ingredientName}`)
          .join(', ');
        deductionSummaryList.push(`${menuItem.name} (${detailStr})`);
      }
    });

    if (deductionSummaryList.length > 0) {
      const newLog: RecipeDeductionLog = {
        id: `deduct-${Date.now()}`,
        orderNumber,
        timestamp: 'Just now',
        details: `Deducted: ${deductionSummaryList.join(' | ')}`,
        itemsCount: orderedItems.length,
      };
      setRecentDeductions(prev => [newLog, ...prev.slice(0, 9)]);
    }

    return results;
  };

  // Subscription Lifecycle Operations
  const updateTrialConfig = (trialDays: number, graceDays: number) => {
    const newConfig = { defaultTrialDays: trialDays, defaultGraceDays: graceDays };
    setTrialConfig(newConfig);
    setTrialTotalDays(trialDays);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('saas_trial_config', JSON.stringify(newConfig));
      } catch (err) {
        console.error('Failed to save trial config', err);
      }
    }
  };

  const setSubscriptionStatus = (status: 'Trial' | 'Active' | 'Payment Due' | 'Grace Period' | 'Expired' | 'Suspended' | 'Cancelled') => {
    setSubStatus(status);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('saas_tenant_sub_status', status);
      } catch (err) {
        console.error('Failed to set sub status in localStorage', err);
      }
    }
    const updatedRest: Restaurant = {
      ...currentRestaurant,
      subscriptionStatus: status,
    };
    setCurrentRestaurant(updatedRest);
    const updatedList = businesses.map(b => b.id === updatedRest.id ? updatedRest : b);
    persistBusinesses(updatedList);
  };

  const activateSubscription = (
    plan: 'Starter' | 'Professional' | 'Business' | 'Enterprise',
    cycle: 'Monthly' | 'Yearly',
    paymentMethod: string,
    amount: number
  ) => {
    const daysToAdd = cycle === 'Yearly' ? 365 : 30;
    const nextDate = new Date(Date.now() + daysToAdd * 86400000).toISOString().split('T')[0];
    
    setSubStatus('Active');
    setSubPlan(plan);
    setNextPaymentDate(nextDate);
    setAutoRenew(true);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('saas_tenant_sub_status', 'Active');
        localStorage.setItem('saas_tenant_sub_plan', plan);
        localStorage.setItem('saas_tenant_next_payment', nextDate);
      } catch (err) {
        console.error('Failed to save active subscription to localStorage', err);
      }
    }

    const updatedRest: Restaurant = {
      ...currentRestaurant,
      subscriptionStatus: 'Active',
      subscriptionPlan: plan,
      nextBillingDate: nextDate,
      autoRenew: true,
    };
    setCurrentRestaurant(updatedRest);
    const updatedList = businesses.map(b => b.id === updatedRest.id ? updatedRest : b);
    persistBusinesses(updatedList);
  };

  const extendSubscription = (days: number) => {
    if (subscriptionStatus === 'Trial') {
      setTrialDaysRemaining(prev => prev + days);
    } else if (subscriptionStatus === 'Grace Period') {
      setGraceDaysRemaining(prev => prev + days);
    } else {
      const currentDue = new Date(nextPaymentDate);
      const baseDate = isNaN(currentDue.getTime()) ? new Date() : currentDue;
      const newDueDate = new Date(baseDate.getTime() + days * 86400000).toISOString().split('T')[0];
      setNextPaymentDate(newDueDate);
      setSubStatus('Active');
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('saas_tenant_sub_status', 'Active');
          localStorage.setItem('saas_tenant_next_payment', newDueDate);
        } catch (err) {
          console.error(err);
        }
      }
      const updatedRest: Restaurant = {
        ...currentRestaurant,
        subscriptionStatus: 'Active',
        nextBillingDate: newDueDate,
      };
      setCurrentRestaurant(updatedRest);
      const updatedList = businesses.map(b => b.id === updatedRest.id ? updatedRest : b);
      persistBusinesses(updatedList);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isAuthReady,
        businesses,
        currentRestaurant,
        currentBranch,
        isStoreOnline,
        loginAsRole,
        login,
        logout,
        switchRole,
        switchRestaurant,
        switchBranch,
        toggleStoreOnline,
        hasRole,

        // Multi-Tenant SaaS
        registerBusiness,
        updateRestaurantFeatures,
        updateRestaurant,
        isFeatureEnabled,

        // Multi-Branch
        addBranch,
        updateBranch,
        deleteBranch,

        // Onboarding Draft
        saveOnboardingDraft,
        getOnboardingDraft,
        clearOnboardingDraft,

        // Orders
        orders,
        addOrder,
        updateOrderStatus,

        // Tables
        tables,
        updateTableStatus,
        assignWaiterToTable,
        transferTable,
        mergeTables,

        // Inventory
        inventory,
        recentDeductions,
        deductRecipeIngredients,

        // Subscription & Free Trial Lifecycle
        subscriptionStatus,
        subscriptionPlan,
        trialDaysRemaining,
        trialTotalDays,
        graceDaysRemaining,
        nextPaymentDate,
        autoRenew,
        trialConfig,
        updateTrialConfig,
        activateSubscription,
        setSubscriptionStatus,
        extendSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
