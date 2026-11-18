'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { NotificationCategory } from '@/mock/notifications';
import { BiBell, BiCheckDouble, BiRightArrowAlt, BiErrorCircle, BiCheckCircle, BiInfoCircle } from 'react-icons/bi';

const ALL_CATEGORIES: ('All' | NotificationCategory)[] = [
  'All',
  'Form III Deadline',
  'New Order',
  'Ready Order',
  'New Booking',
  'Check-in',
  'Check-out',
  'Low Stock',
  'Payment Issue',
  'Approval Request',
  'OTA Booking',
  'Sync Failure',
  'Security Alert',
];

export default function NotificationCenterPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHospitality();
  const [selectedCategory, setSelectedCategory] = useState<'All' | NotificationCategory>('All');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filtered = notifications.filter(n => {
    if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
    if (unreadOnly && n.read) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'cashier', 'waiter', 'kitchen_staff', 'accountant']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <BiBell className="text-brand" /> Hospitality Notification Center
          </h3>
          <p className="text-muted-custom small mb-0">
            Unified alerts across POS, KDS, Front Desk, Form III 24h Deadlines, OTA Bookings, Approvals, Sync &amp; Security
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`btn btn-sm ${unreadOnly ? 'btn-brand text-white' : 'btn-outline-secondary bg-white text-navy'}`}
          >
            Unread Only ({unreadCount})
          </button>
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="btn btn-outline-secondary btn-sm bg-white text-navy d-flex align-items-center gap-1"
          >
            <BiCheckDouble size={16} /> Mark All Read
          </button>
        </div>
      </div>

      {/* Category Filter Strip */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`btn btn-sm rounded-pill px-3 ${
              selectedCategory === cat ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary bg-white text-navy'
            }`}
            style={{ fontSize: '12px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="d-flex flex-column gap-2">
        {filtered.map(n => (
          <div
            key={n.id}
            className={`app-card p-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 ${
              !n.read ? 'border-start border-4 border-brand' : ''
            }`}
          >
            <div className="d-flex align-items-start gap-3">
              <div
                className={`rounded-3 p-2 flex-shrink-0 ${
                  n.severity === 'danger'
                    ? 'badge-soft-danger'
                    : n.severity === 'warning'
                    ? 'badge-soft-warning'
                    : n.severity === 'success'
                    ? 'badge-soft-success'
                    : 'badge-soft-info'
                }`}
              >
                {n.severity === 'danger' || n.severity === 'warning' ? (
                  <BiErrorCircle size={20} />
                ) : n.severity === 'success' ? (
                  <BiCheckCircle size={20} />
                ) : (
                  <BiInfoCircle size={20} />
                )}
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                  <span className="badge bg-light text-navy border" style={{ fontSize: '10px' }}>
                    {n.category}
                  </span>
                  <span className="fw-bold text-navy small">{n.title}</span>
                  {!n.read && <span className="badge bg-brand text-white rounded-pill" style={{ fontSize: '9px' }}>NEW</span>}
                </div>
                <p className="text-muted-custom small mb-1">{n.message}</p>
                <span className="text-muted-custom" style={{ fontSize: '11px' }}>{n.timestamp}</span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              {!n.read && (
                <button
                  type="button"
                  onClick={() => markNotificationRead(n.id)}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Mark Read
                </button>
              )}
              {n.actionHref && (
                <Link
                  href={n.actionHref}
                  onClick={() => markNotificationRead(n.id)}
                  className="btn btn-sm btn-brand text-white fw-semibold d-flex align-items-center gap-1"
                >
                  {n.actionLabel || 'Open'} <BiRightArrowAlt size={15} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
