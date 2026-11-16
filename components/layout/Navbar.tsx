'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_RESTAURANTS } from '@/data/restaurantData';
import { DEMO_ACCOUNTS } from '@/data/authData';
import { UserRole } from '@/types/auth';
import { 
  BiMenu, 
  BiBell, 
  BiStore, 
  BiBuilding, 
  BiCheckCircle, 
  BiPowerOff,
  BiUser,
  BiLogOut,
  BiTransferAlt,
  BiTrendingUp,
  BiPackage
} from 'react-icons/bi';
import { MdOutlinePointOfSale } from 'react-icons/md';

interface NavbarProps {
  onToggleMobile: () => void;
  collapsed?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobile, collapsed = false }) => {
  const { 
    role, 
    user, 
    businesses,
    currentRestaurant, 
    currentBranch, 
    isStoreOnline, 
    switchRole, 
    switchRestaurant, 
    switchBranch, 
    toggleStoreOnline,
    logout 
  } = useAuth();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const isSuperAdmin = role === 'super_admin';

  return (
    <header 
      className={`dashboard-header bg-white border-bottom border-subtle shadow-sm px-3 py-2 ${
        collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
      }`} 
      style={{ zIndex: 1030, height: '70px' }}
    >
      <div className="d-flex align-items-center justify-content-between h-100">
        {/* Left Section: Mobile Menu & Restaurant / Branch Selectors */}
        <div className="d-flex align-items-center gap-3">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="btn btn-outline-secondary d-lg-none p-1 border-0"
            onClick={onToggleMobile}
            aria-label="Toggle Navigation"
          >
            <BiMenu size={26} />
          </button>

          {/* Restaurant & Branch Selectors (for non-SuperAdmin) */}
          {!isSuperAdmin ? (
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* Restaurant Selector */}
              {role === 'restaurant_owner' && (
                <div className="d-none d-md-flex align-items-center bg-surface px-2 py-1 rounded-3 border border-subtle">
                  <BiStore className="text-brand me-1 flex-shrink-0" size={18} />
                  <select
                    className="form-select form-select-sm border-0 bg-transparent fw-semibold text-navy shadow-none pe-4"
                    style={{ cursor: 'pointer', maxWidth: '250px' }}
                    value={currentRestaurant.id}
                    onChange={(e) => switchRestaurant(e.target.value)}
                    title="Switch between sample multi-business restaurants"
                  >
                    {businesses.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.businessType ? r.businessType.split('/')[0].trim() : 'Restaurant'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Business Type Badge */}
              <span 
                className="badge badge-soft-brand d-none d-xl-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill fw-medium" 
                style={{ fontSize: '11px', letterSpacing: '0.2px' }}
              >
                <span className="bg-brand rounded-circle" style={{ width: '6px', height: '6px' }} />
                {currentRestaurant.businessType}
              </span>

              {/* Branch Selector */}
              {role !== 'kitchen_staff' && (
                <div className="d-none d-sm-flex align-items-center bg-surface px-2 py-1 rounded-3 border border-subtle">
                  <BiBuilding className="text-muted-custom me-1" size={18} />
                  <select
                    className="form-select form-select-sm border-0 bg-transparent fw-medium text-navy shadow-none pe-4"
                    style={{ cursor: 'pointer', maxWidth: '150px' }}
                    value={currentBranch ? currentBranch.id : 'all'}
                    onChange={(e) => switchBranch(e.target.value)}
                    disabled={role === 'branch_manager'} // branch manager is locked to their branch
                  >
                    {role === 'restaurant_owner' && <option value="all">All Branches</option>}
                    {currentRestaurant.branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Store Online Status Indicator */}
              <button
                type="button"
                onClick={toggleStoreOnline}
                className={`btn btn-sm d-flex align-items-center gap-1 rounded-pill px-3 py-1 ${
                  isStoreOnline ? 'badge-soft-success text-success fw-medium' : 'badge-soft-danger text-danger fw-medium'
                }`}
                title="Click to toggle restaurant ordering status"
              >
                <span
                  className={`rounded-circle d-inline-block ${
                    isStoreOnline ? 'bg-success' : 'bg-danger'
                  }`}
                  style={{ width: '8px', height: '8px' }}
                />
                <span className="d-none d-sm-inline" style={{ fontSize: '12px' }}>
                  {isStoreOnline ? 'Accepting Orders' : 'Store Offline'}
                </span>
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="badge badge-soft-brand px-3 py-2 fs-6 fw-semibold rounded-3 d-flex align-items-center gap-2">
                <BiTrendingUp size={18} /> Super Admin Control Center
              </span>
              <span className="badge badge-soft-success d-none d-md-inline-block rounded-pill">
                5 Restaurant Chains Active
              </span>
            </div>
          )}
        </div>

        {/* Right Section: POS Shortcut, Demo Role Switcher, Notifications, Profile */}
        <div className="d-flex align-items-center gap-2">
          {/* Quick POS Billing Button (Only for restaurant staff/owner) */}
          {!isSuperAdmin && role !== 'kitchen_staff' && (
            <Link
              href="/owner/pos"
              className="btn btn-brand btn-sm d-flex align-items-center gap-1 px-3 py-1 shadow-sm text-decoration-none"
            >
              <MdOutlinePointOfSale size={18} />
              <span className="d-none d-sm-inline fw-semibold">POS Billing</span>
            </Link>
          )}

          {/* Role Switcher Pill / Dropdown (Essential for testing all 5 roles) */}
          <div className="position-relative">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-pill px-2 px-md-3 py-1 bg-surface border-subtle"
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowNotifDropdown(false);
                setShowProfileDropdown(false);
              }}
              title="Click to switch role demo"
            >
              <BiTransferAlt className="text-brand" size={16} />
              <span className="text-muted-custom small d-none d-md-inline">Role:</span>
              <span className="fw-bold text-navy small text-capitalize">
                {role.replace('_', ' ')}
              </span>
            </button>

            {/* Dropdown Menu for Roles */}
            {showRoleDropdown && (
              <div 
                className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-subtle p-2 mt-2"
                style={{ width: 'min(280px, calc(100vw - 24px))', maxWidth: 'calc(100vw - 24px)', right: 0, zIndex: 1050 }}
              >
                <div className="px-2 py-1 mb-1 border-bottom border-subtle">
                  <div className="fw-bold text-navy small">Switch Demo Role</div>
                  <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                    Instant role-based perspective toggle
                  </div>
                </div>

                {DEMO_ACCOUNTS.map((acc) => {
                  const isCurrent = role === acc.role;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      className={`dropdown-item d-flex align-items-center justify-content-between p-2 rounded-2 mb-1 ${
                        isCurrent ? 'bg-surface fw-bold border-start border-3 border-brand' : ''
                      }`}
                      onClick={() => {
                        switchRole(acc.role);
                        setShowRoleDropdown(false);
                      }}
                    >
                      <div className="text-start">
                        <div className="text-navy small">{acc.roleTitle}</div>
                        <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                          {acc.name}
                        </div>
                      </div>
                      <span className={`badge ${acc.badgeColor} rounded-pill`} style={{ fontSize: '10px' }}>
                        {isCurrent ? 'Active' : 'Switch'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="position-relative">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary p-2 rounded-circle border-0 text-navy position-relative"
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowRoleDropdown(false);
                setShowProfileDropdown(false);
              }}
              aria-label="Notifications"
            >
              <BiBell size={20} />
              <span
                className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-brand"
                style={{ fontSize: '9px' }}
              >
                3
              </span>
            </button>

            {/* Notification popup */}
            {showNotifDropdown && (
              <div
                className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-subtle p-0 mt-2"
                style={{ width: 'min(310px, calc(100vw - 24px))', maxWidth: 'calc(100vw - 24px)', right: 0, zIndex: 1050 }}
              >
                <div className="p-3 border-bottom border-subtle d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-navy small">Live Notifications</span>
                  <span className="badge badge-soft-brand rounded-pill">3 New</span>
                </div>
                <div className="p-2">
                  <div className="p-2 border-bottom border-subtle rounded-2 hover-bg-light">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-success rounded-circle p-1"><BiCheckCircle size={14} /></span>
                      <span className="fw-semibold text-navy small">New Order #FP-8923 Received</span>
                    </div>
                    <div className="text-muted-custom mt-1" style={{ fontSize: '11px' }}>
                      Takeaway • ₹1,081.50 • 4 mins ago
                    </div>
                  </div>
                  <div className="p-2 border-bottom border-subtle rounded-2 hover-bg-light">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-danger rounded-circle p-1"><BiPackage size={14} /></span>
                      <span className="fw-semibold text-navy small">Low Stock Alert: Malai Paneer</span>
                    </div>
                    <div className="text-muted-custom mt-1" style={{ fontSize: '11px' }}>
                      Current Stock 18 kg (Min: 25 kg)
                    </div>
                  </div>
                  <div className="p-2 rounded-2 hover-bg-light">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-info rounded-circle p-1"><BiTrendingUp size={14} /></span>
                      <span className="fw-semibold text-navy small">Daily Sales Milestone Reached</span>
                    </div>
                    <div className="text-muted-custom mt-1" style={{ fontSize: '11px' }}>
                      Today sales crossed ₹65,000!
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with dropdown */}
          <div className="position-relative">
            <button
              type="button"
              className="btn btn-sm p-0 border-0 d-flex align-items-center"
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowRoleDropdown(false);
                setShowNotifDropdown(false);
              }}
              aria-label="User Profile"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'}
                alt={user?.name || 'User'}
                className="rounded-circle border border-2 border-brand"
                style={{ width: '38px', height: '38px', objectFit: 'cover' }}
              />
            </button>

            {showProfileDropdown && (
              <div
                className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-subtle p-2 mt-2"
                style={{ width: 'min(240px, calc(100vw - 24px))', maxWidth: 'calc(100vw - 24px)', right: 0, zIndex: 1050 }}
              >
                <div className="px-2 py-1 border-bottom border-subtle mb-1">
                  <div className="fw-bold text-navy text-truncate">{user?.name}</div>
                  <div className="text-muted-custom small text-truncate">{user?.email}</div>
                  <span className="badge bg-brand rounded-pill mt-1" style={{ fontSize: '10px' }}>
                    {user?.roleTitle}
                  </span>
                </div>
                <Link
                  href={isSuperAdmin ? '/super-admin/dashboard' : '/owner/settings'}
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-2 text-navy small"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <BiUser size={16} /> Profile & Settings
                </Link>
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-2 text-danger small"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    logout();
                  }}
                >
                  <BiLogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

