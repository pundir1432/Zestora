'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { 
  BiShieldX, 
  BiArrowBack, 
  BiTransferAlt, 
  BiTimeFive, 
  BiError, 
  BiErrorCircle, 
  BiLockAlt, 
  BiCreditCard 
} from 'react-icons/bi';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { 
    role, 
    isAuthenticated,
    isAuthReady,
    switchRole,
    subscriptionStatus,
    subscriptionPlan,
    trialDaysRemaining,
    trialTotalDays,
    graceDaysRemaining,
    nextPaymentDate,
  } = useAuth();

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthReady, isAuthenticated, router]);

  if (!isAuthReady || !isAuthenticated) {
    return (
      <div className="min-vh-100 bg-surface d-flex flex-column align-items-center justify-content-center p-4">
        <div
          className="d-flex align-items-center justify-content-center rounded-3 bg-brand text-white fw-bold shadow-sm mb-3"
          style={{ width: '48px', height: '48px', fontSize: '24px' }}
        >
          Z
        </div>
        <div className="spinner-border text-brand mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted-custom small mb-0 fw-medium">
          {isAuthReady ? 'Redirecting to login...' : 'Verifying session...'}
        </p>
      </div>
    );
  }

  const isAllowed = !allowedRoles || allowedRoles.includes(role);
  const isSuperAdmin = role === 'super_admin';

  return (
    <div className="dashboard-root bg-surface">
      {/* Fixed Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Fixed Header */}
      <Navbar 
        collapsed={collapsed}
        onToggleMobile={() => setMobileOpen(!mobileOpen)} 
      />

      {/* Scrollable Main Content Area */}
      <div 
        className={`dashboard-main-wrapper flex-grow-1 ${
          collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
        }`}
      >
        <main className="p-3 p-md-4">
          {/* SUBSCRIPTION LIFECYCLE TOP BANNER (Shown for business tenant roles) */}
          {!isSuperAdmin && (
            <>
              {subscriptionStatus === 'Trial' && (
                <div className="alert alert-warning border-0 bg-warning bg-opacity-10 px-3 py-2 rounded-3 mb-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 shadow-sm">
                  <div className="d-flex align-items-center gap-2">
                    <BiTimeFive size={18} className="text-warning flex-shrink-0" />
                    <span className="small text-navy">
                      <strong>7-Day Free Trial:</strong> {trialDaysRemaining} of {trialTotalDays} days remaining. Upgrade today to lock in 20% annual savings.
                    </span>
                  </div>
                  <Link
                    href={`/owner/subscription/checkout?plan=${encodeURIComponent(subscriptionPlan)}&cycle=Yearly`}
                    className="btn btn-brand btn-sm text-white py-1 px-3 fw-semibold text-nowrap"
                    style={{ fontSize: '12px' }}
                  >
                    Upgrade Plan
                  </Link>
                </div>
              )}

              {subscriptionStatus === 'Payment Due' && (
                <div className="alert alert-info border-0 bg-info bg-opacity-10 px-3 py-2 rounded-3 mb-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 shadow-sm">
                  <div className="d-flex align-items-center gap-2">
                    <BiError size={18} className="text-info flex-shrink-0" />
                    <span className="small text-navy">
                      <strong>Renewal Notice:</strong> Subscription payment is due on {nextPaymentDate}. Settle bill to ensure uninterrupted POS sync.
                    </span>
                  </div>
                  <Link
                    href={`/owner/subscription/checkout?plan=${encodeURIComponent(subscriptionPlan)}&cycle=Yearly`}
                    className="btn btn-primary btn-sm text-white py-1 px-3 fw-semibold text-nowrap"
                    style={{ fontSize: '12px' }}
                  >
                    Pay Due Invoice
                  </Link>
                </div>
              )}

              {subscriptionStatus === 'Grace Period' && (
                <div className="alert alert-danger border-0 bg-danger bg-opacity-10 px-3 py-2 rounded-3 mb-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 shadow-sm">
                  <div className="d-flex align-items-center gap-2">
                    <BiErrorCircle size={18} className="text-danger flex-shrink-0" />
                    <span className="small text-danger fw-medium">
                      <strong>Payment Overdue:</strong> 7-Day Grace Period active ({graceDaysRemaining} days remaining). Settle invoice to avoid restricted mode.
                    </span>
                  </div>
                  <Link
                    href={`/owner/subscription/checkout?plan=${encodeURIComponent(subscriptionPlan)}&cycle=Monthly`}
                    className="btn btn-danger btn-sm text-white py-1 px-3 fw-bold text-nowrap"
                    style={{ fontSize: '12px' }}
                  >
                    Settle Overdue Bill
                  </Link>
                </div>
              )}

              {subscriptionStatus === 'Suspended' && (
                <div className="alert alert-dark border-0 bg-dark text-white px-3 py-2 rounded-3 mb-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 shadow-sm">
                  <div className="d-flex align-items-center gap-2">
                    <BiLockAlt size={18} className="text-brand flex-shrink-0" />
                    <span className="small text-white">
                      <strong>Restricted Read-Only Mode:</strong> Subscription expired. Order creation is paused. All business data is safely preserved.
                    </span>
                  </div>
                  <Link
                    href={`/owner/subscription/checkout?plan=${encodeURIComponent(subscriptionPlan)}&cycle=Yearly`}
                    className="btn btn-brand btn-sm text-white py-1 px-3 fw-bold text-nowrap"
                    style={{ fontSize: '12px' }}
                  >
                    Pay & Restore Access
                  </Link>
                </div>
              )}
            </>
          )}

          {isAllowed ? (
            children
          ) : (
            <div className="app-card p-5 text-center my-4 mx-auto" style={{ maxWidth: '600px' }}>
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 text-danger p-4 mb-3"
              >
                <BiShieldX size={48} />
              </div>
              <h4 className="fw-bold text-navy mb-2">Restricted Section for Role</h4>
              <p className="text-muted-custom mb-4">
                Your currently active role is <strong className="text-capitalize text-brand">{role.replace('_', ' ')}</strong>.
                This screen requires one of: {allowedRoles?.map(r => r.replace('_', ' ')).join(', ')}.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => switchRole('restaurant_owner')}
                  className="btn btn-brand d-flex align-items-center gap-2"
                >
                  <BiTransferAlt size={18} /> Switch to Restaurant Owner
                </button>
                <button
                  type="button"
                  onClick={() => switchRole('super_admin')}
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                  Switch to Super Admin
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

