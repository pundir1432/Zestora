'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  BiSolidDashboard, 
  BiFoodMenu, 
  BiStore, 
  BiReceipt, 
  BiGroup, 
  BiBarChartAlt2, 
  BiCog, 
  BiLogOut, 
  BiBuilding, 
  BiCreditCard,
  BiShieldQuarter,
  BiPackage,
  BiChevronLeft,
  BiChevronRight,
  BiCalendar,
  BiWallet,
  BiSolidDiscount,
  BiSupport,
  BiBell,
  BiGlobe,
  BiCart,
  BiDish,
  BiTrash,
  BiGift,
  BiStar,
  BiBroadcast,
  BiCalendarCheck,
  BiTimeFive,
  BiNetworkChart,
  BiBrain,
  BiTrendingUp,
  BiPieChartAlt2,
  BiError,
  BiPlug,
  BiShoppingBag,
  BiPurchaseTag,
} from 'react-icons/bi';
import { MdOutlinePointOfSale, MdTableRestaurant } from 'react-icons/md';
import { TbToolsKitchen2, TbFileInvoice } from 'react-icons/tb';
import { FiUsers } from 'react-icons/fi';
import { BusinessFeatures } from '@/types/restaurant';

interface NavItem {
  section?: string;
  label: string;
  href: string;
  icon: any;
  roles?: string[];
  featureKey?: keyof BusinessFeatures;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const { role, user, logout, isFeatureEnabled, currentRestaurant } = useAuth();

  const isSuperAdmin = role === 'super_admin';

  const superAdminLinks: NavItem[] = [
    { section: 'Core Platform', label: 'Platform Dashboard', href: '/super-admin/dashboard', icon: BiSolidDashboard },
    { section: 'Core Platform', label: 'Business Management', href: '/super-admin/restaurants', icon: BiStore },
    { section: 'Core Platform', label: 'Owner Management', href: '/super-admin/owners', icon: BiShieldQuarter },
    { section: 'Core Platform', label: 'Branch Management', href: '/super-admin/branches', icon: BiBuilding },
    { section: 'Monetization', label: 'Subscription Plans', href: '/super-admin/subscriptions', icon: BiCreditCard },
    { section: 'Monetization', label: 'Gateways & Settlements', href: '/super-admin/payments', icon: BiCreditCard },
    { section: 'Monetization', label: 'Platform Invoices', href: '/super-admin/invoices', icon: TbFileInvoice },
    { section: 'Monetization', label: 'Feature Marketplace', href: '/super-admin/marketplace', icon: BiShoppingBag },
    { section: 'Monetization', label: 'SaaS Coupons', href: '/super-admin/coupons', icon: BiPurchaseTag },
    { section: 'Intelligence & Care', label: 'Revenue Reports', href: '/super-admin/reports', icon: BiBarChartAlt2 },
    { section: 'Intelligence & Care', label: 'Support Tickets', href: '/super-admin/tickets', icon: BiSupport, badge: '4', badgeColor: 'bg-danger text-white' },
    { section: 'Intelligence & Care', label: 'Notifications', href: '/super-admin/notifications', icon: BiBell },
    { section: 'Intelligence & Care', label: 'Platform Settings', href: '/super-admin/settings', icon: BiCog },
  ];

  const ownerAllLinks: NavItem[] = [
    // OVERVIEW
    { section: 'Overview', label: 'Dashboard', href: '/owner/dashboard', icon: BiSolidDashboard, roles: ['restaurant_owner', 'branch_manager', 'cashier', 'waiter', 'kitchen_staff', 'accountant'] },

    // SALES
    { section: 'Sales', label: 'POS / Billing', href: '/owner/pos', icon: MdOutlinePointOfSale, roles: ['restaurant_owner', 'branch_manager', 'cashier', 'waiter'], highlight: true },
    { section: 'Sales', label: 'Orders', href: '/owner/orders', icon: BiReceipt, roles: ['restaurant_owner', 'branch_manager', 'cashier', 'waiter'], badge: '8' },
    { section: 'Sales', label: 'Tables', href: '/owner/tables', icon: MdTableRestaurant, roles: ['restaurant_owner', 'branch_manager', 'waiter'], featureKey: 'tableManagement', badge: 'Live', badgeColor: 'bg-info text-white' },
    { section: 'Sales', label: 'Reservations', href: '/owner/reservations', icon: BiCalendar, roles: ['restaurant_owner', 'branch_manager', 'waiter'], featureKey: 'reservations' },
    { section: 'Sales', label: 'Online Store & QR', href: '/owner/online-ordering', icon: BiGlobe, roles: ['restaurant_owner', 'branch_manager'] },

    // OPERATIONS
    { section: 'Operations', label: 'Menu Management', href: '/owner/menu', icon: BiFoodMenu, roles: ['restaurant_owner', 'branch_manager'] },
    { section: 'Operations', label: 'Kitchen / KOT', href: '/owner/kot', icon: TbToolsKitchen2, roles: ['restaurant_owner', 'branch_manager', 'kitchen_staff'], featureKey: 'kitchenKot', badge: '3', badgeColor: 'bg-warning text-dark' },
    { section: 'Operations', label: 'Inventory', href: '/owner/inventory', icon: BiPackage, roles: ['restaurant_owner', 'branch_manager'], featureKey: 'inventory', badge: '2 Low', badgeColor: 'bg-danger' },
    { section: 'Operations', label: 'Suppliers', href: '/owner/suppliers', icon: BiStore, roles: ['restaurant_owner', 'branch_manager'], featureKey: 'inventory' },
    { section: 'Operations', label: 'Purchase Orders', href: '/owner/purchase-orders', icon: BiCart, roles: ['restaurant_owner', 'branch_manager', 'accountant'] },
    { section: 'Operations', label: 'Recipe & Costing', href: '/owner/recipes', icon: BiDish, roles: ['restaurant_owner', 'branch_manager', 'kitchen_staff'] },
    { section: 'Operations', label: 'Waste Management', href: '/owner/waste', icon: BiTrash, roles: ['restaurant_owner', 'branch_manager', 'kitchen_staff'] },

    // CUSTOMER MANAGEMENT
    { section: 'Customer Management', label: 'Customers', href: '/owner/customers', icon: FiUsers, roles: ['restaurant_owner', 'branch_manager', 'cashier'], featureKey: 'customerCrm' },
    { section: 'Customer Management', label: 'Loyalty & Rewards', href: '/owner/loyalty', icon: BiGift, roles: ['restaurant_owner', 'branch_manager', 'cashier'] },
    { section: 'Customer Management', label: 'Customer Feedback', href: '/owner/feedback', icon: BiStar, roles: ['restaurant_owner', 'branch_manager'] },
    { section: 'Customer Management', label: 'Marketing Campaigns', href: '/owner/campaigns', icon: BiBroadcast, roles: ['restaurant_owner', 'branch_manager'] },

    // TEAM MANAGEMENT
    { section: 'Team Management', label: 'Staff Directory', href: '/owner/staff', icon: BiGroup, roles: ['restaurant_owner', 'branch_manager'], featureKey: 'staffManagement' },
    { section: 'Team Management', label: 'Staff Attendance', href: '/owner/attendance', icon: BiCalendarCheck, roles: ['restaurant_owner', 'branch_manager'] },
    { section: 'Team Management', label: 'Shifts & Roster', href: '/owner/shifts', icon: BiTimeFive, roles: ['restaurant_owner', 'branch_manager'] },
    { section: 'Team Management', label: 'Roles & Permissions', href: '/owner/roles', icon: BiShieldQuarter, roles: ['restaurant_owner', 'branch_manager'] },

    // BUSINESS MANAGEMENT
    { section: 'Business Management', label: 'Branches', href: '/owner/branches', icon: BiBuilding, roles: ['restaurant_owner'] },
    { section: 'Business Management', label: 'Expenses', href: '/owner/expenses', icon: BiWallet, roles: ['restaurant_owner', 'branch_manager', 'accountant'] },
    { section: 'Business Management', label: 'Discounts & Offers', href: '/owner/offers', icon: BiSolidDiscount, roles: ['restaurant_owner', 'branch_manager'], featureKey: 'offersDiscounts' },
    { section: 'Business Management', label: 'Franchise Network', href: '/owner/franchise', icon: BiNetworkChart, roles: ['restaurant_owner'] },

    // INTELLIGENCE
    { section: 'Intelligence', label: 'AI Copilot Assistant', href: '/owner/ai-assistant', icon: BiBrain, roles: ['restaurant_owner', 'branch_manager'], badge: 'AI', badgeColor: 'bg-primary text-white' },
    { section: 'Intelligence', label: 'AI Demand Forecast', href: '/owner/ai-forecasting', icon: BiTrendingUp, roles: ['restaurant_owner', 'branch_manager', 'kitchen_staff'] },
    { section: 'Intelligence', label: 'Profit & Loss (P&L)', href: '/owner/profit-loss', icon: BiPieChartAlt2, roles: ['restaurant_owner', 'accountant'] },
    { section: 'Intelligence', label: 'Business Analytics', href: '/owner/analytics', icon: BiBarChartAlt2, roles: ['restaurant_owner', 'branch_manager', 'accountant'], featureKey: 'reportsAnalytics' },
    { section: 'Intelligence', label: 'Fraud Detection Audit', href: '/owner/fraud-detection', icon: BiError, roles: ['restaurant_owner', 'branch_manager'], badge: 'Alerts', badgeColor: 'bg-danger text-white' },

    // ACCOUNT
    { section: 'Account', label: 'Subscription & Billing', href: '/owner/subscription', icon: BiCreditCard, roles: ['restaurant_owner', 'accountant'] },
    { section: 'Account', label: 'Feature Marketplace', href: '/owner/marketplace', icon: BiShoppingBag, roles: ['restaurant_owner'] },
    { section: 'Account', label: 'Integrations Hub', href: '/owner/integrations', icon: BiPlug, roles: ['restaurant_owner', 'branch_manager'] },
    { section: 'Account', label: 'Settings', href: '/owner/settings', icon: BiCog, roles: ['restaurant_owner'] },
  ];

  // Filter links by role and by active business features
  const filteredOwnerLinks = ownerAllLinks.filter(item => {
    if (item.roles && !item.roles.includes(role)) return false;
    if (item.featureKey && !isFeatureEnabled(item.featureKey)) return false;
    return true;
  });

  const activeLinks: NavItem[] = isSuperAdmin ? superAdminLinks : filteredOwnerLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none" 
          style={{ zIndex: 1040 }}
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`dashboard-sidebar d-flex flex-column flex-shrink-0 bg-navy text-white ${
          collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
        } ${mobileOpen ? 'd-flex' : 'd-none d-lg-flex'}`}
        style={{
          width: collapsed ? '80px' : '260px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1045,
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Brand Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary border-opacity-25" style={{ height: '70px' }}>
          <Link href={isSuperAdmin ? '/super-admin/dashboard' : '/owner/dashboard'} className="d-flex align-items-center text-decoration-none text-white overflow-hidden">
            <div 
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand text-white fw-bold me-2 flex-shrink-0"
              style={{ width: '38px', height: '38px', fontSize: '20px' }}
            >
              Z
            </div>
            {!collapsed && (
              <div className="d-flex flex-column text-nowrap">
                <span className="fw-bold fs-5 lh-1 text-white tracking-wide">
                  ZEST<span className="text-brand">ORA</span>
                </span>
                <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                  {isSuperAdmin ? 'Super Admin HQ' : 'Restaurant SaaS'}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle button */}
          <button 
            type="button" 
            onClick={onToggleCollapse} 
            className="btn btn-sm btn-link text-white-50 p-1 d-none d-lg-block text-decoration-none"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <BiChevronRight size={22} /> : <BiChevronLeft size={22} />}
          </button>
        </div>

        {/* Role & Business Type Tag */}
        {!collapsed && (
          <div className="px-3 py-2 bg-black bg-opacity-25 border-bottom border-secondary border-opacity-10 d-flex flex-column gap-1">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-white-50 small" style={{ fontSize: '11px' }}>Role:</span>
              <span className="badge rounded-pill bg-brand text-uppercase" style={{ fontSize: '10px' }}>
                {role.replace('_', ' ')}
              </span>
            </div>
            {!isSuperAdmin && currentRestaurant && (
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="text-white-50 small" style={{ fontSize: '11px' }}>Type:</span>
                <span className="badge bg-secondary bg-opacity-50 text-white text-truncate max-w-100" style={{ fontSize: '10px', maxWidth: '140px' }} title={currentRestaurant.businessType}>
                  {currentRestaurant.businessType}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Menu */}
        <div className="flex-grow-1 overflow-y-auto py-2 px-2">
          <ul className="nav nav-pills flex-column gap-1 mb-auto">
            {activeLinks.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isPos = 'highlight' in item && item.highlight;

              // Check if we need to display a section header
              const prevItem = activeLinks[idx - 1];
              const showSectionHeader = !collapsed && item.section && (!prevItem || prevItem.section !== item.section);

              return (
                <React.Fragment key={idx}>
                  {showSectionHeader && (
                    <li className="nav-header text-uppercase text-white-50 px-3 pt-3 pb-1" style={{ fontSize: '11px', letterSpacing: '0.8px', fontWeight: 600 }}>
                      {item.section}
                    </li>
                  )}
                  <li className="nav-item">
                    <Link
                      href={item.href}
                      onClick={() => onCloseMobile()}
                      className={`nav-link d-flex align-items-center px-3 py-2 rounded-3 text-nowrap transition-all ${
                        isActive
                          ? 'bg-brand text-white fw-semibold shadow-sm'
                          : isPos
                          ? 'bg-white bg-opacity-10 text-white hover-bg-light fw-medium'
                          : 'text-white-50 hover-light'
                      }`}
                      style={{
                        transition: 'all 0.15s ease-in-out',
                        borderLeft: isActive ? '3px solid #ffffff' : '3px solid transparent',
                      }}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-white' : isPos ? 'text-brand' : 'text-white-50'}`} />
                      {!collapsed && (
                        <span className="ms-3 flex-grow-1 text-truncate" style={{ fontSize: '14px' }}>
                          {item.label}
                        </span>
                      )}
                      {!collapsed && item.badge && (
                        <span className={`badge rounded-pill ms-2 ${item.badgeColor || 'bg-brand text-white'}`} style={{ fontSize: '10px' }}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>

        {/* User Footer & Logout */}
        <div className="p-3 border-top border-secondary border-opacity-25 bg-black bg-opacity-20">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center overflow-hidden">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'}
                alt={user?.name || 'User'}
                className="rounded-circle flex-shrink-0 border border-brand"
                style={{ width: '38px', height: '38px', objectFit: 'cover' }}
              />
              {!collapsed && (
                <div className="ms-2 overflow-hidden">
                  <div className="text-white text-truncate fw-semibold" style={{ fontSize: '13px' }}>
                    {user?.name}
                  </div>
                  <div className="text-white-50 text-truncate" style={{ fontSize: '11px' }}>
                    {user?.roleTitle}
                  </div>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                type="button"
                onClick={logout}
                className="btn btn-sm btn-link text-white-50 hover-danger p-1 text-decoration-none"
                title="Logout"
              >
                <BiLogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
