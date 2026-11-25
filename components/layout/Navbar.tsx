'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useHospitality } from '@/context/HospitalityContext';
import {
  BiMenu,
  BiBell,
  BiStore,
  BiUser,
  BiLogOut,
  BiSearch,
  BiCheckCircle,
  BiChevronDown,
} from 'react-icons/bi';
import { MdOutlinePointOfSale } from 'react-icons/md';

interface NavbarProps {
  onToggleMobile: () => void;
  collapsed?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobile, collapsed = false }) => {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead } = useHospitality();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifs = notifications.filter(n => !n.read);

  const closeAllDropdowns = () => {
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
      <div className="d-flex align-items-center justify-content-between h-100 gap-3">
        {/* Left Section: Mobile Menu & Restaurant Branch Identity */}
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          <button
            type="button"
            className="btn btn-outline-secondary d-lg-none p-1 border-0"
            onClick={onToggleMobile}
            aria-label="Toggle Navigation"
          >
            <BiMenu size={26} />
          </button>

          <div className="d-flex align-items-center gap-2 flex-wrap overflow-hidden">
            <div className="d-flex align-items-center gap-2">
              <span className="p-1 rounded-2 bg-surface text-brand d-none d-sm-inline-flex">
                <BiStore size={18} />
              </span>
              <span className="fw-bold text-navy text-truncate" style={{ fontSize: '14px' }}>
                Food Palace
              </span>
            </div>

            <span className="badge-soft-success px-2 py-1 rounded-pill small d-none d-sm-inline-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
              <span className="d-inline-block rounded-circle bg-success" style={{ width: '6px', height: '6px' }} />
              Accepting Orders
            </span>

            <span className="badge bg-surface text-navy border border-subtle rounded-pill px-2 py-1 small d-none d-md-inline-block" style={{ fontSize: '11px' }}>
              Indiranagar Branch
            </span>
          </div>
        </div>

        {/* Center Section: Search Bar (Matching Image 6 RestroPro) */}
        <div className="d-none d-md-flex align-items-center flex-grow-1 justify-content-center" style={{ maxWidth: '400px' }}>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-surface border-subtle text-muted ps-3">
              <BiSearch size={16} />
            </span>
            <input
              type="text"
              className="form-control bg-surface border-subtle pe-3"
              placeholder="Search dishes, orders, tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: '0 8px 8px 0', fontSize: '13px' }}
            />
          </div>
        </div>

        {/* Right Section: Quick POS Button, Notification Icon Button, Profile Avatar */}
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          {/* Quick POS Action */}
          <Link
            href="/owner/pos"
            className="btn btn-brand btn-sm d-flex align-items-center gap-1 text-white text-decoration-none shadow-sm px-3"
            style={{ borderRadius: '8px', minHeight: '34px' }}
          >
            <MdOutlinePointOfSale size={16} />
            <span className="fw-semibold" style={{ fontSize: '12.5px' }}>+ POS Billing</span>
          </Link>

          {/* Notification Icon Button with Badge (Matching Image 5) */}
          <div className="position-relative">
            <button
              type="button"
              className="btn-icon"
              onClick={() => {
                const next = !showNotifDropdown;
                closeAllDropdowns();
                setShowNotifDropdown(next);
              }}
              aria-label="Notifications"
              title="Notifications"
            >
              <BiBell size={20} />
              {unreadNotifs.length > 0 && (
                <span className="btn-icon-badge">
                  {unreadNotifs.length > 9 ? '9+' : unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div
                className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-subtle p-0 mt-2"
                style={{ width: 'min(340px, calc(100vw - 24px))', right: 0, zIndex: 1055 }}
              >
                <div className="p-3 border-bottom border-subtle d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-navy small">Kitchen &amp; Order Alerts</span>
                  <span className="badge badge-soft-brand" style={{ fontSize: '10px' }}>
                    {unreadNotifs.length} New
                  </span>
                </div>
                <div className="p-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        closeAllDropdowns();
                      }}
                      className="d-block p-2 border-bottom border-subtle rounded-2 hover-bg-light transition-all cursor-pointer"
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span className="d-inline-block rounded-circle bg-danger" style={{ width: '6px', height: '6px' }} />
                        <span className="fw-semibold text-navy text-truncate" style={{ fontSize: '12px' }}>
                          {n.title}
                        </span>
                      </div>
                      <div className="text-muted-custom mt-1 text-truncate" style={{ fontSize: '11px' }}>
                        {n.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Dropdown */}
          <div className="position-relative">
            <button
              type="button"
              className="btn btn-sm p-0 border-0 d-flex align-items-center gap-2 bg-transparent"
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
                className="rounded-circle"
                style={{ width: '36px', height: '36px', objectFit: 'cover', border: '2px solid #E63946' }}
              />
              <div className="d-none d-lg-block text-start lh-1">
                <div className="fw-bold text-navy text-truncate" style={{ fontSize: '12.5px', maxWidth: '120px' }}>
                  {user?.name || 'Pankaj Pundir'}
                </div>
                <div className="text-muted-custom text-truncate mt-1" style={{ fontSize: '10px' }}>
                  Restaurant Owner
                </div>
              </div>
              <BiChevronDown size={14} className="text-muted-custom d-none d-lg-inline" />
            </button>

            {showProfileDropdown && (
              <div
                className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-subtle p-2 mt-2"
                style={{ width: 'min(220px, calc(100vw - 24px))', right: 0, zIndex: 1055 }}
              >
                <div className="px-2 py-1 border-bottom border-subtle mb-1">
                  <div className="fw-bold text-navy text-truncate">{user?.name || 'Pankaj Pundir'}</div>
                  <div className="text-muted-custom small text-truncate" style={{ fontSize: '11px' }}>
                    {user?.email || 'owner@foodpalace.com'}
                  </div>
                </div>
                <Link
                  href="/owner/pos"
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-2 text-navy small"
                  onClick={closeAllDropdowns}
                >
                  <MdOutlinePointOfSale size={16} className="text-brand" /> POS Counter
                </Link>
                <Link
                  href="/owner/settings"
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-2 text-navy small"
                  onClick={closeAllDropdowns}
                >
                  <BiUser size={16} /> Restaurant Settings
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

export default Navbar;
