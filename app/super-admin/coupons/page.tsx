'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_SUPER_ADMIN_COUPONS } from '@/data/saasData';
import { SuperAdminCoupon } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiPurchaseTag,
  BiPlus,
  BiCopy,
  BiCheck,
  BiTrash,
  BiCheckCircle,
  BiTimeFive,
  BiGift,
  BiSearch,
} from 'react-icons/bi';

export default function SuperAdminCouponsPage() {
  const [coupons, setCoupons] = useState<SuperAdminCoupon[]>(SAMPLE_SUPER_ADMIN_COUPONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Expired'>('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Coupon Form
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(25);
  const [maxDiscount, setMaxDiscount] = useState(2500);
  const [applicablePlan, setApplicablePlan] = useState('All Plans');
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [maxUses, setMaxUses] = useState(100);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchSearch =
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.applicablePlan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [coupons, searchTerm, statusFilter]);

  const activeCount = useMemo(() => coupons.filter((c) => c.status === 'Active').length, [coupons]);

  const totalRedemptions = useMemo(
    () => coupons.reduce((acc, c) => acc + c.totalUsed, 0),
    [coupons]
  );

  const estimatedDiscountGiven = useMemo(
    () => coupons.reduce((acc, c) => acc + c.totalUsed * (c.maxDiscount * 0.65), 0),
    [coupons]
  );

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'Active' ? 'Expired' : 'Active' }
          : c
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: SuperAdminCoupon = {
      id: `sac-${Date.now()}`,
      code: code.toUpperCase().trim(),
      discountPercent: Number(discountPercent) || 10,
      maxDiscount: Number(maxDiscount) || 1000,
      applicablePlan,
      validUntil,
      totalUsed: 0,
      maxUses: Number(maxUses) || 50,
      status: 'Active',
    };

    setCoupons([newCoupon, ...coupons]);
    setShowAddModal(false);
    setCode('');
    setDiscountPercent(25);
    setMaxDiscount(2500);
  };

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Platform Subscription Coupons & Affiliates</h1>
            <p className="text-muted small mb-0">
              Create promotional discount codes for new restaurant sign-ups, annual SaaS plan renewals, and partner affiliate deals.
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <BiPlus size={18} /> Create SaaS Coupon
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Active Promo Campaigns</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiPurchaseTag size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{activeCount} Promo Codes</h3>
              <span className="text-success small fw-medium">Applicable on checkout</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Total Tenant Redemptions</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiGift size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>{formatNumber(totalRedemptions)} times</h3>
              <span className="text-muted small">Converted across all tiers</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Discount Incentives Value</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiTimeFive size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(Math.round(estimatedDiscountGiven))}</h3>
              <span className="text-muted small">Total customer acquisition discount subsidy</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-6">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <BiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by coupon code or applicable plan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
                {(['All', 'Active', 'Expired'] as const).map((status) => (
                  <button
                    key={status}
                    className={`btn btn-sm ${
                      statusFilter === status ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th className="ps-3 py-3">Coupon Code</th>
                    <th>Discount</th>
                    <th>Max Cap</th>
                    <th>Applicable Plan</th>
                    <th>Valid Until</th>
                    <th>Usage / Limit</th>
                    <th>Status</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {filteredCoupons.map((c) => {
                    const usagePercent = Math.min(100, Math.round((c.totalUsed / c.maxUses) * 100));
                    return (
                      <tr key={c.id}>
                        <td className="ps-3">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-dark font-monospace px-2 py-1 fs-6">
                              {c.code}
                            </span>
                            <button
                              className="btn btn-sm btn-light border py-0 px-2 text-muted"
                              onClick={() => handleCopy(c.code)}
                              title="Copy Code"
                            >
                              {copiedCode === c.code ? (
                                <BiCheck className="text-success" />
                              ) : (
                                <BiCopy />
                              )}
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className="fw-bold text-success fs-6">{c.discountPercent}% OFF</span>
                        </td>
                        <td className="fw-semibold text-dark" suppressHydrationWarning>
                          ₹{formatNumber(c.maxDiscount)}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {c.applicablePlan}
                          </span>
                        </td>
                        <td>{c.validUntil}</td>
                        <td style={{ minWidth: '150px' }}>
                          <div className="d-flex justify-content-between small text-muted mb-1">
                            <span suppressHydrationWarning>{c.totalUsed} used</span>
                            <span suppressHydrationWarning>{c.maxUses} max</span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div
                              className={`progress-bar ${
                                usagePercent >= 90 ? 'bg-danger' : 'bg-primary'
                              }`}
                              style={{ width: `${usagePercent}%` }}
                            ></div>
                          </div>
                        </td>
                        <td>
                          {c.status === 'Active' ? (
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                              <BiCheckCircle className="me-1" /> Active
                            </span>
                          ) : (
                            <span className="badge bg-secondary-subtle text-muted border">
                              Expired
                            </span>
                          )}
                        </td>
                        <td className="text-end pe-3">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleToggleStatus(c.id)}
                              title={c.status === 'Active' ? 'Deactivate Coupon' : 'Activate Coupon'}
                            >
                              {c.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(c.id)}
                              title="Delete Coupon"
                            >
                              <BiTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Create Coupon */}
        {showAddModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleCreateCoupon}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Create Platform Coupon</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Coupon Code *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm font-monospace text-uppercase"
                        placeholder="e.g. FESTIVE50"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Discount % *</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min={1}
                          max={100}
                          required
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(Number(e.target.value))}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Max Discount Cap (₹) *</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min={100}
                          required
                          value={maxDiscount}
                          onChange={(e) => setMaxDiscount(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Applicable SaaS Plan</label>
                      <select
                        className="form-select form-select-sm"
                        value={applicablePlan}
                        onChange={(e) => setApplicablePlan(e.target.value)}
                      >
                        <option value="All Plans">All Plans</option>
                        <option value="Starter Plan (1st Month)">Starter Plan (1st Month)</option>
                        <option value="Pro Plan">Pro Plan</option>
                        <option value="Enterprise Plan">Enterprise Plan</option>
                      </select>
                    </div>

                    <div className="row g-2 mb-0">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Valid Until</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={validUntil}
                          onChange={(e) => setValidUntil(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Max Redemptions</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min={1}
                          value={maxUses}
                          onChange={(e) => setMaxUses(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Create Coupon
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
