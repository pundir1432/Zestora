'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PlanGate } from '@/components/common/PlanBadge';
import { bookingService } from '@/services';
import { formatNumber } from '@/utils/formatters';
import { BiNetworkChart, BiErrorCircle, BiCheckCircle, BiSync } from 'react-icons/bi';

export default function OtaAggregatorReconciliationPage() {
  const [txns, setTxns] = useState(() => bookingService.getOtaTransactions());
  const [filterType, setFilterType] = useState<'All' | 'Stay OTA' | 'Food Aggregator'>('All');

  const visible = filterType === 'All' ? txns : txns.filter(t => t.channelType === filterType);

  const grossTotal = visible.reduce((s, t) => s + t.grossAmount, 0);
  const commissionTotal = visible.reduce((s, t) => s + t.commissionAmount + t.gstOnCommission, 0);
  const tcsTdsTotal = visible.reduce((s, t) => s + t.tcsAmount + t.tdsAmount, 0);
  const netExpected = visible.reduce((s, t) => s + t.expectedNetPayout, 0);

  const markReconciled = (id: string) => {
    setTxns(prev =>
      prev.map(t => (t.id === id ? { ...t, receivedPayout: t.expectedNetPayout, reconciliationStatus: 'Reconciled', notes: 'Dispute settled (Mock)' } : t))
    );
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'accountant']}>
      <PlanGate featureKey="otaReconciliation" requiredTier="G" featureTitle="OTA & Food Aggregator Payout Reconciliation">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-4">
          <div>
            <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
              <BiNetworkChart className="text-brand" /> OTA &amp; Aggregator Reconciliation
            </h3>
            <p className="text-muted-custom small mb-0">
              MakeMyTrip, Booking.com, Goibibo, Agoda, Hostelworld, Zomato &amp; Swiggy — Commission, GST on Commission, TCS, TDS &amp; Net Payout Audit (Mock States)
            </p>
          </div>
          <span className="badge badge-soft-success px-3 py-2 d-inline-flex align-items-center gap-1">
            <BiSync /> Channel Manager Mock Connected
          </span>
        </div>

        {/* Summary KPI Strip */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="app-card p-3">
              <div className="text-muted-custom small">Gross Channel Bookings</div>
              <div className="fs-4 fw-bold text-navy">₹{formatNumber(grossTotal)}</div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="app-card p-3">
              <div className="text-muted-custom small">Commission + 18% GST</div>
              <div className="fs-4 fw-bold text-danger">₹{formatNumber(commissionTotal)}</div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="app-card p-3">
              <div className="text-muted-custom small">TCS + TDS Deducted</div>
              <div className="fs-4 fw-bold text-primary">₹{formatNumber(tcsTdsTotal)}</div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="app-card p-3">
              <div className="text-muted-custom small">Expected Net Payout</div>
              <div className="fs-4 fw-bold text-success">₹{formatNumber(netExpected)}</div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="d-flex gap-2 mb-3 flex-wrap">
          {(['All', 'Stay OTA', 'Food Aggregator'] as const).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterType(f)}
              className={`btn btn-sm rounded-pill px-3 ${filterType === f ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary bg-white text-navy'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="app-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr className="text-muted-custom">
                  <th>Channel &amp; Ref</th>
                  <th>Guest / Batch</th>
                  <th className="text-end">Gross</th>
                  <th className="text-end">Comm + GST</th>
                  <th className="text-end">TCS / TDS</th>
                  <th className="text-end">Expected Net</th>
                  <th className="text-end">Received</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div className="fw-bold text-navy">{t.channel}</div>
                      <div className="font-monospace text-muted-custom" style={{ fontSize: '10px' }}>{t.bookingOrOrderRef}</div>
                      <div className="text-muted-custom" style={{ fontSize: '10px' }}>Stmt: {t.statementRef}</div>
                    </td>
                    <td>
                      <div className="text-navy fw-semibold">{t.guestOrCustomer}</div>
                      <div className="text-muted-custom" style={{ fontSize: '10px' }}>{t.date}</div>
                      {t.notes && <div className="text-danger mt-0.5" style={{ fontSize: '10px' }}>{t.notes}</div>}
                    </td>
                    <td className="text-end fw-semibold">₹{formatNumber(t.grossAmount)}</td>
                    <td className="text-end text-danger">
                      -₹{formatNumber(t.commissionAmount + t.gstOnCommission)}
                      <div className="text-muted-custom" style={{ fontSize: '10px' }}>({t.commissionPercent}% + 18% GST)</div>
                    </td>
                    <td className="text-end text-muted-custom">
                      ₹{t.tcsAmount} / ₹{t.tdsAmount}
                    </td>
                    <td className="text-end fw-bold text-navy">₹{formatNumber(t.expectedNetPayout)}</td>
                    <td className="text-end fw-bold text-success">₹{formatNumber(t.receivedPayout)}</td>
                    <td>
                      {t.reconciliationStatus === 'Reconciled' ? (
                        <span className="badge badge-soft-success d-inline-flex align-items-center gap-1"><BiCheckCircle /> Reconciled</span>
                      ) : t.reconciliationStatus === 'Mismatch Alert' ? (
                        <div className="d-flex flex-column gap-1 align-items-start">
                          <span className="badge badge-soft-danger d-inline-flex align-items-center gap-1"><BiErrorCircle /> Mismatch</span>
                          <button type="button" onClick={() => markReconciled(t.id)} className="btn btn-link btn-sm p-0 text-brand" style={{ fontSize: '11px' }}>
                            Resolve Mock
                          </button>
                        </div>
                      ) : (
                        <span className="badge badge-soft-warning">Pending Payout</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PlanGate>
    </DashboardLayout>
  );
}
