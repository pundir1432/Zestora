'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SAMPLE_PLATFORM_OWNERS, PlatformOwner } from '@/data/superAdminData';
import { Modal } from '@/components/common/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  BiSearch, 
  BiPlus, 
  BiEdit, 
  BiShow, 
  BiPowerOff, 
  BiFilterAlt,
  BiUser,
  BiPhone,
  BiEnvelope,
  BiMapPin,
  BiBuilding,
  BiCheckCircle
} from 'react-icons/bi';

export default function RestaurantOwnersPage() {
  const [owners, setOwners] = useState<PlatformOwner[]>(SAMPLE_PLATFORM_OWNERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'pending' | 'suspended'>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<PlatformOwner | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    subscriptionPlan: 'Professional' as 'Basic' | 'Professional' | 'Enterprise',
  });

  // Filtered list
  const filteredOwners = owners.filter((owner) => {
    const matchesSearch = 
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || owner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      subscriptionPlan: 'Professional',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newOwner: PlatformOwner = {
      id: `owner-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city || 'Bengaluru',
      restaurantsCount: 1,
      branchesCount: 1,
      registeredDate: new Date().toISOString().split('T')[0],
      subscriptionPlan: formData.subscriptionPlan,
      status: 'active',
      totalRevenueGenerated: 0,
    };
    setOwners([newOwner, ...owners]);
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (owner: PlatformOwner) => {
    setSelectedOwner(owner);
    setFormData({
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      city: owner.city,
      subscriptionPlan: owner.subscriptionPlan,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOwner) return;
    setOwners(prev => prev.map(o => o.id === selectedOwner.id ? {
      ...o,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      subscriptionPlan: formData.subscriptionPlan,
    } : o));
    setIsEditModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setOwners(prev => prev.map(o => {
      if (o.id === id) {
        const nextStatus = o.status === 'active' ? 'suspended' : 'active';
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  const handleOpenView = (owner: PlatformOwner) => {
    setSelectedOwner(owner);
    setIsViewModalOpen(true);
  };

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      {/* Page Title & Add Button */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Restaurant Owners Management</h4>
          <p className="text-muted-custom small mb-0">
            View, onboard, and manage restaurant business owner accounts
          </p>
        </div>

        <button
          type="button"
          className="btn btn-brand d-flex align-items-center gap-2 shadow-sm"
          onClick={handleOpenAdd}
        >
          <BiPlus size={20} />
          <span>Add New Owner</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="app-card p-3 mb-4 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-surface border-subtle text-muted">
                <BiSearch size={18} />
              </span>
              <input
                type="text"
                className="form-control border-subtle"
                placeholder="Search by owner name, email or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 ms-auto">
            <div className="d-flex align-items-center justify-content-md-end gap-2">
              <span className="text-muted-custom small fw-semibold">Status:</span>
              <select
                className="form-select form-select-sm border-subtle w-auto"
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
      </div>

      {/* Owners Table */}
      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted-custom">
                <th>Owner Details</th>
                <th>Phone Number</th>
                <th>City</th>
                <th className="text-center">Restaurants</th>
                <th className="text-center">Branches</th>
                <th>SaaS Plan</th>
                <th>Registration Date</th>
                <th>Account Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOwners.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-5 text-muted-custom">
                    No restaurant owners matching your query.
                  </td>
                </tr>
              ) : (
                filteredOwners.map((owner) => (
                  <tr key={owner.id}>
                    <td>
                      <div className="fw-semibold text-navy">{owner.name}</div>
                      <div className="text-muted-custom small">{owner.email}</div>
                    </td>
                    <td className="small">{owner.phone}</td>
                    <td className="small">{owner.city}</td>
                    <td className="text-center small fw-semibold">{owner.restaurantsCount}</td>
                    <td className="text-center small fw-semibold">{owner.branchesCount}</td>
                    <td>
                      <span className="badge badge-soft-brand">{owner.subscriptionPlan}</span>
                    </td>
                    <td className="small text-muted-custom">{owner.registeredDate}</td>
                    <td>
                      <StatusBadge status={owner.status} />
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary p-1"
                          onClick={() => handleOpenView(owner)}
                          title="View Details"
                        >
                          <BiShow size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary p-1"
                          onClick={() => handleOpenEdit(owner)}
                          title="Edit Owner"
                        >
                          <BiEdit size={16} />
                        </button>
                        <button
                          type="button"
                          className={`btn p-1 ${owner.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          onClick={() => handleToggleStatus(owner.id)}
                          title={owner.status === 'active' ? 'Deactivate Owner' : 'Activate Owner'}
                        >
                          <BiPowerOff size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Owner */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Restaurant Owner"
        subtitle="Onboard a new restaurant business partner"
        size="md"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Full Name</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              placeholder="e.g. Vikram Singhania"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Email Address</label>
            <input
              type="email"
              className="form-control form-control-sm border-subtle"
              placeholder="e.g. owner@restaurant.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Phone Number</label>
              <input
                type="tel"
                className="form-control form-control-sm border-subtle"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">City</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                placeholder="e.g. Bengaluru"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-navy">Subscription Plan</label>
            <select
              className="form-select form-select-sm border-subtle"
              value={formData.subscriptionPlan}
              onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value as any })}
            >
              <option value="Basic">Basic (₹1,499 / mo)</option>
              <option value="Professional">Professional (₹2,999 / mo)</option>
              <option value="Enterprise">Enterprise (₹5,999 / mo)</option>
            </select>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm">
              Save & Onboard
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Owner */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Restaurant Owner"
        subtitle={`Updating profile for ${selectedOwner?.name}`}
        size="md"
      >
        <form onSubmit={handleSaveEdit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Full Name</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Email Address</label>
            <input
              type="email"
              className="form-control form-control-sm border-subtle"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Phone Number</label>
              <input
                type="tel"
                className="form-control form-control-sm border-subtle"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">City</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-navy">Subscription Plan</label>
            <select
              className="form-select form-select-sm border-subtle"
              value={formData.subscriptionPlan}
              onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value as any })}
            >
              <option value="Basic">Basic</option>
              <option value="Professional">Professional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm">
              Update Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Owner Details */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Owner Account Overview"
        subtitle={`ID: ${selectedOwner?.id}`}
        size="md"
      >
        {selectedOwner && (
          <div className="d-flex flex-column gap-3">
            <div className="p-3 bg-surface rounded-3 border border-subtle">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold text-navy mb-0">{selectedOwner.name}</h5>
                <StatusBadge status={selectedOwner.status} />
              </div>
              <div className="d-flex align-items-center gap-2 text-muted-custom small mb-1">
                <BiEnvelope className="text-brand" /> {selectedOwner.email}
              </div>
              <div className="d-flex align-items-center gap-2 text-muted-custom small mb-1">
                <BiPhone className="text-brand" /> {selectedOwner.phone}
              </div>
              <div className="d-flex align-items-center gap-2 text-muted-custom small">
                <BiMapPin className="text-brand" /> {selectedOwner.city}
              </div>
            </div>

            <div className="row g-2">
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 text-center border border-subtle">
                  <span className="small text-muted-custom d-block">Active Outlets</span>
                  <strong className="fs-5 text-navy">{selectedOwner.branchesCount} Branches</strong>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 text-center border border-subtle">
                  <span className="small text-muted-custom d-block">SaaS Subscription</span>
                  <strong className="fs-5 text-brand">{selectedOwner.subscriptionPlan}</strong>
                </div>
              </div>
            </div>

            <div className="p-3 bg-surface rounded-3 border border-subtle small">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted-custom">Registered Since:</span>
                <span className="fw-semibold text-navy">{selectedOwner.registeredDate}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted-custom">Lifetime Platform Volume:</span>
                <span className="fw-semibold text-navy">₹{(selectedOwner.totalRevenueGenerated / 100000).toFixed(1)} Lakhs</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted-custom">KYC & FSSAI Verification:</span>
                <span className="text-success fw-bold d-flex align-items-center gap-1">
                  <BiCheckCircle /> Verified
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

