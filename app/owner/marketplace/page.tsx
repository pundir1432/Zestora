'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_MARKETPLACE_FEATURES } from '@/data/saasData';
import { MarketplaceFeature } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiStore,
  BiCheck,
  BiSearch,
  BiPlus,
  BiStar,
  BiDollarCircle,
  BiCheckCircle,
} from 'react-icons/bi';

export default function BusinessOwnerMarketplacePage() {
  const [features, setFeatures] = useState<MarketplaceFeature[]>(SAMPLE_MARKETPLACE_FEATURES);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'browse' | 'installed'>('browse');

  const filteredFeatures = useMemo(() => {
    return features.filter((feat) => {
      const matchCat = categoryFilter === 'All' || feat.category === categoryFilter;
      const matchSearch =
        feat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feat.tagline.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTab = activeTab === 'browse' ? true : feat.isInstalled;
      return matchCat && matchSearch && matchTab;
    });
  }, [features, categoryFilter, searchTerm, activeTab]);

  const installedCount = useMemo(() => features.filter((f) => f.isInstalled).length, [features]);

  const monthlyAddonBill = useMemo(
    () => features.filter((f) => f.isInstalled).reduce((acc, f) => acc + f.monthlyPrice, 0),
    [features]
  );

  const handleToggleInstall = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, isInstalled: !f.isInstalled } : f
      )
    );
  };

  const categories = ['All', 'Automation', 'Integrations', 'AI & Analytics', 'Hardware', 'Marketing'];

  return (
    <DashboardLayout allowedRoles={['restaurant_owner']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Feature Marketplace & Add-ons Store</h1>
            <p className="text-muted small mb-0">
              Supercharge your restaurant operations with AI demand forecasters, WhatsApp automation bots, kitchen KDS screens, and accounting sync.
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm ${activeTab === 'browse' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('browse')}
            >
              Browse All ({features.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'installed' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('installed')}
            >
              Installed Modules ({installedCount})
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Active Add-on Subscriptions</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiCheckCircle size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{installedCount} Modules Active</h3>
              <span className="text-muted small">Billed automatically with monthly SaaS invoice</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Monthly Add-on Spend</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiDollarCircle size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(monthlyAddonBill)} / mo</h3>
              <span className="text-muted small">Cancel or pause modules anytime</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Estimated Monthly Cost Savings</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiStore size={20} />
                </span>
              </div>
              <h3 className="fw-bold text-success mb-1" suppressHydrationWarning>₹{formatNumber(18400)}</h3>
              <span className="text-success small fw-medium">Saved in reduced food waste & man hours</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
          <div className="card-body p-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${
                      categoryFilter === cat ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div style={{ maxWidth: '300px' }} className="w-100">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <BiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add-ons Grid */}
        <div className="row g-3">
          {filteredFeatures.map((feat) => (
            <div key={feat.id} className="col-12 col-md-6 col-xl-4">
              <div className="card border-0 shadow-sm rounded-3 bg-white h-100 d-flex flex-column">
                <div className="card-body p-4 flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-light text-dark border me-1 mb-2">
                        {feat.category}
                      </span>
                      {feat.badge && (
                        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle mb-2">
                          {feat.badge}
                        </span>
                      )}
                      <h5 className="fw-bold text-dark mb-1">{feat.name}</h5>
                    </div>
                    <div className="text-end">
                      <span className="h5 fw-bold text-primary d-block mb-0" suppressHydrationWarning>
                        ₹{formatNumber(feat.monthlyPrice)}
                      </span>
                      <span className="text-muted small">/month</span>
                    </div>
                  </div>

                  <p className="text-muted small mb-3">{feat.tagline}</p>

                  <div className="p-3 bg-light rounded-2 mb-3">
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>Rating</span>
                      <span className="fw-semibold text-dark d-flex align-items-center">
                        <BiStar className="text-warning me-1" /> {feat.rating} / 5.0
                      </span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Active in Industry</span>
                      <span className="fw-semibold text-dark" suppressHydrationWarning>
                        {formatNumber(feat.installsCount)} restaurants
                      </span>
                    </div>
                  </div>

                  <ul className="list-unstyled small text-muted mb-0">
                    {feat.features.map((f, idx) => (
                      <li key={idx} className="mb-2 d-flex align-items-start">
                        <BiCheck className="text-success me-2 mt-1 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-footer bg-white border-top p-3 d-flex justify-content-between align-items-center">
                  <div>
                    {feat.isInstalled ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle d-flex align-items-center gap-1">
                        <BiCheckCircle /> Active on All Terminals
                      </span>
                    ) : (
                      <span className="text-muted small">14-day free trial included</span>
                    )}
                  </div>
                  <button
                    className={`btn btn-sm ${
                      feat.isInstalled ? 'btn-outline-danger' : 'btn-primary'
                    }`}
                    onClick={() => handleToggleInstall(feat.id)}
                  >
                    {feat.isInstalled ? 'Uninstall' : 'Activate Module'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
