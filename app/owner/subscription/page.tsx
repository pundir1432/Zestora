'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { SUBSCRIPTION_PLANS } from '@/data/subscriptionData';
import { formatNumber } from '@/utils/formatters';
import {
  BiCreditCard,
  BiCheckCircle,
  BiCheck,
  BiBuilding,
  BiReceipt,
  BiDownload,
  BiCalendar,
  BiTrendingUp,
  BiCheckShield,
  BiRightArrowAlt,
  BiRefresh,
  BiError,
  BiErrorCircle,
  BiLockAlt,
  BiPrinter,
  BiTimeFive,
  BiPlay
} from 'react-icons/bi';

export default function OwnerSubscriptionPage() {
  const router = useRouter();
  const { 
    currentRestaurant, 
    updateRestaurant,
    subscriptionStatus,
    subscriptionPlan,
    trialDaysRemaining,
    trialTotalDays,
    graceDaysRemaining,
    nextPaymentDate,
    autoRenew,
    setSubscriptionStatus,
    extendSubscription,
  } = useAuth();

  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Yearly');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [autoRenewState, setAutoRenewState] = useState(autoRenew);

  // Billing history
  const [billingHistory, setBillingHistory] = useState([
    {
      id: 'inv-1',
      invoiceNumber: 'INV-SAAS-2026-081',
      date: '12-Apr-2026',
      period: '12-Apr-2026 to 11-Apr-2027',
      plan: subscriptionPlan || 'Professional',
      cycle: 'Yearly',
      amount: 28788,
      gstAmount: 5181.84,
      taxableAmount: 28788,
      status: 'Paid',
      sacCode: '998313',
      paymentMethod: 'UPI AutoPay (Google Pay)',
    },
    {
      id: 'inv-2',
      invoiceNumber: 'INV-SAAS-2025-042',
      date: '12-Apr-2025',
      period: '12-Apr-2025 to 11-Apr-2026',
      plan: 'Starter',
      cycle: 'Yearly',
      amount: 14388,
      gstAmount: 2589.84,
      taxableAmount: 14388,
      status: 'Paid',
      sacCode: '998313',
      paymentMethod: 'HDFC Corporate NetBanking',
    },
  ]);

  const handleToggleAutoRenew = () => {
    const nextVal = !autoRenewState;
    setAutoRenewState(nextVal);
    updateRestaurant({ autoRenew: nextVal });
  };

  const handleViewInvoice = (inv: any) => {
    setSelectedInvoice(inv);
    setShowInvoiceModal(true);
  };

  const handleCheckoutPlan = (planName: string) => {
    router.push(`/owner/subscription/checkout?plan=${encodeURIComponent(planName)}&cycle=${billingCycle}`);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'accountant']}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-3 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">SaaS Subscription & Plan Management</h4>
          <p className="text-muted-custom small mb-0">
            Platform membership tier, active outlet limits, quota tracking, and tax invoice receipts
          </p>
        </div>

        <Link
          href={`/owner/subscription/checkout?plan=${encodeURIComponent(subscriptionPlan || 'Professional')}&cycle=${billingCycle}`}
          className="btn btn-brand text-white btn-sm d-flex align-items-center gap-1.5 shadow-sm px-3 py-2 fw-semibold"
        >
          <BiCreditCard size={18} />
          <span>{subscriptionStatus === 'Trial' ? 'Upgrade to Paid Plan' : 'Renew / Change Plan'}</span>
        </Link>
      </div>

      {/* LIFECYCLE DEMO SIMULATOR TOOLBAR */}
      <div className="p-3 mb-4 rounded-3 border bg-white shadow-sm">
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-navy text-white px-2.5 py-1.5 rounded-pill small d-flex align-items-center gap-1">
              <BiPlay size={14} className="text-brand" /> DEMO SIMULATOR
            </span>
            <span className="small text-muted">
              Test how the platform and navigation respond to each subscription lifecycle phase:
            </span>
          </div>

          <div className="d-flex flex-wrap gap-1.5">
            <button
              type="button"
              className={`btn btn-sm ${subscriptionStatus === 'Trial' ? 'btn-warning text-dark fw-bold' : 'btn-outline-warning'}`}
              onClick={() => setSubscriptionStatus('Trial')}
            >
              Trial (5 Days)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${subscriptionStatus === 'Active' ? 'btn-success text-white fw-bold' : 'btn-outline-success'}`}
              onClick={() => setSubscriptionStatus('Active')}
            >
              Active Paid
            </button>
            <button
              type="button"
              className={`btn btn-sm ${subscriptionStatus === 'Payment Due' ? 'btn-primary text-white fw-bold' : 'btn-outline-primary'}`}
              onClick={() => setSubscriptionStatus('Payment Due')}
            >
              Payment Due
            </button>
            <button
              type="button"
              className={`btn btn-sm ${subscriptionStatus === 'Grace Period' ? 'btn-danger text-white fw-bold' : 'btn-outline-danger'}`}
              onClick={() => setSubscriptionStatus('Grace Period')}
            >
              Grace Period (3 Days)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${subscriptionStatus === 'Suspended' ? 'btn-dark text-white fw-bold' : 'btn-outline-dark'}`}
              onClick={() => setSubscriptionStatus('Suspended')}
            >
              Suspended (Restricted)
            </button>
          </div>
        </div>
      </div>

      {/* CURRENT STATUS ALERT BANNER */}
      {subscriptionStatus === 'Trial' && (
        <div className="alert alert-warning border-0 bg-warning bg-opacity-15 p-3 rounded-3 mb-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2">
            <BiTimeFive size={22} className="text-warning flex-shrink-0" />
            <div>
              <strong className="text-navy">7-Day Free Trial Active: {trialDaysRemaining} of {trialTotalDays} Days Remaining</strong>
              <div className="small text-muted">
                You have unrestricted access to all POS, KDS and multi-outlet features. Upgrade before your trial expires to lock in 20% annual savings.
              </div>
            </div>
          </div>
          <Link
            href={`/owner/subscription/checkout?plan=${encodeURIComponent(subscriptionPlan)}&cycle=Yearly`}
            className="btn btn-brand btn-sm text-white fw-semibold text-nowrap px-3 shadow-sm"
          >
            Upgrade Plan Now
          </Link>
        </div>
      )}

      {subscriptionStatus === 'Payment Due' && (
        <div className="alert alert-info border-0 bg-info bg-opacity-15 p-3 rounded-3 mb-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2">
            <BiError size={22} className="text-info flex-shrink-0" />
            <div>
              <strong className="text-navy">Subscription Renewal Due on {nextPaymentDate}</strong>
              <div className="small text-muted">
                Your annual license cycle is ending. Settle your renewal invoice now or ensure AutoPay mandate has sufficient balance.
              </div>
            </div>
          </div>
          <Link
            href={`/owner/subscription/checkout?plan=${encodeURIComponent(subscriptionPlan)}&cycle=Yearly`}
            className="btn btn-primary btn-sm text-white fw-semibold text-nowrap px-3"
          >
            Pay Renewal
          </Link>
        </div>
      )}

      {subscriptionStatus === 'Grace Period' && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-15 p-3 rounded-3 mb-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2">
            <BiErrorCircle size={22} className="text-danger flex-shrink-0" />
            <div>
              <strong className="text-danger">Payment Overdue: 7-Day Grace Period Active ({graceDaysRemaining} Days Left)</strong>
              <div className="small text-muted">
                Payment attempt failed. Your workspace is currently operating under the courtesy grace period. Settle payment immediately to prevent your POS from entering restricted mode.
              </div>
            </div>
          </div>
          <Link
            href={`/owner/subscription/checkout?plan=${encodeURIComponent(subscriptionPlan)}&cycle=Monthly`}
            className="btn btn-danger btn-sm text-white fw-semibold text-nowrap px-3 shadow-sm"
          >
            Settle Overdue Invoice
          </Link>
        </div>
      )}

      {subscriptionStatus === 'Suspended' && (
        <div className="alert alert-dark border-0 bg-dark text-white p-3 rounded-3 mb-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2">
            <BiLockAlt size={22} className="text-brand flex-shrink-0" />
            <div>
              <strong className="text-white">Workspace in Restricted Read-Only Mode</strong>
              <div className="small text-white-50">
                Your subscription has expired and the grace period has ended. Order creation is temporarily paused. <strong>Your business data and order history are 100% safe and retained.</strong>
              </div>
            </div>
          </div>
          <Link
            href={`/owner/subscription/checkout?plan=${encodeURIComponent(subscriptionPlan)}&cycle=Yearly`}
            className="btn btn-brand btn-sm text-white fw-bold text-nowrap px-3 shadow-sm"
          >
            Pay & Restore Access
          </Link>
        </div>
      )}

      {/* Current Plan Overview Card */}
      <div className="app-card p-4 mb-4 bg-navy text-white position-relative overflow-hidden">
        <div className="row g-4 align-items-center position-relative" style={{ zIndex: 2 }}>
          <div className="col-12 col-lg-7">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className={`badge ${
                subscriptionStatus === 'Active' ? 'bg-success' :
                subscriptionStatus === 'Trial' ? 'bg-warning text-dark' :
                subscriptionStatus === 'Grace Period' ? 'bg-danger' :
                subscriptionStatus === 'Payment Due' ? 'bg-info text-dark' :
                'bg-secondary'
              } text-uppercase px-2.5 py-1`} style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                Status: {subscriptionStatus}
              </span>
              <span className="text-white-50 small">
                • {autoRenewState ? 'Auto-Renewal Enabled' : 'Auto-Renewal Disabled'}
              </span>
            </div>

            <h2 className="fw-bold text-white mb-1">{subscriptionPlan} Tier</h2>
            <p className="text-white-50 small mb-3">
              Full multi-outlet POS, cloud synchronization, inventory tracking, and priority customer support.
            </p>

            <div className="d-flex align-items-center gap-4 flex-wrap">
              <div>
                <span className="text-white-50 small d-block" style={{ fontSize: '11px' }}>Billing Frequency</span>
                <strong className="text-white">Annual (Prepaid)</strong>
              </div>
              <div className="border-start border-secondary border-opacity-50 ps-4">
                <span className="text-white-50 small d-block" style={{ fontSize: '11px' }}>Next Billing / Expiry</span>
                <strong className="text-brand">{nextPaymentDate}</strong>
              </div>
              <div className="border-start border-secondary border-opacity-50 ps-4">
                <span className="text-white-50 small d-block" style={{ fontSize: '11px' }}>Payment Channel</span>
                <strong className="text-white">UPI AutoPay / e-Mandate</strong>
              </div>
            </div>

            <div className="mt-4 pt-3 border-top border-secondary border-opacity-35 d-flex align-items-center gap-3">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="autoRenewSwitch"
                  checked={autoRenewState}
                  onChange={handleToggleAutoRenew}
                />
                <label className="form-check-label small text-white-50" htmlFor="autoRenewSwitch">
                  Auto-Debit Mandate
                </label>
              </div>

              <Link
                href={`/owner/subscription/checkout?plan=${encodeURIComponent(subscriptionPlan)}&cycle=Yearly`}
                className="btn btn-sm btn-outline-light px-3"
              >
                Change Payment Method
              </Link>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-15">
              <h6 className="fw-bold text-white small mb-3 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                Quota & Capacity Usage
              </h6>

              {/* Outlet limit */}
              <div className="mb-2.5">
                <div className="d-flex justify-content-between text-white-50 small mb-1" style={{ fontSize: '11px' }}>
                  <span>Active Outlets</span>
                  <span>{currentRestaurant.branches.length} of 5 Outlets</span>
                </div>
                <div className="progress bg-white bg-opacity-25" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-brand"
                    style={{ width: `${Math.min(100, (currentRestaurant.branches.length / 5) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Staff limit */}
              <div className="mb-2.5">
                <div className="d-flex justify-content-between text-white-50 small mb-1" style={{ fontSize: '11px' }}>
                  <span>Staff Logins</span>
                  <span>8 of 25 Allowed</span>
                </div>
                <div className="progress bg-white bg-opacity-25" style={{ height: '6px' }}>
                  <div className="progress-bar bg-info" style={{ width: '32%' }} />
                </div>
              </div>

              {/* Orders limit */}
              <div>
                <div className="d-flex justify-content-between text-white-50 small mb-1" style={{ fontSize: '11px' }}>
                  <span>Monthly Orders</span>
                  <span>2,480 of Unlimited</span>
                </div>
                <div className="progress bg-white bg-opacity-25" style={{ height: '6px' }}>
                  <div className="progress-bar bg-success" style={{ width: '22%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Switcher Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <h5 className="fw-bold text-navy mb-0">Choose the Right Tier for Your Food Business</h5>
          <p className="text-muted-custom small mb-0">
            Scale seamlessly across single outlets, multi-branch franchises, and enterprise restaurant chains
          </p>
        </div>

        {/* Monthly vs Yearly Toggle */}
        <div className="bg-surface p-1 rounded-pill border border-subtle d-flex align-items-center">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 ${
              billingCycle === 'Monthly' ? 'bg-white fw-bold shadow-sm text-navy' : 'text-muted-custom'
            }`}
            onClick={() => setBillingCycle('Monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 ${
              billingCycle === 'Yearly' ? 'bg-brand fw-bold shadow-sm text-white' : 'text-muted-custom'
            }`}
            onClick={() => setBillingCycle('Yearly')}
          >
            <span>Annual</span>
            <span className="badge bg-white text-brand rounded-pill" style={{ fontSize: '9px' }}>
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* 4 Plan Cards */}
      <div className="row g-4 mb-5">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = subscriptionPlan === plan.name;
          const price = billingCycle === 'Yearly' ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <div key={plan.id} className="col-12 col-md-6 col-xl-3">
              <div
                className={`app-card p-4 h-100 d-flex flex-column justify-content-between position-relative ${
                  plan.isPopular ? 'border-brand border-2 shadow' : ''
                }`}
              >
                {plan.isPopular && (
                  <div
                    className="position-absolute top-0 start-50 translate-middle badge bg-brand text-white px-3 py-1 rounded-pill shadow-sm"
                    style={{ fontSize: '11px', letterSpacing: '0.5px' }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold text-navy mb-0">{plan.name}</h5>
                    {isCurrent && (
                      <span className="badge badge-soft-brand rounded-pill">Current Plan</span>
                    )}
                  </div>

                  <div className="my-3">
                    <span className="fs-3 fw-bold text-navy" suppressHydrationWarning>₹{formatNumber(price)}</span>
                    <span className="text-muted-custom small">
                      {billingCycle === 'Yearly' ? ' / yr + GST' : ' / mo + GST'}
                    </span>
                  </div>

                  <div className="p-2 bg-surface rounded-2 border border-subtle mb-3 small text-muted-custom">
                    <strong>Capacity:</strong> Up to {plan.maxBranches} Outlets • {plan.maxStaff} Staff
                  </div>

                  <ul className="list-unstyled d-flex flex-column gap-2 mb-4 small">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="d-flex align-items-start gap-2 text-navy">
                        <BiCheck className="text-brand flex-shrink-0 mt-0.5" size={18} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    type="button"
                    className={`btn w-100 btn-sm ${isCurrent ? 'btn-outline-brand' : plan.isPopular ? 'btn-brand text-white shadow-sm' : 'btn-outline-secondary'}`}
                    onClick={() => handleCheckoutPlan(plan.name)}
                  >
                    {isCurrent ? 'Renew Current Plan' : `Switch to ${plan.name}`}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Billing & Tax Invoices History */}
      <div className="app-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold text-navy mb-0">Billing & GST Tax Invoice Receipts</h5>
            <p className="text-muted-custom small mb-0">
              Download GST compliant B2B tax receipts with SAC code 998313 for monthly input credit filing
            </p>
          </div>
          <span className="badge badge-soft-success px-3 py-1.5 rounded-pill small">
            GSTR-2B Ready
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-surface border-bottom border-subtle">
              <tr>
                <th className="text-muted-custom small py-3 ps-3">INVOICE NUMBER</th>
                <th className="text-muted-custom small py-3">BILLING PERIOD</th>
                <th className="text-muted-custom small py-3">TIER & CYCLE</th>
                <th className="text-muted-custom small py-3 text-end">AMOUNT (INC. GST)</th>
                <th className="text-muted-custom small py-3 text-center">STATUS</th>
                <th className="text-muted-custom small py-3 text-end pe-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((b) => (
                <tr key={b.id}>
                  <td className="ps-3 font-monospace small fw-bold text-navy">{b.invoiceNumber}</td>
                  <td>
                    <div className="text-navy small">{b.period}</div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      Billed on {b.date} via {b.paymentMethod}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-soft-brand me-1">{b.plan}</span>
                    <span className="badge bg-light text-navy border" style={{ fontSize: '10px' }}>
                      {b.cycle}
                    </span>
                  </td>
                  <td className="text-end fw-bold text-navy" suppressHydrationWarning>
                    ₹{formatNumber(b.amount)}
                  </td>
                  <td className="text-center">
                    <span className="badge bg-success text-white rounded-pill">{b.status}</span>
                  </td>
                  <td className="text-end pe-3">
                    <button
                      type="button"
                      className="btn btn-outline-brand btn-sm py-1 px-2.5 d-inline-flex align-items-center gap-1"
                      onClick={() => handleViewInvoice(b)}
                    >
                      <BiReceipt size={15} /> View Tax Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GST INVOICE MODAL */}
      {showInvoiceModal && selectedInvoice && (
        <div 
          className="modal fade show d-block" 
          tabIndex={-1} 
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1070 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="modal-header bg-navy text-white py-3 px-4">
                <h5 className="modal-title fw-bold">Tax Invoice Receipt (B2B)</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowInvoiceModal(false)}
                />
              </div>

              <div className="modal-body p-4 p-md-5 bg-white text-navy">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="bg-brand text-white fw-bold px-2 py-1 rounded" style={{ fontSize: '16px' }}>
                        Z
                      </div>
                      <span className="fw-bold fs-5 text-navy">ZESTORA SAAS TECHNOLOGIES PVT LTD</span>
                    </div>
                    <p className="small text-muted mb-0">
                      Level 4, Prestige Tech Park, Marathahalli Outer Ring Road
                      <br />
                      Bengaluru, Karnataka - 560103
                      <br />
                      <strong>GSTIN:</strong> 29AAECP1234K1ZV • <strong>PAN:</strong> AAECP1234K
                    </p>
                  </div>

                  <div className="text-end">
                    <span className="badge bg-brand text-white px-3 py-1 text-uppercase mb-2">TAX INVOICE</span>
                    <h5 className="fw-bold text-navy mb-0 font-monospace">{selectedInvoice.invoiceNumber}</h5>
                    <span className="small text-muted">Billed Date: {selectedInvoice.date}</span>
                  </div>
                </div>

                {/* Billed To */}
                <div className="row g-3 mb-4 small">
                  <div className="col-6">
                    <strong className="text-muted d-block" style={{ fontSize: '11px' }}>BILLED TO:</strong>
                    <div className="fw-bold text-navy fs-6">{currentRestaurant.name}</div>
                    <div>{currentRestaurant.address || '100 Feet Road, Indiranagar'}</div>
                    <div>{currentRestaurant.city || 'Bengaluru'}, {currentRestaurant.state || 'Karnataka'}</div>
                    <div><strong>Customer GSTIN:</strong> {currentRestaurant.gstin || '29ABCDE1234F1Z5'}</div>
                  </div>

                  <div className="col-6 text-end">
                    <strong className="text-muted d-block" style={{ fontSize: '11px' }}>PAYMENT STATUS:</strong>
                    <div>Status: <span className="badge bg-success">PAID</span></div>
                    <div>Payment Method: {selectedInvoice.paymentMethod}</div>
                    <div>SAC Code: <span className="font-monospace">{selectedInvoice.sacCode}</span></div>
                    <div>Place of Supply: Karnataka (29)</div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="table-responsive mb-4">
                  <table className="table table-bordered align-middle small">
                    <thead className="bg-surface">
                      <tr>
                        <th>#</th>
                        <th>SERVICE DESCRIPTION</th>
                        <th>SAC</th>
                        <th className="text-center">CYCLE</th>
                        <th className="text-end">TAXABLE VALUE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>
                          <strong>Zestora SaaS Platform Subscription – {selectedInvoice.plan} Tier</strong>
                          <div className="text-muted" style={{ fontSize: '11px' }}>
                            Full access to cloud billing POS, digital menu, KDS sync, multi-branch control & recipe engine
                          </div>
                        </td>
                        <td className="font-monospace">{selectedInvoice.sacCode}</td>
                        <td className="text-center">{selectedInvoice.cycle}</td>
                        <td className="text-end fw-bold" suppressHydrationWarning>₹{formatNumber(selectedInvoice.taxableAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="row justify-content-end mb-4">
                  <div className="col-12 col-md-6">
                    <div className="d-flex flex-column gap-1 small">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Taxable Value:</span>
                        <strong suppressHydrationWarning>₹{formatNumber(selectedInvoice.taxableAmount)}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">CGST @ 9%:</span>
                        <span suppressHydrationWarning>₹{formatNumber(selectedInvoice.gstAmount / 2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">SGST @ 9%:</span>
                        <span suppressHydrationWarning>₹{formatNumber(selectedInvoice.gstAmount / 2)}</span>
                      </div>
                      <div className="d-flex justify-content-between border-top pt-2 fs-6">
                        <strong className="text-navy">Total Invoice Amount:</strong>
                        <strong className="text-brand fs-5" suppressHydrationWarning>₹{formatNumber(selectedInvoice.amount)}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Declaration */}
                <div className="p-3 bg-light rounded-3 border small text-muted" style={{ fontSize: '11px' }}>
                  This is a computer-generated tax invoice and requires no physical signature under Rule 46 of the CGST Rules, 2017. All software subscription services are subject to standard SaaS Terms of Service.
                </div>
              </div>

              <div className="modal-footer bg-surface py-3 px-4 d-flex justify-content-between">
                <span className="small text-muted">
                  Official GST Registered Invoice (SAC 998313)
                </span>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                    onClick={() => window.print()}
                  >
                    <BiPrinter size={16} />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-brand btn-sm text-white d-flex align-items-center gap-1 shadow-sm"
                    onClick={() => setShowInvoiceModal(false)}
                  >
                    <BiCheckCircle size={16} />
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
