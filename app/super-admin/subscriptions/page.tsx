'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { SUBSCRIPTION_PLANS, SAMPLE_OWNER_SUBSCRIPTIONS } from '@/data/subscriptionData';
import { SubscriptionPlan, OwnerSubscription, SubscriptionLifecycleStatus } from '@/types/subscription';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Modal } from '@/components/common/Modal';
import { formatNumber } from '@/utils/formatters';
import { 
  BiCheck, 
  BiCreditCard, 
  BiTime, 
  BiEdit, 
  BiFilterAlt,
  BiCalendar,
  BiErrorCircle,
  BiCheckCircle,
  BiPlusCircle,
  BiTransferAlt,
  BiTag,
  BiLockAlt,
  BiPlay,
  BiSliderAlt,
  BiSearch,
  BiRefresh
} from 'react-icons/bi';

export default function SubscriptionsPage() {
  const { trialConfig, updateTrialConfig } = useAuth();

  const [plans, setPlans] = useState<SubscriptionPlan[]>(SUBSCRIPTION_PLANS);
  const [subscriptions, setSubscriptions] = useState<OwnerSubscription[]>(SAMPLE_OWNER_SUBSCRIPTIONS);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | SubscriptionLifecycleStatus>('All');

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Trial Config Modal
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [cfgTrialDays, setCfgTrialDays] = useState(trialConfig.defaultTrialDays);
  const [cfgGraceDays, setCfgGraceDays] = useState(trialConfig.defaultGraceDays);

  // Modal: Change Plan
  const [selectedSubForPlanChange, setSelectedSubForPlanChange] = useState<OwnerSubscription | null>(null);
  const [targetPlan, setTargetPlan] = useState<'Starter' | 'Professional' | 'Business' | 'Enterprise'>('Professional');

  // Modal: Apply Coupon / Discount
  const [selectedSubForCoupon, setSelectedSubForCoupon] = useState<OwnerSubscription | null>(null);
  const [couponCode, setCouponCode] = useState('FOUNDER20');
  const [discountPercent, setDiscountPercent] = useState(20);

  // Modal: Edit Plan Tier Pricing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [planPrice, setPlanPrice] = useState(2999);

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Action: Save Policy Config
  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    updateTrialConfig(Number(cfgTrialDays), Number(cfgGraceDays));
    setIsConfigModalOpen(false);
    showToast(`Global Policy Updated: ${cfgTrialDays} Days Free Trial & ${cfgGraceDays} Days Grace Period`);
  };

  // Action: 1-Click Activate
  const handleActivateSub = (subId: string) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subId) {
        const nextDate = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
        return {
          ...s,
          status: 'Active',
          isRestrictedMode: false,
          nextBillingDate: nextDate,
          lastPaymentDate: new Date().toISOString().split('T')[0],
        };
      }
      return s;
    }));
    showToast('Subscription activated successfully! Tenant granted full platform access.');
  };

  // Action: Extend Subscription
  const handleExtendDays = (subId: string, days: number, label: string) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subId) {
        const currentDue = new Date(s.nextBillingDate);
        const base = isNaN(currentDue.getTime()) ? new Date() : currentDue;
        const newDue = new Date(base.getTime() + days * 86400000).toISOString().split('T')[0];
        return {
          ...s,
          nextBillingDate: newDue,
          status: 'Active',
          isRestrictedMode: false,
        };
      }
      return s;
    }));
    showToast(`License extended by ${label}! New billing date updated.`);
  };

  // Action: Grant / Extend Free Trial
  const handleExtendTrial = (subId: string, days: number) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subId) {
        const remaining = (s.trialDaysRemaining || 0) + days;
        const total = (s.trialTotalDays || 7) + days;
        const newEnd = new Date(Date.now() + remaining * 86400000).toISOString().split('T')[0];
        return {
          ...s,
          status: 'Trial',
          trialDaysRemaining: remaining,
          trialTotalDays: total,
          trialEndDate: newEnd,
          isRestrictedMode: false,
        };
      }
      return s;
    }));
    showToast(`Added +${days} Free Trial Days! Tenant access prolonged.`);
  };

  // Action: Toggle Suspend / Restore
  const handleToggleSuspend = (subId: string, currentStatus: string) => {
    const isSuspending = currentStatus !== 'Suspended';
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subId) {
        return {
          ...s,
          status: isSuspending ? 'Suspended' : 'Active',
          isRestrictedMode: isSuspending,
        };
      }
      return s;
    }));
    showToast(isSuspending ? 'Restaurant workspace moved to Restricted Mode (Data safely retained).' : 'Restaurant workspace restored to Active Mode!');
  };

  // Action: Change Plan
  const handleConfirmChangePlan = () => {
    if (!selectedSubForPlanChange) return;
    const planObj = SUBSCRIPTION_PLANS.find(p => p.name === targetPlan);
    const newAmount = selectedSubForPlanChange.billingCycle === 'Yearly' 
      ? planObj?.yearlyPrice || 28788 
      : planObj?.monthlyPrice || 2999;

    setSubscriptions(prev => prev.map(s => {
      if (s.id === selectedSubForPlanChange.id) {
        return {
          ...s,
          planName: targetPlan,
          amount: newAmount,
          gstAmount: Number((newAmount * 0.18).toFixed(2)),
        };
      }
      return s;
    }));
    setSelectedSubForPlanChange(null);
    showToast(`Plan successfully converted to ${targetPlan} Tier.`);
  };

  // Action: Apply Coupon
  const handleConfirmCoupon = () => {
    if (!selectedSubForCoupon) return;
    setSubscriptions(prev => prev.map(s => {
      if (s.id === selectedSubForCoupon.id) {
        const discounted = Math.round(s.amount * (1 - discountPercent / 100));
        return {
          ...s,
          amount: discounted,
          gstAmount: Number((discounted * 0.18).toFixed(2)),
        };
      }
      return s;
    }));
    setSelectedSubForCoupon(null);
    showToast(`Coupon ${couponCode} (${discountPercent}% OFF) applied to tenant!`);
  };

  const handleOpenEdit = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setPlanPrice(billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice);
    setIsEditModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setPlans(prev => prev.map(p => {
      if (p.id === selectedPlan.id) {
        return billingCycle === 'monthly' 
          ? { ...p, monthlyPrice: planPrice }
          : { ...p, yearlyPrice: planPrice };
      }
      return p;
    }));
    setIsEditModalOpen(false);
    showToast(`Price updated for ${selectedPlan.name} Tier.`);
  };

  const expiringCount = subscriptions.filter(s => s.status === 'Payment Due' || s.status === 'Grace Period').length;

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      {/* Toast Alert */}
      {toastMessage && (
        <div 
          className="position-fixed top-0 start-50 translate-middle-x mt-4 z-index-1080 animate__animated animate__fadeInDown"
          style={{ zIndex: 1080 }}
        >
          <div className="alert alert-success shadow-lg border-0 d-flex align-items-center gap-2 py-2.5 px-4 rounded-pill">
            <BiCheckCircle size={20} />
            <span className="fw-semibold small">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Multi-Tenant Subscriptions & Lifecycle Control</h4>
          <p className="text-muted-custom small mb-0">
            Control SaaS commercial plans, trial durations, grace periods, automated renewals, and tenant access states
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Trial / Grace Policy Config Button */}
          <button
            type="button"
            className="btn btn-outline-navy btn-sm d-flex align-items-center gap-1.5 bg-white shadow-sm fw-semibold"
            onClick={() => setIsConfigModalOpen(true)}
          >
            <BiSliderAlt size={16} className="text-brand" />
            <span>Policy Config (Trial: {trialConfig.defaultTrialDays}d, Grace: {trialConfig.defaultGraceDays}d)</span>
          </button>

          {/* Monthly / Yearly Toggle */}
          <div className="bg-white p-1 rounded-pill border border-subtle d-flex align-items-center shadow-sm">
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 ${billingCycle === 'monthly' ? 'btn-brand fw-semibold text-white' : 'btn-light bg-transparent text-navy'}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 ${billingCycle === 'yearly' ? 'btn-brand fw-semibold text-white' : 'btn-light bg-transparent text-navy'}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Annual <span className="badge bg-success ms-1 text-white" style={{ fontSize: '9px' }}>Save 20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overdue / Expiring Subscriptions Warning Alert */}
      {expiringCount > 0 && (
        <div className="alert alert-warning border-warning border-opacity-25 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 rounded-3 p-3 gap-2">
          <div className="d-flex align-items-center gap-2">
            <BiErrorCircle size={24} className="text-warning flex-shrink-0" />
            <div>
              <strong className="text-navy">{expiringCount} Restaurant Subscriptions Need Attention!</strong>
              <div className="small text-muted-custom">
                Tenants are in Payment Due or Grace Period. Automated reminders have been dispatched. You can extend trial, grant courtesy grace days, or apply discounts below.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-dark rounded-pill fw-semibold px-3"
            onClick={() => setStatusFilter('Payment Due')}
          >
            Filter Pending Renewals
          </button>
        </div>
      )}

      {/* Plans Pricing Cards Grid (4 Plans) */}
      <div className="row g-3 mb-5">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          const cycleLabel = billingCycle === 'monthly' ? '/ month' : '/ year';

          return (
            <div key={plan.id} className="col-12 col-sm-6 col-xl-3">
              <div className={`app-card p-3.5 h-100 d-flex flex-column justify-content-between position-relative ${
                plan.isPopular ? 'border-brand shadow-sm' : ''
              }`}>
                {plan.isPopular && (
                  <span 
                    className="position-absolute top-0 end-0 m-2.5 badge bg-brand text-white rounded-pill px-2.5 py-1"
                    style={{ fontSize: '10px' }}
                  >
                    Most Popular
                  </span>
                )}

                <div>
                  <h6 className="fw-bold text-navy mb-1">{plan.name} Tier</h6>
                  <div className="d-flex align-items-baseline gap-1 my-2">
                    <span className="fs-3 fw-bold text-navy" suppressHydrationWarning>₹{formatNumber(price)}</span>
                    <span className="text-muted-custom small">{cycleLabel}</span>
                  </div>

                  <div className="small text-muted-custom mb-2.5 pb-2 border-bottom border-subtle" style={{ fontSize: '11px' }}>
                    Max Outlets: <strong>{plan.maxBranches} Outlets</strong> • Max Staff: <strong>{plan.maxStaff}</strong>
                  </div>

                  <ul className="list-unstyled d-flex flex-column gap-1.5 mb-3 small">
                    {plan.features.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="d-flex align-items-start gap-1.5 text-navy" style={{ fontSize: '11px' }}>
                        <BiCheck className="text-success flex-shrink-0 mt-0.5" size={14} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-top border-subtle">
                  <button
                    type="button"
                    className="btn w-100 btn-sm btn-outline-secondary d-flex align-items-center justify-content-center gap-1 py-1"
                    onClick={() => handleOpenEdit(plan)}
                    style={{ fontSize: '12px' }}
                  >
                    <BiEdit size={14} />
                    <span>Edit Tier Price</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active & Expiring Subscriptions Management Section */}
      <div className="app-card overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-3 border-bottom border-subtle bg-surface d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div>
            <h6 className="fw-bold text-navy mb-0">Tenant Subscriptions & Lifecycle Directory</h6>
            <span className="text-muted-custom small">Direct 1-click license actions for Super Admin</span>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="input-group input-group-sm" style={{ width: '220px' }}>
              <span className="input-group-text bg-white border-subtle"><BiSearch size={14} /></span>
              <input
                type="text"
                className="form-control border-subtle"
                placeholder="Search tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter Badges */}
            <select
              className="form-select form-select-sm border-subtle fw-semibold text-navy"
              style={{ width: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="All">All Statuses ({subscriptions.length})</option>
              <option value="Trial">Free Trial ({subscriptions.filter(s => s.status === 'Trial').length})</option>
              <option value="Active">Active ({subscriptions.filter(s => s.status === 'Active').length})</option>
              <option value="Payment Due">Payment Due ({subscriptions.filter(s => s.status === 'Payment Due').length})</option>
              <option value="Grace Period">Grace Period ({subscriptions.filter(s => s.status === 'Grace Period').length})</option>
              <option value="Suspended">Suspended / Restricted ({subscriptions.filter(s => s.status === 'Suspended').length})</option>
            </select>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted-custom" style={{ fontSize: '11px' }}>
                <th className="ps-3">RESTAURANT BRAND</th>
                <th>OWNER & CONTACT</th>
                <th>PLAN TIER</th>
                <th>CYCLE</th>
                <th>NEXT BILLING / EXPIRY</th>
                <th>STATUS</th>
                <th className="text-end pe-3">LIFECYCLE MANAGEMENT ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((sub) => {
                const isRestricted = sub.status === 'Suspended' || sub.isRestrictedMode;
                return (
                  <tr key={sub.id} className={isRestricted ? 'bg-danger bg-opacity-10' : ''}>
                    <td className="ps-3">
                      <div className="fw-bold text-navy">{sub.restaurantName}</div>
                      <span className="font-monospace text-muted" style={{ fontSize: '11px' }}>{sub.id}</span>
                    </td>
                    <td>
                      <div className="small fw-semibold text-navy">{sub.ownerName}</div>
                      <span className="text-muted-custom" style={{ fontSize: '11px' }}>{sub.paymentMethod}</span>
                    </td>
                    <td>
                      <span className="badge badge-soft-brand">{sub.planName}</span>
                    </td>
                    <td className="small">{sub.billingCycle}</td>
                    <td>
                      <div className="small fw-semibold text-navy">{sub.nextBillingDate}</div>
                      {sub.status === 'Trial' && (
                        <span className="badge bg-warning bg-opacity-25 text-dark" style={{ fontSize: '10px' }}>
                          {sub.trialDaysRemaining || 5}d trial left
                        </span>
                      )}
                      {sub.status === 'Grace Period' && (
                        <span className="badge bg-danger bg-opacity-25 text-danger" style={{ fontSize: '10px' }}>
                          {sub.graceDaysRemaining || 3}d grace left
                        </span>
                      )}
                      {sub.status === 'Suspended' && (
                        <span className="badge bg-dark text-white" style={{ fontSize: '10px' }}>
                          Restricted Mode
                        </span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="text-end pe-3">
                      <div className="d-inline-flex align-items-center gap-1">
                        {/* 1-Click Activate / Restore */}
                        {sub.status !== 'Active' ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-success py-1 px-2 d-inline-flex align-items-center gap-1"
                            style={{ fontSize: '11px' }}
                            title="Instantly Mark Active"
                            onClick={() => handleActivateSub(sub.id)}
                          >
                            <BiCheckCircle size={14} />
                            <span>Activate</span>
                          </button>
                        ) : (
                          <div className="btn-group btn-group-sm">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary py-1 px-2 d-inline-flex align-items-center gap-1"
                              style={{ fontSize: '11px' }}
                              title="Extend 30 Days"
                              onClick={() => handleExtendDays(sub.id, 30, '+30 Days')}
                            >
                              <BiPlusCircle size={13} />
                              <span>+30d</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary py-1 px-2 d-inline-flex align-items-center gap-1"
                              style={{ fontSize: '11px' }}
                              title="Extend 1 Year"
                              onClick={() => handleExtendDays(sub.id, 365, '+1 Year')}
                            >
                              <span>+1yr</span>
                            </button>
                          </div>
                        )}

                        {/* Grant/Extend Free Trial */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning text-dark py-1 px-2 d-inline-flex align-items-center gap-1"
                          style={{ fontSize: '11px' }}
                          title="Grant +7 Free Trial Days"
                          onClick={() => handleExtendTrial(sub.id, 7)}
                        >
                          <BiTime size={14} />
                          <span>+7d Trial</span>
                        </button>

                        {/* Change Plan Button */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary py-1 px-2 d-inline-flex align-items-center gap-1"
                          style={{ fontSize: '11px' }}
                          title="Change Plan Tier"
                          onClick={() => {
                            setSelectedSubForPlanChange(sub);
                            setTargetPlan(sub.planName as any);
                          }}
                        >
                          <BiTransferAlt size={14} />
                          <span>Plan</span>
                        </button>

                        {/* Apply Promo / Coupon */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-info py-1 px-2 d-inline-flex align-items-center gap-1"
                          style={{ fontSize: '11px' }}
                          title="Apply Discount Coupon"
                          onClick={() => setSelectedSubForCoupon(sub)}
                        >
                          <BiTag size={14} />
                          <span>Promo</span>
                        </button>

                        {/* Suspend / Restore Restricted Mode */}
                        <button
                          type="button"
                          className={`btn btn-sm py-1 px-2 d-inline-flex align-items-center gap-1 ${
                            isRestricted ? 'btn-danger text-white' : 'btn-outline-dark'
                          }`}
                          style={{ fontSize: '11px' }}
                          title={isRestricted ? 'Restore Tenant Access' : 'Suspend Tenant to Restricted Mode'}
                          onClick={() => handleToggleSuspend(sub.id, sub.status)}
                        >
                          <BiLockAlt size={13} />
                          <span>{isRestricted ? 'Restore' : 'Suspend'}</span>
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

      {/* MODAL 1: Trial & Grace Period Global Policy Config */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title="Global Subscription Policy Settings"
        subtitle="Set platform-wide default durations for independent onboarding"
        size="md"
      >
        <form onSubmit={handleSavePolicy}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">
              Default Free Trial Duration (Days)
            </label>
            <div className="input-group">
              <input
                type="number"
                min={1}
                max={90}
                className="form-control border-subtle"
                value={cfgTrialDays}
                onChange={(e) => setCfgTrialDays(Number(e.target.value))}
                required
              />
              <span className="input-group-text bg-surface border-subtle small">Days</span>
            </div>
            <span className="small text-muted" style={{ fontSize: '11px' }}>
              Offered automatically upon owner registration without credit card requirement.
            </span>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-navy">
              Default Grace Period Duration (Days)
            </label>
            <div className="input-group">
              <input
                type="number"
                min={1}
                max={30}
                className="form-control border-subtle"
                value={cfgGraceDays}
                onChange={(e) => setCfgGraceDays(Number(e.target.value))}
                required
              />
              <span className="input-group-text bg-surface border-subtle small">Days</span>
            </div>
            <span className="small text-muted" style={{ fontSize: '11px' }}>
              Courtesy window after renewal due date before restricted read-only mode is enforced.
            </span>
          </div>

          <div className="p-3 bg-light rounded-3 border mb-4 small">
            <strong className="text-navy d-block mb-1">Data Retention & Protection Guarantee:</strong>
            <span className="text-muted">
              Even when a tenant moves to restricted/suspended mode, their menu, order history, inventory, and customer databases are <strong>never deleted</strong>. Access is immediately restored upon subscription renewal.
            </span>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setIsConfigModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm text-white fw-semibold shadow-sm">
              Save Policy Configuration
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Change Subscription Plan */}
      <Modal
        isOpen={!!selectedSubForPlanChange}
        onClose={() => setSelectedSubForPlanChange(null)}
        title="Change Subscription Tier"
        subtitle={`Tenant: ${selectedSubForPlanChange?.restaurantName}`}
        size="md"
      >
        <div className="mb-3">
          <label className="form-label small fw-semibold text-navy">Select Target Plan</label>
          <div className="row g-2">
            {(['Starter', 'Professional', 'Business', 'Enterprise'] as const).map(p => (
              <div key={p} className="col-6">
                <button
                  type="button"
                  className={`btn btn-sm w-100 py-2 border text-start d-flex align-items-center justify-content-between ${
                    targetPlan === p ? 'border-brand bg-brand bg-opacity-10 fw-bold text-navy' : 'bg-surface text-navy'
                  }`}
                  onClick={() => setTargetPlan(p)}
                >
                  <span>{p}</span>
                  {targetPlan === p && <BiCheck className="text-brand" size={18} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="small text-muted mb-4">
          Changing tier dynamically adjusts branch limits, maximum staff logins, and features available in the tenant workspace immediately.
        </p>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setSelectedSubForPlanChange(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-brand btn-sm text-white fw-semibold shadow-sm"
            onClick={handleConfirmChangePlan}
          >
            Confirm Tier Switch
          </button>
        </div>
      </Modal>

      {/* MODAL 3: Apply Discount Coupon */}
      <Modal
        isOpen={!!selectedSubForCoupon}
        onClose={() => setSelectedSubForCoupon(null)}
        title="Apply Discount Promo Coupon"
        subtitle={`Tenant: ${selectedSubForCoupon?.restaurantName}`}
        size="md"
      >
        <div className="mb-3">
          <label className="form-label small fw-semibold text-navy">Promo Voucher Code</label>
          <input
            type="text"
            className="form-control border-subtle font-monospace text-uppercase"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          />
        </div>

        <div className="mb-4">
          <label className="form-label small fw-semibold text-navy">Discount Concession (%)</label>
          <div className="input-group">
            <input
              type="number"
              min={5}
              max={90}
              className="form-control border-subtle"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
            />
            <span className="input-group-text bg-surface border-subtle">%</span>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setSelectedSubForCoupon(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-brand btn-sm text-white fw-semibold shadow-sm"
            onClick={handleConfirmCoupon}
          >
            Apply Promo Code
          </button>
        </div>
      </Modal>

      {/* MODAL 4: Edit Plan Price */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${selectedPlan?.name} Plan Pricing`}
        subtitle="Adjust pricing rules for future renewals"
        size="sm"
      >
        <form onSubmit={handleSavePlan}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">
              {billingCycle === 'monthly' ? 'Monthly Rate (₹)' : 'Yearly Rate (₹)'}
            </label>
            <input
              type="number"
              className="form-control form-control-sm border-subtle"
              value={planPrice}
              onChange={(e) => setPlanPrice(Number(e.target.value))}
              required
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm text-white fw-semibold">
              Save Price
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
