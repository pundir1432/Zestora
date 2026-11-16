'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_EXPENSES } from '@/data/saasData';
import { ExpenseRecord } from '@/types/saas';
import { Modal } from '@/components/common/Modal';
import { formatNumber } from '@/utils/formatters';
import {
  BiWallet,
  BiPlus,
  BiSearch,
  BiCreditCard,
  BiCalendar,
  BiBuilding,
  BiCheckCircle,
  BiReceipt,
  BiTrendingDown,
  BiFilterAlt,
} from 'react-icons/bi';

export default function ExpensesPage() {
  const { currentRestaurant, currentBranch } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(SAMPLE_EXPENSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Utilities' as ExpenseRecord['category'],
    amount: 1500,
    date: '2026-11-16',
    paidTo: '',
    paymentMode: 'UPI' as ExpenseRecord['paymentMode'],
    notes: '',
  });

  // Filtering
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.receiptRef && e.receiptRef.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Metrics
  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);
  const rentUtilities = expenses
    .filter((e) => e.category === 'Rent' || e.category === 'Utilities')
    .reduce((acc, e) => acc + e.amount, 0);
  const salaries = expenses
    .filter((e) => e.category === 'Salaries & Wages')
    .reduce((acc, e) => acc + e.amount, 0);
  const packagingMarketing = expenses
    .filter((e) => e.category === 'Packaging Materials' || e.category === 'Marketing & Ads')
    .reduce((acc, e) => acc + e.amount, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      amount: Number(formData.amount),
      date: formData.date,
      paidTo: formData.paidTo,
      paymentMode: formData.paymentMode,
      branchId: currentBranch ? currentBranch.id : 'branch-1',
      branchName: currentBranch ? currentBranch.name : 'Main Branch',
      status: 'Paid',
      receiptRef: `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: formData.notes,
    };

    setExpenses([newExp, ...expenses]);
    setIsAddModalOpen(false);

    // Reset
    setFormData({
      title: '',
      category: 'Utilities',
      amount: 1500,
      date: '2026-11-16',
      paidTo: '',
      paymentMode: 'UPI',
      notes: '',
    });
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'accountant']}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Operating Expenses & Cost Ledger</h4>
          <p className="text-muted-custom small mb-0">
            Track daily restaurant cash-outflows, rent, utility bills, staff incentives, and store maintenance
          </p>
        </div>

        <button
          type="button"
          className="btn btn-brand d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setIsAddModalOpen(true)}
        >
          <BiPlus size={20} />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Monthly Total Outflow</span>
              <h3 className="fw-bold text-navy mb-0">₹{(totalExpense / 1000).toFixed(1)}k</h3>
              <span className="text-danger small fw-medium" style={{ fontSize: '11px' }}>
                All branches combined
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-danger bg-opacity-10 text-danger"
              style={{ width: '48px', height: '48px' }}
            >
              <BiTrendingDown size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Rent & Utilities</span>
              <h3 className="fw-bold text-navy mb-0">₹{(rentUtilities / 1000).toFixed(1)}k</h3>
              <span className="text-muted-custom small" style={{ fontSize: '11px' }}>
                Premises & electricity
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand bg-opacity-10 text-brand"
              style={{ width: '48px', height: '48px' }}
            >
              <BiBuilding size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Salaries & Wages</span>
              <h3 className="fw-bold text-navy mb-0">₹{(salaries / 1000).toFixed(1)}k</h3>
              <span className="text-muted-custom small" style={{ fontSize: '11px' }}>
                Staff payroll advances
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-info bg-opacity-10 text-info"
              style={{ width: '48px', height: '48px' }}
            >
              <BiWallet size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Packaging & Marketing</span>
              <h3 className="fw-bold text-navy mb-0">₹{(packagingMarketing / 1000).toFixed(1)}k</h3>
              <span className="text-muted-custom small" style={{ fontSize: '11px' }}>
                Containers & ad spend
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-warning bg-opacity-10 text-warning"
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
          <div className="col-12 col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-subtle text-muted-custom">
                <BiSearch size={16} />
              </span>
              <input
                type="text"
                className="form-control border-subtle shadow-none"
                placeholder="Search expense description, payee, or receipt #..."
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
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Salaries & Wages">Salaries & Wages</option>
                <option value="Maintenance & Repairs">Maintenance & Repairs</option>
                <option value="Packaging Materials">Packaging Materials</option>
                <option value="Marketing & Ads">Marketing & Ads</option>
              </select>
            </div>
          </div>

          <div className="col-6 col-md-3 text-end">
            <span className="badge bg-light text-navy border">
              {filteredExpenses.length} Expense Records
            </span>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-surface border-bottom border-subtle">
              <tr>
                <th className="text-muted-custom small py-3 ps-3">EXPENSE DESCRIPTION</th>
                <th className="text-muted-custom small py-3">CATEGORY</th>
                <th className="text-muted-custom small py-3 text-end">AMOUNT</th>
                <th className="text-muted-custom small py-3">DATE</th>
                <th className="text-muted-custom small py-3">BENEFICIARY / PAID TO</th>
                <th className="text-muted-custom small py-3 text-center">MODE</th>
                <th className="text-muted-custom small py-3 text-center">STATUS</th>
                <th className="text-muted-custom small py-3 text-end pe-3">VOUCHER / RECEIPT</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td className="ps-3">
                    <div className="fw-semibold text-navy">{exp.title}</div>
                    {exp.notes && (
                      <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                        {exp.notes}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-soft-brand">{exp.category}</span>
                  </td>
                  <td className="text-end fw-bold text-navy fs-6" suppressHydrationWarning>
                    ₹{formatNumber(exp.amount)}
                  </td>
                  <td>
                    <div className="small text-navy d-flex align-items-center gap-1">
                      <BiCalendar size={13} className="text-brand flex-shrink-0" />
                      <span>{exp.date}</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-navy small fw-medium">{exp.paidTo}</div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      {exp.branchName}
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="badge bg-light text-navy border" style={{ fontSize: '11px' }}>
                      {exp.paymentMode}
                    </span>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge rounded-pill ${
                        exp.status === 'Paid'
                          ? 'bg-success text-white'
                          : exp.status === 'Approved'
                          ? 'bg-info text-white'
                          : 'bg-warning text-dark'
                      }`}
                    >
                      {exp.status}
                    </span>
                  </td>
                  <td className="text-end pe-3">
                    {exp.receiptRef ? (
                      <span className="font-monospace small text-brand fw-semibold">
                        {exp.receiptRef}
                      </span>
                    ) : (
                      <span className="text-muted small">No receipt</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted-custom">
                    No expense entries found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record New Expense */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Operating Expense"
        subtitle={`Charging to ${currentRestaurant.name}`}
        size="md"
      >
        <form onSubmit={handleCreateExpense}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Expense Title / Description</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              placeholder="e.g. Commercial Gas Cylinder Refill / Staff Incentives"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Category</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.category}
                onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities (Electricity, Gas, Water)</option>
                <option value="Salaries & Wages">Salaries & Wages</option>
                <option value="Maintenance & Repairs">Maintenance & Repairs</option>
                <option value="Packaging Materials">Packaging Materials</option>
                <option value="Marketing & Ads">Marketing & Ads</option>
                <option value="Kitchen Supplies">Kitchen Supplies</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Amount (₹)</label>
              <input
                type="number"
                className="form-control form-control-sm border-subtle"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Date Incurred</label>
              <input
                type="date"
                className="form-control form-control-sm border-subtle"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Payment Mode</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.paymentMode}
                onChange={(e: any) => setFormData({ ...formData, paymentMode: e.target.value })}
              >
                <option value="UPI">UPI / QR Code</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                <option value="Company Card">Corporate Card</option>
                <option value="Cash">Cash Ledger</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Beneficiary / Paid To</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              placeholder="e.g. CleanAir Exhaust Services / BESCOM"
              value={formData.paidTo}
              onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-navy">Remarks / Voucher Notes</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              placeholder="e.g. Monthly maintenance contract payment"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
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
              Save Expense Entry
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
