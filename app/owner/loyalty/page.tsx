'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_LOYALTY_TIERS, SAMPLE_CUSTOMERS } from '@/data/saasData';
import { LoyaltyTier } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiGift,
  BiAward,
  BiPlus,
  BiSearch,
  BiCheck,
  BiCoinStack,
  BiUserCheck,
  BiHistory,
} from 'react-icons/bi';

export default function BusinessOwnerLoyaltyPage() {
  const [tiers, setTiers] = useState<LoyaltyTier[]>(SAMPLE_LOYALTY_TIERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(SAMPLE_CUSTOMERS[0]?.name || '');
  const [bonusPoints, setBonusPoints] = useState(250);
  const [bonusReason, setBonusReason] = useState('Festive VIP Dining Perk');

  const totalMembers = useMemo(
    () => tiers.reduce((acc, t) => acc + t.memberCount, 0),
    [tiers]
  );

  const totalPointsCirculating = 482500;

  const handleIssueBonus = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Successfully credited ${bonusPoints} loyalty points to ${selectedCustomer}! SMS alert sent.`);
    setShowBonusModal(false);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'cashier']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Customer Loyalty & Reward Tiers</h1>
            <p className="text-muted small mb-0">
              Automated cashback points, tiered VIP memberships, and reward redemptions directly at POS.
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => setShowBonusModal(true)}
            >
              <BiGift size={18} /> Issue Reward Points
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Active Enrolled Diners</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiUserCheck size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>{formatNumber(totalMembers)} Members</h3>
              <span className="text-success small fw-medium">+88 joined this week</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Points in Circulation</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiCoinStack size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>{formatNumber(totalPointsCirculating)} pts</h3>
              <span className="text-muted small">Worth ₹{(totalPointsCirculating / 10).toLocaleString('en-IN')} in store redemptions</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Repeat Diner Conversion</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiAward size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">42.8%</h3>
              <span className="text-success small fw-medium">+14% higher than non-loyalty patrons</span>
            </div>
          </div>
        </div>

        {/* Loyalty Tiers Grid */}
        <h5 className="fw-bold text-dark mb-3">Membership Tiers</h5>
        <div className="row g-3 mb-5">
          {tiers.map((tier) => (
            <div key={tier.name} className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-3 bg-white h-100 position-relative overflow-hidden">
                <div
                  style={{
                    height: '6px',
                    backgroundColor: tier.name === 'Platinum' ? '#18263B' : tier.name === 'Gold' ? '#ffc107' : '#6c757d',
                  }}
                ></div>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="fw-bold mb-0" style={{ color: tier.name === 'Platinum' ? '#18263B' : undefined }}>
                      {tier.name} Club
                    </h4>
                    <span className="badge bg-light text-dark border">
                      {tier.memberCount} Diners
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="text-muted small">Spend threshold:</span>
                    <div className="fw-bold text-dark fs-6" suppressHydrationWarning>
                      {tier.minSpend === 0 ? 'Zero minimum (Auto enrolled)' : `₹${formatNumber(tier.minSpend)}+ annual spend`}
                    </div>
                  </div>

                  <div className="p-3 bg-light rounded-3 mb-3 text-center">
                    <div className="text-muted small">Cashback on Every Bill</div>
                    <div className="display-6 fw-bold text-primary">{tier.cashbackPercent}%</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>Earned automatically upon checkout</div>
                  </div>

                  <h6 className="fw-bold text-dark small text-uppercase mb-2">Tier Privileges</h6>
                  <ul className="list-unstyled small text-muted mb-0">
                    {tier.perks.map((p, idx) => (
                      <li key={idx} className="mb-2 d-flex align-items-start">
                        <BiCheck className="text-success me-2 mt-1 flex-shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Points Lookup Table */}
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="card-header bg-white border-bottom p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="fw-bold mb-0 text-dark">Diner Point Balances & Tier Status</h5>
              <div className="text-muted small">Search registered patrons and redeem points on billing</div>
            </div>
            <div style={{ maxWidth: '300px' }} className="w-100">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <BiSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search customer name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th className="ps-3 py-3">Customer Name</th>
                    <th>Phone</th>
                    <th>Membership Tier</th>
                    <th>Current Point Balance</th>
                    <th>Redeemable Value</th>
                    <th>Total Lifetime Spend</th>
                    <th className="text-end pe-3">Action</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {SAMPLE_CUSTOMERS.filter(
                    (c) =>
                      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      c.phone.includes(searchTerm)
                  ).map((cust) => {
                    const points = Math.round(cust.totalSpending * 0.08);
                    const tierName = cust.totalSpending >= 15000 ? 'Platinum' : cust.totalSpending >= 5000 ? 'Gold' : 'Silver';
                    return (
                      <tr key={cust.id}>
                        <td className="ps-3 fw-bold text-dark">{cust.name}</td>
                        <td className="text-muted">{cust.phone}</td>
                        <td>
                          <span
                            className={`badge ${
                              tierName === 'Platinum'
                                ? 'bg-dark text-white'
                                : tierName === 'Gold'
                                ? 'bg-warning text-dark'
                                : 'bg-secondary text-white'
                            }`}
                          >
                            {tierName}
                          </span>
                        </td>
                        <td className="fw-bold text-primary" suppressHydrationWarning>{formatNumber(points)} pts</td>
                        <td className="fw-semibold text-success" suppressHydrationWarning>₹{formatNumber(Math.round(points / 10))}</td>
                        <td suppressHydrationWarning>₹{formatNumber(cust.totalSpending)}</td>
                        <td className="text-end pe-3">
                          <button
                            className="btn btn-outline-secondary btn-sm px-2 py-0"
                            onClick={() => {
                              setSelectedCustomer(cust.name);
                              setShowBonusModal(true);
                            }}
                          >
                            + Bonus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Issue Bonus Points */}
        {showBonusModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleIssueBonus}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Credit Reward Points</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowBonusModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Customer Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Points to Credit *</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        min={10}
                        max={10000}
                        required
                        value={bonusPoints}
                        onChange={(e) => setBonusPoints(Number(e.target.value))}
                      />
                      <div className="text-muted small mt-1">
                        Equivalent to ₹{(bonusPoints / 10).toFixed(0)} discount on their next bill.
                      </div>
                    </div>

                    <div className="mb-0">
                      <label className="form-label small fw-semibold">Reason / Campaign</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={bonusReason}
                        onChange={(e) => setBonusReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowBonusModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Credit Points & Send SMS
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
