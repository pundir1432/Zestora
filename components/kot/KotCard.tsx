'use client';

import React from 'react';
import { Order, OrderStatus } from '@/types/order';
import { BiTime, BiCheck, BiRightArrowAlt, BiPrinter, BiDish } from 'react-icons/bi';
import { formatTime } from '@/utils/formatters';

interface KotCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onPrintKot: (order: Order) => void;
}

export const KotCard: React.FC<KotCardProps> = ({
  order,
  onUpdateStatus,
  onPrintKot,
}) => {
  const elapsed = order.elapsedMinutes || 5;

  let timerColor = 'badge-soft-success';
  if (elapsed >= 20) {
    timerColor = 'badge-soft-danger text-danger fw-bold';
  } else if (elapsed >= 10) {
    timerColor = 'badge-soft-warning text-warning fw-bold';
  }

  return (
    <div className="card border-subtle shadow-sm h-100 rounded-3 overflow-hidden d-flex flex-column bg-white">
      {/* KOT Card Header */}
      <div 
        className="p-3 border-bottom border-subtle d-flex align-items-center justify-content-between"
        style={{
          backgroundColor: order.orderStatus === 'Preparing' 
            ? 'rgba(244, 123, 53, 0.08)' 
            : order.orderStatus === 'Ready'
            ? 'rgba(22, 163, 106, 0.08)'
            : '#f8fafc',
        }}
      >
        <div>
          <span className="fw-bolder fs-6 text-navy">#{order.orderNumber}</span>
          <div className="d-flex align-items-center gap-2 mt-1">
            <span className="badge badge-soft-brand" style={{ fontSize: '10px' }}>
              {order.orderType}
            </span>
            {order.tableNumber && (
              <span className="badge bg-dark text-white" style={{ fontSize: '10px' }}>
                {order.tableNumber}
              </span>
            )}
          </div>
        </div>

        <div className="text-end">
          <span className={`badge rounded-pill ${timerColor} d-inline-flex align-items-center gap-1`} style={{ fontSize: '11px' }}>
            <BiTime size={13} /> {elapsed}m ago
          </span>
          <div className="text-muted-custom small mt-1" style={{ fontSize: '11px' }} suppressHydrationWarning>
            {formatTime(order.createdAt)}
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="p-3 flex-grow-1 overflow-y-auto" style={{ maxHeight: '240px' }}>
        <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
          {order.items.map((item, idx) => (
            <li key={idx} className="d-flex align-items-start justify-content-between pb-2 border-bottom border-subtle">
              <div className="d-flex align-items-start gap-2">
                <span className={`food-type-icon mt-1 ${item.isVeg ? 'veg' : 'non-veg'}`} />
                <div>
                  <span className="fw-semibold text-navy small">{item.name}</span>
                  {item.variantName && (
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      ({item.variantName})
                    </div>
                  )}
                </div>
              </div>
              <span className="badge bg-secondary rounded-pill px-2 py-1 fw-bold fs-6">
                x{item.quantity}
              </span>
            </li>
          ))}
        </ul>

        {order.specialInstructions && (
          <div className="alert alert-warning p-2 mt-2 mb-0 rounded-2 small d-flex align-items-center gap-1">
            <strong className="flex-shrink-0">Note:</strong>
            <span className="text-truncate">{order.specialInstructions}</span>
          </div>
        )}
      </div>

      {/* KOT Card Footer Actions */}
      <div className="p-2 border-top border-subtle bg-surface d-flex align-items-center justify-content-between gap-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary p-1"
          onClick={() => onPrintKot(order)}
          title="Print KOT Slip"
        >
          <BiPrinter size={18} />
        </button>

        <div className="d-flex gap-1 flex-grow-1 justify-content-end">
          {order.orderStatus === 'New' && (
            <button
              type="button"
              className="btn btn-sm btn-brand flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              onClick={() => onUpdateStatus(order.id, 'Preparing')}
            >
              <span>Start Prep</span>
              <BiRightArrowAlt size={16} />
            </button>
          )}

          {order.orderStatus === 'Accepted' && (
            <button
              type="button"
              className="btn btn-sm btn-brand flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              onClick={() => onUpdateStatus(order.id, 'Preparing')}
            >
              <span>Start Prep</span>
              <BiRightArrowAlt size={16} />
            </button>
          )}

          {order.orderStatus === 'Preparing' && (
            <button
              type="button"
              className="btn btn-sm btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              onClick={() => onUpdateStatus(order.id, 'Ready')}
            >
              <BiCheck size={16} />
              <span>Mark Ready</span>
            </button>
          )}

          {order.orderStatus === 'Ready' && (
            <button
              type="button"
              className="btn btn-sm btn-outline-success flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              onClick={() => onUpdateStatus(order.id, 'Completed')}
            >
              <BiCheck size={16} />
              <span>Served / Done</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

