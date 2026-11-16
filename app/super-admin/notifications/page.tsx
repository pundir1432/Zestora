'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SAMPLE_PLATFORM_NOTIFICATIONS } from '@/data/saasData';
import { PlatformNotificationRecord } from '@/types/saas';
import { Modal } from '@/components/common/Modal';
import { formatNumber } from '@/utils/formatters';
import {
  BiBell,
  BiPlus,
  BiTrash,
  BiRadioCircleMarked,
  BiSend,
  BiCheckCircle,
  BiError,
  BiInfoCircle,
  BiWrench,
  BiRocket,
  BiGroup,
  BiCalendar,
} from 'react-icons/bi';

export default function SuperAdminNotificationsPage() {
  const [notifications, setNotifications] = useState<PlatformNotificationRecord[]>(
    SAMPLE_PLATFORM_NOTIFICATIONS
  );
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<PlatformNotificationRecord['type']>('info');
  const [targetAudience, setTargetAudience] = useState<
    PlatformNotificationRecord['targetAudience']
  >('All Tenants');
  const [scheduledFor, setScheduledFor] = useState('');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: PlatformNotificationRecord = {
      id: `pnotif-${Date.now()}`,
      title,
      message,
      type,
      targetAudience,
      createdAt: new Date().toISOString().split('T')[0],
      scheduledFor: scheduledFor ? scheduledFor : undefined,
      status: scheduledFor ? 'Scheduled' : 'Published',
      deliveredCount: 2840,
      readCount: 0,
    };

    setNotifications([newRecord, ...notifications]);
    setIsNewModalOpen(false);
    setTitle('');
    setMessage('');
    setScheduledFor('');
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Metrics
  const activeCount = notifications.filter((n) => n.status === 'Published').length;
  const totalDelivered = notifications.reduce((acc, n) => acc + n.deliveredCount, 0);
  const totalRead = notifications.reduce((acc, n) => acc + n.readCount, 0);
  const avgReadRate = Math.round((totalRead / (totalDelivered || 1)) * 100);

  const getTypeIcon = (t: PlatformNotificationRecord['type']) => {
    switch (t) {
      case 'maintenance':
        return <BiWrench className="text-warning flex-shrink-0" size={20} />;
      case 'feature':
        return <BiRocket className="text-info flex-shrink-0" size={20} />;
      case 'warning':
        return <BiError className="text-danger flex-shrink-0" size={20} />;
      case 'critical':
        return <BiError className="text-danger flex-shrink-0" size={20} />;
      default:
        return <BiInfoCircle className="text-brand flex-shrink-0" size={20} />;
    }
  };

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Platform Broadcast Announcements</h4>
          <p className="text-muted-custom small mb-0">
            Publish system-wide notifications, maintenance schedules, and release alerts to tenant dashboards
          </p>
        </div>

        <button
          type="button"
          className="btn btn-brand d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setIsNewModalOpen(true)}
        >
          <BiPlus size={20} />
          <span>Broadcast Announcement</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Published Announcements</span>
              <h3 className="fw-bold text-navy mb-0">{activeCount}</h3>
              <span className="text-success small fw-medium" style={{ fontSize: '11px' }}>
                Active in tenant navbar alerts
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand bg-opacity-10 text-brand"
              style={{ width: '48px', height: '48px' }}
            >
              <BiBell size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Tenant Inboxes Delivered</span>
              <h3 className="fw-bold text-navy mb-0" suppressHydrationWarning>{formatNumber(totalDelivered)}</h3>
              <span className="text-muted-custom small" style={{ fontSize: '11px' }}>
                Total notifications dispatched
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-info bg-opacity-10 text-info"
              style={{ width: '48px', height: '48px' }}
            >
              <BiGroup size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Average Open Rate</span>
              <h3 className="fw-bold text-success mb-0">{avgReadRate}%</h3>
              <span className="text-success small fw-medium" style={{ fontSize: '11px' }}>
                High tenant engagement
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-success"
              style={{ width: '48px', height: '48px' }}
            >
              <BiCheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Platform Delivery Speed</span>
              <h3 className="fw-bold text-brand mb-0">&lt; 2 Secs</h3>
              <span className="text-muted-custom small" style={{ fontSize: '11px' }}>
                WebSocket push enabled
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-warning bg-opacity-10 text-warning"
              style={{ width: '48px', height: '48px' }}
            >
              <BiSend size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Feed */}
      <div className="d-flex flex-column gap-3">
        {notifications.map((n) => (
          <div key={n.id} className="app-card p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-2">
              <div className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-3 bg-surface border border-subtle mt-1">
                  {getTypeIcon(n.type)}
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <h5 className="fw-bold text-navy mb-0">{n.title}</h5>
                    <span className="badge text-uppercase bg-secondary bg-opacity-25 text-navy" style={{ fontSize: '10px' }}>
                      {n.type}
                    </span>
                    <span
                      className={`badge rounded-pill ${
                        n.status === 'Published'
                          ? 'bg-success text-white'
                          : 'bg-warning text-dark'
                      }`}
                      style={{ fontSize: '10px' }}
                    >
                      {n.status}
                    </span>
                  </div>
                  <div className="text-muted-custom small mt-1">
                    Audience: <strong>{n.targetAudience}</strong> • Dispatched: {n.createdAt}
                    {n.scheduledFor && ` • Scheduled Window: ${n.scheduledFor}`}
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3">
                <div className="text-end small">
                  <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                    Delivered: <strong>{n.deliveredCount}</strong>
                  </div>
                  <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                    Read: <strong>{n.readCount}</strong> ({Math.round((n.readCount / (n.deliveredCount || 1)) * 100)}%)
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm p-1.5"
                  title="Archive Notification"
                  onClick={() => handleDelete(n.id)}
                >
                  <BiTrash size={17} />
                </button>
              </div>
            </div>

            <div className="p-3 bg-surface rounded-3 border border-subtle text-navy small mt-2">
              {n.message}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Broadcast New Announcement */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Broadcast Platform Announcement"
        subtitle="Dispatches pop-up notification directly to tenant dashboards"
        size="md"
      >
        <form onSubmit={handleCreateAnnouncement}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Announcement Title</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              placeholder="e.g. Scheduled Maintenance / New Feature Launch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Notification Type</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={type}
                onChange={(e: any) => setType(e.target.value)}
              >
                <option value="info">Information (General)</option>
                <option value="feature">New Feature Release</option>
                <option value="maintenance">Cloud Maintenance</option>
                <option value="warning">Compliance / Tax Warning</option>
                <option value="critical">Critical Outage / Alert</option>
              </select>
            </div>

            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Target Audience</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={targetAudience}
                onChange={(e: any) => setTargetAudience(e.target.value)}
              >
                <option value="All Tenants">All Tenants (100%)</option>
                <option value="Active Subscriptions">Active Subscriptions Only</option>
                <option value="Multi-Branch Only">Multi-Branch Outlets Only</option>
                <option value="Cloud Kitchens">Cloud Kitchens</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Announcement Body</label>
            <textarea
              rows={4}
              className="form-control form-control-sm border-subtle"
              placeholder="Write the full message details that restaurant owners and managers will see..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-navy">
              Scheduled Time (Optional, leave blank for instant blast)
            </label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              placeholder="e.g. Sunday 03:30 AM IST"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setIsNewModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm d-flex align-items-center gap-1">
              <BiSend size={16} /> Broadcast Instantly
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
