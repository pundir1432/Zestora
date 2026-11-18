'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { userService } from '@/services';
import { HospitalityRole } from '@/mock/users';
import { PlanTierBadge } from '@/components/common/PlanBadge';
import { BiShieldQuarter, BiSearch, BiCheckShield, BiUserCheck } from 'react-icons/bi';

const CATEGORIES = [
  'All (33)',
  'Platform Governance',
  'Tenant & Ownership',
  'Restaurant & Kitchen',
  'Hotel, Hostel & Front Desk',
  'Camp & Adventure',
  'Finance, GST & Audit',
  'External & Device Accounts',
] as const;

export default function RolesPermissions33Page() {
  const allRoles = userService.getRoles();
  const [supportRequests, setSupportRequests] = useState(() => userService.getSupportAccessRequests());
  const [catFilter, setCatFilter] = useState<string>('All (33)');
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<HospitalityRole | null>(allRoles[5]);

  const filtered = allRoles.filter(r => {
    const matchCat = catFilter === 'All (33)' || r.category === catFilter;
    const matchQ =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.scope.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const handleSupportConsent = (id: string, approve: boolean) => {
    setSupportRequests(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, status: approve ? 'Active' : 'Revoked', consentGivenBy: approve ? 'Vikram Singhania (Owner)' : undefined }
          : s
      )
    );
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <BiShieldQuarter className="text-brand" /> 33-Role Hospitality Access &amp; Permission Matrix
          </h3>
          <p className="text-muted-custom small mb-0">
            Visualizing <strong>Role + Scope (Platform &rarr; Tenant &rarr; Property &rarr; Outlet) + Limits + Plan Tier (S/G/E)</strong> + External / Device Accounts
          </p>
        </div>
        <span className="badge bg-navy text-white px-3 py-2 fs-6">{allRoles.length} Configurable Roles</span>
      </div>

      {/* Support Access & Consent Banner */}
      <div className="app-card p-3 mb-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
          <span className="fw-bold text-navy small d-flex align-items-center gap-1">
            <BiCheckShield className="text-brand" /> Support Access &amp; Explicit Tenant Consent
          </span>
          <span className="text-muted-custom" style={{ fontSize: '11px' }}>Platform support cannot access tenant data without time-boxed owner consent</span>
        </div>
        <div className="row g-2">
          {supportRequests.map(sr => (
            <div key={sr.id} className="col-12 col-lg-6">
              <div className="p-3 rounded-3 bg-surface border border-subtle d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2">
                <div>
                  <div className="fw-bold text-navy small">{sr.requestedBy} <span className="badge badge-soft-warning ms-1" style={{ fontSize: '10px' }}>{sr.status}</span></div>
                  <div className="text-muted-custom" style={{ fontSize: '11px' }}>{sr.reason} &bull; {sr.scope}</div>
                </div>
                {sr.status === 'Pending Consent' && (
                  <div className="d-flex gap-1 flex-shrink-0">
                    <button type="button" onClick={() => handleSupportConsent(sr.id, true)} className="btn btn-sm btn-success text-white fw-semibold">Grant</button>
                    <button type="button" onClick={() => handleSupportConsent(sr.id, false)} className="btn btn-sm btn-outline-danger">Deny</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter + Search */}
      <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-2 mb-3">
        <div className="d-flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCatFilter(c)}
              className={`btn btn-sm rounded-pill px-3 ${catFilter === c ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary bg-white text-navy'}`}
              style={{ fontSize: '11px' }}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="input-group input-group-sm" style={{ maxWidth: '240px' }}>
          <span className="input-group-text bg-white"><BiSearch /></span>
          <input className="form-control" placeholder="Search 33 roles..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="row g-3">
        {/* Roles Table */}
        <div className="col-12 col-xl-8">
          <div className="app-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr className="text-muted-custom">
                    <th>Role &amp; Code</th>
                    <th>Scope</th>
                    <th>Limits</th>
                    <th>Plans</th>
                    <th className="text-center">Users</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedRole(r)}
                      className={selectedRole?.id === r.id ? 'table-warning' : ''}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className="fw-bold text-navy">{r.name}</div>
                        <div className="font-monospace text-muted-custom" style={{ fontSize: '10px' }}>{r.code} &bull; {r.category}</div>
                      </td>
                      <td><span className="badge bg-light text-navy border">{r.scope}</span></td>
                      <td style={{ fontSize: '11px' }}>
                        Max Disc: <strong>{r.maxDiscountPercent}%</strong>
                        {!r.canVoidWithoutApproval && <div className="text-muted-custom">Void needs approval</div>}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {r.planAvailability.map(p => (
                            <PlanTierBadge key={p} tier={p} compact />
                          ))}
                        </div>
                      </td>
                      <td className="text-center fw-bold text-navy">{r.assignedUsers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Role Formula Inspector: Role + Scope + Limits + Plan */}
        <div className="col-12 col-xl-4">
          {selectedRole && (
            <div className="app-card p-4 sticky-top" style={{ top: '86px' }}>
              <span className="badge badge-soft-brand mb-2">{selectedRole.category}</span>
              <h5 className="fw-bold text-navy mb-0">{selectedRole.name}</h5>
              <div className="font-monospace text-muted-custom small mb-3">{selectedRole.code}</div>

              <div className="p-3 rounded-3 bg-surface border border-subtle small mb-3">
                <div className="fw-bold text-navy mb-1">Access Formula: Role + Scope + Limits + Plan</div>
                <div><strong>Scope:</strong> {selectedRole.scope}</div>
                <div><strong>Discount Limit:</strong> Up to {selectedRole.maxDiscountPercent}%</div>
                <div><strong>Void Without Approval:</strong> {selectedRole.canVoidWithoutApproval ? 'Yes' : 'No (Requires Approval)'}</div>
                <div><strong>Reopen Closed Day:</strong> {selectedRole.canReopenDay ? 'Allowed' : 'Restricted'}</div>
                <div className="mt-1 d-flex align-items-center gap-1">
                  <strong>Plans:</strong>
                  {selectedRole.planAvailability.map(p => <PlanTierBadge key={p} tier={p} compact />)}
                </div>
              </div>

              <h6 className="fw-bold text-navy small mb-2">Granted Capabilities</h6>
              <div className="d-flex flex-wrap gap-1 mb-3">
                {selectedRole.permissionsSummary.map(perm => (
                  <span key={perm} className="badge badge-soft-success" style={{ fontSize: '11px' }}>{perm}</span>
                ))}
              </div>

              <h6 className="fw-bold text-navy small mb-2">Approval Triggers</h6>
              {selectedRole.approvalRequiredFor.length === 0 ? (
                <div className="text-muted-custom small">No escalation triggers configured</div>
              ) : (
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {selectedRole.approvalRequiredFor.map(ap => (
                    <span key={ap} className="badge badge-soft-warning" style={{ fontSize: '11px' }}>{ap}</span>
                  ))}
                </div>
              )}

              <div className="pt-2 border-top small text-muted-custom d-flex align-items-center gap-1">
                <BiUserCheck className="text-brand" /> Currently assigned to <strong>{selectedRole.assignedUsers}</strong> active user/device account(s)
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
