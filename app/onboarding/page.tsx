'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BusinessType, BusinessFeatures } from '@/types/restaurant';
import { BUSINESS_TYPES_META, getDefaultFeaturesForBusinessType } from '@/data/businessTypesData';
import { 
  BiUser, 
  BiStore, 
  BiLayer, 
  BiBuilding, 
  BiReceipt, 
  BiDish, 
  BiCreditCard, 
  BiShieldQuarter, 
  BiCheck, 
  BiRightArrowAlt, 
  BiLeftArrowAlt,
  BiSave,
  BiCheckCircle,
  BiDetail,
  BiTime,
  BiGroup
} from 'react-icons/bi';
import { MdTableRestaurant, MdOutlineCleaningServices } from 'react-icons/md';
import { TbToolsKitchen2 } from 'react-icons/tb';

const STEPS = [
  { id: 1, label: 'Owner Info', icon: BiUser },
  { id: 2, label: 'Business Profile', icon: BiStore },
  { id: 3, label: 'Type & Format', icon: BiLayer },
  { id: 4, label: 'Branches', icon: BiBuilding },
  { id: 5, label: 'Order Channels', icon: BiReceipt },
  { id: 6, label: 'Menu Catalog', icon: BiDish },
  { id: 7, label: 'Table Layout', icon: MdTableRestaurant },
  { id: 8, label: 'Billing & Tax', icon: BiReceipt },
  { id: 9, label: 'Payment Modes', icon: BiCreditCard },
  { id: 10, label: 'Kitchen & KOT', icon: TbToolsKitchen2 },
  { id: 11, label: 'Staff Roster', icon: BiGroup },
  { id: 12, label: 'SaaS Plan', icon: BiShieldQuarter },
  { id: 13, label: 'Review & Launch', icon: BiCheckCircle },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { registerBusiness, saveOnboardingDraft, getOnboardingDraft, clearOnboardingDraft } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [saveDraftAlert, setSaveDraftAlert] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    // Step 1: Owner Info
    ownerName: 'Vikram Singhania',
    ownerEmail: 'vikram.singhania@foodpalace.com',
    ownerPhone: '+91 98765 43210',
    ownerRoleTitle: 'Founder & CEO',

    // Step 2: Business Profile
    businessName: 'The Artisan Cafe & Bakery',
    tagline: 'Freshly Baked Pastries & Handcrafted Cold Brews',
    businessDescription: 'Contemporary artisan cafe with indoor lounge seating and online takeaway pickup.',
    businessAddress: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pincode: '560038',
    openingHours: '08:00 AM - 11:00 PM',

    // Step 3: Type & Format
    businessType: 'Cafe / Coffee Shop' as BusinessType,
    businessCategory: 'Specialty Coffee & European Bakery',

    // Step 4: Branch Configuration
    branchCount: 1,
    primaryBranchName: 'Flagship Indiranagar Outlet',
    managerName: 'Kavita Reddy',

    // Step 5: Order Channels
    allowDineIn: true,
    allowTakeaway: true,
    allowDelivery: true,
    allowCounter: true,
    allowQrOrdering: true,

    // Step 6: Menu Configuration
    sampleCategories: ['Coffee & Brews', 'Bakery & Pastries', 'Breakfast Sandwiches', 'Beverages'],
    currency: 'INR (₹)',
    enableWeightPricing: false,

    // Step 7: Table Configuration
    enableTables: true,
    tablesCount: 12,
    diningFloors: ['Ground Floor Cafe Lounge', 'Outdoor Garden Patio'],

    // Step 8: Billing & Tax
    gstin: '29ABCDE1234F1Z5',
    fssaiNumber: '11223344000512',
    cgstRate: 2.5,
    sgstRate: 2.5,
    serviceChargePercent: 5.0,
    enableServiceCharge: false,

    // Step 9: Payment Methods
    enableCash: true,
    enableUpi: true,
    enableCards: true,
    enableSplitBilling: true,
    upiVpa: 'artisancafe@okhdfcbank',

    // Step 10: Kitchen Setup
    kitchenDisplay: true,
    kitchenStations: ['Main Bakery Oven', 'Barista Coffee Bar', 'Cold Pantry'],
    autoPrintKot: true,
    defaultPrepTime: 15,

    // Step 11: Staff Setup
    initialStaffCount: 6,
    staffRolesSelected: ['Branch Manager', 'Cashier', 'Barista', 'Waiter'],

    // Step 12: Subscription Plan
    subscriptionPlan: 'Professional' as 'Starter' | 'Professional' | 'Business' | 'Enterprise' | 'Free Trial',
    billingCycle: 'Monthly' as 'Monthly' | 'Yearly',
  });

  // Load draft if saved previously
  useEffect(() => {
    const draft = getOnboardingDraft();
    if (draft) {
      setFormData(prev => ({
        ...prev,
        ownerName: draft.ownerName || prev.ownerName,
        ownerEmail: draft.ownerEmail || prev.ownerEmail,
        ownerPhone: draft.ownerPhone || prev.ownerPhone,
        businessName: draft.businessName || prev.businessName,
        businessType: draft.businessType || prev.businessType,
        businessCategory: draft.businessCategory || prev.businessCategory,
        businessAddress: draft.businessAddress || prev.businessAddress,
        city: draft.city || prev.city,
        state: draft.state || prev.state,
        gstin: draft.gstin || prev.gstin,
        fssaiNumber: draft.fssaiNumber || prev.fssaiNumber,
        subscriptionPlan: draft.subscriptionPlan || prev.subscriptionPlan,
      }));
      if (draft.step && draft.step > 1 && draft.step <= 13) {
        setCurrentStep(draft.step);
      }
    }
  }, []);

  const handleSaveProgress = () => {
    saveOnboardingDraft({
      step: currentStep,
      ownerName: formData.ownerName,
      ownerEmail: formData.ownerEmail,
      ownerPhone: formData.ownerPhone,
      businessName: formData.businessName,
      businessType: formData.businessType,
      businessCategory: formData.businessCategory,
      branchCount: formData.branchCount,
      businessAddress: formData.businessAddress,
      city: formData.city,
      state: formData.state,
      gstin: formData.gstin,
      fssaiNumber: formData.fssaiNumber,
      openingHours: formData.openingHours,
      subscriptionPlan: formData.subscriptionPlan,
    });
    setSaveDraftAlert(true);
    setTimeout(() => setSaveDraftAlert(false), 3000);
  };

  const handleNext = () => {
    if (currentStep < 13) {
      const next = currentStep + 1;
      setCurrentStep(next);
      saveOnboardingDraft({ step: next });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteLaunch = () => {
    const defaultFeat = getDefaultFeaturesForBusinessType(formData.businessType);
    const configuredFeatures: BusinessFeatures = {
      ...defaultFeat,
      dineIn: formData.allowDineIn,
      takeaway: formData.allowTakeaway,
      delivery: formData.allowDelivery,
      tableManagement: formData.enableTables,
      splitBilling: formData.enableSplitBilling,
    };

    registerBusiness({
      ownerName: formData.ownerName,
      ownerEmail: formData.ownerEmail,
      ownerPhone: formData.ownerPhone,
      businessName: formData.businessName,
      businessType: formData.businessType,
      businessCategory: formData.businessCategory,
      branchCount: formData.branchCount,
      businessAddress: formData.businessAddress,
      city: formData.city,
      state: formData.state,
      gstin: formData.gstin,
      fssaiNumber: formData.fssaiNumber,
      subscriptionPlan: formData.subscriptionPlan,
      features: configuredFeatures,
    });

    clearOnboardingDraft();
    router.push('/owner/dashboard');
  };

  // Adjust table requirement depending on business type
  const isCloudKitchen = formData.businessType === 'Cloud Kitchen' || formData.businessType === 'Food Truck';

  return (
    <div className="min-vh-100 bg-surface d-flex flex-column justify-content-between">
      {/* Top Header */}
      <header className="bg-navy py-3 px-4 border-bottom border-secondary border-opacity-25 sticky-top shadow-sm" style={{ zIndex: 1020 }}>
        <div className="container d-flex align-items-center justify-content-between">
          <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div 
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand text-white fw-bold shadow-sm"
              style={{ width: '38px', height: '38px', fontSize: '20px' }}
            >
              Z
            </div>
            <span className="fw-bold fs-4 text-white">
              ZEST<span className="text-brand">ORA</span>
            </span>
          </Link>

          <div className="d-flex align-items-center gap-2">
            {saveDraftAlert && (
              <span className="badge badge-soft-success px-3 py-2 rounded-pill small">
                Progress Saved Locally!
              </span>
            )}
            <button
              type="button"
              className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
              onClick={handleSaveProgress}
            >
              <BiSave size={16} />
              <span>Save & Continue Later</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="container my-auto py-4">
        {/* Step Progress Bar */}
        <div className="app-card p-3 mb-4 bg-white shadow-sm rounded-4">
          <div className="d-flex align-items-center justify-content-between overflow-x-auto pb-2 gap-2">
            {STEPS.map((s) => {
              const isPassed = currentStep > s.id;
              const isCurrent = currentStep === s.id;
              return (
                <div
                  key={s.id}
                  className="d-flex align-items-center gap-2 cursor-pointer flex-shrink-0"
                  onClick={() => setCurrentStep(s.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center fw-bold small transition-all ${
                      isCurrent
                        ? 'bg-brand text-white shadow-sm'
                        : isPassed
                        ? 'bg-success text-white'
                        : 'bg-light text-muted'
                    }`}
                    style={{ width: '32px', height: '32px', fontSize: '12px' }}
                  >
                    {isPassed ? <BiCheck size={18} /> : s.id}
                  </div>
                  <span
                    className={`small text-nowrap d-none d-md-inline ${
                      isCurrent ? 'fw-bold text-navy' : isPassed ? 'text-navy' : 'text-muted'
                    }`}
                    style={{ fontSize: '12px' }}
                  >
                    {s.label}
                  </span>
                  {s.id < STEPS.length && (
                    <span className="text-muted-custom opacity-50 ms-1 d-none d-lg-inline">&rarr;</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="progress mt-2" style={{ height: '4px' }}>
            <div
              className="progress-bar bg-brand"
              role="progressbar"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Step Card */}
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 col-xl-8">
            <div className="app-card p-4 p-md-5 bg-white shadow-lg rounded-4">
              {/* STEP 1: Owner Information */}
              {currentStep === 1 && (
                <div>
                  <h5 className="fw-bold text-navy mb-1">Step 1: Business Owner Profile</h5>
                  <p className="text-muted-custom small mb-4">
                    Primary administrative contact authorized to manage this SaaS tenant account.
                  </p>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Owner Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Corporate Role / Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.ownerRoleTitle}
                        onChange={(e) => setFormData({ ...formData, ownerRoleTitle: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Primary Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.ownerEmail}
                        onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Mobile Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.ownerPhone}
                        onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Business Profile */}
              {currentStep === 2 && (
                <div>
                  <h5 className="fw-bold text-navy mb-1">Step 2: Business Profile & Location</h5>
                  <p className="text-muted-custom small mb-4">
                    Brand identity details that appear on guest invoices, receipts, and online catalogs.
                  </p>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Brand / Restaurant Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Tagline</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-navy">Physical Street Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.businessAddress}
                        onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                      />
                    </div>
                    <div className="col-6 col-md-4">
                      <label className="form-label small fw-semibold text-navy">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="col-6 col-md-4">
                      <label className="form-label small fw-semibold text-navy">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold text-navy">Operating Hours</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.openingHours}
                        onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Business Type & Category */}
              {currentStep === 3 && (
                <div>
                  <h5 className="fw-bold text-navy mb-1">Step 3: Business Type & Format</h5>
                  <p className="text-muted-custom small mb-4">
                    Selecting your operational model will dynamically configure appropriate POS, Table, and Kitchen workflows.
                  </p>
                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-navy">Select Business Model (13+ Formats)</label>
                    <select
                      className="form-select form-select-lg fw-semibold text-navy"
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value as BusinessType })}
                    >
                      {BUSINESS_TYPES_META.map(b => (
                        <option key={b.type} value={b.type}>
                          {b.type} — {b.tagline}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="fw-bold text-navy small mb-1">Operational Highlights for {formData.businessType}:</div>
                    <div className="small text-muted-custom">
                      {BUSINESS_TYPES_META.find(b => b.type === formData.businessType)?.description}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Branch Configuration */}
              {currentStep === 4 && (
                <div>
                  <h5 className="fw-bold text-navy mb-1">Step 4: Outlet & Multi-Branch Setup</h5>
                  <p className="text-muted-custom small mb-4">
                    Configure your first physical branch or commissary kitchen. You can add more branches anytime.
                  </p>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Primary Branch Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.primaryBranchName}
                        onChange={(e) => setFormData({ ...formData, primaryBranchName: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Branch Manager in Charge</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.managerName}
                        onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Total Initial Outlets</label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        className="form-control"
                        value={formData.branchCount}
                        onChange={(e) => setFormData({ ...formData, branchCount: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Order Channels */}
              {currentStep === 5 && (
                <div>
                  <h5 className="fw-bold text-navy mb-1">Step 5: Enabled Order Channels</h5>
                  <p className="text-muted-custom small mb-4">
                    Choose which order streams your restaurant will accept.
                  </p>
                  <div className="row g-3">
                    {[
                      { key: 'allowDineIn', title: 'Dine-In Seating', desc: 'Guests dining at physical tables' },
                      { key: 'allowTakeaway', title: 'Takeaway / Pickup', desc: 'Customer collection at counter' },
                      { key: 'allowDelivery', title: 'Delivery Dispatch', desc: 'Direct riders or food delivery aggregators' },
                      { key: 'allowCounter', title: 'Quick Counter POS', desc: 'Direct cashier ordering' },
                      { key: 'allowQrOrdering', title: 'Digital QR Table Ordering', desc: 'Contactless ordering via mobile web' },
                    ].map(({ key, title, desc }) => (
                      <div key={key} className="col-12 col-md-6">
                        <div className="p-3 border rounded-3 h-100 bg-white">
                          <div className="form-check form-switch mb-1">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={(formData as any)[key]}
                              onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                            />
                            <label className="form-check-label fw-bold text-navy small">{title}</label>
                          </div>
                          <span className="small text-muted-custom ps-4 d-block">{desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Menu Configuration */}
              {currentStep === 6 && (
                <div>
                  <h5 className="fw-bold text-navy mb-1">Step 6: Menu & Catalog Structure</h5>
                  <p className="text-muted-custom small mb-4">
                    Define food categories, base currency, and special pricing attributes.
                  </p>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-navy">Default Initial Categories</label>
                    <div className="d-flex gap-2 flex-wrap mb-2">
                      {formData.sampleCategories.map((c, i) => (
                        <span key={i} className="badge bg-light text-navy border p-2">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-navy">Base Currency</label>
                      <input type="text" className="form-control" value={formData.currency} disabled />
                    </div>
                    <div className="col-6 d-flex align-items-center pt-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.enableWeightPricing}
                          onChange={(e) => setFormData({ ...formData, enableWeightPricing: e.target.checked })}
                        />
                        <label className="form-check-label small fw-semibold text-navy">Enable Weight Pricing (kg/g)</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Table Configuration */}
              {currentStep === 7 && (
                <div>
                  <h5 className="fw-bold text-navy mb-1">Step 7: Table & Dining Floor Setup</h5>
                  <p className="text-muted-custom small mb-4">
                    {isCloudKitchen ? 'Table management is usually disabled for delivery-only kitchens.' : 'Configure dining floors and table capacity.'}
                  </p>
                  <div className="form-check form-switch mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={formData.enableTables}
                      onChange={(e) => setFormData({ ...formData, enableTables: e.target.checked })}
                    />
                    <label className="form-check-label fw-bold text-navy">Enable Table & Floor Layout Management</label>
                  </div>
                  {formData.enableTables && (
                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold text-navy">Initial Tables Count</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.tablesCount}
                          onChange={(e) => setFormData({ ...formData, tablesCount: Number(e.target.value) })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold text-navy">Dining Floors</label>
                        <input type="text" className="form-control" value={formData.diningFloors.join(', ')} disabled />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 8: Billing & Tax */}
              {currentStep === 8 && (
                <div>
                  <h5 className="fw-bold text-navy mb-1">Step 8: GST Compliance & Tax Rules</h5>
                  <p className="text-muted-custom small mb-4">
                    Standard GST rates applied to printed tax invoices and GSTR-1 reports.
                  </p>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">GSTIN Number</label>
                      <input
                        type="text"
                        className="form-control font-monospace"
                        value={formData.gstin}
                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">FSSAI License</label>
                      <input
                        type="text"
                        className="form-control font-monospace"
                        value={formData.fssaiNumber}
                        onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-navy">Central GST (CGST %)</label>
                      <input type="number" step="0.1" className="form-control" value={formData.cgstRate} onChange={(e) => setFormData({ ...formData, cgstRate: Number(e.target.value) })} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-navy">State GST (SGST %)</label>
                      <input type="number" step="0.1" className="form-control" value={formData.sgstRate} onChange={(e) => setFormData({ ...formData, sgstRate: Number(e.target.value) })} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 9: Payment Methods */}
              {currentStep === 9 && (
                <div>
                  <h5 className="fw-bold text-navy mb-1">Step 9: Payment Modes & UPI QR</h5>
                  <p className="text-muted-custom small mb-4">
                    Select payment modes cashiers can accept at the billing counter.
                  </p>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-navy">Merchant UPI VPA ID</label>
                    <input
                      type="text"
                      className="form-control font-monospace"
                      value={formData.upiVpa}
                      onChange={(e) => setFormData({ ...formData, upiVpa: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={formData.enableCash} onChange={(e) => setFormData({ ...formData, enableCash: e.target.checked })} id="c1" />
                        <label className="form-check-label small" htmlFor="c1">Cash Payments</label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={formData.enableUpi} onChange={(e) => setFormData({ ...formData, enableUpi: e.target.checked })} id="c2" />
                        <label className="form-check-label small" htmlFor="c2">UPI / Dynamic QR Code</label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={formData.enableCards} onChange={(e) => setFormData({ ...formData, enableCards: e.target.checked })} id="c3" />
                        <label className="form-check-label small" htmlFor="c3">Credit & Debit Cards</label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={formData.enableSplitBilling} onChange={(e) => setFormData({ ...formData, enableSplitBilling: e.target.checked })} id="c4" />
                        <label className="form-check-label small" htmlFor="c4">Split Payment Mode</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 10: Kitchen Setup */}
              {currentStep === 10 && (
                <div>
                  <h5 className="fw-bold text-navy mb-1">Step 10: Kitchen Display (KDS) & KOT</h5>
                  <p className="text-muted-custom small mb-4">
                    Configure chef display terminals, prep timers, and order dispatch stations.
                  </p>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-navy">Default Prep Time (Mins)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.defaultPrepTime}
                        onChange={(e) => setFormData({ ...formData, defaultPrepTime: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-6 d-flex align-items-center pt-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.autoPrintKot}
                          onChange={(e) => setFormData({ ...formData, autoPrintKot: e.target.checked })}
                        />
                        <label className="form-check-label small fw-semibold text-navy">Auto-Send KOT on POS Punch</label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="small fw-semibold text-navy d-block mb-1">Kitchen Dispatch Stations</label>
                    <div className="d-flex gap-2 flex-wrap">
                      {formData.kitchenStations.map((st, i) => (
                        <span key={i} className="badge bg-light text-navy border p-2">{st}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 11: Staff Setup */}
              {currentStep === 11 && (
                <div>
                  <h5 className="fw-bold text-navy mb-1">Step 11: Staff Roster & Roles</h5>
                  <p className="text-muted-custom small mb-4">
                    Configure employee roles across your physical outlets.
                  </p>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Estimated Staff Count</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.initialStaffCount}
                        onChange={(e) => setFormData({ ...formData, initialStaffCount: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-navy">Default Operational Roles</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {['Branch Manager', 'Cashier', 'Floor Waiter', 'Head Chef', 'Inventory Manager', 'Accountant'].map(r => (
                          <span key={r} className="badge bg-light text-navy border p-2">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 12: Subscription Plan */}
              {currentStep === 12 && (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <h5 className="fw-bold text-navy mb-1">Step 12: Select SaaS Subscription Tier</h5>
                      <p className="text-muted-custom small mb-0">
                        Choose the right package for your restaurant. Your 7-day free trial gives you full access to all features.
                      </p>
                    </div>
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill small fw-semibold">
                      7-Day Free Trial Included
                    </span>
                  </div>

                  <div className="p-3 bg-light rounded-3 border mb-4 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-brand text-white rounded-pill px-2.5 py-1 small">No Risk</span>
                      <span className="small text-navy fw-medium">
                        No credit card required today. You will only be billed if you choose to continue after your 7-day trial.
                      </span>
                    </div>
                  </div>

                  <div className="row g-3">
                    {[
                      { name: 'Starter', price: '₹1,499/mo', desc: '1 outlet, billing POS, digital menu, basic inventory', tag: 'Great for Cafes' },
                      { name: 'Professional', price: '₹2,999/mo', desc: 'Up to 2 branches, table layout, KDS, recipes, loyalty CRM', tag: 'Most Popular', highlight: true },
                      { name: 'Business', price: '₹4,999/mo', desc: 'Up to 5 outlets, AI demand forecast, WhatsApp bot, central commissary', tag: 'Growth Engine' },
                      { name: 'Enterprise', price: '₹8,999/mo', desc: 'Unlimited outlets, Tally ERP sync, Swiggy/Zomato injection, 24/7 SLA', tag: 'Enterprise Grade' },
                    ].map(p => {
                      const isSelected = formData.subscriptionPlan === p.name;
                      return (
                        <div key={p.name} className="col-12 col-md-6 col-lg-3">
                          <div
                            className={`p-3 rounded-3 border h-100 d-flex flex-column justify-content-between cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-brand bg-brand bg-opacity-10 shadow-sm' 
                                : p.highlight 
                                ? 'border-primary border-opacity-50 bg-white' 
                                : 'border-subtle bg-white'
                            }`}
                            style={{ cursor: 'pointer', position: 'relative' }}
                            onClick={() => setFormData({ ...formData, subscriptionPlan: p.name as any })}
                          >
                            <div>
                              <div className="d-flex align-items-center justify-content-between mb-1">
                                <h6 className="fw-bold text-navy mb-0">{p.name}</h6>
                                <span className={`badge ${isSelected ? 'bg-brand text-white' : 'bg-secondary bg-opacity-10 text-muted'} rounded-pill`} style={{ fontSize: '10px' }}>
                                  {p.tag}
                                </span>
                              </div>
                              <div className="fs-5 fw-bolder text-brand mb-2">{p.price}</div>
                              <p className="small text-muted mb-0" style={{ fontSize: '11px', lineHeight: '1.4' }}>{p.desc}</p>
                            </div>
                            <div className="pt-3 mt-2 border-top">
                              <span className={`badge w-100 py-1.5 ${isSelected ? 'bg-brand text-white' : 'bg-light text-navy border'}`} style={{ fontSize: '11px' }}>
                                {isSelected ? 'Selected Plan' : 'Select Plan'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 13: Review & Complete */}
              {currentStep === 13 && (
                <div>
                  <div className="text-center mb-4">
                    <div className="mx-auto bg-success bg-opacity-10 text-success p-3 rounded-circle mb-2 d-inline-flex">
                      <BiCheckCircle size={40} />
                    </div>
                    <h4 className="fw-bold text-navy mb-1">Ready to Launch Your Workspace</h4>
                    <p className="text-muted-custom small">
                      Review your configuration summary before provisioning your SaaS tenant.
                    </p>
                  </div>

                  <div className="p-3 bg-light rounded-3 border mb-4">
                    <div className="row g-2 small">
                      <div className="col-6">
                        <span className="text-muted d-block">Business:</span>
                        <strong className="text-navy">{formData.businessName}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Format:</span>
                        <strong className="text-brand">{formData.businessType}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Owner:</span>
                        <strong className="text-navy">{formData.ownerName}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Location:</span>
                        <strong className="text-navy">{formData.city}, {formData.state}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">SaaS Plan:</span>
                        <span className="badge badge-soft-brand">{formData.subscriptionPlan}</span>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Outlets:</span>
                        <span className="badge badge-soft-info">{formData.branchCount} Branch</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="d-flex align-items-center justify-content-between pt-4 mt-4 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center gap-1"
                  disabled={currentStep === 1}
                  onClick={handlePrev}
                >
                  <BiLeftArrowAlt size={18} />
                  <span>Previous</span>
                </button>

                {currentStep < 13 ? (
                  <button
                    type="button"
                    className="btn btn-brand d-flex align-items-center gap-1 text-white shadow-sm px-4"
                    onClick={handleNext}
                  >
                    <span>Next Step</span>
                    <BiRightArrowAlt size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-brand d-flex align-items-center gap-2 text-white shadow-sm px-4 py-2"
                    onClick={handleCompleteLaunch}
                  >
                    <BiCheckCircle size={20} />
                    <span>Launch Restaurant Workspace</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center border-top bg-white">
        <span className="text-muted-custom small">
          Zestora Multi-Tenant SaaS Platform &copy; 2026.
        </span>
      </footer>
    </div>
  );
}
