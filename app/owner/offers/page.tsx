'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_OFFERS } from '@/data/saasData';
import { OfferCoupon } from '@/types/saas';
import { Modal } from '@/components/common/Modal';
import {
  BiSolidDiscount,
  BiPlus,
  BiSearch,
  BiCopy,
  BiCheck,
  BiCalendar,
  BiTrendingUp,
  BiShoppingBag,
  BiPowerOff,
} from 'react-icons/bi';
import { MdOutlinePercent } from 'react-icons/md';

export default function OffersPage() {
  const { currentRestaurant } = useAuth();
  const [offers, setOffers] = useState<OfferCoupon[]>(SAMPLE_OFFERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage' as OfferCoupon['discountType'],
    discountValue: 20,
    minOrderValue: 299,
    maxDiscount: 100,
    validFrom: '2026-11-16',
    validUntil: '2026-12-31',
    usageLimit: 500,
    channels: ['Dine In', 'Takeaway', 'Delivery'] as ('Dine In' | 'Takeaway' | 'Delivery')[],
  });

  // Filtering
  const filteredOffers = offers.filter((o) => {
    const matchesSearch =
      o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const activeOffersCount = offers.filter((o) => o.status === 'active').length;
  const totalRedemptions = offers.reduce((acc, o) => acc + o.usedCount, 0);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const next = o.status === 'active' ? 'expired' : 'active';
          return { ...o, status: next };
        }
        return o;
      })
    );
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer: OfferCoupon = {
      id: `off-${Date.now()}`,
      code: formData.code.toUpperCase().replace(/\s+/g, ''),
      title: formData.title,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      usageLimit: Number(formData.usageLimit),
      usedCount: 0,
      status: 'active',
      applicableChannels: formData.channels,
    };

    setOffers([newOffer, ...offers]);
    setIsAddModalOpen(false);

    // Reset Form
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 299,
      maxDiscount: 100,
      validFrom: '2026-11-16',
      validUntil: '2026-12-31',
      usageLimit: 500,
      channels: ['Dine In', 'Takeaway', 'Delivery'],
    });
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Discounts & Promo Campaigns</h4>
          <p className="text-muted-custom small mb-0">
            Create promotional coupon codes, order value discounts, and track redemption limits
          </p>
        </div>

        <button
          type="button"
          className="btn btn-brand d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setIsAddModalOpen(true)}
        >
          <BiPlus size={20} />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Active Promo Codes</span>
              <h3 className="fw-bold text-navy mb-0">{activeOffersCount} Campaigns</h3>
              <span className="text-success small fw-medium" style={{ fontSize: '11px' }}>
                Live across POS & Online
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand bg-opacity-10 text-brand"
              style={{ width: '48px', height: '48px' }}
            >
              <BiSolidDiscount size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Total Redemptions</span>
              <h3 className="fw-bold text-navy mb-0">{totalRedemptions} Times</h3>
              <span className="text-info small fw-medium" style={{ fontSize: '11px' }}>
                Used by customers this month
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-info bg-opacity-10 text-info"
              style={{ width: '48px', height: '48px' }}
            >
              <BiShoppingBag size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Total Savings Given</span>
              <h3 className="fw-bold text-warning mb-0">₹48,250</h3>
              <span className="text-muted-custom small" style={{ fontSize: '11px' }}>
                Customer discount granted
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-warning bg-opacity-10 text-warning"
              style={{ width: '48px', height: '48px' }}
            >
              <MdOutlinePercent size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Sales Influenced</span>
              <h3 className="fw-bold text-success mb-0">₹2.84 L</h3>
              <span className="text-success small fw-medium" style={{ fontSize: '11px' }}>
                5.8x ROI on discount budget
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-success"
              style={{ width: '48px', height: '48px' }}
            >
              <BiTrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="app-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-subtle text-muted-custom">
                <BiSearch size={16} />
              </span>
              <input
                type="text"
                className="form-control border-subtle shadow-none"
                placeholder="Search offer code or campaign title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm border-subtle shadow-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="active">Active Campaigns</option>
              <option value="expired">Expired / Inactive</option>
            </select>
          </div>

          <div className="col-6 col-md-3 text-end">
            <span className="badge bg-light text-navy border">
              {filteredOffers.length} Coupons Available
            </span>
          </div>
        </div>
      </div>

      {/* Offers Cards Grid */}
      <div className="row g-3">
        {filteredOffers.map((o) => {
          const usagePercent = Math.min(100, Math.round((o.usedCount / o.usageLimit) * 100));

          return (
            <div key={o.id} className="col-12 col-md-6 col-xl-4">
              <div className="app-card p-4 h-100 d-flex flex-column justify-content-between shadow-sm">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="px-2.5 py-1 bg-surface border border-subtle rounded-2 font-monospace fw-bold text-navy fs-6">
                        {o.code}
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-muted-custom p-0"
                        title="Copy Code"
                        onClick={() => handleCopyCode(o.code)}
                      >
                        {copiedCode === o.code ? (
                          <BiCheck size={18} className="text-success" />
                        ) : (
                          <BiCopy size={18} />
                        )}
                      </button>
                    </div>

                    <span
                      className={`badge rounded-pill ${
                        o.status === 'active' ? 'bg-success text-white' : 'bg-secondary text-white'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>

                  <h6 className="fw-bold text-navy mb-1">{o.title}</h6>
                  <p className="text-muted-custom small mb-3">{o.description}</p>

                  <div className="p-2.5 bg-surface rounded-3 border border-subtle mb-3 small">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted-custom">Benefit:</span>
                      <strong className="text-brand">
                        {o.discountType === 'percentage'
                          ? `${o.discountValue}% OFF`
                          : `₹${o.discountValue} FLAT OFF`}
                        {o.maxDiscount && ` (Max ₹${o.maxDiscount})`}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted-custom">Min Order:</span>
                      <strong className="text-navy">₹{o.minOrderValue}</strong>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between text-muted-custom small mb-1" style={{ fontSize: '11px' }}>
                      <span>Redemptions</span>
                      <span>
                        {o.usedCount} / {o.usageLimit} ({usagePercent}%)
                      </span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar bg-brand"
                        role="progressbar"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {o.applicableChannels.map((c, i) => (
                      <span key={i} className="badge bg-light text-navy border" style={{ fontSize: '10px' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-top border-subtle d-flex align-items-center justify-content-between">
                  <div className="text-muted-custom small d-flex align-items-center gap-1">
                    <BiCalendar size={13} className="text-brand flex-shrink-0" />
                    <span>Valid: {o.validUntil}</span>
                  </div>

                  <button
                    type="button"
                    className={`btn btn-sm ${
                      o.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'
                    } py-1 px-2.5 d-flex align-items-center gap-1`}
                    onClick={() => handleToggleStatus(o.id)}
                  >
                    <BiPowerOff size={14} />
                    <span>{o.status === 'active' ? 'Disable' : 'Enable'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredOffers.length === 0 && (
          <div className="col-12 text-center py-5 text-muted-custom">
            No coupon offers found matching your search.
          </div>
        )}
      </div>

      {/* Modal: Create New Offer */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Promotional Discount Offer"
        subtitle={`Live campaign for ${currentRestaurant.name}`}
        size="md"
      >
        <form onSubmit={handleCreateOffer}>
          <div className="row g-2 mb-3">
            <div className="col-5">
              <label className="form-label small fw-semibold text-navy">Coupon Code</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle text-uppercase font-monospace"
                placeholder="e.g. MONSOON30"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            <div className="col-7">
              <label className="form-label small fw-semibold text-navy">Campaign Headline</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                placeholder="e.g. 30% Off on Monsoon Snacks"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Description / Terms</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              placeholder="e.g. Valid on all hot beverages and fried starters"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Discount Type</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.discountType}
                onChange={(e: any) => setFormData({ ...formData, discountType: e.target.value })}
              >
                <option value="percentage">Percentage (%) Off</option>
                <option value="flat">Flat Amount (₹) Off</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">
                {formData.discountType === 'percentage' ? 'Percentage Value (%)' : 'Flat Amount (₹)'}
              </label>
              <input
                type="number"
                className="form-control form-control-sm border-subtle"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Min Order Amount (₹)</label>
              <input
                type="number"
                className="form-control form-control-sm border-subtle"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Max Discount Cap (₹)</label>
              <input
                type="number"
                className="form-control form-control-sm border-subtle"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Valid From</label>
              <input
                type="date"
                className="form-control form-control-sm border-subtle"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Valid Until</label>
              <input
                type="date"
                className="form-control form-control-sm border-subtle"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-navy">Total Redemptions Cap</label>
            <input
              type="number"
              className="form-control form-control-sm border-subtle"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
              required
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm">
              Publish Promo Code
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
