'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { SUBSCRIPTION_PLANS } from '@/data/subscriptionData';
import { formatNumber } from '@/utils/formatters';
import { 
  BiCheckCircle, 
  BiCheckShield, 
  BiCreditCard, 
  BiQrScan, 
  BiBuilding, 
  BiReceipt, 
  BiRightArrowAlt, 
  BiLeftArrowAlt, 
  BiCheck, 
  BiXCircle, 
  BiRefresh, 
  BiDownload, 
  BiPrinter, 
  BiTag,
  BiLockAlt,
  BiMobileAlt
} from 'react-icons/bi';
import { SiGooglepay, SiPhonepe, SiPaytm } from 'react-icons/si';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') || 'Professional';
  const initialCycle = searchParams.get('cycle') === 'Monthly' ? 'Monthly' : 'Yearly';

  const { currentRestaurant, activateSubscription } = useAuth();

  const [selectedPlanName, setSelectedPlanName] = useState<string>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>(initialCycle);
  const [paymentMethodTab, setPaymentMethodTab] = useState<'upi' | 'card' | 'netbanking' | 'autopay'>('upi');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  // GST State
  const [claimGst, setClaimGst] = useState(true);
  const [gstin, setGstin] = useState(currentRestaurant.gstin || '29ABCDE1234F1Z5');
  const [companyName, setCompanyName] = useState(currentRestaurant.name || 'Food Business Pvt Ltd');

  // Card Form
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardHolder, setCardHolder] = useState(currentRestaurant.ownerName || 'Vikram Singhania');
  const [enableCardMandate, setEnableCardMandate] = useState(true);

  // UPI Form
  const [upiId, setUpiId] = useState('owner@okhdfcbank');
  const [enableUpiMandate, setEnableUpiMandate] = useState(true);

  // Netbanking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // AutoPay e-NACH Form
  const [accountNumber, setAccountNumber] = useState('50100239481230');
  const [ifscCode, setIfscCode] = useState('HDFC0000123');
  const [accountHolder, setAccountHolder] = useState(currentRestaurant.ownerName || 'Vikram Singhania');

  // Simulation & Modal States
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'success' | 'failed'>('idle');
  const [completedTxn, setCompletedTxn] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.name === selectedPlanName) || SUBSCRIPTION_PLANS[1];

  // Pricing calculations
  const basePrice = billingCycle === 'Yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const taxableAmount = Math.max(0, basePrice - couponDiscount);
  const gstRate = 0.18; // 18% GST (9% CGST + 9% SGST)
  const gstAmount = Number((taxableAmount * gstRate).toFixed(2));
  const totalAmount = Number((taxableAmount + gstAmount).toFixed(2));

  // Coupon handling
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'GROWTH50') {
      setAppliedCoupon({ code, discount: 500, label: '₹500 Flat Festive Discount' });
    } else if (code === 'STARTUPFREE') {
      const disc = Math.round(basePrice * 0.20);
      setAppliedCoupon({ code, discount: disc, label: '20% Startup Launch Concession' });
    } else if (code === 'FESTIVE20') {
      setAppliedCoupon({ code, discount: 1000, label: '₹1,000 Seasonal Discount' });
    } else if (code === 'WELCOME50') {
      const disc = Math.round(basePrice * 0.50);
      setAppliedCoupon({ code, discount: disc, label: '50% First-Time Founder Voucher' });
    } else {
      setCouponError('Invalid coupon code. Try GROWTH50 or STARTUPFREE');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleInitiatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowGatewayModal(true);
    }, 600);
  };

  const handleSimulateGatewaySuccess = () => {
    setShowGatewayModal(false);
    setIsProcessing(true);

    setTimeout(() => {
      const txnId = `PAY-${Date.now().toString().slice(-8)}`;
      const orderId = `order_Rz${Math.floor(100000 + Math.random() * 900000)}`;

      const txnData = {
        txnId,
        orderId,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        plan: selectedPlan.name,
        cycle: billingCycle,
        method: paymentMethodTab === 'upi' ? `UPI AutoPay (${upiId})` : paymentMethodTab === 'card' ? `Credit Card (ending ${cardNumber.slice(-4)})` : paymentMethodTab === 'netbanking' ? `${selectedBank} NetBanking` : `e-NACH Mandate (${selectedBank})`,
        basePrice,
        discount: couponDiscount,
        taxableAmount,
        gstAmount,
        totalAmount,
        gstin: claimGst ? gstin : 'N/A (Consumer)',
        companyName,
      };

      setCompletedTxn(txnData);
      setPaymentState('success');
      setIsProcessing(false);

      // Activate subscription in SaaS Context & LocalStorage
      activateSubscription(
        selectedPlan.name as any,
        billingCycle,
        txnData.method,
        totalAmount
      );
    }, 1000);
  };

  const handleSimulateGatewayFailure = () => {
    setShowGatewayModal(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentState('failed');
    }, 800);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'accountant']}>
      {/* SUCCESS CONFIRMATION VIEW */}
      {paymentState === 'success' && completedTxn && (
        <div className="py-4">
          <div className="app-card p-4 p-md-5 bg-white shadow-lg rounded-4 text-center max-w-700 mx-auto">
            <div className="mx-auto bg-success bg-opacity-10 text-success p-3 rounded-circle mb-3 d-inline-flex">
              <BiCheckCircle size={54} />
            </div>

            <span className="badge bg-success text-white px-3 py-1.5 rounded-pill small mb-2">
              Subscription Active & Verified
            </span>
            <h3 className="fw-bold text-navy mb-1">Payment Successful!</h3>
            <p className="text-muted-custom small mb-4">
              Your restaurant workspace has been upgraded to <strong>{completedTxn.plan} Tier</strong> ({completedTxn.cycle}).
            </p>

            {/* Receipt Summary Box */}
            <div className="p-4 bg-surface rounded-3 border text-start mb-4">
              <div className="row g-3 small">
                <div className="col-12 col-md-6">
                  <span className="text-muted d-block" style={{ fontSize: '11px' }}>TRANSACTION ID</span>
                  <strong className="text-navy font-monospace">{completedTxn.txnId}</strong>
                </div>
                <div className="col-12 col-md-6">
                  <span className="text-muted d-block" style={{ fontSize: '11px' }}>GATEWAY ORDER ID</span>
                  <strong className="text-navy font-monospace">{completedTxn.orderId}</strong>
                </div>
                <div className="col-12 col-md-6">
                  <span className="text-muted d-block" style={{ fontSize: '11px' }}>PAYMENT METHOD</span>
                  <span className="text-navy fw-medium">{completedTxn.method}</span>
                </div>
                <div className="col-12 col-md-6">
                  <span className="text-muted d-block" style={{ fontSize: '11px' }}>PAYMENT DATE & TIME</span>
                  <span className="text-navy">{completedTxn.date}</span>
                </div>
                <div className="col-12 border-top pt-2 d-flex justify-content-between align-items-center">
                  <span className="text-navy fw-semibold">Total Paid (incl. 18% GST):</span>
                  <span className="fs-5 fw-bold text-brand" suppressHydrationWarning>₹{formatNumber(completedTxn.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
              <button
                type="button"
                className="btn btn-outline-brand d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowInvoiceModal(true)}
              >
                <BiReceipt size={18} />
                <span>View GST Tax Invoice</span>
              </button>
              <Link
                href="/owner/dashboard"
                className="btn btn-brand text-white d-flex align-items-center justify-content-center gap-2 shadow-sm"
              >
                <span>Go to Business Dashboard</span>
                <BiRightArrowAlt size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* FAILED PAYMENT VIEW */}
      {paymentState === 'failed' && (
        <div className="py-4">
          <div className="app-card p-4 p-md-5 bg-white shadow-lg rounded-4 text-center max-w-700 mx-auto">
            <div className="mx-auto bg-danger bg-opacity-10 text-danger p-3 rounded-circle mb-3 d-inline-flex">
              <BiXCircle size={54} />
            </div>

            <span className="badge bg-danger text-white px-3 py-1.5 rounded-pill small mb-2">
              Payment Not Completed
            </span>
            <h3 className="fw-bold text-navy mb-1">Transaction Failed</h3>
            <p className="text-muted-custom small mb-4">
              The issuing bank or UPI application rejected the mandate authorization or timed out.
              <br />
              <strong>Error Code:</strong> <span className="font-monospace text-danger">GATEWAY_ERR_3DS_TIMEOUT</span>
            </p>

            <div className="alert alert-warning text-start small mb-4">
              <strong>Common reasons for failure:</strong>
              <ul className="mb-0 mt-1 ps-3">
                <li>Bank UPI server didn&apos;t respond within 5 minutes</li>
                <li>Card international/online e-mandate limit not enabled on netbanking</li>
                <li>Incorrect OTP or 3D Secure session expired</li>
              </ul>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
              <button
                type="button"
                className="btn btn-brand text-white d-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={() => setPaymentState('idle')}
              >
                <BiRefresh size={18} />
                <span>Retry Payment</span>
              </button>
              <Link
                href="/owner/subscription"
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
              >
                <span>Back to Plans</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT WIZARD VIEW */}
      {paymentState === 'idle' && (
        <>
          {/* Header */}
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <Link href="/owner/subscription" className="btn btn-sm btn-outline-secondary py-1 px-2.5 d-inline-flex align-items-center gap-1">
                  <BiLeftArrowAlt size={16} /> Back
                </Link>
                <h4 className="fw-bold text-navy mb-0">Secure SaaS Checkout</h4>
              </div>
              <p className="text-muted-custom small mb-0">
                Upgrade or renew your multi-tenant Zestora restaurant operating system license
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill small d-flex align-items-center gap-1">
                <BiCheckShield size={18} />
                <span>256-Bit Bank Grade SSL Encrypted</span>
              </span>
            </div>
          </div>

          <div className="row g-4">
            {/* Left Column: Plan Selection & Payment Method */}
            <div className="col-12 col-lg-8">
              {/* STEP 1: Select Plan & Cycle */}
              <div className="app-card p-3 p-sm-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold text-navy mb-0 text-uppercase small" style={{ letterSpacing: '0.5px' }}>
                    1. Select Subscription Tier & Billing Cycle
                  </h6>
                  {/* Cycle Switcher */}
                  <div className="bg-surface p-1 rounded-pill border border-subtle d-inline-flex align-items-center">
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 ${billingCycle === 'Monthly' ? 'bg-white fw-bold shadow-sm text-navy' : 'text-muted-custom'}`}
                      onClick={() => setBillingCycle('Monthly')}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 ${billingCycle === 'Yearly' ? 'bg-brand fw-bold shadow-sm text-white' : 'text-muted-custom'}`}
                      onClick={() => setBillingCycle('Yearly')}
                    >
                      <span>Annual</span>
                      <span className="badge bg-white text-brand rounded-pill" style={{ fontSize: '9px' }}>Save 20%</span>
                    </button>
                  </div>
                </div>

                {/* Plan Options Grid */}
                <div className="row g-3">
                  {SUBSCRIPTION_PLANS.map((plan) => {
                    const isSelected = selectedPlanName === plan.name;
                    const price = billingCycle === 'Yearly' ? plan.yearlyPrice : plan.monthlyPrice;

                    return (
                      <div key={plan.id} className="col-12 col-sm-6 col-xl-3">
                        <div
                          className={`p-3 rounded-3 border h-100 cursor-pointer transition-all d-flex flex-column justify-content-between ${
                            isSelected 
                              ? 'border-brand bg-brand bg-opacity-10 shadow-sm' 
                              : 'border-subtle bg-white hover-shadow'
                          }`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedPlanName(plan.name)}
                        >
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="fw-bold text-navy">{plan.name}</span>
                              {plan.isPopular && (
                                <span className="badge bg-brand text-white rounded-pill" style={{ fontSize: '9px' }}>Popular</span>
                              )}
                            </div>
                            <div className="fs-5 fw-bold text-navy" suppressHydrationWarning>₹{formatNumber(price)}</div>
                            <span className="text-muted d-block" style={{ fontSize: '11px' }}>
                              {billingCycle === 'Yearly' ? 'per year' : 'per month'}
                            </span>
                          </div>
                          <div className="pt-2 mt-2 border-top">
                            <span className={`badge w-100 py-1 ${isSelected ? 'bg-brand text-white' : 'bg-light text-navy'}`} style={{ fontSize: '10px' }}>
                              {isSelected ? '✓ Selected' : 'Choose Plan'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: GST & Business Billing Details */}
              <div className="app-card p-3 p-sm-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold text-navy mb-0 text-uppercase small" style={{ letterSpacing: '0.5px' }}>
                    2. Business & GST Invoicing Details
                  </h6>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="claimGstSwitch"
                      checked={claimGst}
                      onChange={(e) => setClaimGst(e.target.checked)}
                    />
                    <label className="form-check-label small fw-semibold text-navy" htmlFor="claimGstSwitch">
                      Claim GST Input Tax Credit
                    </label>
                  </div>
                </div>

                {claimGst ? (
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Business / Entity Legal Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm border-subtle"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Blue Tokai Hospitality Pvt Ltd"
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">GSTIN (15 Digits)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm border-subtle font-monospace text-uppercase"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="29ABCDE1234F1Z5"
                      />
                    </div>
                    <div className="col-12">
                      <span className="small text-muted" style={{ fontSize: '11px' }}>
                        ✓ SAC Code: <strong>998313</strong> (Information Technology & SaaS Software Hosting Services). B2B Tax invoice will be generated with valid QR code for GSTR-2B ITC claim.
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="small text-muted mb-0">
                    Proceeding as unregistered retail consumer. A standard B2C receipt will be issued.
                  </p>
                )}
              </div>

              {/* STEP 3: Payment Method Tabs */}
              <div className="app-card p-3 p-sm-4">
                <h6 className="fw-bold text-navy mb-3 text-uppercase small" style={{ letterSpacing: '0.5px' }}>
                  3. Select Payment Gateway Mode
                </h6>

                {/* Tabs */}
                <ul className="nav nav-pills nav-fill flex-column flex-sm-row gap-2 bg-surface p-1.5 rounded-3 mb-4 border">
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link py-2 small fw-semibold d-flex align-items-center justify-content-center gap-1.5 ${
                        paymentMethodTab === 'upi' ? 'active bg-brand text-white shadow-sm' : 'text-navy'
                      }`}
                      onClick={() => setPaymentMethodTab('upi')}
                    >
                      <BiQrScan size={18} />
                      <span>UPI / QR</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link py-2 small fw-semibold d-flex align-items-center justify-content-center gap-1.5 ${
                        paymentMethodTab === 'card' ? 'active bg-brand text-white shadow-sm' : 'text-navy'
                      }`}
                      onClick={() => setPaymentMethodTab('card')}
                    >
                      <BiCreditCard size={18} />
                      <span>Credit / Debit Card</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link py-2 small fw-semibold d-flex align-items-center justify-content-center gap-1.5 ${
                        paymentMethodTab === 'netbanking' ? 'active bg-brand text-white shadow-sm' : 'text-navy'
                      }`}
                      onClick={() => setPaymentMethodTab('netbanking')}
                    >
                      <BiBuilding size={18} />
                      <span>Net Banking</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link py-2 small fw-semibold d-flex align-items-center justify-content-center gap-1.5 ${
                        paymentMethodTab === 'autopay' ? 'active bg-brand text-white shadow-sm' : 'text-navy'
                      }`}
                      onClick={() => setPaymentMethodTab('autopay')}
                    >
                      <BiRefresh size={18} />
                      <span>Recurring AutoPay</span>
                    </button>
                  </li>
                </ul>

                {/* TAB 1: UPI */}
                {paymentMethodTab === 'upi' && (
                  <div>
                    <div className="row g-4 align-items-center">
                      <div className="col-12 col-md-5 text-center border-end-md">
                        <div className="p-3 bg-white border rounded-3 d-inline-block shadow-sm mb-2">
                          {/* SVG QR Code Simulation */}
                          <div 
                            className="bg-navy p-3 text-white rounded d-flex flex-column align-items-center justify-content-center mx-auto" 
                            style={{ width: '150px', height: '150px' }}
                          >
                            <BiQrScan size={90} className="text-brand" />
                            <span className="small text-white-50" style={{ fontSize: '9px' }}>SCAN WITH ANY UPI APP</span>
                          </div>
                        </div>
                        <div className="d-flex justify-content-center gap-3 text-muted">
                          <SiGooglepay size={24} title="Google Pay" />
                          <SiPhonepe size={24} title="PhonePe" />
                          <SiPaytm size={24} title="Paytm" />
                        </div>
                      </div>

                      <div className="col-12 col-md-7">
                        <label className="form-label small fw-semibold text-navy">Or Pay via UPI VPA / ID</label>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control border-subtle"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@okhdfcbank"
                          />
                          <button type="button" className="btn btn-outline-brand fw-semibold">
                            Verify
                          </button>
                        </div>

                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="upiMandate"
                            checked={enableUpiMandate}
                            onChange={(e) => setEnableUpiMandate(e.target.checked)}
                          />
                          <label className="form-check-label small text-navy" htmlFor="upiMandate">
                            Set up <strong>UPI AutoPay</strong> for seamless automatic renewals (Cancel anytime in 1-click)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CREDIT / DEBIT CARD */}
                {paymentMethodTab === 'card' && (
                  <div>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold text-navy">Card Number</label>
                        <div className="input-group">
                          <span className="input-group-text bg-surface border-subtle"><BiCreditCard size={18} /></span>
                          <input
                            type="text"
                            className="form-control border-subtle font-monospace"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 •••• •••• 4242"
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <label className="form-label small fw-semibold text-navy">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          className="form-control border-subtle font-monospace"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08/29"
                        />
                      </div>

                      <div className="col-6">
                        <label className="form-label small fw-semibold text-navy">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          className="form-control border-subtle font-monospace"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold text-navy">Cardholder Full Name</label>
                        <input
                          type="text"
                          className="form-control border-subtle"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                        />
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="cardMandate"
                            checked={enableCardMandate}
                            onChange={(e) => setEnableCardMandate(e.target.checked)}
                          />
                          <label className="form-check-label small text-navy" htmlFor="cardMandate">
                            Authorize automatic recurring debit via RBI Compliant e-Mandate
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: NET BANKING */}
                {paymentMethodTab === 'netbanking' && (
                  <div>
                    <label className="form-label small fw-semibold text-navy mb-2">Select Your Bank</label>
                    <div className="row g-2 mb-3">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra'].map((b) => (
                        <div key={b} className="col-6 col-sm-4">
                          <button
                            type="button"
                            className={`btn btn-sm w-100 py-2 border text-start d-flex align-items-center justify-content-between ${
                              selectedBank === b ? 'border-brand bg-brand bg-opacity-10 fw-bold text-navy' : 'bg-surface text-navy'
                            }`}
                            onClick={() => setSelectedBank(b)}
                          >
                            <span>{b}</span>
                            {selectedBank === b && <BiCheck className="text-brand" size={18} />}
                          </button>
                        </div>
                      ))}
                    </div>

                    <select
                      className="form-select border-subtle small"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Canara Bank">Canara Bank</option>
                      <option value="IndusInd Bank">IndusInd Bank</option>
                      <option value="Yes Bank">Yes Bank</option>
                    </select>
                  </div>
                )}

                {/* TAB 4: AUTOPAY e-NACH */}
                {paymentMethodTab === 'autopay' && (
                  <div>
                    <div className="p-3 bg-light rounded-3 border mb-3 small">
                      <strong className="text-navy d-block mb-1">e-NACH Standing Instruction Mandate</strong>
                      <span className="text-muted">
                        Authorizes your bank account for automated license billing at renewal intervals. An OTP mandate authentication will be triggered via NPCI DigiLocker.
                      </span>
                    </div>

                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold text-navy">Account Number</label>
                        <input
                          type="text"
                          className="form-control border-subtle font-monospace"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold text-navy">IFSC Code</label>
                        <input
                          type="text"
                          className="form-control border-subtle font-monospace text-uppercase"
                          value={ifscCode}
                          onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-semibold text-navy">Account Holder Name</label>
                        <input
                          type="text"
                          className="form-control border-subtle"
                          value={accountHolder}
                          onChange={(e) => setAccountHolder(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout Trigger */}
            <div className="col-12 col-lg-4">
              <div className="app-card p-4 sticky-top" style={{ top: '90px' }}>
                <h5 className="fw-bold text-navy mb-3">Order Summary</h5>

                <div className="p-3 bg-surface rounded-3 border mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-navy">{selectedPlan.name} Plan</strong>
                    <span className="badge badge-soft-brand">{billingCycle}</span>
                  </div>
                  <p className="small text-muted mb-0" style={{ fontSize: '11px' }}>
                    {selectedPlan.recommendedFor}
                  </p>
                </div>

                {/* Coupon Code Section */}
                <div className="mb-3">
                  {appliedCoupon ? (
                    <div className="p-2.5 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 d-flex align-items-center justify-content-between">
                      <div>
                        <span className="badge bg-success text-white me-1.5">{appliedCoupon.code}</span>
                        <span className="small text-success fw-medium">Save ₹{appliedCoupon.discount}</span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-danger p-0 text-decoration-none small"
                        onClick={handleRemoveCoupon}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon}>
                      <label className="form-label small fw-semibold text-navy">Have a Promo Coupon?</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-subtle"><BiTag size={16} /></span>
                        <input
                          type="text"
                          className="form-control form-control-sm border-subtle font-monospace text-uppercase"
                          placeholder="e.g. GROWTH50"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button type="submit" className="btn btn-sm btn-outline-brand fw-semibold">
                          Apply
                        </button>
                      </div>
                      {couponError && <div className="text-danger small mt-1" style={{ fontSize: '11px' }}>{couponError}</div>}
                    </form>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="d-flex flex-column gap-2 border-top pt-3 mb-3 small">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted-custom">Base Subscription Fee:</span>
                    <strong className="text-navy" suppressHydrationWarning>₹{formatNumber(basePrice)}</strong>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="d-flex justify-content-between text-success">
                      <span>Coupon Discount:</span>
                      <strong suppressHydrationWarning>-₹{formatNumber(couponDiscount)}</strong>
                    </div>
                  )}

                  <div className="d-flex justify-content-between">
                    <span className="text-muted-custom">Taxable Base Amount:</span>
                    <span className="text-navy" suppressHydrationWarning>₹{formatNumber(taxableAmount)}</span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span className="text-muted-custom">18% GST (CGST 9% + SGST 9%):</span>
                    <span className="text-navy" suppressHydrationWarning>₹{formatNumber(gstAmount)}</span>
                  </div>

                  <div className="d-flex justify-content-between border-top pt-2 fs-6">
                    <span className="fw-bold text-navy">Total Amount Payable:</span>
                    <strong className="text-brand fs-5" suppressHydrationWarning>₹{formatNumber(totalAmount)}</strong>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  type="button"
                  className="btn btn-brand w-100 py-2.5 fw-bold text-white shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
                  onClick={handleInitiatePayment}
                  disabled={isProcessing}
                >
                  <BiLockAlt size={18} />
                  <span>
                    {isProcessing ? 'Connecting Gateway...' : `Pay ₹${formatNumber(totalAmount)} & Activate`}
                  </span>
                </button>

                <div className="text-center">
                  <span className="small text-muted d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '11px' }}>
                    <BiCheckShield size={14} className="text-success" />
                    Powered by Razorpay & Cashfree India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* RAZORPAY / CASHFREE GATEWAY SIMULATION MODAL */}
      {showGatewayModal && (
        <div 
          className="modal fade show d-block" 
          tabIndex={-1} 
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
            <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
              {/* Gateway Top Navy Brand Header */}
              <div className="bg-navy p-3 text-white d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-brand text-white fw-bold px-2 py-0.5 rounded" style={{ fontSize: '13px' }}>
                    Z
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Zestora SaaS Checkout</h6>
                    <span className="small text-white-50" style={{ fontSize: '10px' }}>ORDER ID: order_Rz98124018</span>
                  </div>
                </div>
                <div className="text-end">
                  <div className="small text-white-50" style={{ fontSize: '10px' }}>PAYABLE AMOUNT</div>
                  <strong className="text-brand fs-6" suppressHydrationWarning>₹{formatNumber(totalAmount)}</strong>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 bg-white text-center">
                <div className="spinner-grow text-primary mb-3" role="status" style={{ width: '40px', height: '40px' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h6 className="fw-bold text-navy mb-1">Awaiting Authorization</h6>
                <p className="small text-muted mb-4">
                  Simulating production payment gateway redirect with 3D Secure e-mandate registration.
                </p>

                <div className="p-3 bg-light rounded-3 border mb-4 text-start small">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Tenant:</span>
                    <strong className="text-navy">{currentRestaurant.name}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Selected Tier:</span>
                    <strong className="text-navy">{selectedPlan.name} ({billingCycle})</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Payment Channel:</span>
                    <span className="text-navy fw-medium">{paymentMethodTab.toUpperCase()}</span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2">
                  <button
                    type="button"
                    className="btn btn-success py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    onClick={handleSimulateGatewaySuccess}
                  >
                    <BiCheckCircle size={18} />
                    <span>Simulate Payment SUCCESS</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    onClick={handleSimulateGatewayFailure}
                  >
                    <BiXCircle size={18} />
                    <span>Simulate Payment FAILURE</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-link text-muted btn-sm text-decoration-none mt-1"
                    onClick={() => setShowGatewayModal(false)}
                  >
                    Cancel Transaction
                  </button>
                </div>
              </div>

              <div className="py-2 bg-surface text-center border-top">
                <span className="small text-muted" style={{ fontSize: '10px' }}>
                  🔒 PCI-DSS Compliant 256-Bit Gateway Sandbox
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GST TAX INVOICE MODAL */}
      {showInvoiceModal && completedTxn && (
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

              <div className="modal-body p-4 p-md-5 bg-white text-navy" id="printable-invoice">
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
                    <h5 className="fw-bold text-navy mb-0 font-monospace">INV-SAAS-{completedTxn.txnId}</h5>
                    <span className="small text-muted">Date: {completedTxn.date}</span>
                  </div>
                </div>

                {/* Billed To */}
                <div className="row g-3 mb-4 small">
                  <div className="col-6">
                    <strong className="text-muted d-block" style={{ fontSize: '11px' }}>BILLED TO:</strong>
                    <div className="fw-bold text-navy fs-6">{completedTxn.companyName}</div>
                    <div>{currentRestaurant.address || '100 Feet Road, Indiranagar'}</div>
                    <div>{currentRestaurant.city || 'Bengaluru'}, {currentRestaurant.state || 'Karnataka'}</div>
                    <div><strong>Customer GSTIN:</strong> {completedTxn.gstin}</div>
                  </div>

                  <div className="col-6 text-end">
                    <strong className="text-muted d-block" style={{ fontSize: '11px' }}>PAYMENT DETAILS:</strong>
                    <div>Status: <span className="badge bg-success">PAID</span></div>
                    <div>Gateway Order: <span className="font-monospace">{completedTxn.orderId}</span></div>
                    <div>Method: {completedTxn.method}</div>
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
                          <strong>Zestora SaaS Platform Subscription – {completedTxn.plan} Tier</strong>
                          <div className="text-muted" style={{ fontSize: '11px' }}>
                            Cloud POS billing, KDS sync, multi-branch control & recipe studio
                          </div>
                        </td>
                        <td className="font-monospace">998313</td>
                        <td className="text-center">{completedTxn.cycle}</td>
                        <td className="text-end fw-bold" suppressHydrationWarning>₹{formatNumber(completedTxn.taxableAmount)}</td>
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
                        <strong suppressHydrationWarning>₹{formatNumber(completedTxn.taxableAmount)}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">CGST @ 9%:</span>
                        <span suppressHydrationWarning>₹{formatNumber(completedTxn.gstAmount / 2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">SGST @ 9%:</span>
                        <span suppressHydrationWarning>₹{formatNumber(completedTxn.gstAmount / 2)}</span>
                      </div>
                      <div className="d-flex justify-content-between border-top pt-2 fs-6">
                        <strong className="text-navy">Total Invoice Amount:</strong>
                        <strong className="text-brand fs-5" suppressHydrationWarning>₹{formatNumber(completedTxn.totalAmount)}</strong>
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
                    <span>Close Receipt</span>
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-5 text-center">Loading checkout system...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
