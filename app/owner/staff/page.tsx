'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SAMPLE_STAFF } from '@/data/staffData';
import { StaffMember, StaffRole } from '@/types/staff';
import { useAuth } from '@/context/AuthContext';
import { Modal } from '@/components/common/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatNumber } from '@/utils/formatters';
import { 
  BiSearch, 
  BiPlus, 
  BiEdit, 
  BiPowerOff, 
  BiPhone, 
  BiEnvelope, 
  BiBuilding, 
  BiTime, 
  BiCheckCircle,
  BiUser,
  BiShieldQuarter,
  BiCheck,
  BiX
} from 'react-icons/bi';

const ALL_ROLES: StaffRole[] = [
  'Branch Manager',
  'Cashier',
  'Kitchen Staff',
  'Waiter',
  'Inventory Manager',
  'Delivery Manager',
];

export default function StaffManagementPage() {
  const { currentRestaurant } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>(SAMPLE_STAFF);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    role: 'Cashier' as StaffRole,
    branchName: 'Indiranagar Branch',
    email: '',
    phone: '',
    salary: 25000,
    shift: 'Morning' as 'Morning' | 'Evening' | 'Full Day',
  });

  const filteredStaff = staff.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'All' || s.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      role: 'Cashier',
      branchName: currentRestaurant.branches[0]?.name || 'Indiranagar Branch',
      email: '',
      phone: '',
      salary: 25000,
      shift: 'Morning',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: StaffMember = {
      id: `stf-${Date.now()}`,
      name: formData.name,
      role: formData.role,
      branchId: 'branch-1',
      branchName: formData.branchName,
      email: formData.email,
      phone: formData.phone,
      salary: Number(formData.salary),
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'active',
      shift: formData.shift,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    };
    setStaff([newMember, ...staff]);
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (member: StaffMember) => {
    setSelectedStaff(member);
    setFormData({
      name: member.name,
      role: member.role,
      branchName: member.branchName,
      email: member.email,
      phone: member.phone,
      salary: member.salary,
      shift: member.shift,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    setStaff(prev => prev.map(s => s.id === selectedStaff.id ? {
      ...s,
      name: formData.name,
      role: formData.role,
      branchName: formData.branchName,
      email: formData.email,
      phone: formData.phone,
      salary: Number(formData.salary),
      shift: formData.shift,
    } : s));
    setIsEditModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id === id) {
        const next = s.status === 'active' ? 'inactive' : 'active';
        return { ...s, status: next };
      }
      return s;
    }));
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      {/* Title */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Restaurant Staff & Employee Roles</h4>
          <p className="text-muted-custom small mb-0">
            Shift scheduling, multi-branch employee assignment, and granular access permissions
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-1 shadow-sm"
            onClick={() => setIsMatrixOpen(true)}
          >
            <BiShieldQuarter size={18} />
            <span>Role Permissions Matrix</span>
          </button>

          <button
            type="button"
            className="btn btn-brand d-flex align-items-center gap-2 shadow-sm text-white"
            onClick={handleOpenAdd}
          >
            <BiPlus size={20} />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
                placeholder="Search staff by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 ms-auto">
            <div className="d-flex align-items-center justify-content-md-end gap-2">
              <span className="text-muted-custom small fw-semibold">Role:</span>
              <select
                className="form-select form-select-sm border-subtle w-auto"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles ({staff.length})</option>
                {ALL_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted-custom">
                <th>Staff Member</th>
                <th>Role</th>
                <th>Assigned Outlet</th>
                <th>Contact Details</th>
                <th>Shift</th>
                <th>Monthly Salary</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'}
                        alt={member.name}
                        className="rounded-circle border"
                        style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="fw-semibold text-navy small">{member.name}</div>
                        <div className="text-muted-custom font-monospace" style={{ fontSize: '11px' }}>ID: {member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-soft-brand fw-semibold">
                      {member.role}
                    </span>
                  </td>
                  <td className="small">{member.branchName}</td>
                  <td className="small">
                    <div>{member.phone}</div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>{member.email}</div>
                  </td>
                  <td>
                    <span className="badge bg-light text-navy border">
                      {member.shift}
                    </span>
                  </td>
                  <td className="fw-semibold text-navy small" suppressHydrationWarning>₹{formatNumber(member.salary)}</td>
                  <td className="small text-muted-custom">{member.joiningDate}</td>
                  <td>
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-secondary p-1"
                        onClick={() => handleOpenEdit(member)}
                        title="Edit Details"
                      >
                        <BiEdit size={16} />
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${member.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'} p-1`}
                        onClick={() => handleToggleStatus(member.id)}
                        title={member.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <BiPowerOff size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Role Permissions Matrix */}
      <Modal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        title="Role Access Permissions Matrix"
        subtitle="Access control rules enforced across all system interfaces"
        size="lg"
      >
        <div className="table-responsive">
          <table className="table table-sm table-bordered align-middle text-center mb-0">
            <thead className="table-light">
              <tr className="small text-muted-custom">
                <th className="text-start">Feature Module</th>
                <th>Owner</th>
                <th>Branch Mgr</th>
                <th>Cashier</th>
                <th>Waiter</th>
                <th>Kitchen</th>
                <th>Inventory</th>
                <th>Delivery</th>
              </tr>
            </thead>
            <tbody className="small">
              {[
                { module: 'POS Billing & Checkout', roles: ['Owner', 'Branch Mgr', 'Cashier'] },
                { module: 'Table & Floor Management', roles: ['Owner', 'Branch Mgr', 'Cashier', 'Waiter'] },
                { module: 'Kitchen KOT / KDS Display', roles: ['Owner', 'Branch Mgr', 'Kitchen'] },
                { module: 'Menu & Pricing Editing', roles: ['Owner', 'Branch Mgr'] },
                { module: 'Stock & Purchase Orders', roles: ['Owner', 'Branch Mgr', 'Inventory'] },
                { module: 'Delivery Partner Dispatch', roles: ['Owner', 'Branch Mgr', 'Cashier', 'Delivery'] },
                { module: 'Customer CRM & Discounts', roles: ['Owner', 'Branch Mgr', 'Cashier'] },
                { module: 'Sales & Revenue Reports', roles: ['Owner', 'Branch Mgr'] },
                { module: 'Restaurant Settings & Tax', roles: ['Owner'] },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="text-start fw-semibold text-navy">{row.module}</td>
                  {['Owner', 'Branch Mgr', 'Cashier', 'Waiter', 'Kitchen', 'Inventory', 'Delivery'].map(r => (
                    <td key={r}>
                      {row.roles.includes(r) ? (
                        <BiCheck className="text-success fs-5" />
                      ) : (
                        <BiX className="text-muted-custom fs-5" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Modal: Add Staff */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Staff Member"
        size="md"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Assigned Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })}
              >
                {ALL_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Assigned Outlet</label>
              <select
                className="form-select"
                value={formData.branchName}
                onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
              >
                {currentRestaurant.branches.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="staff@restaurant.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-4">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Monthly Salary (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Working Shift</label>
              <select
                className="form-select"
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
              >
                <option value="Morning">Morning Shift (8 AM - 4 PM)</option>
                <option value="Evening">Evening Shift (3 PM - 11 PM)</option>
                <option value="Full Day">Full Day Shift</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand text-white">
              Save Staff Member
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Staff */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Staff Member"
        size="md"
      >
        <form onSubmit={handleSaveEdit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })}
              >
                {ALL_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Shift</label>
              <select
                className="form-select"
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Full Day">Full Day</option>
              </select>
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Phone</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-navy">Monthly Salary (₹)</label>
            <input
              type="number"
              className="form-control"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
              required
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand text-white">
              Update Details
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
