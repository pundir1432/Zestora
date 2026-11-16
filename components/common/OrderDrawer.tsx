'use client';

import React from 'react';
import { Modal } from './Modal';
import { Order, OrderStatus } from '@/types/order';
import { StatusBadge } from './StatusBadge';
import { 
  BiPrinter, 
  BiPhone, 
  BiUser, 
  BiMapPin, 
  BiTime, 
  BiCheck, 
  BiX, 
  BiRightArrowAlt,
  BiDish
} from 'react-icons/bi';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onPrintReceipt: (order: Order) => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  onPrintReceipt,
}) => {
  if (!isOpen || !order) return null;

  const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
    'New': 'Accepted',
    'Accepted': 'Preparing',
    'Preparing': 'Ready',
    'Ready': 'Completed',
    'Completed': null,
    'Cancelled': null,
    'Rejected': null,
  };

  const nextStatus = nextStatusMap[order.orderStatus];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details #${order.orderNumber}`}
      subtitle={`${order.branchName} • Placed on ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
      size="lg"
      footer={
        <div className="d-flex align-items-center justify-content-between w-100 flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-1"
            onClick={() => onPrintReceipt(order)}
          >
            <BiPrinter size={18} /> Print Bill
          </button>

          <div className="d-flex align-items-center gap-2">
            {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Completed' && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  onUpdateStatus(order.id, 'Cancelled');
                  onClose();
                }}
              >
                Cancel Order
              </button>
            )}

            {nextStatus && (
              <button
                type="button"
                className="btn btn-brand d-flex align-items-center gap-2"
                onClick={() => {
                  onUpdateStatus(order.id, nextStatus);
                  onClose();
                }}
              >
                <span>Advance to <strong>{nextStatus}</strong></span>
                <BiRightArrowAlt size={20} />
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="row g-3">
        {/* Left Column: Order Information & Customer */}
        <div className="col-12 col-md-5">
          <div className="bg-surface p-3 rounded-3 border border-subtle mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted-custom fw-semibold">CURRENT STATUS</span>
              <StatusBadge status={order.orderStatus} />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted-custom fw-semibold">ORDER TYPE</span>
              <span className="badge badge-soft-brand fw-bold">{order.orderType}</span>
            </div>
            {order.tableNumber && (
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted-custom fw-semibold">TABLE NUMBER</span>
                <span className="fw-bold text-navy">{order.tableNumber}</span>
              </div>
            )}
            <div className="d-flex justify-content-between align-items-center">
              <span className="small text-muted-custom fw-semibold">PAYMENT</span>
              <div className="text-end">
                <span className="fw-semibold text-navy me-1">{order.paymentMethod}</span>
                <StatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-surface p-3 rounded-3 border border-subtle">
            <h6 className="fw-bold text-navy mb-2 small text-uppercase">Customer Information</h6>
            <div className="d-flex align-items-center gap-2 mb-1">
              <BiUser className="text-brand flex-shrink-0" size={16} />
              <span className="fw-semibold text-navy">{order.customerName}</span>
            </div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <BiPhone className="text-brand flex-shrink-0" size={16} />
              <a href={`tel:${order.customerPhone}`} className="text-decoration-none text-navy small">
                {order.customerPhone}
              </a>
            </div>
            {order.deliveryAddress && (
              <div className="d-flex align-items-start gap-2 mt-2 pt-2 border-top border-subtle">
                <BiMapPin className="text-danger flex-shrink-0 mt-1" size={16} />
                <span className="text-muted-custom small">{order.deliveryAddress}</span>
              </div>
            )}
            {order.specialInstructions && (
              <div className="mt-2 pt-2 border-top border-subtle">
                <span className="small text-muted-custom fw-semibold d-block">Special Note:</span>
                <span className="small text-dark fst-italic">"{order.specialInstructions}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ordered Food Items & Billing Breakdown */}
        <div className="col-12 col-md-7">
          <div className="border border-subtle rounded-3 p-3 bg-white">
            <h6 className="fw-bold text-navy mb-3 small text-uppercase d-flex align-items-center gap-2">
              <BiDish className="text-brand" size={18} /> Ordered Food Items ({order.items.length})
            </h6>

            <div className="table-responsive mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted-custom">
                    <th>Item</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Price</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`food-type-icon ${item.isVeg ? 'veg' : 'non-veg'}`} />
                          <div>
                            <div className="fw-semibold text-navy small">{item.name}</div>
                            {item.variantName && (
                              <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                                Size: {item.variantName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-center fw-bold">{item.quantity}</td>
                      <td className="text-end small">₹{item.price}</td>
                      <td className="text-end fw-semibold text-navy small">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Summary */}
            <div className="bg-surface p-3 rounded-3 small">
              <div className="d-flex justify-content-between py-1">
                <span className="text-muted-custom">Subtotal</span>
                <span className="fw-semibold">₹{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="d-flex justify-content-between py-1 text-success">
                  <span>Discount {order.discountCode ? `(${order.discountCode})` : ''}</span>
                  <span className="fw-semibold">-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between py-1 text-muted-custom">
                <span>GST (5% split 2.5% CGST + 2.5% SGST)</span>
                <span>₹{order.taxGst.toFixed(2)}</span>
              </div>
              {order.serviceCharge > 0 && (
                <div className="d-flex justify-content-between py-1 text-muted-custom">
                  <span>Service Charge</span>
                  <span>₹{order.serviceCharge.toFixed(2)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between py-2 border-top border-subtle fw-bold fs-6 text-navy mt-1">
                <span>Grand Total</span>
                <span className="text-brand">₹{order.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

