'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SAMPLE_CUSTOMERS } from '@/data/customersData';
import { Customer, CustomerGroup } from '@/types/customer';
import { formatNumber } from '@/utils/formatters';
import { Modal } from '@/components/common/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  BiSearch, 
  BiPlus, 
  BiEdit, 
  BiShow, 
  BiPhone, 
  BiEnvelope, 
  BiMapPin, 
  BiStar, 
  BiDish, 
  BiCheckCircle,
  BiCake,
  BiCalendarHeart,
  BiGift,
  BiBuilding
} from 'react-icons/bi';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(SAMPLE_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    category: 'Regular' as CustomerGroup,
    customerGroup: 'Regular' as CustomerGroup,
    dateOfBirth: '',
    anniversaryDate: '',
  });

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === 'All' || c.customerGroup === groupFilter || c.category === groupFilter;

    return matchesSearch && matchesGroup;
  });

  const totalLoyaltyPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
  const vipCount = customers.filter(c => c.customerGroup === 'VIP' || c.category === 'VIP').length;

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      category: 'Regular',
      customerGroup: 'Regular',
      dateOfBirth: '',
      anniversaryDate: '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      totalOrders: 1,
      totalSpending: 0,
      lastOrderDate: new Date().toISOString().split('T')[0],
      category: formData.category,
      customerGroup: formData.customerGroup,
      dateOfBirth: formData.dateOfBirth || undefined,
      anniversaryDate: formData.anniversaryDate || undefined,
      loyaltyPoints: 100,
      favoriteItems: ['Paneer Tikka Angara'],
      status: 'active',
      activeCoupons: ['WELCOME100', 'FREEBEVERAGE'],
    };
    setCustomers([newCust, ...customers]);
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (c: Customer) => {
    setSelectedCust(c);
    setFormData({
      name: c.name,
      phone: c.phone,
      email: c.email,
      address: c.address || '',
      category: c.category,
      customerGroup: c.customerGroup || 'Regular',
      dateOfBirth: c.dateOfBirth || '',
      anniversaryDate: c.anniversaryDate || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCust) return;
    setCustomers(prev => prev.map(c => c.id === selectedCust.id ? {
      ...c,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      category: formData.category,
      customerGroup: formData.customerGroup,
      dateOfBirth: formData.dateOfBirth || undefined,
      anniversaryDate: formData.anniversaryDate || undefined,
    } : c));
    setIsEditModalOpen(false);
  };

  const handleOpenView = (c: Customer) => {
    setSelectedCust(c);
    setIsViewModalOpen(true);
  };

  const handleRedeemPoints = (custId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === custId && c.loyaltyPoints >= 100) {
        return { ...c, loyaltyPoints: c.loyaltyPoints - 100 };
      }
      return c;
    }));
    if (selectedCust && selectedCust.id === custId) {
      setSelectedCust(prev => prev ? { ...prev, loyaltyPoints: Math.max(0, prev.loyaltyPoints - 100) } : null);
    }
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      {/* Title */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Customer CRM & Loyalty Program</h4>
          <p className="text-muted-custom small mb-0">
            Diner profiles, spending history, birthday/anniversary automation, and loyalty reward points
          </p>
        </div>

        <button
          type="button"
          className="btn btn-brand d-flex align-items-center gap-2 shadow-sm text-white"
          onClick={handleOpenAdd}
        >
          <BiPlus size={20} />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Key CRM Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-muted-custom small mb-1">Total Profiles</span>
            <div className="fs-4 fw-bold text-navy">{customers.length} Diners</div>
            <span className="small text-success" style={{ fontSize: '11px' }}>+12 new this week</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-muted-custom small mb-1">VIP & High Spenders</span>
            <div className="fs-4 fw-bold text-brand">{vipCount} VIPs</div>
            <span className="small text-muted" style={{ fontSize: '11px' }}>Priority table reservation</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-muted-custom small mb-1">Active Loyalty Points</span>
            <div className="fs-4 fw-bold text-navy" suppressHydrationWarning>{formatNumber(totalLoyaltyPoints)} Pts</div>
            <span className="small text-warning" style={{ fontSize: '11px' }}>1 Pt = ₹1 on billing</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-muted-custom small mb-1">Upcoming Birthdays</span>
            <div className="fs-4 fw-bold text-success">3 This Month</div>
            <span className="small text-muted" style={{ fontSize: '11px' }}>Auto SMS discount coupon active</span>
          </div>
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
                placeholder="Search by customer name, phone number, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 ms-auto">
            <div className="d-flex align-items-center justify-content-md-end gap-2">
              <span className="text-muted-custom small fw-semibold">Group:</span>
              <select
                className="form-select form-select-sm border-subtle w-auto"
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
              >
                <option value="All">All Customer Groups</option>
                <option value="VIP">VIP Diners</option>
                <option value="Corporate">Corporate Accounts</option>
                <option value="Student">Students / Youth</option>
                <option value="High Spender">High Spenders</option>
                <option value="Regular">Regular Walk-ins</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted-custom">
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Group / Tag</th>
                <th className="text-center">Total Orders</th>
                <th className="text-end">Total Spending</th>
                <th>Loyalty Points</th>
                <th>Special Dates</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => (
                <tr key={cust.id}>
                  <td>
                    <div className="fw-semibold text-navy">{cust.name}</div>
                    <div className="text-muted-custom small" style={{ fontSize: '11px' }}>{cust.email}</div>
                  </td>
                  <td className="small">{cust.phone}</td>
                  <td>
                    <span className={`badge ${
                      cust.customerGroup === 'VIP' ? 'bg-brand text-white' :
                      cust.customerGroup === 'Corporate' ? 'badge-soft-info' :
                      cust.customerGroup === 'High Spender' ? 'badge-soft-warning' : 'badge-soft-secondary'
                    }`}>
                      {cust.customerGroup || cust.category}
                    </span>
                  </td>
                  <td className="text-center small fw-bold">{cust.totalOrders}</td>
                  <td className="text-end fw-bold text-navy small" suppressHydrationWarning>₹{formatNumber(cust.totalSpending)}</td>
                  <td>
                    <span className="badge badge-soft-warning fw-semibold d-inline-flex align-items-center gap-1">
                      <BiStar size={12} /> {cust.loyaltyPoints} Pts
                    </span>
                  </td>
                  <td className="small text-muted-custom">
                    {cust.dateOfBirth && (
                      <div className="d-flex align-items-center gap-1">
                        <BiCake size={12} className="text-danger" />
                        <span>DOB: {cust.dateOfBirth}</span>
                      </div>
                    )}
                    {cust.anniversaryDate && (
                      <div className="d-flex align-items-center gap-1">
                        <BiCalendarHeart size={12} className="text-primary" />
                        <span>Anniv: {cust.anniversaryDate}</span>
                      </div>
                    )}
                    {!cust.dateOfBirth && !cust.anniversaryDate && (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-secondary p-1"
                        onClick={() => handleOpenView(cust)}
                        title="View Profile & Rewards"
                      >
                        <BiShow size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary p-1"
                        onClick={() => handleOpenEdit(cust)}
                        title="Edit Customer"
                      >
                        <BiEdit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Customer Profile */}
      {selectedCust && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Diner Profile: ${selectedCust.name}`}
          size="md"
        >
          <div>
            <div className="p-3 bg-light rounded-3 mb-3 d-flex align-items-center justify-content-between">
              <div>
                <div className="fs-5 fw-bold text-navy">{selectedCust.name}</div>
                <div className="small text-muted">{selectedCust.phone} • {selectedCust.email}</div>
              </div>
              <span className="badge bg-brand text-white px-3 py-2 rounded-pill">
                {selectedCust.customerGroup || selectedCust.category}
              </span>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="p-2 border rounded bg-white">
                  <div className="text-muted small">Total Spend</div>
                  <div className="fs-5 fw-bold text-navy" suppressHydrationWarning>₹{formatNumber(selectedCust.totalSpending)}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 border rounded bg-white">
                  <div className="text-muted small">Loyalty Points</div>
                  <div className="fs-5 fw-bold text-warning d-flex align-items-center gap-1">
                    <BiStar size={18} /> {selectedCust.loyaltyPoints} Pts
                  </div>
                </div>
              </div>
            </div>

            {/* Special Celebration Dates */}
            <div className="p-3 bg-surface border rounded-3 mb-3">
              <h6 className="fw-bold text-navy small text-uppercase mb-2">Celebration Dates</h6>
              <div className="row g-2 small">
                <div className="col-6">
                  <span className="text-muted d-block">Birthday:</span>
                  <span className="fw-semibold text-navy">{selectedCust.dateOfBirth || 'Not registered'}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Anniversary:</span>
                  <span className="fw-semibold text-navy">{selectedCust.anniversaryDate || 'Not registered'}</span>
                </div>
              </div>
            </div>

            {/* Favorite Items */}
            <div className="mb-3">
              <h6 className="fw-bold text-navy small text-uppercase mb-1">Frequently Ordered Dishes</h6>
              <div className="d-flex gap-1 flex-wrap">
                {selectedCust.favoriteItems?.map((fav, i) => (
                  <span key={i} className="badge bg-light text-navy border p-2">
                    <BiDish className="me-1" /> {fav}
                  </span>
                )) || <span className="text-muted small">No order history recorded</span>}
              </div>
            </div>

            {/* Active Coupons */}
            <div className="mb-4">
              <h6 className="fw-bold text-navy small text-uppercase mb-1">Active Offer Coupons</h6>
              <div className="d-flex gap-2">
                <span className="badge badge-soft-success p-2 d-flex align-items-center gap-1">
                  <BiGift /> FLAT100 (₹100 Off on orders above ₹500)
                </span>
                <span className="badge badge-soft-info p-2 d-flex align-items-center gap-1">
                  <BiGift /> SWEETDISCOUNT (10% Off Mithai)
                </span>
              </div>
            </div>

            <div className="d-flex justify-content-between pt-2 border-top">
              <button
                type="button"
                className="btn btn-outline-warning btn-sm"
                onClick={() => handleRedeemPoints(selectedCust.id)}
                disabled={selectedCust.loyaltyPoints < 100}
              >
                Redeem 100 Pts (-₹100)
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsViewModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Add Customer */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Customer Profile"
        size="md"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Ramesh Kulkarni"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
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
                placeholder="customer@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Customer Group</label>
            <select
              className="form-select"
              value={formData.customerGroup}
              onChange={(e) => setFormData({ ...formData, customerGroup: e.target.value as any })}
            >
              <option value="Regular">Regular Diner</option>
              <option value="VIP">VIP Guest</option>
              <option value="Corporate">Corporate / B2B</option>
              <option value="Student">Student</option>
              <option value="High Spender">High Spender</option>
            </select>
          </div>

          <div className="row g-2 mb-4">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Wedding Anniversary</label>
              <input
                type="date"
                className="form-control"
                value={formData.anniversaryDate}
                onChange={(e) => setFormData({ ...formData, anniversaryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand text-white">
              Create Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Customer */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer Profile"
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
              <label className="form-label small fw-semibold text-navy">Phone Number</label>
              <input
                type="tel"
                className="form-control"
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Customer Group</label>
            <select
              className="form-select"
              value={formData.customerGroup}
              onChange={(e) => setFormData({ ...formData, customerGroup: e.target.value as any })}
            >
              <option value="Regular">Regular Diner</option>
              <option value="VIP">VIP Guest</option>
              <option value="Corporate">Corporate / B2B</option>
              <option value="Student">Student</option>
              <option value="High Spender">High Spender</option>
            </select>
          </div>

          <div className="row g-2 mb-4">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Wedding Anniversary</label>
              <input
                type="date"
                className="form-control"
                value={formData.anniversaryDate}
                onChange={(e) => setFormData({ ...formData, anniversaryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand text-white">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
