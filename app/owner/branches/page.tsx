'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Branch } from '@/types/restaurant';
import { Modal } from '@/components/common/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  BiBuilding, 
  BiPlus, 
  BiEdit, 
  BiMapPin, 
  BiPhone, 
  BiTime, 
  BiUser, 
  BiPowerOff,
  BiTrash,
  BiCheckCircle
} from 'react-icons/bi';

export default function BranchesPage() {
  const { currentRestaurant, switchBranch, addBranch, updateBranch, deleteBranch } = useAuth();
  const branches = currentRestaurant.branches;

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: 'Bengaluru',
    pincode: '560038',
    phone: '',
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    openingHours: '11:00 AM - 11:30 PM',
    seatingCapacity: 60,
    tablesCount: 16,
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      code: `FP-0${branches.length + 1}`,
      address: '',
      city: 'Bengaluru',
      pincode: '560001',
      phone: '+91 80 4400 2200',
      managerName: '',
      managerPhone: '+91 98450 00000',
      managerEmail: 'manager@foodpalace.com',
      openingHours: '11:00 AM - 11:30 PM',
      seatingCapacity: 60,
      tablesCount: 16,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addBranch({
      name: formData.name,
      code: formData.code,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      phone: formData.phone,
      managerName: formData.managerName,
      managerPhone: formData.managerPhone,
      managerEmail: formData.managerEmail,
      openingHours: formData.openingHours,
      seatingCapacity: Number(formData.seatingCapacity),
      tablesCount: Number(formData.tablesCount),
      status: 'active',
    });
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      city: branch.city,
      pincode: branch.pincode,
      phone: branch.phone,
      managerName: branch.managerName,
      managerPhone: branch.managerPhone,
      managerEmail: branch.managerEmail,
      openingHours: branch.openingHours,
      seatingCapacity: branch.seatingCapacity,
      tablesCount: branch.tablesCount,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch) return;

    updateBranch(selectedBranch.id, {
      name: formData.name,
      code: formData.code,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      phone: formData.phone,
      managerName: formData.managerName,
      managerPhone: formData.managerPhone,
      managerEmail: formData.managerEmail,
      openingHours: formData.openingHours,
      seatingCapacity: Number(formData.seatingCapacity),
      tablesCount: Number(formData.tablesCount),
    });
    setIsEditModalOpen(false);
  };

  const handleToggleStatus = (b: Branch) => {
    const nextStatus = b.status === 'active' ? 'inactive' : 'active';
    updateBranch(b.id, { status: nextStatus });
  };

  const handleOpenDelete = (b: Branch) => {
    setSelectedBranch(b);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedBranch) return;
    deleteBranch(selectedBranch.id);
    setIsDeleteModalOpen(false);
    setSelectedBranch(null);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner']}>
      {/* Title */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">{currentRestaurant.name} Outlets & Branches</h4>
          <p className="text-muted-custom small mb-0">
            Multi-branch operations, store managers, seating capacities, and operating hours
          </p>
        </div>

        <button
          type="button"
          className="btn btn-brand d-flex align-items-center gap-2 shadow-sm"
          onClick={handleOpenAdd}
        >
          <BiPlus size={20} />
          <span>Add New Branch</span>
        </button>
      </div>

      {/* Restaurant Profile Summary Card */}
      <div className="app-card p-4 mb-4 bg-white">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <img
              src={currentRestaurant.logo}
              alt={currentRestaurant.name}
              className="rounded-3 border border-subtle"
              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
            />
            <div>
              <h5 className="fw-bold text-navy mb-1">{currentRestaurant.name}</h5>
              <div className="text-muted-custom small mb-2">{currentRestaurant.tagline}</div>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge badge-soft-brand">SaaS: {currentRestaurant.subscriptionPlan} Plan</span>
                <span className="badge bg-light text-navy border">FSSAI: {currentRestaurant.fssaiNumber}</span>
                <span className="badge bg-light text-navy border">GSTIN: {currentRestaurant.gstin}</span>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-center p-2 px-3 bg-surface rounded-3 border border-subtle">
              <span className="small text-muted-custom d-block">Total Outlets</span>
              <strong className="fs-5 text-navy">{branches.length}</strong>
            </div>
            <div className="text-center p-2 px-3 bg-surface rounded-3 border border-subtle">
              <span className="small text-muted-custom d-block">Combined Seating</span>
              <strong className="fs-5 text-brand">
                {branches.reduce((sum, b) => sum + (b.seatingCapacity || 0), 0)} Pax
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Branches Cards Grid */}
      <div className="row g-4">
        {branches.map((b) => (
          <div key={b.id} className="col-12 col-md-6 col-xl-4">
            <div className="app-card p-4 h-100 d-flex flex-column justify-content-between shadow-sm">
              <div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="fw-bold text-navy mb-0">{b.name}</h5>
                    <span className="badge bg-secondary text-white mt-1" style={{ fontSize: '10px' }}>
                      Outlet Code: {b.code}
                    </span>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <div className="d-flex flex-column gap-2 my-3 text-navy small">
                  <div className="d-flex align-items-start gap-2">
                    <BiMapPin className="text-brand flex-shrink-0 mt-1" size={16} />
                    <span>{b.address}, {b.city} - {b.pincode}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <BiPhone className="text-brand flex-shrink-0" size={16} />
                    <span>{b.phone}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <BiTime className="text-brand flex-shrink-0" size={16} />
                    <span>{b.openingHours}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2 pt-2 border-top border-subtle">
                    <BiUser className="text-navy flex-shrink-0" size={16} />
                    <span>
                      Manager: <strong>{b.managerName}</strong> ({b.managerPhone})
                    </span>
                  </div>
                </div>

                <div className="row g-2 p-2 bg-surface rounded-3 border border-subtle text-center small mb-3">
                  <div className="col-4">
                    <span className="text-muted-custom d-block" style={{ fontSize: '11px' }}>Tables</span>
                    <strong className="text-navy">{b.tablesCount}</strong>
                  </div>
                  <div className="col-4">
                    <span className="text-muted-custom d-block" style={{ fontSize: '11px' }}>Capacity</span>
                    <strong className="text-navy">{b.seatingCapacity} Seats</strong>
                  </div>
                  <div className="col-4">
                    <span className="text-muted-custom d-block" style={{ fontSize: '11px' }}>Active Orders</span>
                    <strong className="text-brand">{b.activeOrdersCount || 0}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-top border-subtle d-flex align-items-center justify-content-between gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-brand flex-grow-1"
                  onClick={() => switchBranch(b.id)}
                  title="Filter all reports and dashboards to this branch"
                >
                  Set as Active View
                </button>

                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary p-1"
                    onClick={() => handleOpenEdit(b)}
                    title="Edit Branch"
                  >
                    <BiEdit size={16} />
                  </button>
                  <button
                    type="button"
                    className={`btn p-1 ${b.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                    onClick={() => handleToggleStatus(b)}
                    title={b.status === 'active' ? 'Deactivate Branch' : 'Activate Branch'}
                  >
                    <BiPowerOff size={16} />
                  </button>
                  {branches.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger p-1"
                      onClick={() => handleOpenDelete(b)}
                      title="Delete Branch"
                    >
                      <BiTrash size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add New Branch */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Branch Outlet"
        subtitle={`Expanding ${currentRestaurant.name}`}
        size="md"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="row g-2 mb-3">
            <div className="col-8">
              <label className="form-label small fw-semibold text-navy">Branch Name</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                placeholder="e.g. HSR Layout Branch"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="col-4">
              <label className="form-label small fw-semibold text-navy">Branch Code</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle text-uppercase font-monospace"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Street Address</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              placeholder="e.g. 27th Main, Sector 1"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="row g-2 mb-3">
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
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Pincode</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle font-monospace"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Branch Contact Phone</label>
              <input
                type="tel"
                className="form-control form-control-sm border-subtle"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Operating Hours</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Manager Name</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                placeholder="e.g. Kavita Reddy"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Manager Mobile</label>
              <input
                type="tel"
                className="form-control form-control-sm border-subtle"
                value={formData.managerPhone}
                onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-4">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Total Tables</label>
              <input
                type="number"
                className="form-control form-control-sm border-subtle"
                value={formData.tablesCount}
                onChange={(e) => setFormData({ ...formData, tablesCount: Number(e.target.value) })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Seating Capacity (Pax)</label>
              <input
                type="number"
                className="form-control form-control-sm border-subtle"
                value={formData.seatingCapacity}
                onChange={(e) => setFormData({ ...formData, seatingCapacity: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm">
              Save & Launch Branch
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Branch */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Branch Information"
        subtitle={`Updating ${selectedBranch?.name}`}
        size="md"
      >
        <form onSubmit={handleSaveEdit}>
          <div className="row g-2 mb-3">
            <div className="col-8">
              <label className="form-label small fw-semibold text-navy">Branch Name</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="col-4">
              <label className="form-label small fw-semibold text-navy">Branch Code</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle text-uppercase font-monospace"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Street Address</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Branch Contact Phone</label>
              <input
                type="tel"
                className="form-control form-control-sm border-subtle"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Operating Hours</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-4">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Manager Name</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Manager Mobile</label>
              <input
                type="tel"
                className="form-control form-control-sm border-subtle"
                value={formData.managerPhone}
                onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Delete Branch Confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Outlet Branch"
        subtitle={selectedBranch?.name || ''}
        size="sm"
      >
        <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-3 mb-3 small">
          <strong>Warning:</strong> Deleting this branch will unbind its assigned POS tables and localized inventory orders. This action cannot be undone.
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleConfirmDelete}
          >
            Yes, Delete Branch
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
