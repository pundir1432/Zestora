'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { INITIAL_ORDERS } from '@/data/ordersData';
import { Order, OrderStatus, OrderType } from '@/types/order';
import { StatusBadge } from '@/components/common/StatusBadge';
import { OrderDrawer } from '@/components/common/OrderDrawer';
import { ReceiptModal } from '@/components/common/ReceiptModal';
import { formatDate, formatTime } from '@/utils/formatters';
import { 
  BiSearch, 
  BiFilterAlt, 
  BiShow, 
  BiPrinter, 
  BiCheckCircle, 
  BiXCircle,
  BiRightArrowAlt,
  BiDish
} from 'react-icons/bi';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const tabs = ['All', 'New', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === 'All' || o.orderStatus === activeTab;
    const matchesType = orderTypeFilter === 'All' || o.orderType === orderTypeFilter;
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesType && matchesSearch;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
    }
  };

  const handlePrintReceipt = (order: Order) => {
    setReceiptOrder(order);
    setIsReceiptOpen(true);
  };

  const getTabCount = (tabName: string) => {
    if (tabName === 'All') return orders.length;
    return orders.filter(o => o.orderStatus === tabName).length;
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'cashier']}>
      {/* Title */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Orders Management</h4>
          <p className="text-muted-custom small mb-0">
            Real-time restaurant kitchen orders, delivery pipelines, and order state advancement
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge badge-soft-brand px-3 py-2 rounded-pill small fw-semibold">
            {orders.filter(o => ['New', 'Accepted', 'Preparing'].includes(o.orderStatus)).length} Active Kitchen Tickets
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="app-card mb-3 bg-white p-2">
        <ul className="nav nav-pills gap-1 flex-nowrap overflow-x-auto pb-1 pb-md-0">
          {tabs.map((tab) => {
            const count = getTabCount(tab);
            const isActive = activeTab === tab;
            return (
              <li key={tab} className="nav-item">
                <button
                  type="button"
                  className={`nav-link btn-sm rounded-2 px-3 py-2 text-nowrap d-flex align-items-center gap-2 ${
                    isActive ? 'bg-brand text-white fw-semibold' : 'text-navy hover-bg-light'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span>{tab} Orders</span>
                  <span className={`badge rounded-pill ${
                    isActive ? 'bg-white text-brand' : 'bg-light text-navy'
                  }`} style={{ fontSize: '10px' }}>
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
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
                placeholder="Search by Order #, Customer, Phone, or Dish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 ms-auto">
            <div className="d-flex align-items-center justify-content-md-end gap-2">
              <span className="text-muted-custom small fw-semibold">Order Type:</span>
              <select
                className="form-select form-select-sm border-subtle w-auto"
                value={orderTypeFilter}
                onChange={(e) => setOrderTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Dine In">Dine In</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted-custom">
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Items Ordered</th>
                <th>Order Type</th>
                <th>Branch</th>
                <th>Date & Time</th>
                <th>Payment</th>
                <th className="text-end">Amount</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-5 text-muted-custom">
                    No orders found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <span className="fw-bold text-navy font-monospace">{ord.orderNumber}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-navy small">{ord.customerName}</div>
                      <div className="text-muted-custom" style={{ fontSize: '11px' }}>{ord.customerPhone}</div>
                    </td>
                    <td className="small text-truncate" style={{ maxWidth: '240px' }} title={ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}>
                      {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td>
                      <span className="badge badge-soft-brand">{ord.orderType}</span>
                      {ord.tableNumber && (
                        <span className="badge bg-light text-navy ms-1 border" style={{ fontSize: '10px' }}>
                          {ord.tableNumber}
                        </span>
                      )}
                    </td>
                    <td className="small text-muted-custom">{ord.branchName}</td>
                    <td className="small text-muted-custom" suppressHydrationWarning>
                      {formatDate(ord.createdAt)} {formatTime(ord.createdAt)}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <StatusBadge status={ord.paymentStatus} />
                        <span className="small text-muted-custom">({ord.paymentMethod})</span>
                      </div>
                    </td>
                    <td className="text-end fw-bold text-navy small">
                      ₹{ord.grandTotal.toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={ord.orderStatus} />
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary p-1"
                          onClick={() => {
                            setSelectedOrder(ord);
                            setIsDrawerOpen(true);
                          }}
                          title="View Details"
                        >
                          <BiShow size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary p-1"
                          onClick={() => handlePrintReceipt(ord)}
                          title="Print Receipt"
                        >
                          <BiPrinter size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Drawer */}
      <OrderDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onPrintReceipt={handlePrintReceipt}
      />

      {/* Print Thermal Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={receiptOrder}
      />
    </DashboardLayout>
  );
}

