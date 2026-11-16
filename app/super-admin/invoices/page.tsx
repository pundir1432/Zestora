'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SAMPLE_SAAS_INVOICES } from '@/data/saasData';
import { SaaSInvoiceRecord } from '@/types/saas';
import { Modal } from '@/components/common/Modal';
import { formatNumber, formatCurrency } from '@/utils/formatters';
import {
  BiReceipt,
  BiSearch,
  BiDownload,
  BiCheckCircle,
  BiTime,
  BiErrorCircle,
  BiCreditCard,
  BiPrinter,
  BiStore,
  BiCalendar,
} from 'react-icons/bi';

export default function SuperAdminInvoicesPage() {
  const [invoices, setInvoices] = useState<SaaSInvoiceRecord[]>(SAMPLE_SAAS_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cycleFilter, setCycleFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState<SaaSInvoiceRecord | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Filters
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchesCycle = cycleFilter === 'All' || inv.billingCycle === cycleFilter;

    return matchesSearch && matchesStatus && matchesCycle;
  });

  // Metrics
  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((acc, i) => acc + i.totalAmount, 0);
  const pendingAmount = invoices
    .filter((i) => i.status === 'Pending')
    .reduce((acc, i) => acc + i.totalAmount, 0);
  const overdueCount = invoices.filter((i) => i.status === 'Overdue').length;

  const handleOpenReceipt = (inv: SaaSInvoiceRecord) => {
    setSelectedInvoice(inv);
    setIsInvoiceModalOpen(true);
  };

  const handleMarkAsPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'Paid',
              paidDate: new Date().toISOString().split('T')[0],
              paymentMethod: 'Manual Admin Verification (Bank Wire)',
              transactionRef: `TXN-MANUAL-${Math.floor(100000 + Math.random() * 900000)}`,
            }
          : i
      )
    );
    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice((prev) =>
        prev
          ? {
              ...prev,
              status: 'Paid',
              paidDate: new Date().toISOString().split('T')[0],
              paymentMethod: 'Manual Admin Verification (Bank Wire)',
              transactionRef: `TXN-MANUAL-${Math.floor(100000 + Math.random() * 900000)}`,
            }
          : null
      );
    }
  };

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Platform SaaS Invoices & Billing</h4>
          <p className="text-muted-custom small mb-0">
            Tenant subscription billing ledger, GST compliance invoices, and automated payment tracking
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Total Billed Subscriptions</span>
              <h3 className="fw-bold text-navy mb-0">₹{(totalBilled / 1000).toFixed(1)}k</h3>
              <span className="text-muted-custom small" style={{ fontSize: '11px' }}>
                Across all tenant tiers
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand bg-opacity-10 text-brand"
              style={{ width: '48px', height: '48px' }}
            >
              <BiReceipt size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Collected Revenue</span>
              <h3 className="fw-bold text-success mb-0">₹{(totalCollected / 1000).toFixed(1)}k</h3>
              <span className="text-success small fw-medium" style={{ fontSize: '11px' }}>
                {Math.round((totalCollected / (totalBilled || 1)) * 100)}% Settled via Gateway
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-success"
              style={{ width: '48px', height: '48px' }}
            >
              <BiCheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Pending Invoices</span>
              <h3 className="fw-bold text-warning mb-0" suppressHydrationWarning>₹{formatNumber(pendingAmount)}</h3>
              <span className="text-muted-custom small" style={{ fontSize: '11px' }}>
                Due in next 7-10 days
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-warning bg-opacity-10 text-warning"
              style={{ width: '48px', height: '48px' }}
            >
              <BiTime size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Overdue Collections</span>
              <h3 className="fw-bold text-danger mb-0">{overdueCount} Invoices</h3>
              <span className="text-danger small fw-medium" style={{ fontSize: '11px' }}>
                Requires reminder trigger
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-danger bg-opacity-10 text-danger"
              style={{ width: '48px', height: '48px' }}
            >
              <BiErrorCircle size={24} />
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
                placeholder="Search by invoice number, restaurant, or owner email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted-custom small">Status:</span>
              <select
                className="form-select form-select-sm border-subtle shadow-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Invoices</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted-custom small">Cycle:</span>
              <select
                className="form-select form-select-sm border-subtle shadow-none"
                value={cycleFilter}
                onChange={(e) => setCycleFilter(e.target.value)}
              >
                <option value="All">All Cycles</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="col-12 col-md-1 text-md-end">
            <span className="badge bg-light text-navy border">
              {filteredInvoices.length} Bills
            </span>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-surface border-bottom border-subtle">
              <tr>
                <th className="text-muted-custom small py-3 ps-3">INVOICE NO</th>
                <th className="text-muted-custom small py-3">TENANT RESTAURANT</th>
                <th className="text-muted-custom small py-3">OWNER</th>
                <th className="text-muted-custom small py-3">PLAN & CYCLE</th>
                <th className="text-muted-custom small py-3 text-end">BASE AMOUNT</th>
                <th className="text-muted-custom small py-3 text-end">TOTAL (INC. GST)</th>
                <th className="text-muted-custom small py-3">ISSUE DATE</th>
                <th className="text-muted-custom small py-3 text-center">STATUS</th>
                <th className="text-muted-custom small py-3 text-end pe-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="ps-3 font-monospace small fw-bold text-navy">{inv.invoiceNumber}</td>
                  <td>
                    <div className="d-flex align-items-center gap-1 text-navy fw-medium">
                      <BiStore className="text-brand flex-shrink-0" size={15} />
                      <span>{inv.restaurantName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-navy small fw-semibold">{inv.ownerName}</div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      {inv.ownerEmail}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-soft-brand me-1">{inv.planName}</span>
                    <span className="badge bg-light text-navy border" style={{ fontSize: '10px' }}>
                      {inv.billingCycle}
                    </span>
                  </td>
                  <td className="text-end text-muted-custom small" suppressHydrationWarning>
                    ₹{formatCurrency(inv.amount, 2)}
                  </td>
                  <td className="text-end fw-bold text-navy" suppressHydrationWarning>
                    ₹{formatCurrency(inv.totalAmount, 2)}
                  </td>
                  <td className="small text-muted-custom">
                    <div className="d-flex align-items-center gap-1">
                      <BiCalendar size={14} className="text-brand flex-shrink-0" />
                      <span>{inv.issueDate}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge rounded-pill ${
                        inv.status === 'Paid'
                          ? 'bg-success text-white'
                          : inv.status === 'Pending'
                          ? 'bg-warning text-dark'
                          : 'bg-danger text-white'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="text-end pe-3">
                    <button
                      type="button"
                      className="btn btn-outline-brand btn-sm d-inline-flex align-items-center gap-1 py-1"
                      onClick={() => handleOpenReceipt(inv)}
                    >
                      <BiReceipt size={15} />
                      <span className="d-none d-lg-inline">View Tax Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-5 text-muted-custom">
                    No invoices found matching the current search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Tax Invoice (SaaS Services)"
        subtitle={selectedInvoice?.invoiceNumber || ''}
        size="lg"
      >
        {selectedInvoice && (
          <div>
            <div className="p-4 border border-subtle rounded-3 bg-surface mb-3">
              <div className="d-flex justify-content-between align-items-start border-bottom border-subtle pb-3 mb-3">
                <div>
                  <h5 className="fw-bold text-navy mb-0">ZESTORA SAAS PLATFORM</h5>
                  <div className="text-muted-custom small">Antigravity Technologies Pvt. Ltd.</div>
                  <div className="text-muted-custom small">GSTIN: 29AAACP9921M1Z4 | SAC: 998315</div>
                </div>
                <div className="text-end">
                  <div className="fw-bold font-monospace text-brand fs-6">{selectedInvoice.invoiceNumber}</div>
                  <div className="text-muted-custom small">Date: {selectedInvoice.issueDate}</div>
                  <div className="text-muted-custom small">Due Date: {selectedInvoice.dueDate}</div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="small text-muted-custom text-uppercase fw-semibold mb-1">Billed To (Tenant):</div>
                  <div className="fw-bold text-navy">{selectedInvoice.restaurantName}</div>
                  <div className="small text-muted-custom">Owner: {selectedInvoice.ownerName}</div>
                  <div className="small text-muted-custom">Email: {selectedInvoice.ownerEmail}</div>
                </div>
                <div className="col-6 text-end">
                  <div className="small text-muted-custom text-uppercase fw-semibold mb-1">Payment Status:</div>
                  <span
                    className={`badge fs-6 rounded-pill px-3 py-1 ${
                      selectedInvoice.status === 'Paid'
                        ? 'bg-success text-white'
                        : selectedInvoice.status === 'Pending'
                        ? 'bg-warning text-dark'
                        : 'bg-danger text-white'
                    }`}
                  >
                    {selectedInvoice.status}
                  </span>
                  {selectedInvoice.paymentMethod && (
                    <div className="small text-muted-custom mt-2">
                      Mode: <strong>{selectedInvoice.paymentMethod}</strong>
                    </div>
                  )}
                  {selectedInvoice.transactionRef && (
                    <div className="small text-muted-custom font-monospace">
                      Ref: {selectedInvoice.transactionRef}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="table-responsive mb-3">
                <table className="table table-bordered table-sm bg-white mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-2">Description</th>
                      <th className="py-2 text-center">Billing Cycle</th>
                      <th className="py-2 text-end">Taxable Value</th>
                      <th className="py-2 text-end">IGST (18%)</th>
                      <th className="py-2 text-end">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{selectedInvoice.planName} SaaS Platform Subscription</strong>
                        <div className="text-muted-custom small">Cloud POS, KOT sync, Menu Management, Multi-branch</div>
                      </td>
                      <td className="text-center">{selectedInvoice.billingCycle}</td>
                      <td className="text-end" suppressHydrationWarning>₹{formatCurrency(selectedInvoice.amount, 2)}</td>
                      <td className="text-end" suppressHydrationWarning>₹{formatCurrency(selectedInvoice.gstAmount, 2)}</td>
                      <td className="text-end fw-bold text-navy" suppressHydrationWarning>
                        ₹{formatCurrency(selectedInvoice.totalAmount, 2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-end">
                <div style={{ width: '280px' }}>
                  <div className="d-flex justify-content-between small py-1 border-bottom border-subtle">
                    <span>Taxable Value:</span>
                    <strong suppressHydrationWarning>₹{formatCurrency(selectedInvoice.amount, 2)}</strong>
                  </div>
                  <div className="d-flex justify-content-between small py-1 border-bottom border-subtle">
                    <span>IGST (18%):</span>
                    <strong suppressHydrationWarning>₹{formatCurrency(selectedInvoice.gstAmount, 2)}</strong>
                  </div>
                  <div className="d-flex justify-content-between fs-6 py-2 fw-bold text-navy">
                    <span>Net Payable:</span>
                    <span className="text-brand" suppressHydrationWarning>₹{formatCurrency(selectedInvoice.totalAmount, 2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              {selectedInvoice.status !== 'Paid' ? (
                <button
                  type="button"
                  className="btn btn-success btn-sm d-flex align-items-center gap-1"
                  onClick={() => handleMarkAsPaid(selectedInvoice.id)}
                >
                  <BiCheckCircle size={16} /> Mark as Paid (Manual Approval)
                </button>
              ) : (
                <div className="text-success small fw-semibold d-flex align-items-center gap-1">
                  <BiCheckCircle size={18} /> Invoice Fully Settled
                </div>
              )}

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  onClick={() => window.print()}
                >
                  <BiPrinter size={16} /> Print
                </button>
                <button
                  type="button"
                  className="btn btn-brand btn-sm d-flex align-items-center gap-1"
                  onClick={() => setIsInvoiceModalOpen(false)}
                >
                  <BiDownload size={16} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
