'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PlanGate } from '@/components/common/PlanBadge';
import { useHospitality } from '@/context/HospitalityContext';
import { auditService } from '@/services';
import { formatNumber } from '@/utils/formatters';
import { BiCheckShield, BiError, BiListOl, BiLockAlt, BiLockOpenAlt } from 'react-icons/bi';

export default function AuditComplianceDayClosePage() {
  const { auditLogs, dayClose, updateDayClose, createApprovalRequest, appendAuditLog } = useHospitality();
  const exceptions = auditService.getExceptions();
  const seriesChecks = auditService.getInvoiceSeriesChecks();

  const [tab, setTab] = useState<'audit' | 'exceptions' | 'numbering' | 'dayclose'>('audit');
  const [countedCashInput, setCountedCashInput] = useState<number>(dayClose.countedCash);
  const [reopenReason, setReopenReason] = useState('');
  const [notice, setNotice] = useState('');

  const variance = countedCashInput - dayClose.expectedCash;

  const handleCloseDay = () => {
    updateDayClose({
      countedCash: countedCashInput,
      cashVariance: variance,
      status: 'Closed',
      closedBy: 'Vikram Singhania (Owner)',
      closedAt: 'Just now',
    });
    appendAuditLog({
      user: 'Vikram Singhania',
      role: 'Tenant Owner',
      device: 'Back Office Web',
      action: 'Closed Business Day',
      objectType: 'Day Close',
      objectRef: `DAY-${dayClose.businessDate}`,
      oldValue: 'Status: Open',
      newValue: `Status: Closed (Cash Variance ₹${variance})`,
      reason: 'End-of-day cash reconciliation & compliance review completed',
      severity: variance !== 0 ? 'Warning' : 'Info',
    });
    setNotice(`Business Day ${dayClose.businessDate} closed and locked with immutable audit log!`);
    setTimeout(() => setNotice(''), 4000);
  };

  const handleRequestReopen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    updateDayClose({ status: 'Reopen Requested' });
    createApprovalRequest({
      type: 'Reopen Day',
      requestedBy: 'Kavita Reddy',
      requesterRole: 'Property Manager',
      propertyOutlet: dayClose.propertyName,
      amountOrImpact: `Business Date: ${dayClose.businessDate}`,
      reason: reopenReason.trim(),
    });
    setReopenReason('');
    setNotice('Reopen Day request submitted to Approval Workflows & logged in Audit Trail!');
    setTimeout(() => setNotice(''), 4000);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'accountant']}>
      <PlanGate featureKey="auditAndDayClose" requiredTier="G" featureTitle="Immutable Audit, Exceptions & Day Close">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-4">
          <div>
            <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
              <BiCheckShield className="text-brand" /> Audit Trail, Exceptions, Gap-Free Numbering &amp; Day Close
            </h3>
            <p className="text-muted-custom small mb-0">
              Complete accountability across POS, Front Desk, Inventory, Invoice Sequences &amp; Cash Reconciliation
            </p>
          </div>
          {notice && <span className="badge bg-success text-white px-3 py-2">{notice}</span>}
        </div>

        {/* Navigation Tabs */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {[
            { k: 'audit' as const, label: `Audit Log (${auditLogs.length})` },
            { k: 'exceptions' as const, label: `Exception Reports (${exceptions.length})` },
            { k: 'numbering' as const, label: 'Gap-Free Numbering' },
            { k: 'dayclose' as const, label: `Day Close (${dayClose.status})` },
          ].map(tItem => (
            <button
              key={tItem.k}
              type="button"
              onClick={() => setTab(tItem.k)}
              className={`btn btn-sm rounded-pill px-3 ${tab === tItem.k ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary bg-white text-navy'}`}
            >
              {tItem.label}
            </button>
          ))}
        </div>

        {tab === 'audit' && (
          <div className="app-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr className="text-muted-custom">
                    <th>Date / Time</th>
                    <th>User &amp; Device</th>
                    <th>Action &amp; Object</th>
                    <th>Old Value &rarr; New Value</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id}>
                      <td className="text-nowrap text-muted-custom">{log.timestamp}</td>
                      <td>
                        <div className="fw-bold text-navy">{log.user}</div>
                        <div className="text-muted-custom" style={{ fontSize: '10px' }}>{log.role} &bull; {log.device}</div>
                      </td>
                      <td>
                        <div className="fw-semibold text-navy">{log.action}</div>
                        <span className="badge bg-light text-navy border" style={{ fontSize: '10px' }}>{log.objectType}: {log.objectRef}</span>
                      </td>
                      <td>
                        <div className="text-danger" style={{ fontSize: '11px' }}>Old: {log.oldValue}</div>
                        <div className="text-success fw-semibold" style={{ fontSize: '11px' }}>New: {log.newValue}</div>
                      </td>
                      <td className="text-muted-custom" style={{ maxWidth: '240px' }}>{log.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'exceptions' && (
          <div className="app-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr className="text-muted-custom">
                    <th>Category</th>
                    <th>Time &amp; Outlet</th>
                    <th>Staff &amp; Ref</th>
                    <th>Exception Details</th>
                    <th className="text-end">Impact</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exceptions.map(ex => (
                    <tr key={ex.id}>
                      <td>
                        <span className="badge badge-soft-danger d-inline-flex align-items-center gap-1">
                          <BiError /> {ex.category}
                        </span>
                      </td>
                      <td>
                        <div className="text-navy fw-semibold">{ex.outlet}</div>
                        <div className="text-muted-custom" style={{ fontSize: '10px' }}>{ex.timestamp}</div>
                      </td>
                      <td>
                        <div className="text-navy">{ex.staffName}</div>
                        <div className="font-monospace text-muted-custom" style={{ fontSize: '10px' }}>{ex.referenceNo}</div>
                      </td>
                      <td className="text-navy">{ex.details}</td>
                      <td className="text-end fw-bold text-danger">
                        {ex.amountImpact !== 0 ? `₹${formatNumber(ex.amountImpact)}` : '—'}
                      </td>
                      <td>
                        <span className={`badge rounded-pill ${
                          ex.status === 'Approved' ? 'badge-soft-success' : ex.status === 'Flagged' ? 'badge-soft-danger' : 'badge-soft-warning'
                        }`}>
                          {ex.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'numbering' && (
          <div className="row g-3">
            {seriesChecks.map(sc => (
              <div key={sc.seriesCode} className="col-12 col-md-6">
                <div className="app-card p-3.5 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-navy text-white font-monospace fs-6 d-inline-flex align-items-center gap-1">
                      <BiListOl /> {sc.seriesCode}*
                    </span>
                    <span className="badge badge-soft-success">{sc.integrityStatus}</span>
                  </div>
                  <div className="fw-bold text-navy small mb-2">{sc.outlet}</div>
                  <div className="row g-2 small bg-surface rounded-3 p-2.5">
                    <div className="col-4"><span className="text-muted-custom d-block">Start #</span><strong>{sc.startNo}</strong></div>
                    <div className="col-4"><span className="text-muted-custom d-block">Current #</span><strong>{sc.currentNo}</strong></div>
                    <div className="col-4"><span className="text-muted-custom d-block">Missing Gaps</span><strong className="text-success">{sc.missingGaps.length}</strong></div>
                  </div>
                  <div className="text-muted-custom mt-2" style={{ fontSize: '11px' }}>
                    Voided with Audit Trail: {sc.voidedWithAudit.length > 0 ? sc.voidedWithAudit.map(n => `#${n}`).join(', ') : 'None'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'dayclose' && (
          <div className="row g-3">
            <div className="col-12 col-lg-7">
              <div className="app-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="fw-bold text-navy mb-0">Business Day Close — {dayClose.businessDate}</h5>
                    <div className="text-muted-custom small">{dayClose.propertyName}</div>
                  </div>
                  <span className={`badge rounded-pill px-3 py-2 ${dayClose.status === 'Closed' ? 'bg-success text-white' : dayClose.status === 'Reopen Requested' ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
                    {dayClose.status}
                  </span>
                </div>

                {/* Step Flow */}
                <div className="d-flex align-items-center gap-2 flex-wrap small mb-4">
                  <span className="badge badge-soft-success">1. Open Day</span> &rarr;
                  <span className="badge badge-soft-info">2. Review Exceptions</span> &rarr;
                  <span className="badge badge-soft-warning">3. Cash Reconciliation</span> &rarr;
                  <span className="badge bg-navy text-white">4. Close &amp; Lock Day</span>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-surface">
                      <div className="text-muted-custom small">Expected Cash in Till</div>
                      <div className="fs-4 fw-bold text-navy">₹{formatNumber(dayClose.expectedCash)}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-surface">
                      <label className="form-label small text-muted-custom mb-1">Physical Counted Cash (₹)</label>
                      <input
                        type="number"
                        disabled={dayClose.status === 'Closed'}
                        className="form-control fw-bold"
                        value={countedCashInput}
                        onChange={e => setCountedCashInput(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className={`alert py-2 px-3 small mb-4 ${variance === 0 ? 'alert-success' : 'alert-danger'}`}>
                  <strong>Cash Variance:</strong> ₹{formatNumber(variance)} ({variance === 0 ? 'Perfectly Balanced' : 'Cash Difference will be logged in Exception Report'})
                </div>

                {dayClose.status !== 'Closed' ? (
                  <button type="button" onClick={handleCloseDay} className="btn btn-brand text-white fw-bold w-100 py-2.5 d-flex align-items-center justify-content-center gap-2">
                    <BiLockAlt /> Reconcile &amp; Close Business Day
                  </button>
                ) : (
                  <div className="small text-success fw-semibold">
                    Closed by {dayClose.closedBy} ({dayClose.closedAt})
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <form onSubmit={handleRequestReopen} className="app-card p-4 h-100">
                <h6 className="fw-bold text-navy mb-2 d-flex align-items-center gap-1">
                  <BiLockOpenAlt className="text-warning" /> Reopen Closed Day Request
                </h6>
                <p className="text-muted-custom small">
                  Reopening a closed business date requires explicit reason, Owner/GM approval, and writes an immutable entry to the Audit Log.
                </p>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Reason for Reopen Request *</label>
                  <textarea
                    rows={3}
                    required
                    className="form-control form-control-sm"
                    placeholder="e.g., Corporate guest shared B2B GSTIN after night audit..."
                    value={reopenReason}
                    onChange={e => setReopenReason(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-outline-warning text-dark fw-semibold w-100">
                  Submit Reopen Request for Approval
                </button>
              </form>
            </div>
          </div>
        )}
      </PlanGate>
    </DashboardLayout>
  );
}
