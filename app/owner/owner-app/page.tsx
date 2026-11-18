'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { reportService } from '@/services';
import { formatNumber } from '@/utils/formatters';
import {
  BiTrendingUp,
  BiHotel,
  BiStore,
  BiShieldAlt2,
  BiErrorCircle,
  BiCheckCircle,
  BiWallet,
  BiFile,
  BiRightArrowAlt,
  BiBell,
  BiMobileAlt,
} from 'react-icons/bi';
import { TbTent } from 'react-icons/tb';

export default function OwnerPulseAppPage() {
  const { activeProperty, activeTenant, rooms, formIIIRecords, approvals, notifications, decideApproval } = useHospitality();
  const kpi = reportService.getDashboardSummary();
  const ota = reportService.getOtaSummary();
  const pendingApprovals = approvals.filter(a => a.status === 'Pending');
  const overdueFormIII = formIIIRecords.filter(f => f.status === 'Overdue').length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="mx-auto" style={{ maxWidth: '720px' }}>
        {/* Owner Mobile Pulse Header */}
        <div className="app-card p-4 bg-navy text-white border-0 mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="badge bg-brand text-white rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1">
              <BiMobileAlt size={14} /> Owner Executive Pulse
            </span>
            <span className="text-white-50 small">{activeProperty.city}</span>
          </div>
          <h4 className="fw-bold mb-1">{activeTenant.name}</h4>
          <p className="text-white-50 small mb-3">Simplified daily snapshot — no back-office clutter</p>

          <div className="row g-3 pt-2 border-top border-white border-opacity-10">
            <div className="col-6">
              <div className="text-white-50 small">Today&apos;s Total Revenue</div>
              <div className="fs-3 fw-bold">₹{formatNumber(kpi.todayTotalRevenue)}</div>
              <span className="badge bg-success bg-opacity-25 text-white mt-1" style={{ fontSize: '10px' }}>
                <BiTrendingUp size={12} /> Est. Profit Margin ~31.4%
              </span>
            </div>
            <div className="col-6">
              <div className="text-white-50 small">Net Cash + Online Inflow</div>
              <div className="fs-3 fw-bold">₹{formatNumber(kpi.cashPayments + kpi.onlinePayments)}</div>
              <div className="text-white-50 mt-1" style={{ fontSize: '11px' }}>
                Cash ₹{formatNumber(kpi.cashPayments)} &bull; Online ₹{formatNumber(kpi.onlinePayments)}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Stream Cards: Restaurant + Rooms + Camp */}
        <div className="row g-2 mb-3">
          <div className="col-4">
            <div className="app-card p-3 text-center h-100">
              <BiStore className="text-brand mb-1" size={22} />
              <div className="text-muted-custom" style={{ fontSize: '11px' }}>Restaurant</div>
              <div className="fw-bold text-navy fs-6">₹{formatNumber(kpi.restaurantSales)}</div>
              <div className="text-success" style={{ fontSize: '10px' }}>{kpi.totalOrders} orders</div>
            </div>
          </div>
          <div className="col-4">
            <div className="app-card p-3 text-center h-100">
              <BiHotel className="text-primary mb-1" size={22} />
              <div className="text-muted-custom" style={{ fontSize: '11px' }}>Stay &amp; Dorms</div>
              <div className="fw-bold text-navy fs-6">₹{formatNumber(kpi.roomRevenue)}</div>
              <div className="text-primary" style={{ fontSize: '10px' }}>{occupiedRooms}/{rooms.length} Rooms</div>
            </div>
          </div>
          <div className="col-4">
            <div className="app-card p-3 text-center h-100">
              <TbTent className="text-success mb-1" size={22} />
              <div className="text-muted-custom" style={{ fontSize: '11px' }}>Camp &amp; Raft</div>
              <div className="fw-bold text-navy fs-6">₹{formatNumber(kpi.campRevenue)}</div>
              <div className="text-success" style={{ fontSize: '10px' }}>4 Trips Today</div>
            </div>
          </div>
        </div>

        {/* Compliance, GST, OTA Payout & Pending Payments Strip */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <Link href="/owner/form-iii" className="app-card p-3 d-block text-decoration-none h-100">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small fw-semibold text-navy">Form III Compliance</span>
                <BiShieldAlt2 className="text-danger" size={18} />
              </div>
              <div className="fw-bold text-danger fs-5 mt-1">{overdueFormIII} Overdue</div>
              <div className="text-muted-custom" style={{ fontSize: '11px' }}>Tap to submit foreign guest pack</div>
            </Link>
          </div>
          <div className="col-6">
            <Link href="/owner/ota" className="app-card p-3 d-block text-decoration-none h-100">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small fw-semibold text-navy">OTA Expected Payout</span>
                <BiWallet className="text-brand" size={18} />
              </div>
              <div className="fw-bold text-navy fs-5 mt-1">₹{formatNumber(ota.netExpected)}</div>
              <div className="text-warning fw-semibold" style={{ fontSize: '11px' }}>{ota.mismatches} reconciliation mismatches</div>
            </Link>
          </div>
          <div className="col-6">
            <Link href="/owner/gst" className="app-card p-3 d-block text-decoration-none h-100">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small fw-semibold text-navy">GST Liability Today</span>
                <BiFile className="text-primary" size={18} />
              </div>
              <div className="fw-bold text-navy fs-5 mt-1">₹{formatNumber(kpi.gstCollectedToday)}</div>
              <div className="text-muted-custom" style={{ fontSize: '11px' }}>All HSN/SAC slabs mapped</div>
            </Link>
          </div>
          <div className="col-6">
            <Link href="/owner/folio" className="app-card p-3 d-block text-decoration-none h-100">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small fw-semibold text-navy">Pending Guest Balances</span>
                <BiErrorCircle className="text-warning" size={18} />
              </div>
              <div className="fw-bold text-navy fs-5 mt-1">₹12,312</div>
              <div className="text-muted-custom" style={{ fontSize: '11px' }}>Across 3 active checkouts</div>
            </Link>
          </div>
        </div>

        {/* 1-Tap Owner Approvals (Discounts, Voids, Reopen Day) */}
        <div className="app-card p-3 p-md-4 mb-3">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="fw-bold text-navy mb-0">1-Tap Approvals Waiting ({pendingApprovals.length})</h6>
            <Link href="/owner/approvals" className="small text-brand fw-semibold text-decoration-none">
              View All <BiRightArrowAlt />
            </Link>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="text-center py-3 text-success small fw-semibold">
              <BiCheckCircle size={22} className="me-1" /> All caught up! No pending approvals.
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {pendingApprovals.map(req => (
                <div key={req.id} className="p-3 rounded-3 bg-surface border border-subtle">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="badge badge-soft-warning">{req.type}</span>
                    <span className="fw-bold text-navy small">{req.amountOrImpact}</span>
                  </div>
                  <div className="small text-navy fw-semibold">{req.requestedBy} ({req.requesterRole})</div>
                  <p className="text-muted-custom small mb-2">{req.reason}</p>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={() => decideApproval(req.id, 'Approved', 'Approved via Owner Pulse App')}
                      className="btn btn-success btn-sm flex-grow-1 fw-semibold"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => decideApproval(req.id, 'Rejected', 'Rejected via Owner Pulse App')}
                      className="btn btn-outline-danger btn-sm flex-grow-1 fw-semibold"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High-Priority Alerts */}
        <div className="app-card p-3 p-md-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="fw-bold text-navy mb-0 d-flex align-items-center gap-1">
              <BiBell className="text-brand" /> Critical Exceptions &amp; Alerts
            </h6>
            <Link href="/owner/notifications" className="small text-brand fw-semibold text-decoration-none">
              All Alerts &rarr;
            </Link>
          </div>
          <div className="d-flex flex-column gap-2">
            {notifications.slice(0, 4).map(n => (
              <Link
                key={n.id}
                href={n.actionHref || '/owner/notifications'}
                className="p-2.5 rounded-3 bg-surface border border-subtle text-decoration-none d-flex align-items-center justify-content-between gap-2"
              >
                <div>
                  <div className="fw-semibold text-navy small">{n.title}</div>
                  <div className="text-muted-custom" style={{ fontSize: '11px' }}>{n.message}</div>
                </div>
                <BiRightArrowAlt size={18} className="text-brand flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
