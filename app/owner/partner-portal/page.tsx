'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PlanGate } from '@/components/common/PlanBadge';
import { formatNumber } from '@/utils/formatters';
import { BiBriefcase, BiCheckCircle, BiPlus } from 'react-icons/bi';

const INITIAL_PARTNERS = [
  { id: 'AGT-01', name: 'Himalayan Rapids Travel Desk', type: 'Rafting & Stay Agent', city: 'Tapovan, Rishikesh', commissionPct: 12, monthBookings: 24, grossSales: 148000, payableCommission: 17760, creditLimit: 50000, status: 'Active' },
  { id: 'AGT-02', name: 'Ganga Trails Yoga Retreats', type: 'Yoga Group Partner', city: 'Laxman Jhula', commissionPct: 10, monthBookings: 16, grossSales: 214000, payableCommission: 21400, creditLimit: 75000, status: 'Active' },
  { id: 'AGT-03', name: 'Dehradun Cab & Tour Syndicate', type: 'Transfer & Hotel Agent', city: 'Dehradun / Haridwar', commissionPct: 15, monthBookings: 11, grossSales: 62000, payableCommission: 9300, creditLimit: 30000, status: 'Active' },
  { id: 'AGT-04', name: 'Uttarakhand SaaS Channel Partner', type: 'Reseller / Onboarding Partner', city: 'Rishikesh Cluster', commissionPct: 20, monthBookings: 8, grossSales: 96000, payableCommission: 19200, creditLimit: 100000, status: 'Active' },
];

export default function PartnerPortalPage() {
  const [partners, setPartners] = useState(INITIAL_PARTNERS);
  const [settledIds, setSettledIds] = useState<string[]>([]);

  const settlePartner = (id: string) => {
    setSettledIds(prev => [...prev, id]);
    setPartners(prev => prev.map(p => (p.id === id ? { ...p, payableCommission: 0 } : p)));
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <PlanGate featureKey="partnerPortal" requiredTier="G" featureTitle="Partner, Travel Agent & Reseller Portal">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-4">
          <div>
            <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
              <BiBriefcase className="text-brand" /> Partner &amp; Travel Agent Portal
            </h3>
            <p className="text-muted-custom small mb-0">
              Manage Rishikesh travel agents, yoga retreat partners, rafting brokers &amp; regional onboarding partners (Role: EXT_AGENT)
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert('Mock Partner Invite Link copied! Partner receives scoped EXT_AGENT portal credentials.')}
            className="btn btn-brand btn-sm text-white fw-semibold d-flex align-items-center gap-1"
          >
            <BiPlus /> Invite Partner Agent
          </button>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="app-card p-3">
              <div className="text-muted-custom small">Active Partners</div>
              <div className="fs-3 fw-bold text-navy">{partners.length}</div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="app-card p-3">
              <div className="text-muted-custom small">Partner-Driven Bookings</div>
              <div className="fs-3 fw-bold text-primary">{partners.reduce((s, p) => s + p.monthBookings, 0)}</div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="app-card p-3">
              <div className="text-muted-custom small">Gross Partner Revenue</div>
              <div className="fs-3 fw-bold text-navy">₹{formatNumber(partners.reduce((s, p) => s + p.grossSales, 0))}</div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="app-card p-3">
              <div className="text-muted-custom small">Payable Commissions</div>
              <div className="fs-3 fw-bold text-brand">₹{formatNumber(partners.reduce((s, p) => s + p.payableCommission, 0))}</div>
            </div>
          </div>
        </div>

        <div className="app-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr className="text-muted-custom">
                  <th>Partner / Agent</th>
                  <th>Type &amp; City</th>
                  <th className="text-center">Comm %</th>
                  <th className="text-end">Gross Sales</th>
                  <th className="text-end">Credit Limit</th>
                  <th className="text-end">Commission Due</th>
                  <th className="text-end">Payout</th>
                </tr>
              </thead>
              <tbody>
                {partners.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="fw-bold text-navy">{p.name}</div>
                      <div className="font-monospace text-muted-custom" style={{ fontSize: '10px' }}>{p.id}</div>
                    </td>
                    <td>
                      <span className="badge badge-soft-info">{p.type}</span>
                      <div className="text-muted-custom" style={{ fontSize: '10px' }}>{p.city}</div>
                    </td>
                    <td className="text-center fw-bold text-navy">{p.commissionPct}%</td>
                    <td className="text-end fw-semibold">₹{formatNumber(p.grossSales)}</td>
                    <td className="text-end text-muted-custom">₹{formatNumber(p.creditLimit)}</td>
                    <td className="text-end fw-bold text-brand">₹{formatNumber(p.payableCommission)}</td>
                    <td className="text-end">
                      {settledIds.includes(p.id) || p.payableCommission === 0 ? (
                        <span className="badge badge-soft-success d-inline-flex align-items-center gap-1"><BiCheckCircle /> Settled</span>
                      ) : (
                        <button type="button" onClick={() => settlePartner(p.id)} className="btn btn-sm btn-outline-success fw-semibold">
                          Mark Settled
                        </button>
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
