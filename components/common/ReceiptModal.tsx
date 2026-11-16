'use client';

import React from 'react';
import { Modal } from './Modal';
import { Invoice } from '@/types/invoice';
import { Order } from '@/types/order';
import { BiPrinter, BiDownload, BiCheckCircle } from 'react-icons/bi';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  invoice?: Invoice | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
  invoice,
}) => {
  if (!isOpen || (!order && !invoice)) return null;

  const restName = invoice?.restaurantName || 'Food Palace';
  const branchName = invoice?.branchName || order?.branchName || 'Indiranagar Branch';
  const invNumber = invoice?.invoiceNumber || `INV-2026-${order?.orderNumber.replace('FP-', '') || '8921'}`;
  const orderNum = order?.orderNumber || invoice?.orderNumber || 'FP-8921';
  const dateStr = invoice?.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = invoice?.time || '03:45 PM';
  const custName = order?.customerName || invoice?.customerName || 'Walk-in Customer';
  const custPhone = order?.customerPhone || invoice?.customerPhone || '+91 98765 43210';
  const tableNum = order?.tableNumber || (order?.orderType === 'Dine In' ? 'Table 1' : null);
  const orderType = order?.orderType || 'Dine In';

  // Items
  const items = order
    ? order.items.map(i => ({ name: i.name, quantity: i.quantity, rate: i.price, amount: i.total }))
    : (invoice?.items || []);

  const subtotal = order ? order.subtotal : (invoice?.subtotal || 0);
  const discount = order ? order.discount : (invoice?.discount || 0);
  const cgst = order ? +(order.taxGst / 2).toFixed(2) : (invoice?.cgst || 0);
  const sgst = order ? +(order.taxGst / 2).toFixed(2) : (invoice?.sgst || 0);
  const serviceCharge = order ? order.serviceCharge : (invoice?.serviceCharge || 0);
  const grandTotal = order ? order.grandTotal : (invoice?.grandTotal || 0);
  const paymentMethod = order ? order.paymentMethod : (invoice?.paymentMethod || 'UPI');
  const paymentStatus = order ? order.paymentStatus : (invoice?.paymentStatus || 'Paid');

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tax Invoice & Bill Receipt"
      subtitle={`Previewing thermal invoice receipt #${invNumber}`}
      size="md"
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-brand d-flex align-items-center gap-2" onClick={handlePrint}>
            <BiPrinter size={18} /> Print Thermal Bill
          </button>
        </>
      }
    >
      <div 
        className="bg-light p-3 p-sm-4 rounded-3 border border-subtle font-monospace text-navy mx-auto"
        style={{ maxWidth: '420px', fontSize: '13px', lineHeight: '1.4' }}
      >
        {/* Receipt Header */}
        <div className="text-center pb-3 border-bottom border-secondary border-dashed">
          <h4 className="fw-bold text-navy mb-0">{restName.toUpperCase()}</h4>
          <div className="small text-muted-custom">{branchName}</div>
          <div className="small text-muted-custom">100 Feet Road, Indiranagar, Bengaluru - 560038</div>
          <div className="small text-muted-custom">Ph: +91 80 4123 4567</div>
          <div className="mt-2 small fw-semibold">
            <span>GSTIN: 29ABCDE1234F1Z5</span> | <span>FSSAI: 11223344000512</span>
          </div>
          <div className="badge bg-dark text-white rounded-pill px-3 py-1 mt-2 text-uppercase">
            TAX INVOICE
          </div>
        </div>

        {/* Invoice Metadata */}
        <div className="py-2 border-bottom border-secondary border-dashed small">
          <div className="d-flex justify-content-between">
            <span>Invoice No: <strong>{invNumber}</strong></span>
            <span>Order: <strong>{orderNum}</strong></span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Date: {dateStr}</span>
            <span>Time: {timeStr}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Customer: <strong>{custName}</strong></span>
            <span>Type: <strong>{orderType}</strong></span>
          </div>
          {tableNum && (
            <div className="d-flex justify-content-between">
              <span>Seating: <strong>{tableNum}</strong></span>
              <span>Cashier: Suresh P.</span>
            </div>
          )}
        </div>

        {/* Itemized Table */}
        <div className="py-2 border-bottom border-secondary border-dashed">
          <table className="table table-sm table-borderless mb-0" style={{ fontSize: '12px' }}>
            <thead>
              <tr className="border-bottom border-secondary">
                <th className="p-1">Item</th>
                <th className="p-1 text-center">Qty</th>
                <th className="p-1 text-end">Rate</th>
                <th className="p-1 text-end">Amt (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-1 text-truncate" style={{ maxWidth: '170px' }}>{item.name}</td>
                  <td className="p-1 text-center">{item.quantity}</td>
                  <td className="p-1 text-end">₹{item.rate}</td>
                  <td className="p-1 text-end fw-semibold">₹{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Tax Calculation */}
        <div className="py-2 border-bottom border-secondary border-dashed small">
          <div className="d-flex justify-content-between py-1">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="d-flex justify-content-between py-1 text-success">
              <span>Discount</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="d-flex justify-content-between py-1 text-muted-custom">
            <span>CGST (2.5%)</span>
            <span>₹{cgst.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between py-1 text-muted-custom">
            <span>SGST (2.5%)</span>
            <span>₹{sgst.toFixed(2)}</span>
          </div>
          {serviceCharge > 0 && (
            <div className="d-flex justify-content-between py-1 text-muted-custom">
              <span>Service Charge</span>
              <span>₹{serviceCharge.toFixed(2)}</span>
            </div>
          )}
          <div className="d-flex justify-content-between py-2 border-top border-dark fw-bold fs-6 text-navy">
            <span>GRAND TOTAL</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment & Footer */}
        <div className="text-center pt-3 small">
          <div className="d-flex justify-content-between mb-2">
            <span>Payment Mode: <strong>{paymentMethod}</strong></span>
            <span className="text-success fw-bold d-flex align-items-center gap-1">
              <BiCheckCircle /> {paymentStatus.toUpperCase()}
            </span>
          </div>
          <div className="text-muted-custom my-2">
            ***** THANK YOU FOR DINING WITH US *****
          </div>
          <div className="text-muted-custom" style={{ fontSize: '11px' }}>
            Powered by Zestora Restaurant SaaS • GST Compliant
          </div>
        </div>
      </div>
    </Modal>
  );
};

