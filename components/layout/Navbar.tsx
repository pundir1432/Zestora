'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useHospitality } from '@/context/HospitalityContext';
import { DEMO_ACCOUNTS } from '@/data/authData';
import { PlanTier } from '@/mock/tenants';
import { SyncStatusPill } from '@/components/common/SyncStatusPill';
import {
  BiMenu,
  BiBell,
  BiStore,
  BiBuilding,
  BiUser,
  BiLogOut,
  BiTransferAlt,
  BiTrendingUp,
  BiGlobe,
  BiCrown,
  BiChevronDown,
  BiCheckCircle,
  BiErrorCircle,
  BiInfoCircle,
} from 'react-icons/bi';
import { MdOutlinePointOfSale } from 'react-icons/md';

interface NavbarProps {
  onToggleMobile: () => void;
  collapsed?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobile, collapsed = false }) => {
  const { role, user, switchRole, logout } = useAuth();
  const {
    language,
    toggleLanguage,
    t,
    tenants,
    activeTenant,
    activeProperty,
    activeOutlet,
    selectTenant,
    selectProperty,
    selectOutlet,
    activePlanTier,
    setPlanTierOverride,
    notifications,
    markNotificationRead,
  } = useHospitality();

  const [showHierarchyDropdown, setShowHierarchyDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const isSuperAdmin = role === 'super_admin';
  const unreadNotifs = notifications.filter(n => !n.read);

  const closeAllDropdowns = () => {
    setShowHierarchyDropdown(false);
    setShowRoleDropdown(false);
    setShowNotifDropdown(false);
    setShowProfileDropdown(false);
  };

  return (
    <header
      className={`dashboard-header bg-white border-bottom border-subtle shadow-sm px-3 py-2 ${
        collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
      }`}
      style={{ zIndex: 1030, height: '70px' }}
    >
      <div className="d-flex align-items-center justify-content-between h-100 gap-2">
        {/* Left Section: Mobile Menu & Multi-Tenant Hierarchy Switcher */}
        <div className="d-flex align-items-center gap-2 overflow-visible">
          <button
            type="button"
            className="btn btn-outline-secondary d-lg-none p-1 border-0"
            onClick={onToggleMobile}
            aria-label="Toggle Navigation"
          >
            <BiMenu size={26} />
          </button>

          {!isSuperAdmin ? (
            <div className="d-flex align-items-center gap-2">
              {/* Platform -> Tenant -> Property -> Outlet Switcher */}
              <div className="position-relative">
                <button
                  type="button"
                  onClick={() => {
                    const next = !showHierarchyDropdown;
                    closeAllDropdowns();
                    setShowHierarchyDropdown(next);
                  }}
                  className="btn btn-sm bg-surface border border-subtle rounded-3 px-2.5 py-1.5 d-flex align-items-center gap-2 text-start"
                  title="Switch Tenant → Property → Outlet"
                >
                  <BiBuilding className="text-brand flex-shrink-0" size={18} />
                  <div className="d-none d-md-block lh-1" style={{ maxWidth: '240px' }}>
                    <div className="fw-bold text-navy text-truncate" style={{ fontSize: '12px' }}>
                      {activeProperty.name}
                    </div>
                    <div className="text-muted-custom text-truncate mt-1" style={{ fontSize: '10px' }}>
                      {activeTenant.name} &rarr; <span className="text-brand fw-semibold">{activeOutlet.name}</span>
                    </div>
                  </div>
                  <span className="d-md-none fw-bold text-navy small text-truncate" style={{ maxWidth: '120px' }}>
                    {activeOutlet.code}
                  </span>
                  <BiChevronDown size={15} className="text-muted-custom flex-shrink-0" />
                </button>

                {showHierarchyDropdown && (
                  <div
                    className="dropdown-menu show position-absolute shadow-lg border-subtle p-3 mt-2"
                    style={{ width: 'min(360px, calc(100vw - 24px))', left: 0, zIndex: 1060 }}
                  >
                    <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom border-subtle">
                      <span className="fw-bold text-navy small">Tenant &rarr; Property &rarr; Outlet</span>
                      <span className="badge badge-soft-brand" style={{ fontSize: '10px' }}>
                        {t('platform_market')}
                      </span>
                    </div>

                    <div className="mb-2">
                      <label className="form-label text-muted-custom fw-semibold mb-1" style={{ fontSize: '11px' }}>
                        1. Tenant / Company (Isolated Data)
                      </label>
                      <select
                        className="form-select form-select-sm border-subtle fw-semibold text-navy"
                        value={activeTenant.id}
                        onChange={e => selectTenant(e.target.value)}
                      >
                        {tenants.map(tn => (
                          <option key={tn.id} value={tn.id}>
                            {tn.name} (Plan {tn.planTier} • {tn.status})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-2">
                      <label className="form-label text-muted-custom fw-semibold mb-1" style={{ fontSize: '11px' }}>
                        2. Property (Hotel / Hostel / Camp)
                      </label>
                      <select
                        className="form-select form-select-sm border-subtle text-navy"
                        value={activeProperty.id}
                        onChange={e => selectProperty(e.target.value)}
                      >
                        {activeTenant.properties.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted-custom fw-semibold mb-1" style={{ fontSize: '11px' }}>
                        3. Active Outlet / Desk
                      </label>
                      <select
                        className="form-select form-select-sm border-subtle text-navy"
                        value={activeOutlet.id}
                        onChange={e => selectOutlet(e.target.value)}
                      >
                        {activeProperty.outlets.map(o => (
                          <option key={o.id} value={o.id}>
                            {o.name} ({o.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-surface rounded-3 p-2 d-flex align-items-center justify-content-between">
                      <div>
                        <div className="fw-semibold text-navy" style={{ fontSize: '11px' }}>
                          Preview Plan Tier (S / G / E)
                        </div>
                        <div className="text-muted-custom" style={{ fontSize: '10px' }}>
                          Test plan-based feature gating live
                        </div>
                      </div>
                      <div className="btn-group btn-group-sm">
                        {(['S', 'G', 'E'] as PlanTier[]).map(tier => (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setPlanTierOverride(tier)}
                            className={`btn fw-bold px-2 ${
                              activePlanTier === tier ? 'btn-brand text-white' : 'btn-outline-secondary'
                            }`}
                            style={{ fontSize: '11px' }}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Plan Tier Pill */}
              <div className="d-none d-xxl-flex align-items-center gap-1 bg-surface border border-subtle rounded-pill px-2.5 py-1">
                <BiCrown size={13} className="text-warning" />
                <span className="fw-bold text-navy" style={{ fontSize: '11px' }}>
                  {t('plan_tier')}: {activePlanTier}
                </span>
              </div>

              {/* Offline-First Sync Status Pill */}
              <SyncStatusPill />
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="badge badge-soft-brand px-3 py-2 fs-6 fw-semibold rounded-3 d-flex align-items-center gap-2">
                <BiTrendingUp size={18} /> Platform Console HQ
              </span>
              <span className="badge badge-soft-success d-none d-md-inline-block rounded-pill">
                {tenants.length} Hospitality Tenants • Rishikesh & UK
              </span>
            </div>
          )}
        </div>

        {/* Right Section: Language Toggle, Quick POS, Role Switcher, Notifications, Profile */}
        <div className="d-flex align-items-center gap-1 gap-md-2">
          {/* English / Hindi Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 d-flex align-items-center gap-1 border-subtle bg-surface text-navy fw-semibold"
            style={{ fontSize: '11px' }}
            title="Switch Interface Language (English / हिंदी)"
          >
            <BiGlobe size={15} className="text-brand" />
            <span>{language === 'en' ? 'हिंदी' : 'EN'}</span>
          </button>

          {/* Quick POS Shortcut */}
          {!isSuperAdmin && role !== 'kitchen_staff' && (
            <Link
              href="/owner/pos"
              className="btn btn-brand btn-sm d-none d-sm-flex align-items-center gap-1 px-2.5 py-1 shadow-sm text-decoration-none text-white"
            >
              <MdOutlinePointOfSale size={16} />
              <span className="d-none d-xl-inline fw-semibold" style={{ fontSize: '12px' }}>POS</span>
            </Link>
          )}

          {/* Role Switcher */}
          <div className="position-relative">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-pill px-2 px-md-2.5 py-1 bg-surface border-subtle"
              onClick={() => {
                const next = !showRoleDropdown;
                closeAllDropdowns();
                setShowRoleDropdown(next);
              }}
              title="Switch Demo Role"
            >
              <BiTransferAlt className="text-brand" size={15} />
              <span className="fw-bold text-navy small text-capitalize d-none d-md-inline" style={{ fontSize: '12px' }}>
                {role.replace('_', ' ')}
              </span>
            </button>

            {showRoleDropdown && (
              <div
                className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-subtle p-2 mt-2"
                style={{ width: 'min(280px, calc(100vw - 24px))', right: 0, zIndex: 1055 }}
              >
                <div className="px-2 py-1 mb-1 border-bottom border-subtle d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold text-navy small">Quick Role Switch</div>
                    <div className="text-muted-custom" style={{ fontSize: '10px' }}>33 Roles Configurable in Roles Matrix</div>
                  </div>
                  <Link href="/owner/roles" className="small text-brand fw-semibold text-decoration-none" onClick={closeAllDropdowns} style={{ fontSize: '11px' }}>
                    All 33 &rarr;
                  </Link>
                </div>

                {DEMO_ACCOUNTS.map(acc => {
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
                        closeAllDropdowns();
                      }}
                    >
                      <div className="text-start">
                        <div className="text-navy small">{acc.roleTitle}</div>
                        <div className="text-muted-custom" style={{ fontSize: '11px' }}>{acc.name}</div>
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
                const next = !showNotifDropdown;
                closeAllDropdowns();
                setShowNotifDropdown(next);
              }}
              aria-label="Notifications"
            >
              <BiBell size={20} />
              {unreadNotifs.length > 0 && (
                <span
                  className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '9px' }}
                >
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div
                className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-subtle p-0 mt-2"
                style={{ width: 'min(340px, calc(100vw - 24px))', right: 0, zIndex: 1055 }}
              >
                <div className="p-3 border-bottom border-subtle d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-navy small">Hospitality Alerts</span>
                  <Link href="/owner/notifications" onClick={closeAllDropdowns} className="small text-brand fw-semibold text-decoration-none">
                    Open Center ({notifications.length})
                  </Link>
                </div>
                <div className="p-2" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {notifications.slice(0, 5).map(n => (
                    <Link
                      key={n.id}
                      href={n.actionHref || '/owner/notifications'}
                      onClick={() => {
                        markNotificationRead(n.id);
                        closeAllDropdowns();
                      }}
                      className={`d-block p-2 border-bottom border-subtle rounded-2 text-decoration-none ${
                        !n.read ? 'bg-surface' : ''
                      }`}
                    >
                      <div className="d-flex align-items-center gap-2">
                        {n.severity === 'danger' ? (
                          <BiErrorCircle className="text-danger flex-shrink-0" size={16} />
                        ) : n.severity === 'success' ? (
                          <BiCheckCircle className="text-success flex-shrink-0" size={16} />
                        ) : (
                          <BiInfoCircle className="text-brand flex-shrink-0" size={16} />
                        )}
                        <span className="fw-semibold text-navy text-truncate" style={{ fontSize: '12px' }}>
                          {n.title}
                        </span>
                      </div>
                      <div className="text-muted-custom mt-1 text-truncate" style={{ fontSize: '11px' }}>
                        {n.message}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="position-relative">
            <button
              type="button"
              className="btn btn-sm p-0 border-0 d-flex align-items-center"
              onClick={() => {
                const next = !showProfileDropdown;
                closeAllDropdowns();
                setShowProfileDropdown(next);
              }}
              aria-label="User Profile"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'}
                alt={user?.name || 'User'}
                className="rounded-circle border border-2 border-brand"
                style={{ width: '36px', height: '36px', objectFit: 'cover' }}
              />
            </button>

            {showProfileDropdown && (
              <div
                className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-subtle p-2 mt-2"
                style={{ width: 'min(240px, calc(100vw - 24px))', right: 0, zIndex: 1055 }}
              >
                <div className="px-2 py-1 border-bottom border-subtle mb-1">
                  <div className="fw-bold text-navy text-truncate">{user?.name}</div>
                  <div className="text-muted-custom small text-truncate">{user?.email}</div>
                  <span className="badge bg-brand rounded-pill mt-1" style={{ fontSize: '10px' }}>
                    {user?.roleTitle}
                  </span>
                </div>
                <Link
                  href="/owner/owner-app"
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-2 text-navy small"
                  onClick={closeAllDropdowns}
                >
                  <BiStore size={16} /> Owner Pulse App
                </Link>
                <Link
                  href={isSuperAdmin ? '/super-admin/settings' : '/owner/settings'}
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-2 text-navy small"
                  onClick={closeAllDropdowns}
                >
                  <BiUser size={16} /> Profile & Settings
                </Link>
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-2 text-danger small"
                  onClick={() => {
                    closeAllDropdowns();
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
