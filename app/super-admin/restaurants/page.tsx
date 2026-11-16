'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SAMPLE_RESTAURANTS } from '@/data/restaurantData';
import { SAMPLE_PLATFORM_OWNERS } from '@/data/superAdminData';
import { BUSINESS_TYPES_METADATA, getDefaultFeaturesForBusinessType } from '@/data/businessTypesData';
import { Restaurant, Branch, BusinessType, BusinessFeatures } from '@/types/restaurant';
import { Modal } from '@/components/common/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  BiSearch, 
  BiPlus, 
  BiEdit, 
  BiShow, 
  BiBuilding, 
  BiStore, 
  BiMapPin, 
  BiPhone, 
  BiCheckCircle,
  BiDish,
  BiLayer,
  BiChevronRight,
  BiChevronLeft,
  BiCheck
} from 'react-icons/bi';

export default function SuperAdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(SAMPLE_RESTAURANTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'pending' | 'suspended'>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRest, setSelectedRest] = useState<Restaurant | null>(null);

  // Multi-step Onboarding Form state
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    businessType: 'Casual Dining Restaurant' as BusinessType,
    tagline: '',
    description: '',
    ownerName: SAMPLE_PLATFORM_OWNERS[0].name,
    ownerEmail: 'owner@restaurant.com',
    ownerPhone: '+91 98765 00000',
    address: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    gstin: '29ABCDE1234F1Z5',
    fssaiNumber: '11223344000999',
    openingHours: '11:00 AM - 11:30 PM',
    branchCount: 1,
    subscriptionPlan: 'Professional' as 'Basic' | 'Professional' | 'Enterprise',
    features: getDefaultFeaturesForBusinessType('Casual Dining Restaurant'),
  });

  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.businessType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesType = typeFilter === 'All' || r.businessType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenAdd = () => {
    setWizardStep(1);
    const initialType: BusinessType = 'Casual Dining Restaurant';
    setOnboardingData({
      name: '',
      businessType: initialType,
      tagline: '',
      description: '',
      ownerName: SAMPLE_PLATFORM_OWNERS[0].name,
      ownerEmail: 'owner@restaurant.com',
      ownerPhone: '+91 98765 00000',
      address: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      gstin: '29ABCDE1234F1Z5',
      fssaiNumber: '11223344000999',
      openingHours: '11:00 AM - 11:30 PM',
      branchCount: 1,
      subscriptionPlan: 'Professional',
      features: getDefaultFeaturesForBusinessType(initialType),
    });
    setIsAddModalOpen(true);
  };

  const handleTypeChange = (newType: BusinessType) => {
    const defaultFeat = getDefaultFeaturesForBusinessType(newType);
    setOnboardingData(prev => ({
      ...prev,
      businessType: newType,
      features: defaultFeat,
    }));
  };

  const handleToggleOnboardingFeature = (key: keyof BusinessFeatures) => {
    setOnboardingData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: !prev.features[key],
      },
    }));
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newRest: Restaurant = {
      id: `rest-${Date.now()}`,
      name: onboardingData.name,
      businessType: onboardingData.businessType,
      tagline: onboardingData.tagline || 'Modern Food Business on Zestora SaaS',
      description: onboardingData.description,
      cuisine: ['Specialty Food', 'Beverages'],
      ownerId: 'owner-1',
      ownerName: onboardingData.ownerName,
      ownerEmail: onboardingData.ownerEmail,
      ownerPhone: onboardingData.ownerPhone,
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&h=120&q=80',
      fssaiNumber: onboardingData.fssaiNumber,
      gstin: onboardingData.gstin,
      address: onboardingData.address,
      city: onboardingData.city,
      state: onboardingData.state,
      country: onboardingData.country,
      openingHours: onboardingData.openingHours,
      status: 'active',
      subscriptionPlan: onboardingData.subscriptionPlan,
      createdAt: new Date().toISOString().split('T')[0],
      features: onboardingData.features,
      branches: [
        {
          id: `branch-${Date.now()}-1`,
          name: 'Main Flagship Branch',
          code: 'MFB',
          restaurantId: `rest-${Date.now()}`,
          address: onboardingData.address,
          city: onboardingData.city,
          pincode: '560001',
          phone: onboardingData.ownerPhone,
          managerName: onboardingData.ownerName,
          managerPhone: onboardingData.ownerPhone,
          managerEmail: onboardingData.ownerEmail,
          openingHours: onboardingData.openingHours,
          seatingCapacity: onboardingData.features.tableManagement ? 50 : 0,
          tablesCount: onboardingData.features.tableManagement ? 12 : 0,
          status: 'active',
          dailyRevenue: 35000,
          activeOrdersCount: 2,
        }
      ],
    };
    setRestaurants([newRest, ...restaurants]);
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (rest: Restaurant) => {
    setSelectedRest(rest);
    setIsEditModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === id) {
        const next = r.status === 'active' ? 'suspended' : 'active';
        return { ...r, status: next };
      }
      return r;
    }));
  };

  const handleOpenView = (rest: Restaurant) => {
    setSelectedRest(rest);
    setIsViewModalOpen(true);
  };

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      {/* Title */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Multi-Business Restaurant Network</h4>
          <p className="text-muted-custom small mb-0">
            Platform-wide directory supporting 15 food business verticals with modular operational configurations
          </p>
        </div>

        <button
          type="button"
          className="btn btn-brand d-flex align-items-center gap-2 shadow-sm text-white"
          onClick={handleOpenAdd}
        >
          <BiPlus size={20} />
          <span>Onboard New Restaurant</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="app-card p-3 mb-4 bg-white shadow-sm">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-surface border-subtle text-muted">
                <BiSearch size={18} />
              </span>
              <input
                type="text"
                className="form-control border-subtle"
                placeholder="Search restaurant, business type, owner, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-4">
            <select
              className="form-select form-select-sm border-subtle"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All 15 Business Types</option>
              {BUSINESS_TYPES_METADATA.map(b => (
                <option key={b.type} value={b.type}>{b.type}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3 text-md-end">
            <select
              className="form-select form-select-sm border-subtle"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurants Table */}
      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted-custom">
                <th>Restaurant Brand</th>
                <th>Business Vertical</th>
                <th>Assigned Owner</th>
                <th>City & Location</th>
                <th className="text-center">Outlets</th>
                <th>Plan</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={r.logo}
                        alt={r.name}
                        className="rounded-3 border border-subtle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="fw-semibold text-navy">{r.name}</div>
                        <div className="text-muted-custom" style={{ fontSize: '11px' }}>{r.tagline}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-soft-brand fw-semibold">
                      {r.businessType}
                    </span>
                  </td>
                  <td>
                    <div className="fw-medium text-navy small">{r.ownerName}</div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>{r.ownerEmail}</div>
                  </td>
                  <td className="small text-navy">
                    <div>{r.city}, {r.state}</div>
                    <div className="text-muted-custom font-monospace" style={{ fontSize: '10px' }}>GST: {r.gstin}</div>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-soft-info rounded-pill px-2 py-1">
                      {r.branches.length} Branches
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-light text-navy border">{r.subscriptionPlan}</span>
                  </td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-secondary p-1"
                        onClick={() => handleOpenView(r)}
                        title="View Details & Configuration"
                      >
                        <BiShow size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary p-1"
                        onClick={() => handleOpenEdit(r)}
                        title="Edit Restaurant"
                      >
                        <BiEdit size={16} />
                      </button>
                      <button
                        type="button"
                        className={`btn p-1 ${r.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={() => handleToggleStatus(r.id)}
                        title={r.status === 'active' ? 'Suspend Restaurant' : 'Activate Restaurant'}
                      >
                        <BiStore size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Restaurant Wizard */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Restaurant Onboarding & Business Configuration"
        subtitle={`Step ${wizardStep} of 3: ${
          wizardStep === 1 ? 'Brand & Business Vertical' :
          wizardStep === 2 ? 'Owner, Contact & Location' : 'Operational Features Configuration'
        }`}
        size="lg"
      >
        <form onSubmit={handleSaveAdd}>
          {/* Step Indicators */}
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
            {[
              { num: 1, label: 'Business Type' },
              { num: 2, label: 'Owner & Location' },
              { num: 3, label: 'Operational Modules' },
            ].map((st) => (
              <div key={st.num} className="d-flex align-items-center gap-2">
                <span className={`rounded-circle d-flex align-items-center justify-content-center fw-bold small ${
                  wizardStep === st.num ? 'bg-brand text-white' :
                  wizardStep > st.num ? 'bg-success text-white' : 'bg-light text-muted'
                }`} style={{ width: '28px', height: '28px' }}>
                  {wizardStep > st.num ? <BiCheck /> : st.num}
                </span>
                <span className={`small fw-semibold ${wizardStep === st.num ? 'text-navy' : 'text-muted'}`}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>

          {/* STEP 1: Brand & Business Vertical */}
          {wizardStep === 1 && (
            <div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-navy">Restaurant Brand Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Anand Royal Mithai & Sweets or Roast & Brew Cafe"
                  value={onboardingData.name}
                  onChange={(e) => setOnboardingData({ ...onboardingData, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-navy">Food Business Vertical (15 Formats)</label>
                <select
                  className="form-select fw-semibold text-navy"
                  value={onboardingData.businessType}
                  onChange={(e) => handleTypeChange(e.target.value as BusinessType)}
                >
                  {BUSINESS_TYPES_METADATA.map(b => (
                    <option key={b.type} value={b.type}>
                      {b.type} — {b.tagline}
                    </option>
                  ))}
                </select>
                <div className="small text-muted-custom mt-1">
                  Selecting a business type will automatically configure optimal POS, Table, Kitchen, and Billing modules.
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-navy">Tagline</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Pure Ghee Sweets & Savories"
                    value={onboardingData.tagline}
                    onChange={(e) => setOnboardingData({ ...onboardingData, tagline: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-navy">Subscription Plan</label>
                  <select
                    className="form-select"
                    value={onboardingData.subscriptionPlan}
                    onChange={(e) => setOnboardingData({ ...onboardingData, subscriptionPlan: e.target.value as any })}
                  >
                    <option value="Basic">Basic Plan (Single Outlet)</option>
                    <option value="Professional">Professional Plan (Multi-Branch)</option>
                    <option value="Enterprise">Enterprise Chain Plan</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-navy">Business Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Overview of dining concept, target demographic..."
                  value={onboardingData.description}
                  onChange={(e) => setOnboardingData({ ...onboardingData, description: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end pt-3">
                <button
                  type="button"
                  className="btn btn-brand text-white d-flex align-items-center gap-1"
                  disabled={!onboardingData.name.trim()}
                  onClick={() => setWizardStep(2)}
                >
                  <span>Next: Owner & Location</span>
                  <BiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Owner, Contact & Location */}
          {wizardStep === 2 && (
            <div>
              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-navy">Assign Franchise / Owner</label>
                  <select
                    className="form-select"
                    value={onboardingData.ownerName}
                    onChange={(e) => setOnboardingData({ ...onboardingData, ownerName: e.target.value })}
                  >
                    {SAMPLE_PLATFORM_OWNERS.map(o => (
                      <option key={o.id} value={o.name}>{o.name} ({o.email})</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-navy">Owner Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={onboardingData.ownerEmail}
                    onChange={(e) => setOnboardingData({ ...onboardingData, ownerEmail: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-navy">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={onboardingData.ownerPhone}
                    onChange={(e) => setOnboardingData({ ...onboardingData, ownerPhone: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-navy">Initial Branch Count</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    className="form-control"
                    value={onboardingData.branchCount}
                    onChange={(e) => setOnboardingData({ ...onboardingData, branchCount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-navy">GSTIN Number</label>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    value={onboardingData.gstin}
                    onChange={(e) => setOnboardingData({ ...onboardingData, gstin: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-navy">FSSAI License</label>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    value={onboardingData.fssaiNumber}
                    onChange={(e) => setOnboardingData({ ...onboardingData, fssaiNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-8">
                  <label className="form-label small fw-semibold text-navy">Business Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={onboardingData.address}
                    onChange={(e) => setOnboardingData({ ...onboardingData, address: e.target.value })}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold text-navy">City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={onboardingData.city}
                    onChange={(e) => setOnboardingData({ ...onboardingData, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between pt-3">
                <button
                  type="button"
                  className="btn btn-light d-flex align-items-center gap-1"
                  onClick={() => setWizardStep(1)}
                >
                  <BiChevronLeft size={18} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  className="btn btn-brand text-white d-flex align-items-center gap-1"
                  onClick={() => setWizardStep(3)}
                >
                  <span>Next: Operational Features</span>
                  <BiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Operational Features Configuration */}
          {wizardStep === 3 && (
            <div>
              <div className="p-3 bg-light rounded-3 mb-3 d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-bold text-navy">Presets for {onboardingData.businessType}</div>
                  <div className="small text-muted">Review or customize feature switches before provisioning</div>
                </div>
                <span className="badge badge-soft-brand">{onboardingData.businessType}</span>
              </div>

              <div className="row g-2 mb-4" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {[
                  { key: 'posBilling', label: 'POS Billing' },
                  { key: 'dineIn', label: 'Dine-In Service' },
                  { key: 'tableManagement', label: 'Table & Floor Management' },
                  { key: 'kitchenKot', label: 'Kitchen KOT Tickets' },
                  { key: 'kitchenKds', label: 'Kitchen KDS Screen' },
                  { key: 'takeaway', label: 'Takeaway Orders' },
                  { key: 'delivery', label: 'Delivery Dispatch' },
                  { key: 'inventory', label: 'Inventory & Stock' },
                  { key: 'recipeManagement', label: 'Recipe Auto-Deductions' },
                  { key: 'splitBilling', label: 'Split Billing' },
                  { key: 'weightBasedBilling', label: 'Weight-Based Billing (kg/g)' },
                  { key: 'customCakeOrders', label: 'Custom Cake Orders' },
                  { key: 'coffeeCustomization', label: 'Coffee Customization' },
                  { key: 'packagingCharges', label: 'Eco Packaging Charges' },
                ].map(({ key, label }) => {
                  const active = !!onboardingData.features[key as keyof BusinessFeatures];
                  return (
                    <div key={key} className="col-6">
                      <div className={`p-2 rounded-2 border d-flex align-items-center justify-content-between ${
                        active ? 'border-brand bg-white' : 'border-subtle bg-light text-muted'
                      }`}>
                        <span className="small fw-semibold">{label}</span>
                        <input
                          type="checkbox"
                          className="form-check-input ms-2"
                          checked={active}
                          onChange={() => handleToggleOnboardingFeature(key as keyof BusinessFeatures)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="d-flex justify-content-between pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-light d-flex align-items-center gap-1"
                  onClick={() => setWizardStep(2)}
                >
                  <BiChevronLeft size={18} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-brand text-white px-4 shadow-sm"
                >
                  Launch & Register Restaurant
                </button>
              </div>
            </div>
          )}
        </form>
      </Modal>

      {/* Modal: View Details */}
      {selectedRest && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={selectedRest.name}
          subtitle={`${selectedRest.businessType} • ${selectedRest.city}`}
          size="md"
        >
          <div>
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3">
              <img
                src={selectedRest.logo}
                alt={selectedRest.name}
                className="rounded-3 border"
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              />
              <div>
                <div className="fs-5 fw-bold text-navy">{selectedRest.name}</div>
                <div className="small text-muted">{selectedRest.tagline}</div>
              </div>
            </div>

            <div className="row g-2 mb-3 small">
              <div className="col-6">
                <span className="text-muted d-block">Owner:</span>
                <span className="fw-semibold text-navy">{selectedRest.ownerName}</span>
              </div>
              <div className="col-6">
                <span className="text-muted d-block">Contact:</span>
                <span className="fw-semibold text-navy">{selectedRest.ownerPhone}</span>
              </div>
              <div className="col-6">
                <span className="text-muted d-block">FSSAI Number:</span>
                <span className="font-monospace text-navy">{selectedRest.fssaiNumber}</span>
              </div>
              <div className="col-6">
                <span className="text-muted d-block">GSTIN:</span>
                <span className="font-monospace text-navy">{selectedRest.gstin}</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="small fw-bold text-navy text-uppercase mb-2 d-block">Active Operational Modules</label>
              <div className="d-flex gap-1 flex-wrap">
                {Object.entries(selectedRest.features)
                  .filter(([_, val]) => val)
                  .map(([key]) => (
                    <span key={key} className="badge bg-light text-navy border p-1 px-2" style={{ fontSize: '11px' }}>
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                  ))}
              </div>
            </div>

            <div className="d-flex justify-content-end pt-2 border-top">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsViewModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
