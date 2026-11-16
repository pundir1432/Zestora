'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SAMPLE_INVOICES } from '@/data/invoicesData';
import { Invoice } from '@/types/invoice';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ReceiptModal } from '@/components/common/ReceiptModal';
import { Modal } from '@/components/common/Modal';
import { 
  BiSearch, 
  BiPrinter, 
  BiDownload, 
  BiShow, 
  BiFile, 
  BiCheckCircle, 
  BiFilterAlt 
} from 'react-icons/bi';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(SAMPLE_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [exportMessage, setExportMessage] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerPhone.includes(searchTerm);
    const matchesPayment = paymentFilter === 'All' || inv.paymentStatus === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  const handlePrint = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsReceiptModalOpen(true);
  };

  const handleView = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsViewModalOpen(true);
  };

  const handleExport = () => {
    setExportMessage(true);
    setTimeout(() => setExportMessage(false), 3000);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'cashier']}>
      {/* Title */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Billing & GST Invoices</h4>
          <p className="text-muted-custom small mb-0">
            Compliant Indian restaurant tax invoices, HSN summaries, and CGST/SGST breakdowns
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2 shadow-sm"
          onClick={handleExport}
        >
          {exportMessage ? <BiCheckCircle className="text-success" size={18} /> : <BiDownload size={18} />}
          <span>{exportMessage ? 'Invoices Exported (CSV)' : 'Export Invoices'}</span>
        </button>
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
                placeholder="Search Invoice #, Order #, Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 ms-auto">
            <div className="d-flex align-items-center justify-content-md-end gap-2">
              <span className="text-muted-custom small fw-semibold">Payment Status:</span>
              <select
                className="form-select form-select-sm border-subtle w-auto"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as any)}
              >
                <option value="All">All Invoices</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted-custom">
                <th>Invoice Number</th>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Date & Time</th>
                <th className="text-end">Subtotal</th>
                <th className="text-end">Discount</th>
                <th className="text-end">GST (5%)</th>
                <th className="text-end">Total Amount</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <span className="fw-bold text-navy font-monospace">{inv.invoiceNumber}</span>
                  </td>
                  <td>
                    <span className="text-brand font-monospace small">{inv.orderNumber}</span>
                  </td>
                  <td>
                    <div className="fw-semibold text-navy small">{inv.customerName}</div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>{inv.customerPhone}</div>
                  </td>
                  <td className="small text-muted-custom">
                    {inv.date} {inv.time}
                  </td>
                  <td className="text-end small">₹{inv.subtotal.toFixed(2)}</td>
                  <td className="text-end small text-success">
                    {inv.discount > 0 ? `-₹${inv.discount.toFixed(2)}` : '₹0.00'}
                  </td>
                  <td className="text-end small text-muted-custom">
                    ₹{(inv.cgst + inv.sgst).toFixed(2)}
                  </td>
                  <td className="text-end fw-bold text-navy small">
                    ₹{inv.grandTotal.toFixed(2)}
                  </td>
                  <td className="small">{inv.paymentMethod}</td>
                  <td>
                    <StatusBadge status={inv.paymentStatus} />
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-secondary p-1"
                        onClick={() => handleView(inv)}
                        title="View Detailed Tax Invoice"
                      >
                        <BiShow size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary p-1"
                        onClick={() => handlePrint(inv)}
                        title="Print Invoice"
                      >
                        <BiPrinter size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GST Formal Invoice View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Formal Tax Invoice (GST Compliant)"
        subtitle={selectedInvoice?.invoiceNumber}
        size="lg"
        footer={
          <div className="d-flex justify-content-between w-100 align-items-center">
            <span className="text-muted-custom small">Generated by Zestora Cloud POS</span>
            <button
              type="button"
              className="btn btn-brand d-flex align-items-center gap-1"
              onClick={() => {
                setIsViewModalOpen(false);
                setIsReceiptModalOpen(true);
              }}
            >
              <BiPrinter size={18} /> Print Thermal Slip
            </button>
          </div>
        }
      >
        {selectedInvoice && (
          <div className="p-3 border border-subtle rounded-3 bg-white">
            {/* Header info */}
            <div className="d-flex justify-content-between align-items-start pb-3 border-bottom border-subtle">
              <div>
                <h4 className="fw-bold text-navy mb-0">{selectedInvoice.restaurantName}</h4>
                <div className="text-muted-custom small">{selectedInvoice.branchName}</div>
                <div className="text-muted-custom small">GSTIN: <span className="font-monospace fw-semibold text-navy">{selectedInvoice.gstin}</span></div>
                <div className="text-muted-custom small">FSSAI Lic: <span className="font-monospace fw-semibold text-navy">{selectedInvoice.fssaiNumber}</span></div>
              </div>

              <div className="text-end">
                <span className="badge bg-brand fs-6 px-3 py-1 mb-2">TAX INVOICE</span>
                <div className="fw-bold text-navy font-monospace">{selectedInvoice.invoiceNumber}</div>
                <div className="text-muted-custom small">Date: {selectedInvoice.date} • {selectedInvoice.time}</div>
                <div className="text-muted-custom small">Ref Order: {selectedInvoice.orderNumber}</div>
              </div>
            </div>

            {/* Bill To */}
            <div className="py-3 border-bottom border-subtle row">
              <div className="col-6">
                <span className="text-muted-custom small fw-semibold text-uppercase d-block mb-1">Billed To (Customer):</span>
                <strong className="text-navy d-block">{selectedInvoice.customerName}</strong>
                <span className="text-muted-custom small d-block">Phone: {selectedInvoice.customerPhone}</span>
              </div>
              <div className="col-6 text-end">
                <span className="text-muted-custom small fw-semibold text-uppercase d-block mb-1">Payment Details:</span>
                <strong className="text-navy d-block">{selectedInvoice.paymentMethod}</strong>
                <span className="badge badge-soft-success">PAYMENT: {selectedInvoice.paymentStatus.toUpperCase()}</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="py-3 border-bottom border-subtle">
              <table className="table table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted-custom">
                    <th>#</th>
                    <th>Dish / Item Description</th>
                    <th className="text-center">HSN/SAC</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Rate (₹)</th>
                    <th className="text-end">Taxable Value</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="small">{idx + 1}</td>
                      <td className="fw-semibold text-navy small">{item.name}</td>
                      <td className="text-center font-monospace small text-muted">996331</td>
                      <td className="text-center fw-bold small">{item.quantity}</td>
                      <td className="text-end small">₹{item.rate.toFixed(2)}</td>
                      <td className="text-end fw-semibold text-navy small">₹{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tax Breakdown */}
            <div className="row g-3 py-3">
              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-3 small">
                  <span className="fw-semibold text-navy d-block mb-1">GST Tax Summary</span>
                  <div className="d-flex justify-content-between text-muted-custom">
                    <span>Central GST (CGST) @ 2.5%:</span>
                    <span>₹{selectedInvoice.cgst.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between text-muted-custom">
                    <span>State GST (SGST) @ 2.5%:</span>
                    <span>₹{selectedInvoice.sgst.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between text-navy fw-semibold pt-1 border-top mt-1">
                    <span>Total GST Amount (5%):</span>
                    <span>₹{(selectedInvoice.cgst + selectedInvoice.sgst).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="d-flex flex-column gap-1 small">
                  <div className="d-flex justify-content-between text-muted-custom">
                    <span>Subtotal</span>
                    <span>₹{selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="d-flex justify-content-between text-success">
                      <span>Discount</span>
                      <span>-₹{selectedInvoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between text-muted-custom">
                    <span>Taxes (CGST + SGST)</span>
                    <span>₹{(selectedInvoice.cgst + selectedInvoice.sgst).toFixed(2)}</span>
                  </div>
                  {selectedInvoice.serviceCharge > 0 && (
                    <div className="d-flex justify-content-between text-muted-custom">
                      <span>Service Charge</span>
                      <span>₹{selectedInvoice.serviceCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top fs-5 fw-bold text-navy mt-1">
                    <span>Grand Total:</span>
                    <span className="text-brand">₹{selectedInvoice.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        invoice={selectedInvoice}
      />
    </DashboardLayout>
  );
}

