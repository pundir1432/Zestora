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

  const restaurantCoreLinks: NavItem[] = [
    { label: 'Dashboard', href: '/owner/dashboard', icon: BiSolidDashboard },
    { label: 'POS / Billing', href: '/owner/pos', icon: MdOutlinePointOfSale, highlight: true },
    { label: 'Orders', href: '/owner/orders', icon: BiReceipt, badge: readyCount > 0 ? `${readyCount} Ready` : '8', badgeColor: 'bg-brand text-white' },
    { label: 'Menu', href: '/owner/menu', icon: BiFoodMenu },
    { label: 'Tables', href: '/owner/tables', icon: MdTableRestaurant, badge: 'Live', badgeColor: 'bg-success text-white' },
    { label: 'Kitchen (KOT)', href: '/owner/kot', icon: TbToolsKitchen2 },
    { label: 'Reports', href: '/owner/reports', icon: BiBarChartAlt2 },
  ];

  const activeLinks: NavItem[] = isSuperAdmin ? superAdminLinks : restaurantCoreLinks;

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
        className={`dashboard-sidebar d-flex flex-column flex-shrink-0 text-white ${
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
          backgroundColor: '#161922',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
          border: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          outline: 'none',
        }}
      >
        {/* Brand Header: Aligned Logo & Name */}
        <div
          className={`d-flex align-items-center ${collapsed ? 'justify-content-center' : 'justify-content-between'} px-3`}
          style={{ height: '70px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#161922' }}
        >
          <Link
            href={isSuperAdmin ? '/super-admin/dashboard' : '/owner/dashboard'}
            className="d-flex align-items-center text-decoration-none text-white overflow-hidden gap-2"
          >
            <div
              className="d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0 shadow-sm"
              style={{
                width: '38px',
                height: '38px',
                fontSize: '20px',
                lineHeight: 1,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #E63946 0%, #FF6B6B 100%)',
              }}
            >
              Z
            </div>
            {!collapsed && (
              <div className="d-flex flex-column justify-content-center" style={{ lineHeight: 1.15 }}>
                <span
                  className="fw-bold fs-5 text-white tracking-wide"
                  style={{ letterSpacing: '0.6px' }}
                >
                  ZEST<span style={{ color: '#E63946' }}>ORA</span>
                </span>
                <span className="text-white-50" style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.3px' }}>
                  Restaurant POS
                </span>
              </div>
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

        {/* Restaurant Outlet Pill */}
        {!collapsed && (
          <div
            className="px-3 py-2 d-flex align-items-center justify-content-between"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
          >
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              <span className="badge-soft-success px-2 py-0 rounded-pill small" style={{ fontSize: '10px' }}>
                ● Open
              </span>
              <span className="text-white-50 text-truncate" style={{ fontSize: '11px', fontWeight: 500 }}>
                Food Palace &bull; Indiranagar
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div
          ref={navScrollRef}
          onScroll={handleNavScroll}
          className="sidebar-scroll flex-grow-1 overflow-y-auto py-3 px-2"
          style={{ border: 'none', borderRight: 'none', backgroundColor: '#161922' }}
        >
          <ul className="nav nav-pills flex-column gap-1 mb-auto">
            {activeLinks.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isPos = 'highlight' in item && item.highlight;

              return (
                <li className="nav-item" key={item.href + idx}>
                  <Link
                    href={item.href}
                    scroll={false}
                    ref={isActive ? activeLinkRef : undefined}
                    onClick={handleLinkClick}
                    className={`nav-link d-flex align-items-center px-3 py-2 text-nowrap transition-all ${
                      isActive
                        ? 'text-white fw-bold shadow-sm'
                        : isPos
                        ? 'text-white bg-white bg-opacity-10 fw-medium'
                        : 'text-white-50 hover-light'
                    }`}
                    style={{
                      borderRadius: '10px',
                      backgroundColor: isActive ? '#E63946' : undefined,
                      color: isActive ? '#ffffff' : undefined,
                      boxShadow: isActive ? '0 4px 12px rgba(230, 57, 70, 0.35)' : undefined,
                      transition: 'all 0.15s ease-in-out',
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      size={20}
                      className={`flex-shrink-0 ${isActive ? 'text-white' : isPos ? 'text-brand' : 'text-white-50'}`}
                    />
                    {!collapsed && (
                      <span className="ms-3 flex-grow-1 text-truncate" style={{ fontSize: '13.5px' }}>
                        {item.label}
                      </span>
                    )}
                    {!collapsed && item.badge && (
                      <span
                        className={`badge rounded-pill ms-1 ${
                          isActive
                            ? 'bg-white text-danger fw-bold'
                            : item.badgeColor || 'bg-brand text-white'
                        }`}
                        style={{ fontSize: '10px', padding: '0.25em 0.6em' }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Footer & Logout - No white borders */}
        <div
          className="p-3 border-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            border: 'none',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            borderBottom: 'none',
            borderRight: 'none',
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center overflow-hidden">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'}
                alt={user?.name || 'User'}
                className="rounded-circle flex-shrink-0"
                style={{ width: '38px', height: '38px', objectFit: 'cover', border: '2px solid #E63946' }}
              />
              {!collapsed && (
                <div className="ms-2 overflow-hidden">
                  <div className="text-white text-truncate fw-semibold" style={{ fontSize: '13px' }}>
                    {user?.name || 'Pankaj Pundir'}
                  </div>
                  <div className="text-white-50 text-truncate" style={{ fontSize: '11px' }}>
                    Restaurant Owner
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
