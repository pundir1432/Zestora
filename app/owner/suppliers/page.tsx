'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_SUPPLIERS } from '@/data/saasData';
import { Supplier } from '@/types/saas';
import { Modal } from '@/components/common/Modal';
import { formatNumber } from '@/utils/formatters';
import {
  BiPackage,
  BiPlus,
  BiSearch,
  BiPhone,
  BiEnvelope,
  BiMapPin,
  BiCreditCard,
  BiCheckCircle,
  BiDollar,
  BiEdit,
  BiReceipt,
} from 'react-icons/bi';

export default function SuppliersPage() {
  const { currentRestaurant } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>(SAMPLE_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Add Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dairy' as Supplier['category'],
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: 'Bengaluru',
    gstin: '',
    paymentTerms: 'Net 15' as Supplier['paymentTerms'],
  });

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer');
  const [paymentRef, setPaymentRef] = useState('');

  // Filtering
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);

    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Metrics
  const totalSuppliers = suppliers.length;
  const totalOutstanding = suppliers.reduce((acc, s) => acc + s.outstandingBalance, 0);
  const activeCount = suppliers.filter((s) => s.status === 'Active').length;

  const handleOpenPayment = (s: Supplier) => {
    setSelectedSupplier(s);
    setPaymentAmount(s.outstandingBalance.toString());
    setPaymentRef(`TXN-SUP-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;

    const amountNum = Number(paymentAmount) || 0;
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === selectedSupplier.id
          ? {
              ...s,
              outstandingBalance: Math.max(0, s.outstandingBalance - amountNum),
            }
          : s
      )
    );

    setIsPaymentModalOpen(false);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const newSup: Supplier = {
      id: `sup-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      gstin: formData.gstin,
      paymentTerms: formData.paymentTerms,
      outstandingBalance: 0,
      status: 'Active',
      lastOrderDate: 'Just added',
    };

    setSuppliers([newSup, ...suppliers]);
    setIsAddModalOpen(false);

    // Reset Form
    setFormData({
      name: '',
      category: 'Dairy',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: 'Bengaluru',
      gstin: '',
      paymentTerms: 'Net 15',
    });
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Vendor & Supplier Ledger</h4>
          <p className="text-muted-custom small mb-0">
            Raw material vendors, delivery schedules, credit terms, and outstanding accounts payable
          </p>
        </div>

        <button
          type="button"
          className="btn btn-brand d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setIsAddModalOpen(true)}
        >
          <BiPlus size={20} />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Active Suppliers</span>
              <h3 className="fw-bold text-navy mb-0">{totalSuppliers} Vendors</h3>
              <span className="text-success small fw-medium" style={{ fontSize: '11px' }}>
                {activeCount} active supply agreements
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand bg-opacity-10 text-brand"
              style={{ width: '48px', height: '48px' }}
            >
              <BiPackage size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Outstanding Payables</span>
              <h3 className="fw-bold text-danger mb-0" suppressHydrationWarning>₹{formatNumber(totalOutstanding)}</h3>
              <span className="text-danger small fw-medium" style={{ fontSize: '11px' }}>
                Pending vendor settlements
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-danger bg-opacity-10 text-danger"
              style={{ width: '48px', height: '48px' }}
            >
              <BiCreditCard size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Avg Credit Period</span>
              <h3 className="fw-bold text-navy mb-0">15 Days</h3>
              <span className="text-info small fw-medium" style={{ fontSize: '11px' }}>
                Net 15 / Net 30 standard
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-info bg-opacity-10 text-info"
              style={{ width: '48px', height: '48px' }}
            >
              <BiCheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Monthly Deliveries</span>
              <h3 className="fw-bold text-success mb-0">48 Inbounds</h3>
              <span className="text-success small fw-medium" style={{ fontSize: '11px' }}>
                100% On-time delivery rate
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-success"
              style={{ width: '48px', height: '48px' }}
            >
              <BiReceipt size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="app-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-subtle text-muted-custom">
                <BiSearch size={16} />
              </span>
              <input
                type="text"
                className="form-control border-subtle shadow-none"
                placeholder="Search by vendor name, representative, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-4">
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted-custom small">Category:</span>
              <select
                className="form-select form-select-sm border-subtle shadow-none"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Dairy">Dairy</option>
                <option value="Poultry & Meat">Poultry & Meat</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Beverages & Syrups">Beverages & Syrups</option>
                <option value="Bakery Raw">Bakery Raw</option>
                <option value="Packaging">Packaging</option>
              </select>
            </div>
          </div>

          <div className="col-6 col-md-2 text-end">
            <span className="badge bg-light text-navy border">
              {filteredSuppliers.length} Vendors
            </span>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-surface border-bottom border-subtle">
              <tr>
                <th className="text-muted-custom small py-3 ps-3">VENDOR NAME</th>
                <th className="text-muted-custom small py-3">CATEGORY</th>
                <th className="text-muted-custom small py-3">CONTACT PERSON</th>
                <th className="text-muted-custom small py-3">CONTACT INFO</th>
                <th className="text-muted-custom small py-3 text-center">PAYMENT TERMS</th>
                <th className="text-muted-custom small py-3 text-end">OUTSTANDING</th>
                <th className="text-muted-custom small py-3">LAST ORDER</th>
                <th className="text-muted-custom small py-3 text-end pe-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((s) => (
                <tr key={s.id}>
                  <td className="ps-3">
                    <div className="fw-semibold text-navy">{s.name}</div>
                    {s.gstin && (
                      <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                        GSTIN: {s.gstin}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-soft-brand">{s.category}</span>
                  </td>
                  <td>
                    <div className="text-navy small fw-medium">{s.contactPerson}</div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      {s.city}
                    </div>
                  </td>
                  <td>
                    <div className="small text-navy d-flex align-items-center gap-1">
                      <BiPhone size={13} className="text-brand flex-shrink-0" />
                      <span>{s.phone}</span>
                    </div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      {s.email}
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="badge bg-light text-navy border">{s.paymentTerms}</span>
                  </td>
                  <td className="text-end fw-bold" suppressHydrationWarning>
                    {s.outstandingBalance > 0 ? (
                      <span className="text-danger">₹{formatNumber(s.outstandingBalance)}</span>
                    ) : (
                      <span className="text-success">₹0 (Clear)</span>
                    )}
                  </td>
                  <td className="small text-muted-custom">{s.lastOrderDate}</td>
                  <td className="text-end pe-3">
                    <div className="d-flex align-items-center justify-content-end gap-1">
                      {s.outstandingBalance > 0 && (
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm py-1 px-2 d-flex align-items-center gap-1"
                          onClick={() => handleOpenPayment(s)}
                          title="Record Supplier Payment"
                        >
                          <BiDollar size={15} /> Pay
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted-custom">
                    No suppliers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Supplier */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Vendor / Supplier"
        subtitle={`Expanding supplier network for ${currentRestaurant.name}`}
        size="md"
      >
        <form onSubmit={handleCreateSupplier}>
          <div className="row g-2 mb-3">
            <div className="col-8">
              <label className="form-label small fw-semibold text-navy">Company / Vendor Name</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                placeholder="e.g. Metro Wholesale Cash & Carry"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="col-4">
              <label className="form-label small fw-semibold text-navy">Category</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.category}
                onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Dairy">Dairy</option>
                <option value="Poultry & Meat">Poultry & Meat</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Beverages & Syrups">Beverages & Syrups</option>
                <option value="Bakery Raw">Bakery Raw</option>
                <option value="Packaging">Packaging</option>
                <option value="Spices & Groceries">Spices & Groceries</option>
              </select>
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Representative Person</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                placeholder="e.g. Ramesh Chandra"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Contact Phone</label>
              <input
                type="tel"
                className="form-control form-control-sm border-subtle"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Vendor Email</label>
              <input
                type="email"
                className="form-control form-control-sm border-subtle"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Vendor GSTIN (Optional)</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle font-monospace text-uppercase"
                placeholder="29ABCDE1234F1Z5"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              />
            </div>
          </div>

          <div className="row g-2 mb-4">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">City / Market Location</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Credit & Payment Terms</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.paymentTerms}
                onChange={(e: any) => setFormData({ ...formData, paymentTerms: e.target.value })}
              >
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="Net 7">Net 7 Days</option>
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm">
              Register Vendor
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Record Supplier Payment */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Supplier Payment Settlement"
        subtitle={selectedSupplier ? `Paying ${selectedSupplier.name}` : ''}
        size="md"
      >
        {selectedSupplier && (
          <form onSubmit={handleRecordPayment}>
            <div className="p-3 bg-surface rounded-3 border border-subtle mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small text-muted-custom">Current Outstanding:</span>
                <span className="fw-bold text-danger fs-6" suppressHydrationWarning>
                  ₹{formatNumber(selectedSupplier.outstandingBalance)}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-navy">Payment Amount (₹)</label>
              <input
                type="number"
                className="form-control form-control-sm border-subtle"
                max={selectedSupplier.outstandingBalance}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                required
              />
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label small fw-semibold text-navy">Payment Mode</label>
                <select
                  className="form-select form-select-sm border-subtle"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Company Card">Corporate Debit/Credit Card</option>
                  <option value="Cash">Cash Ledger</option>
                  <option value="Cheque">Bank Cheque</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold text-navy">Transaction / UTR Ref</label>
                <input
                  type="text"
                  className="form-control form-control-sm border-subtle font-monospace"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setIsPaymentModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success btn-sm d-flex align-items-center gap-1">
                <BiCheckCircle size={16} /> Confirm Settlement
              </button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
}
