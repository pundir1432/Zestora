'use client';

import React, { useRef, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useHospitality } from '@/context/HospitalityContext';
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
  BiX,
  BiBed,
  BiHotel,
  BiCompass,
  BiShieldAlt2,
  BiFile,
  BiCheckShield,
  BiDevices,
  BiSync,
  BiTv,
  BiMobileAlt,
  BiCycling,
  BiUserCheck,
  BiWrench,
  BiBriefcase,
  BiBookOpen,
} from 'react-icons/bi';
import { MdOutlinePointOfSale, MdTableRestaurant, MdOutlineCleaningServices, MdOutlineMonitor } from 'react-icons/md';
import { TbToolsKitchen2, TbFileInvoice, TbTent } from 'react-icons/tb';
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
  external?: boolean;
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

// Module-level persistent scroll state across Next.js client-side page transitions
let cachedOwnerScroll = 0;
let cachedAdminScroll = 0;

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const { role, user, logout } = useAuth();
  const {
    t,
    activeProperty,
    activePlanTier,
    readyBoardOrders,
    formIIIRecords,
    approvals,
    syncQueue,
    notifications,
  } = useHospitality();

  const isSuperAdmin = role === 'super_admin';

  const readyCount = readyBoardOrders.filter(o => o.stage === 'READY').length;
  const pendingFormIIICount = formIIIRecords.filter(r => r.status !== 'Submitted').length;
  const pendingApprovalCount = approvals.filter(a => a.status === 'Pending').length;
  const pendingSyncCount = syncQueue.filter(s => s.status !== 'Synced').length;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const navScrollRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);

  useIsomorphicLayoutEffect(() => {
    const container = navScrollRef.current;
    if (!container) return;

    const storageKey = isSuperAdmin ? 'zestora_sidebar_scroll_admin' : 'zestora_sidebar_scroll_owner';

    let targetScroll = isSuperAdmin ? cachedAdminScroll : cachedOwnerScroll;
    if (targetScroll <= 0 && typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(storageKey);
      if (saved !== null) {
        targetScroll = Number(saved);
      }
    }

    if (targetScroll > 0) {
      container.scrollTop = targetScroll;
    }

    const rafId = requestAnimationFrame(() => {
      if (activeLinkRef.current && container) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = activeLinkRef.current.getBoundingClientRect();
        const isAbove = itemRect.top < containerRect.top;
        const isBelow = itemRect.bottom > containerRect.bottom;

        if (isAbove || isBelow) {
          activeLinkRef.current.scrollIntoView({ block: 'nearest' });
          const newPos = container.scrollTop;
          if (isSuperAdmin) cachedAdminScroll = newPos;
          else cachedOwnerScroll = newPos;
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(storageKey, newPos.toString());
          }
        }
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [pathname, isSuperAdmin]);

  const handleNavScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScroll = e.currentTarget.scrollTop;
    if (isSuperAdmin) cachedAdminScroll = currentScroll;
    else cachedOwnerScroll = currentScroll;
  };

  const handleLinkClick = () => {
    if (navScrollRef.current) {
      const currentScroll = navScrollRef.current.scrollTop;
      if (isSuperAdmin) cachedAdminScroll = currentScroll;
      else cachedOwnerScroll = currentScroll;
      if (typeof window !== 'undefined') {
        const storageKey = isSuperAdmin ? 'zestora_sidebar_scroll_admin' : 'zestora_sidebar_scroll_owner';
        sessionStorage.setItem(storageKey, currentScroll.toString());
      }
    }
    onCloseMobile();
  };

  const superAdminLinks: NavItem[] = [
    { section: 'Platform Console', label: 'Platform Dashboard', href: '/super-admin/dashboard', icon: BiSolidDashboard },
    { section: 'Platform Console', label: 'Tenants & Properties', href: '/super-admin/restaurants', icon: BiStore },
    { section: 'Platform Console', label: 'Owner Management', href: '/super-admin/owners', icon: BiShieldQuarter },
    { section: 'Platform Console', label: 'Outlets & Branches', href: '/super-admin/branches', icon: BiBuilding },
    { section: 'Plans & Monetization', label: 'Plan Tiers (S / G / E)', href: '/super-admin/subscriptions', icon: BiCreditCard },
    { section: 'Plans & Monetization', label: 'Gateways & Settlements', href: '/super-admin/payments', icon: BiWallet },
    { section: 'Plans & Monetization', label: 'Platform Invoices', href: '/super-admin/invoices', icon: TbFileInvoice },
    { section: 'Plans & Monetization', label: 'Feature Marketplace', href: '/super-admin/marketplace', icon: BiShoppingBag },
    { section: 'Plans & Monetization', label: 'SaaS Coupons', href: '/super-admin/coupons', icon: BiPurchaseTag },
    { section: 'Governance & Care', label: 'Revenue Reports', href: '/super-admin/reports', icon: BiBarChartAlt2 },
    { section: 'Governance & Care', label: 'Support Access & Tickets', href: '/super-admin/tickets', icon: BiSupport, badge: '4', badgeColor: 'bg-danger text-white' },
    { section: 'Governance & Care', label: 'Notifications', href: '/super-admin/notifications', icon: BiBell },
    { section: 'Governance & Care', label: 'Platform Settings', href: '/super-admin/settings', icon: BiCog },
  ];

  const ownerAllLinks: NavItem[] = [
    // 1. EXECUTIVE & OVERVIEW
    { section: t('nav_executive'), label: t('dashboard'), href: '/owner/dashboard', icon: BiSolidDashboard, roles: ['restaurant_owner', 'branch_manager', 'cashier', 'waiter', 'kitchen_staff', 'accountant'] },
    { section: t('nav_executive'), label: t('owner_app'), href: '/owner/owner-app', icon: BiMobileAlt, roles: ['restaurant_owner', 'branch_manager'], badge: 'Mobile', badgeColor: 'bg-brand text-white' },
    { section: t('nav_executive'), label: t('notifications'), href: '/owner/notifications', icon: BiBell, roles: ['restaurant_owner', 'branch_manager', 'cashier', 'waiter', 'kitchen_staff', 'accountant'], badge: unreadNotifCount > 0 ? String(unreadNotifCount) : undefined, badgeColor: 'bg-danger text-white' },
    { section: t('nav_executive'), label: t('sync_center'), href: '/owner/sync-center', icon: BiSync, roles: ['restaurant_owner', 'branch_manager', 'cashier'], badge: pendingSyncCount > 0 ? `${pendingSyncCount}` : undefined, badgeColor: 'bg-warning text-dark' },

    // 2. RESTAURANT & ORDERING
    { section: t('nav_restaurant'), label: t('pos_billing'), href: '/owner/pos', icon: MdOutlinePointOfSale, roles: ['restaurant_owner', 'branch_manager', 'cashier', 'waiter'], highlight: true },
    { section: t('nav_restaurant'), label: t('captain_app'), href: '/owner/captain', icon: BiUserCheck, roles: ['restaurant_owner', 'branch_manager', 'waiter'] },
    { section: t('nav_restaurant'), label: t('kds_kot'), href: '/owner/kot', icon: TbToolsKitchen2, roles: ['restaurant_owner', 'branch_manager', 'kitchen_staff'], badge: 'Live', badgeColor: 'bg-warning text-dark' },
    { section: t('nav_restaurant'), label: t('ready_board'), href: '/ready-board', icon: BiTv, roles: ['restaurant_owner', 'branch_manager', 'cashier', 'waiter', 'kitchen_staff'], badge: readyCount > 0 ? `${readyCount} Ready` : undefined, badgeColor: 'bg-success text-white' },
    { section: t('nav_restaurant'), label: t('self_kiosk'), href: '/kiosk', icon: MdOutlineMonitor, roles: ['restaurant_owner', 'branch_manager', 'cashier'] },
    { section: t('nav_restaurant'), label: t('qr_ordering'), href: '/order/demo', icon: BiGlobe, roles: ['restaurant_owner', 'branch_manager', 'waiter'] },
    { section: t('nav_restaurant'), label: t('orders'), href: '/owner/orders', icon: BiReceipt, roles: ['restaurant_owner', 'branch_manager', 'cashier', 'waiter'] },
    { section: t('nav_restaurant'), label: t('tables'), href: '/owner/tables', icon: MdTableRestaurant, roles: ['restaurant_owner', 'branch_manager', 'waiter'] },
    { section: t('nav_restaurant'), label: t('rider_app'), href: '/owner/rider', icon: BiCycling, roles: ['restaurant_owner', 'branch_manager', 'cashier'] },

    // 3. HOTEL, HOSTEL & FRONT DESK
    { section: t('nav_stay'), label: t('front_desk'), href: '/owner/front-desk', icon: BiHotel, roles: ['restaurant_owner', 'branch_manager', 'cashier'] },
    { section: t('nav_stay'), label: t('rooms'), href: '/owner/rooms', icon: BiBuilding, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_stay'), label: t('dorms'), href: '/owner/dorms', icon: BiBed, roles: ['restaurant_owner', 'branch_manager'], badge: 'Hostel', badgeColor: 'bg-info text-white' },
    { section: t('nav_stay'), label: t('guest_folio'), href: '/owner/folio', icon: TbFileInvoice, roles: ['restaurant_owner', 'branch_manager', 'cashier', 'accountant'] },
    { section: t('nav_stay'), label: t('housekeeping'), href: '/owner/housekeeping', icon: MdOutlineCleaningServices, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_stay'), label: t('guest_booking'), href: '/book', icon: BiBookOpen, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_stay'), label: 'Table Reservations', href: '/owner/reservations', icon: BiCalendar, roles: ['restaurant_owner', 'branch_manager', 'waiter'] },

    // 4. CAMP & ADVENTURE
    { section: t('nav_camp'), label: t('camps_adventure'), href: '/owner/camps', icon: TbTent, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_camp'), label: t('camp_guide'), href: '/owner/camp-guide', icon: BiCompass, roles: ['restaurant_owner', 'branch_manager'] },

    // 5. COMPLIANCE, GST & AUDIT
    { section: t('nav_compliance'), label: t('form_iii'), href: '/owner/form-iii', icon: BiShieldAlt2, roles: ['restaurant_owner', 'branch_manager'], badge: pendingFormIIICount > 0 ? `${pendingFormIIICount} Due` : undefined, badgeColor: 'bg-danger text-white' },
    { section: t('nav_compliance'), label: t('gst_tax'), href: '/owner/gst', icon: BiFile, roles: ['restaurant_owner', 'branch_manager', 'accountant'] },
    { section: t('nav_compliance'), label: t('audit_dayclose'), href: '/owner/audit', icon: BiCheckShield, roles: ['restaurant_owner', 'branch_manager', 'accountant'] },
    { section: t('nav_compliance'), label: t('ota_channels'), href: '/owner/ota', icon: BiNetworkChart, roles: ['restaurant_owner', 'branch_manager', 'accountant'] },
    { section: t('nav_compliance'), label: t('reports'), href: '/owner/reports', icon: BiBarChartAlt2, roles: ['restaurant_owner', 'branch_manager', 'accountant'] },
    { section: t('nav_compliance'), label: 'Profit & Loss (P&L)', href: '/owner/profit-loss', icon: BiPieChartAlt2, roles: ['restaurant_owner', 'accountant'] },

    // 6. INVENTORY & OPERATIONS
    { section: t('nav_operations'), label: 'Menu Management', href: '/owner/menu', icon: BiFoodMenu, roles: ['restaurant_owner', 'branch_manager', 'kitchen_staff'] },
    { section: t('nav_operations'), label: 'Inventory & Camp Gear', href: '/owner/inventory', icon: BiPackage, roles: ['restaurant_owner', 'branch_manager'], badge: 'Low', badgeColor: 'bg-danger text-white' },
    { section: t('nav_operations'), label: 'Purchase Orders & GRN', href: '/owner/purchase-orders', icon: BiCart, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_operations'), label: 'Vendors & Suppliers', href: '/owner/suppliers', icon: BiStore, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_operations'), label: 'Recipes & Costing', href: '/owner/recipes', icon: BiDish, roles: ['restaurant_owner', 'branch_manager', 'kitchen_staff'] },
    { section: t('nav_operations'), label: 'Wastage & Adjustments', href: '/owner/waste', icon: BiTrash, roles: ['restaurant_owner', 'branch_manager', 'kitchen_staff'] },
    { section: t('nav_operations'), label: 'Expenses', href: '/owner/expenses', icon: BiWallet, roles: ['restaurant_owner', 'branch_manager', 'accountant'] },

    // 7. GUESTS & GROWTH
    { section: t('nav_crm'), label: 'Guest Profiles', href: '/owner/customers', icon: BiGroup, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_crm'), label: 'Loyalty & Rewards', href: '/owner/loyalty', icon: BiGift, roles: ['restaurant_owner', 'branch_manager', 'cashier'] },
    { section: t('nav_crm'), label: 'Guest Feedback', href: '/owner/feedback', icon: BiStar, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_crm'), label: 'Discounts & Offers', href: '/owner/offers', icon: BiSolidDiscount, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_crm'), label: 'Marketing Campaigns', href: '/owner/campaigns', icon: BiBroadcast, roles: ['restaurant_owner', 'branch_manager'] },

    // 8. USERS, ROLES & DEVICES
    { section: t('nav_platform'), label: t('approvals'), href: '/owner/approvals', icon: BiShieldQuarter, roles: ['restaurant_owner', 'branch_manager'], badge: pendingApprovalCount > 0 ? String(pendingApprovalCount) : undefined, badgeColor: 'bg-warning text-dark' },
    { section: t('nav_platform'), label: t('roles_33'), href: '/owner/roles', icon: BiShieldQuarter, roles: ['restaurant_owner'] },
    { section: t('nav_platform'), label: 'Users & Staff Directory', href: '/owner/staff', icon: FiUsers, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_platform'), label: 'Attendance & Shifts', href: '/owner/shifts', icon: BiTimeFive, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_platform'), label: t('devices'), href: '/owner/devices', icon: BiDevices, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_platform'), label: 'Properties & Outlets', href: '/owner/branches', icon: BiBuilding, roles: ['restaurant_owner'] },
    { section: t('nav_platform'), label: 'Subscription & Plan (S/G/E)', href: '/owner/subscription', icon: BiCreditCard, roles: ['restaurant_owner', 'accountant'] },

    // 9. AI, OTA & ECOSYSTEM
    { section: t('nav_ai_integrations'), label: t('whatsapp_ai'), href: '/owner/ai-assistant', icon: BiBrain, roles: ['restaurant_owner', 'branch_manager'], badge: 'AI', badgeColor: 'bg-primary text-white' },
    { section: t('nav_ai_integrations'), label: 'AI Demand Forecast', href: '/owner/ai-forecasting', icon: BiTrendingUp, roles: ['restaurant_owner', 'branch_manager', 'kitchen_staff'] },
    { section: t('nav_ai_integrations'), label: 'Fraud & Exception Radar', href: '/owner/fraud-detection', icon: BiError, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_ai_integrations'), label: t('partner_portal'), href: '/owner/partner-portal', icon: BiBriefcase, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_ai_integrations'), label: t('local_helper'), href: '/owner/local-helper', icon: BiWrench, roles: ['restaurant_owner', 'branch_manager', 'cashier'] },
    { section: t('nav_ai_integrations'), label: 'Integrations (Tally/ERP)', href: '/owner/integrations', icon: BiPlug, roles: ['restaurant_owner', 'branch_manager'] },
    { section: t('nav_ai_integrations'), label: 'Settings', href: '/owner/settings', icon: BiCog, roles: ['restaurant_owner'] },
  ];

  const filteredOwnerLinks = ownerAllLinks.filter(item => {
    if (item.roles && !item.roles.includes(role)) return false;
    return true;
  });

  const activeLinks: NavItem[] = isSuperAdmin ? superAdminLinks : filteredOwnerLinks;

  return (
    <>
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
          border: 'none',
          borderRight: 'none',
          borderBottom: 'none',
        }}
      >
        {/* Brand Header */}
        <div
          className={`d-flex align-items-center ${collapsed ? 'justify-content-center' : 'justify-content-between'} px-3`}
          style={{ height: '70px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <Link
            href={isSuperAdmin ? '/super-admin/dashboard' : '/owner/dashboard'}
            className="d-flex align-items-center text-decoration-none text-white overflow-hidden gap-2"
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand text-white fw-bold flex-shrink-0 shadow-sm"
              style={{ width: '38px', height: '38px', fontSize: '20px', lineHeight: 1 }}
            >
              Z
            </div>
            {!collapsed && (
              <span
                className="fw-bold fs-4 text-white tracking-wide d-inline-flex align-items-center"
                style={{ letterSpacing: '0.8px', lineHeight: 1, height: '38px' }}
              >
                ZEST<span className="text-brand">ORA</span>
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="btn btn-sm btn-link text-white-50 p-1 d-none d-lg-flex align-items-center justify-content-center text-decoration-none hover-light"
            style={{ width: '32px', height: '32px' }}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <BiChevronRight size={20} /> : <BiChevronLeft size={20} />}
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            className="btn btn-sm btn-link text-white-50 p-1 d-lg-none text-decoration-none"
            title="Close Navigation"
            aria-label="Close navigation"
          >
            <BiX size={26} />
          </button>
        </div>

        {/* Role, Property & Plan Tag */}
        {!collapsed && (
          <div
            className="px-3 py-2 bg-black bg-opacity-25 d-flex flex-column gap-1"
            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-white-50" style={{ fontSize: '11px' }}>Role:</span>
              <span className="badge rounded-pill bg-brand text-uppercase" style={{ fontSize: '10px' }}>
                {role.replace('_', ' ')}
              </span>
            </div>
            {!isSuperAdmin && (
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="text-white-50" style={{ fontSize: '11px' }}>Market / Plan:</span>
                <span className="badge bg-secondary bg-opacity-50 text-white" style={{ fontSize: '10px' }}>
                  {activeProperty.city} • Tier {activePlanTier}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Menu */}
        <div
          ref={navScrollRef}
          onScroll={handleNavScroll}
          className="sidebar-scroll flex-grow-1 overflow-y-auto py-2 px-2"
          style={{ borderRight: 'none' }}
        >
          <ul className="nav nav-pills flex-column gap-1 mb-auto">
            {activeLinks.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isPos = 'highlight' in item && item.highlight;
              const prevItem = activeLinks[idx - 1];
              const showSectionHeader = !collapsed && item.section && (!prevItem || prevItem.section !== item.section);

              return (
                <React.Fragment key={item.href + idx}>
                  {showSectionHeader && (
                    <li
                      className="nav-header text-uppercase text-white-50 px-3 pt-3 pb-1"
                      style={{ fontSize: '10px', letterSpacing: '0.9px', fontWeight: 700 }}
                    >
                      {item.section}
                    </li>
                  )}
                  <li className="nav-item">
                    <Link
                      href={item.href}
                      scroll={false}
                      ref={isActive ? activeLinkRef : undefined}
                      onClick={handleLinkClick}
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
                      <Icon
                        size={18}
                        className={`flex-shrink-0 ${isActive ? 'text-white' : isPos ? 'text-brand' : 'text-white-50'}`}
                      />
                      {!collapsed && (
                        <span className="ms-3 flex-grow-1 text-truncate" style={{ fontSize: '13px' }}>
                          {item.label}
                        </span>
                      )}
                      {!collapsed && item.badge && (
                        <span
                          className={`badge rounded-pill ms-1 ${item.badgeColor || 'bg-brand text-white'}`}
                          style={{ fontSize: '9px' }}
                        >
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
        <div
          className="p-3 bg-black bg-opacity-20 border-0"
          style={{ border: 'none', borderTop: 'none', borderBottom: 'none' }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center overflow-hidden">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'}
                alt={user?.name || 'User'}
                className="rounded-circle flex-shrink-0 border border-brand"
                style={{ width: '36px', height: '36px', objectFit: 'cover' }}
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
                title={t('logout')}
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
