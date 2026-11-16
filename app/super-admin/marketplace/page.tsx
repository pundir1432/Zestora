'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_MARKETPLACE_FEATURES } from '@/data/saasData';
import { MarketplaceFeature } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiStore,
  BiPlus,
  BiCheck,
  BiSearch,
  BiTrendingUp,
  BiDollarCircle,
  BiCog,
  BiStar,
  BiEdit,
  BiLayer,
} from 'react-icons/bi';

export default function SuperAdminMarketplacePage() {
  const [features, setFeatures] = useState<MarketplaceFeature[]>(SAMPLE_MARKETPLACE_FEATURES);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<MarketplaceFeature | null>(null);

  // New Add-on form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MarketplaceFeature['category']>('Integrations');
  const [newPrice, setNewPrice] = useState(799);
  const [newTagline, setNewTagline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newBadge, setNewBadge] = useState('');

  const filteredFeatures = useMemo(() => {
    return features.filter((feat) => {
      const matchCat = categoryFilter === 'All' || feat.category === categoryFilter;
      const matchSearch =
        feat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feat.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feat.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [features, categoryFilter, searchTerm]);

  const totalInstalls = useMemo(
    () => features.reduce((acc, feat) => acc + feat.installsCount, 0),
    [features]
  );

  const monthlyGrossMrr = useMemo(
    () => features.reduce((acc, feat) => acc + feat.monthlyPrice * feat.installsCount, 0),
    [features]
  );

  const handleCreateAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: MarketplaceFeature = {
      id: `feat-${Date.now()}`,
      name: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newCategory,
      monthlyPrice: Number(newPrice) || 0,
      isInstalled: false,
      rating: 5.0,
      installsCount: 0,
      badge: newBadge ? newBadge : undefined,
      tagline: newTagline || 'Advanced SaaS enterprise add-on capability',
      description: newDescription || 'Seamless plug-and-play module for your restaurant POS.',
      features: ['Automated background sync', 'Custom business rules', '24/7 priority SLA support'],
    };

    setFeatures([created, ...features]);
    setShowAddModal(false);
    // Reset form
    setNewTitle('');
    setNewPrice(799);
    setNewTagline('');
    setNewDescription('');
    setNewBadge('');
  };

  const handleUpdateFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature) return;

    setFeatures((prev) =>
      prev.map((f) => (f.id === editingFeature.id ? editingFeature : f))
    );
    setEditingFeature(null);
  };

  const categories = ['All', 'Automation', 'Integrations', 'AI & Analytics', 'Hardware', 'Marketing'];

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Platform Feature Marketplace Catalog</h1>
            <p className="text-muted small mb-0">
              Manage monetization modules, third-party integrations, and add-on subscriptions available to all restaurant tenants.
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <BiPlus size={18} /> Publish New Add-on
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Active Add-on Catalog</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiStore size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{features.length} Modules</h3>
              <span className="text-muted small">Available across all restaurant tenants</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Total Tenant Installs</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiTrendingUp size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>{formatNumber(totalInstalls)} Active</h3>
              <span className="text-success small fw-medium">+24 new installs this week</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Monthly Marketplace MRR</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiDollarCircle size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(monthlyGrossMrr)}</h3>
              <span className="text-muted small">Direct monthly recurring add-on revenue</span>
            </div>
          </div>
        </div>

        {/* Search & Category Pills */}
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
                    placeholder="Search add-on title or keyword..."
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
                      <span>Active Tenants</span>
                      <span className="fw-semibold text-dark" suppressHydrationWarning>
                        {formatNumber(feat.installsCount)} restaurants
                      </span>
                    </div>
                  </div>

                  <ul className="list-unstyled small text-muted mb-0">
                    {feat.features.slice(0, 3).map((f, idx) => (
                      <li key={idx} className="mb-1 d-flex align-items-start">
                        <BiCheck className="text-success me-2 mt-1 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-footer bg-white border-top p-3 d-flex justify-content-between align-items-center">
                  <span className="badge bg-success-subtle text-success border border-success-subtle">
                    Live in Store
                  </span>
                  <button
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                    onClick={() => setEditingFeature({ ...feat })}
                  >
                    <BiEdit /> Edit Catalog Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Publish New Add-on */}
        {showAddModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleCreateAddon}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Publish New Marketplace Add-on</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Add-on Title *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Dynamic Loyalty Point Engine"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Category *</label>
                        <select
                          className="form-select form-select-sm"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as MarketplaceFeature['category'])}
                        >
                          <option value="Automation">Automation</option>
                          <option value="Integrations">Integrations</option>
                          <option value="AI & Analytics">AI & Analytics</option>
                          <option value="Hardware">Hardware</option>
                          <option value="Marketing">Marketing</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Monthly Price (₹) *</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          required
                          value={newPrice}
                          onChange={(e) => setNewPrice(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Promotional Badge (Optional)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Popular, Hot, AI Powered"
                        value={newBadge}
                        onChange={(e) => setNewBadge(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Tagline / Short Summary *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="One liner explaining benefit to restaurant"
                        value={newTagline}
                        onChange={(e) => setNewTagline(e.target.value)}
                      />
                    </div>

                    <div className="mb-0">
                      <label className="form-label small fw-semibold">Detailed Description</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={3}
                        placeholder="Explain technical capabilities, hardware requirements, etc."
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                      ></textarea>
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
                      Publish Add-on
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Existing Add-on */}
        {editingFeature && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleUpdateFeature}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Edit Marketplace Add-on</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setEditingFeature(null)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Add-on Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editingFeature.name}
                        onChange={(e) => setEditingFeature({ ...editingFeature, name: e.target.value })}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Category</label>
                        <select
                          className="form-select form-select-sm"
                          value={editingFeature.category}
                          onChange={(e) =>
                            setEditingFeature({
                              ...editingFeature,
                              category: e.target.value as MarketplaceFeature['category'],
                            })
                          }
                        >
                          <option value="Automation">Automation</option>
                          <option value="Integrations">Integrations</option>
                          <option value="AI & Analytics">AI & Analytics</option>
                          <option value="Hardware">Hardware</option>
                          <option value="Marketing">Marketing</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Monthly Price (₹)</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={editingFeature.monthlyPrice}
                          onChange={(e) =>
                            setEditingFeature({
                              ...editingFeature,
                              monthlyPrice: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Badge</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editingFeature.badge || ''}
                        onChange={(e) => setEditingFeature({ ...editingFeature, badge: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Tagline</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editingFeature.tagline}
                        onChange={(e) => setEditingFeature({ ...editingFeature, tagline: e.target.value })}
                      />
                    </div>

                    <div className="mb-0">
                      <label className="form-label small fw-semibold">Description</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={3}
                        value={editingFeature.description}
                        onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingFeature(null)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Save Changes
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
