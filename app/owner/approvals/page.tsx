'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { BiShieldQuarter, BiCheckCircle, BiXCircle, BiTimeFive } from 'react-icons/bi';

export default function ApprovalWorkflowsPage() {
  const { approvals, decideApproval } = useHospitality();
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [notes, setNotes] = useState<Record<string, string>>({});

  const visible = filter === 'All' ? approvals : approvals.filter(a => a.status === filter);

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <BiShieldQuarter className="text-brand" /> Approval Workflows Center
          </h3>
          <p className="text-muted-custom small mb-0">
            Discount Approval, Void Approval, Reopen Day, Support Access &amp; Limit Exceeded — Request &rarr; Pending &rarr; Approved/Rejected &rarr; Audit History
          </p>
        </div>
      </div>

      <div className="d-flex gap-2 flex-wrap mb-4">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(st => {
          const count = st === 'All' ? approvals.length : approvals.filter(a => a.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`btn btn-sm rounded-pill px-3 ${filter === st ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary bg-white text-navy'}`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      <div className="d-flex flex-column gap-3">
        {visible.map(req => (
          <div key={req.id} className="app-card p-3 p-md-4">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-2">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="badge bg-navy text-white">{req.id}</span>
                <span className="badge badge-soft-brand">{req.type}</span>
                <span className="fw-bold text-navy">{req.amountOrImpact}</span>
              </div>
              <span
                className={`badge rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1 ${
                  req.status === 'Approved'
                    ? 'badge-soft-success'
                    : req.status === 'Rejected'
                    ? 'badge-soft-danger'
                    : 'badge-soft-warning'
                }`}
              >
                {req.status === 'Approved' ? <BiCheckCircle /> : req.status === 'Rejected' ? <BiXCircle /> : <BiTimeFive />}
                {req.status}
              </span>
            </div>

            <div className="small text-muted-custom mb-2">
              Requested by <strong className="text-navy">{req.requestedBy}</strong> ({req.requesterRole}) &bull; {req.propertyOutlet} &bull; {req.requestedAt}
            </div>
            <div className="p-2.5 rounded-3 bg-surface border border-subtle small text-navy mb-3">
              <strong>Reason:</strong> {req.reason}
            </div>

            {req.status === 'Pending' ? (
              <div className="d-flex flex-column flex-sm-row gap-2 align-items-stretch align-items-sm-center">
                <input
                  className="form-control form-control-sm"
                  placeholder="Optional approver decision note for audit log..."
                  value={notes[req.id] || ''}
                  onChange={e => setNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                />
                <div className="d-flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => decideApproval(req.id, 'Approved', notes[req.id] || 'Approved by Owner')}
                    className="btn btn-success btn-sm text-white fw-semibold px-3"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => decideApproval(req.id, 'Rejected', notes[req.id] || 'Rejected by Owner')}
                    className="btn btn-outline-danger btn-sm fw-semibold px-3"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="small text-muted-custom pt-2 border-top">
                Decided by <strong className="text-navy">{req.approver}</strong> ({req.decidedAt}) &bull; Note: <em>{req.decisionNote}</em>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
