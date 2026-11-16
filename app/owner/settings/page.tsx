'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { BusinessType, BusinessFeatures } from '@/types/restaurant';
import { BUSINESS_TYPES_METADATA, getDefaultFeaturesForBusinessType } from '@/data/businessTypesData';
import { 
  BiStore, 
  BiBuilding, 
  BiReceipt, 
  BiCreditCard, 
  BiUser, 
  BiCheck, 
  BiSave, 
  BiDish, 
  BiQrScan,
  BiCog,
  BiPackage,
  BiGift,
  BiCheckCircle,
  BiLayer
} from 'react-icons/bi';
import { MdTableRestaurant } from 'react-icons/md';

export default function SettingsPage() {
  const { currentRestaurant, updateRestaurant, updateRestaurantFeatures } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'business_type' | 'gst' | 'payment' | 'receipt' | 'order' | 'packaging' | 'crm'
  >('business_type');

  const [saveAlert, setSaveAlert] = useState(false);
  const [presetNotice, setPresetNotice] = useState<string>('');

  // Profile states
  const [name, setName] = useState(currentRestaurant.name);
  const [tagline, setTagline] = useState(currentRestaurant.tagline);
  const [fssai, setFssai] = useState(currentRestaurant.fssaiNumber);
  const [gstin, setGstin] = useState(currentRestaurant.gstin);
  const [phone, setPhone] = useState(currentRestaurant.ownerPhone);
  const [email, setEmail] = useState(currentRestaurant.ownerEmail);
  const [address, setAddress] = useState(currentRestaurant.address || '100 Feet Road, Indiranagar');
  const [city, setCity] = useState(currentRestaurant.city || 'Bengaluru');
  const [openingHours, setOpeningHours] = useState(currentRestaurant.openingHours || '11:00 AM - 11:30 PM');

  // Business Type & Features states
  const [selectedType, setSelectedType] = useState<BusinessType>(currentRestaurant.businessType);
  const [features, setFeatures] = useState<BusinessFeatures>(currentRestaurant.features);

  // GST states
  const [cgstRate, setCgstRate] = useState(2.5);
  const [sgstRate, setSgstRate] = useState(2.5);
  const [serviceChargeRate, setServiceChargeRate] = useState(5.0);
  const [serviceChargeEnabled, setServiceChargeEnabled] = useState(false);
  const [taxInclusivePricing, setTaxInclusivePricing] = useState(false);

  // Payment states
  const [enableCash, setEnableCash] = useState(true);
  const [enableUpi, setEnableUpi] = useState(true);
  const [enableCard, setEnableCard] = useState(true);
  const [enableSplit, setEnableSplit] = useState(true);
  const [vpaId, setVpaId] = useState('foodpalace@okhdfcbank');

  // Receipt states
  const [receiptHeader, setReceiptHeader] = useState('Welcome to Food Palace - Indiranagar');
  const [receiptFooter, setReceiptFooter] = useState('Thank you for dining with us! Visit again!');
  const [printLogoOnReceipt, setPrintLogoOnReceipt] = useState(true);
  const [wifiPassword, setWifiPassword] = useState('FoodPalaceGuest@2026');

  // Order & Kitchen states
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [defaultPrepTime, setDefaultPrepTime] = useState(20);
  const [autoPrintKot, setAutoPrintKot] = useState(true);
  const [tableQrOrdering, setTableQrOrdering] = useState(true);

  // Packaging & Delivery states
  const [packagingCharge, setPackagingCharge] = useState(25);
  const [freeDeliveryRadius, setFreeDeliveryRadius] = useState(5);

  // CRM states
  const [pointsPerHundred, setPointsPerHundred] = useState(5);
  const [autoBirthdaySms, setAutoBirthdaySms] = useState(true);

  // Switch feature flag directly
  const handleToggleFeature = (key: keyof BusinessFeatures) => {
    const updated = {
      ...features,
      [key]: !features[key],
    };
    setFeatures(updated);
    updateRestaurantFeatures({ [key]: !features[key] });
  };

  // Switch business type & load presets
  const handleBusinessTypeChange = (newType: BusinessType) => {
    setSelectedType(newType);
    const preset = getDefaultFeaturesForBusinessType(newType);
    setFeatures(preset);
    updateRestaurant({ businessType: newType });
    updateRestaurantFeatures(preset);

    setPresetNotice(`Applied recommended operational feature preset for "${newType}"`);
    setTimeout(() => setPresetNotice(''), 5000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurant({
      name,
      tagline,
      fssaiNumber: fssai,
      gstin,
      ownerPhone: phone,
      ownerEmail: email,
      address,
      city,
      openingHours,
      businessType: selectedType,
      features,
    });

    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner']}>
      {/* Title */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h4 className="fw-bold text-navy mb-0">Restaurant Settings & Configuration</h4>
            <span className="badge badge-soft-brand rounded-pill small">
              {currentRestaurant.name}
            </span>
          </div>
          <p className="text-muted-custom small mb-0">
            Configure business model, dynamic feature toggles, tax rates, payment gateways, and receipt rules
          </p>
        </div>

        {saveAlert && (
          <span className="badge badge-soft-success py-2 px-3 rounded-pill fw-semibold d-flex align-items-center gap-1">
            <BiCheck size={18} /> Settings Saved Successfully
          </span>
        )}
      </div>

      {presetNotice && (
        <div className="alert alert-info border-0 rounded-3 p-3 mb-4 shadow-sm d-flex align-items-center gap-2">
          <BiCheckCircle size={20} className="text-info" />
          <span>{presetNotice}</span>
        </div>
      )}

      <div className="row g-4">
        {/* Settings Navigation Menu */}
        <div className="col-12 col-md-3">
          <div className="app-card p-2 bg-white shadow-sm">
            <nav className="nav nav-pills flex-column gap-1">
              {[
                { id: 'business_type', label: 'Business Type & Features', icon: BiLayer },
                { id: 'profile', label: 'Restaurant Profile', icon: BiStore },
                { id: 'gst', label: 'GST & Tax Settings', icon: BiReceipt },
                { id: 'payment', label: 'Payment Modes & UPI', icon: BiCreditCard },
                { id: 'receipt', label: 'Bill Receipt Customizer', icon: BiReceipt },
                { id: 'order', label: 'Order & Kitchen (KOT)', icon: BiDish },
                { id: 'packaging', label: 'Delivery & Eco Packaging', icon: BiPackage },
                { id: 'crm', label: 'Customer Loyalty & CRM', icon: BiGift },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`nav-link text-start d-flex align-items-center gap-2 rounded-2 py-2 px-3 ${
                    activeTab === id ? 'bg-brand text-white fw-semibold shadow-sm' : 'text-navy hover-bg-light'
                  }`}
                  onClick={() => setActiveTab(id as any)}
                >
                  <Icon size={18} />
                  <span className="small">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Form Pane */}
        <div className="col-12 col-md-9">
          <div className="app-card p-4 bg-white shadow-sm">
            <form onSubmit={handleSave}>
              {/* TAB: BUSINESS TYPE & FEATURE SWITCHES */}
              {activeTab === 'business_type' && (
                <div>
                  <h6 className="fw-bold text-navy mb-1 pb-2 border-bottom border-subtle">
                    Universal Food Business Profile & Modular Feature Switches
                  </h6>
                  <p className="text-muted-custom small mb-4">
                    Switch between all 15 food business models. Choose a business type to automatically apply optimized operational defaults, or tailor individual switches.
                  </p>

                  {/* Business Type Selector Dropdown */}
                  <div className="p-3 bg-light rounded-3 border border-subtle mb-4">
                    <label className="form-label small fw-bold text-navy text-uppercase mb-1">
                      Current Food Business Model
                    </label>
                    <select
                      className="form-select fw-semibold text-navy mb-2"
                      value={selectedType}
                      onChange={(e) => handleBusinessTypeChange(e.target.value as BusinessType)}
                    >
                      {BUSINESS_TYPES_METADATA.map(b => (
                        <option key={b.type} value={b.type}>
                          {b.type} — {b.tagline}
                        </option>
                      ))}
                    </select>
                    <div className="small text-muted-custom">
                      {BUSINESS_TYPES_METADATA.find(b => b.type === selectedType)?.description}
                    </div>
                  </div>

                  {/* Operational Feature Switches */}
                  <h6 className="fw-bold text-navy small text-uppercase mb-3">
                    Active Operational Modules (Turn ON/OFF for this outlet)
                  </h6>

                  <div className="row g-3 mb-4">
                    {[
                      { key: 'posBilling', title: 'POS Billing & Counter', desc: 'Fast cashier checkout, barcodes, receipts' },
                      { key: 'dineIn', title: 'Dine-In Service', desc: 'Accept in-house dining guests' },
                      { key: 'tableManagement', title: 'Table & Floor Management', desc: 'Floor layouts, table transfers, merge tables' },
                      { key: 'kitchenKot', title: 'Kitchen KOT Printing', desc: 'Print physical KOT tickets to stations' },
                      { key: 'kitchenKds', title: 'Kitchen Display System (KDS)', desc: 'Digital chef order pipeline screens' },
                      { key: 'takeaway', title: 'Takeaway & Pickup', desc: 'Counter pickup and customer collection' },
                      { key: 'delivery', title: 'Delivery Dispatch', desc: 'Direct riders or aggregators (Swiggy/Zomato)' },
                      { key: 'reservations', title: 'Table Reservations', desc: 'Advance bookings for dining parties' },
                      { key: 'onlineOrdering', title: 'Online Store Ordering', desc: 'QR code menus & digital ordering' },
                      { key: 'inventory', title: 'Inventory & Raw Stock', desc: 'Track raw ingredients, batch numbers, alerts' },
                      { key: 'recipeManagement', title: 'Recipe Auto-Deduction', desc: 'Automatically deduct stock when dishes are ordered' },
                      { key: 'purchaseManagement', title: 'Supplier Purchase Orders', desc: 'Create and dispatch purchase orders to vendors' },
                      { key: 'staffManagement', title: 'Staff & Shift Management', desc: '7 employee roles, permissions matrix' },
                      { key: 'customerCrm', title: 'Customer CRM Profiles', desc: 'Track diner spend, history, and preferences' },
                      { key: 'loyaltyProgram', title: 'Loyalty Reward Points', desc: 'Points per order and bill redemption' },
                      { key: 'offersDiscounts', title: 'Promos & Discount Coupons', desc: 'Manage coupon codes & percentage discounts' },
                      { key: 'splitBilling', title: 'Split Payment Mode', desc: 'Split bills across Cash, UPI, and Cards' },
                      { key: 'reportsAnalytics', title: 'Reports & P&L Analytics', desc: 'Financial reports, COGS, tax audits' },
                      { key: 'weightBasedBilling', title: 'Weight-Based Billing (kg/g)', desc: 'Essential for Sweet Shops & Bakeries' },
                      { key: 'customCakeOrders', title: 'Custom Cake Orders', desc: 'Cake flavor, message, and eggless toggle' },
                      { key: 'coffeeCustomization', title: 'Barista Coffee Customizer', desc: 'Milk options, sweetness, and extra shots' },
                      { key: 'alcoholBarTab', title: 'Bar Tabs & Spirits', desc: 'For Pubs, Bars, and Taprooms' },
                      { key: 'packagingCharges', title: 'Eco Packaging Fees', desc: 'Auto packaging fee on takeaway/delivery' },
                      { key: 'courseOrdering', title: 'Multi-Course Service', desc: 'Starters, Mains, Desserts for Fine Dining' },
                    ].map(({ key, title, desc }) => {
                      const isChecked = !!features[key as keyof BusinessFeatures];
                      return (
                        <div key={key} className="col-12 col-md-6">
                          <div className={`p-3 rounded-3 border h-100 transition-all ${
                            isChecked ? 'border-brand bg-white' : 'border-subtle bg-light opacity-75'
                          }`}>
                            <div className="form-check form-switch mb-1">
                              <input
                                className="form-check-input cursor-pointer"
                                type="checkbox"
                                role="switch"
                                id={`feat-${key}`}
                                checked={isChecked}
                                onChange={() => handleToggleFeature(key as keyof BusinessFeatures)}
                              />
                              <label className="form-check-label fw-bold small text-navy cursor-pointer" htmlFor={`feat-${key}`}>
                                {title}
                              </label>
                            </div>
                            <span className="text-muted-custom small ps-4 d-block" style={{ fontSize: '11px' }}>
                              {desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB: RESTAURANT PROFILE */}
              {activeTab === 'profile' && (
                <div>
                  <h6 className="fw-bold text-navy mb-3 pb-2 border-bottom border-subtle">
                    Restaurant Profile & Legal Business Information
                  </h6>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Brand Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm border-subtle"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Tagline</label>
                      <input
                        type="text"
                        className="form-control form-control-sm border-subtle"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">FSSAI License Number</label>
                      <input
                        type="text"
                        className="form-control form-control-sm border-subtle font-monospace"
                        value={fssai}
                        onChange={(e) => setFssai(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">GSTIN Identification</label>
                      <input
                        type="text"
                        className="form-control form-control-sm border-subtle font-monospace"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Physical Address</label>
                      <input
                        type="text"
                        className="form-control form-control-sm border-subtle"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">City</label>
                      <input
                        type="text"
                        className="form-control form-control-sm border-subtle"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Support Email</label>
                      <input
                        type="email"
                        className="form-control form-control-sm border-subtle"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Support Phone</label>
                      <input
                        type="tel"
                        className="form-control form-control-sm border-subtle"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: GST & TAX SETTINGS */}
              {activeTab === 'gst' && (
                <div>
                  <h6 className="fw-bold text-navy mb-3 pb-2 border-bottom border-subtle">
                    GST & Taxes Configuration (Indian Restaurant Compliance)
                  </h6>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Central GST (CGST %)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control form-control-sm border-subtle"
                        value={cgstRate}
                        onChange={(e) => setCgstRate(Number(e.target.value))}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">State GST (SGST %)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control form-control-sm border-subtle"
                        value={sgstRate}
                        onChange={(e) => setSgstRate(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Service Charge (%)</label>
                      <input
                        type="number"
                        step="0.5"
                        className="form-control form-control-sm border-subtle"
                        value={serviceChargeRate}
                        onChange={(e) => setServiceChargeRate(Number(e.target.value))}
                      />
                    </div>
                    <div className="col-12 col-md-6 d-flex align-items-center pt-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="scSwitch"
                          checked={serviceChargeEnabled}
                          onChange={(e) => setServiceChargeEnabled(e.target.checked)}
                        />
                        <label className="form-check-label small fw-semibold text-navy" htmlFor="scSwitch">
                          Apply Service Charge to Dine-In Bills by Default
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PAYMENT MODES & UPI */}
              {activeTab === 'payment' && (
                <div>
                  <h6 className="fw-bold text-navy mb-3 pb-2 border-bottom border-subtle">
                    Payment Gateway & UPI Dynamic QR Code
                  </h6>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-navy">Merchant UPI VPA ID</label>
                      <input
                        type="text"
                        className="form-control form-control-sm border-subtle font-monospace"
                        value={vpaId}
                        onChange={(e) => setVpaId(e.target.value)}
                        placeholder="merchant@bank"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-light rounded-3 mb-3">
                    <label className="small fw-bold text-navy text-uppercase mb-2 d-block">Enabled Payment Modes</label>
                    <div className="row g-2">
                      <div className="col-6 col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="payCash"
                            checked={enableCash}
                            onChange={(e) => setEnableCash(e.target.checked)}
                          />
                          <label className="form-check-label small" htmlFor="payCash">Cash</label>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="payUpi"
                            checked={enableUpi}
                            onChange={(e) => setEnableUpi(e.target.checked)}
                          />
                          <label className="form-check-label small" htmlFor="payUpi">UPI & QR</label>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="payCard"
                            checked={enableCard}
                            onChange={(e) => setEnableCard(e.target.checked)}
                          />
                          <label className="form-check-label small" htmlFor="payCard">Cards (POS)</label>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="paySplit"
                            checked={enableSplit}
                            onChange={(e) => setEnableSplit(e.target.checked)}
                          />
                          <label className="form-check-label small" htmlFor="paySplit">Split Payment</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: RECEIPT CUSTOMIZER */}
              {activeTab === 'receipt' && (
                <div>
                  <h6 className="fw-bold text-navy mb-3 pb-2 border-bottom border-subtle">
                    Thermal Print Receipt & Header Customizer
                  </h6>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-navy">Receipt Header Text</label>
                    <input
                      type="text"
                      className="form-control form-control-sm border-subtle"
                      value={receiptHeader}
                      onChange={(e) => setReceiptHeader(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-navy">Receipt Footer Message</label>
                    <input
                      type="text"
                      className="form-control form-control-sm border-subtle"
                      value={receiptFooter}
                      onChange={(e) => setReceiptFooter(e.target.value)}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-navy">Customer Wi-Fi Password</label>
                      <input
                        type="text"
                        className="form-control form-control-sm border-subtle font-monospace"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                      />
                    </div>
                    <div className="col-6 d-flex align-items-center pt-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="logoCheck"
                          checked={printLogoOnReceipt}
                          onChange={(e) => setPrintLogoOnReceipt(e.target.checked)}
                        />
                        <label className="form-check-label small fw-semibold text-navy" htmlFor="logoCheck">
                          Print Restaurant Logo
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: ORDER & KITCHEN */}
              {activeTab === 'order' && (
                <div>
                  <h6 className="fw-bold text-navy mb-3 pb-2 border-bottom border-subtle">
                    Kitchen Turnaround & KOT Rules
                  </h6>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-navy">Default Cooking Time (Mins)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm border-subtle"
                        value={defaultPrepTime}
                        onChange={(e) => setDefaultPrepTime(Number(e.target.value))}
                      />
                    </div>
                    <div className="col-6 d-flex align-items-center pt-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="autoKotCheck"
                          checked={autoPrintKot}
                          onChange={(e) => setAutoPrintKot(e.target.checked)}
                        />
                        <label className="form-check-label small fw-semibold text-navy" htmlFor="autoKotCheck">
                          Auto-Send to KDS on POS Punch
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PACKAGING & DELIVERY */}
              {activeTab === 'packaging' && (
                <div>
                  <h6 className="fw-bold text-navy mb-3 pb-2 border-bottom border-subtle">
                    Delivery Channels & Eco Packaging
                  </h6>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-navy">Standard Packaging Fee (₹)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm border-subtle"
                        value={packagingCharge}
                        onChange={(e) => setPackagingCharge(Number(e.target.value))}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-navy">Free Delivery Radius (km)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm border-subtle"
                        value={freeDeliveryRadius}
                        onChange={(e) => setFreeDeliveryRadius(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CRM & LOYALTY */}
              {activeTab === 'crm' && (
                <div>
                  <h6 className="fw-bold text-navy mb-3 pb-2 border-bottom border-subtle">
                    Loyalty Reward Program & Automated Greetings
                  </h6>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-navy">Reward Points per ₹100 Spent</label>
                      <input
                        type="number"
                        className="form-control form-control-sm border-subtle"
                        value={pointsPerHundred}
                        onChange={(e) => setPointsPerHundred(Number(e.target.value))}
                      />
                    </div>
                    <div className="col-6 d-flex align-items-center pt-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="bdayCheck"
                          checked={autoBirthdaySms}
                          onChange={(e) => setAutoBirthdaySms(e.target.checked)}
                        />
                        <label className="form-check-label small fw-semibold text-navy" htmlFor="bdayCheck">
                          Auto SMS Discount on Birthday / Anniversary
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button Bar */}
              <div className="d-flex justify-content-end gap-2 pt-3 border-top border-subtle mt-4">
                <button type="submit" className="btn btn-brand d-flex align-items-center gap-2 px-4 shadow-sm text-white">
                  <BiSave size={18} />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
