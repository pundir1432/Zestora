'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/types/order';
import { KotCard } from '@/components/kot/KotCard';
import { ReceiptModal } from '@/components/common/ReceiptModal';
import { 
  BiVolumeFull, 
  BiVolumeMute, 
  BiRefresh, 
  BiCheckCircle, 
  BiTime, 
  BiSearch, 
  BiFilterAlt, 
  BiTrendingUp
} from 'react-icons/bi';
import { TbToolsKitchen2 } from 'react-icons/tb';

const STATIONS = [
  'All Stations',
  'Main Kitchen',
  'Bakery & Oven',
  'Beverage Counter',
  'Pizza Station',
];

export default function KotKdsPage() {
  const { orders, updateOrderStatus, currentRestaurant, isFeatureEnabled } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedStation, setSelectedStation] = useState<string>('All Stations');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handlePrintKot = (order: Order) => {
    setReceiptOrder(order);
    setIsReceiptOpen(true);
  };

  // Filter orders by station and search
  const filteredOrders = orders.filter(o => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchTbl = o.tableNumber?.toLowerCase().includes(q);
      const matchCust = o.customerName.toLowerCase().includes(q);
      if (!matchNum && !matchTbl && !matchCust) return false;
    }

    if (selectedStation !== 'All Stations') {
      const hasItemInStation = o.items.some(item => {
        if (selectedStation === 'Bakery & Oven') return item.kitchenStation === 'Bakery' || item.name.toLowerCase().includes('cake') || item.name.toLowerCase().includes('bread');
        if (selectedStation === 'Beverage Counter') return item.kitchenStation === 'Beverage' || item.name.toLowerCase().includes('coffee') || item.name.toLowerCase().includes('shake');
        if (selectedStation === 'Pizza Station') return item.kitchenStation === 'Pizza' || item.name.toLowerCase().includes('pizza');
        return item.kitchenStation === 'Main Kitchen' || !item.kitchenStation;
      });
      if (!hasItemInStation) return false;
    }

    return true;
  });

  // Kitchen stages:
  const newOrders = filteredOrders.filter(o => o.orderStatus === 'New' || o.orderStatus === 'Accepted');
  const prepOrders = filteredOrders.filter(o => o.orderStatus === 'Preparing');
  const readyOrders = filteredOrders.filter(o => o.orderStatus === 'Ready');
  const completedOrders = filteredOrders.filter(o => o.orderStatus === 'Completed').slice(0, 5);

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'kitchen_staff']}>
      {/* KDS Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-3 gap-2">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2.5 rounded-3 bg-brand text-white d-flex align-items-center justify-content-center shadow-sm">
            <TbToolsKitchen2 size={26} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold text-navy mb-0">Kitchen Display System (KDS / KOT)</h4>
              <span className="badge badge-soft-brand rounded-pill small">
                {currentRestaurant.name}
              </span>
            </div>
            <span className="text-muted-custom small">Real-time order flow, multi-station prep dispatch, and kitchen turnaround timer</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* Audio alerts toggle */}
          <button
            type="button"
            className={`btn btn-sm d-flex align-items-center gap-1 rounded-pill px-3 ${
              soundEnabled ? 'btn-outline-brand fw-semibold shadow-2xs' : 'btn-light text-muted'
            }`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Toggle kitchen order audio alerts"
          >
            {soundEnabled ? <BiVolumeFull size={18} /> : <BiVolumeMute size={18} />}
            <span>{soundEnabled ? 'Buzzer Active' : 'Muted'}</span>
          </button>

          <span className="badge badge-soft-warning py-2 px-3 rounded-pill fw-semibold d-flex align-items-center gap-1">
            <BiTrendingUp className="text-warning" size={16} />
            {prepOrders.length} Cooking Now
          </span>
        </div>
      </div>

      {/* Station Filters & Search Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          {/* Station Pills */}
          <div className="d-flex align-items-center gap-2 overflow-x-auto pb-1 pb-md-0">
            {STATIONS.map(st => (
              <button
                key={st}
                type="button"
                className={`btn btn-sm text-nowrap rounded-pill px-3 ${
                  selectedStation === st ? 'btn-brand text-white fw-semibold shadow-sm' : 'btn-light text-navy'
                }`}
                onClick={() => setSelectedStation(st)}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search tickets */}
          <div className="input-group input-group-sm" style={{ maxWidth: '280px' }}>
            <span className="input-group-text bg-light border-subtle text-muted">
              <BiSearch size={16} />
            </span>
            <input
              type="text"
              className="form-control bg-light border-subtle"
              placeholder="Search by ticket # or table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* KDS Pipeline Board Columns */}
      <div className="row g-3">
        {/* COLUMN 1: NEW & ACCEPTED ORDERS */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="app-card h-100 bg-surface border-subtle d-flex flex-column">
            <div className="p-3 border-bottom border-subtle bg-white d-flex align-items-center justify-content-between rounded-top-3">
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle bg-warning" style={{ width: '10px', height: '10px' }} />
                <h6 className="fw-bold text-navy mb-0">New Tickets</h6>
              </div>
              <span className="badge bg-warning text-dark rounded-pill fw-bold">
                {newOrders.length}
              </span>
            </div>

            <div className="p-3 d-flex flex-column gap-3 flex-grow-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {newOrders.length === 0 ? (
                <div className="text-center py-5 text-muted-custom small">
                  No incoming orders waiting
                </div>
              ) : (
                newOrders.map((ord) => (
                  <KotCard
                    key={ord.id}
                    order={ord}
                    onUpdateStatus={handleUpdateStatus}
                    onPrintKot={handlePrintKot}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 2: PREPARING / ON THE RANGE */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="app-card h-100 bg-surface border-subtle d-flex flex-column">
            <div className="p-3 border-bottom border-subtle bg-white d-flex align-items-center justify-content-between rounded-top-3">
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle bg-brand" style={{ width: '10px', height: '10px' }} />
                <h6 className="fw-bold text-navy mb-0">Cooking / Prep</h6>
              </div>
              <span className="badge bg-brand text-white rounded-pill fw-bold">
                {prepOrders.length}
              </span>
            </div>

            <div className="p-3 d-flex flex-column gap-3 flex-grow-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {prepOrders.length === 0 ? (
                <div className="text-center py-5 text-muted-custom small">
                  Kitchen is clear
                </div>
              ) : (
                prepOrders.map((ord) => (
                  <KotCard
                    key={ord.id}
                    order={ord}
                    onUpdateStatus={handleUpdateStatus}
                    onPrintKot={handlePrintKot}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 3: READY TO SERVE / DISPATCH */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="app-card h-100 bg-surface border-subtle d-flex flex-column">
            <div className="p-3 border-bottom border-subtle bg-white d-flex align-items-center justify-content-between rounded-top-3">
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle bg-success" style={{ width: '10px', height: '10px' }} />
                <h6 className="fw-bold text-navy mb-0">Ready for Waiter / Rider</h6>
              </div>
              <span className="badge bg-success text-white rounded-pill fw-bold">
                {readyOrders.length}
              </span>
            </div>

            <div className="p-3 d-flex flex-column gap-3 flex-grow-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {readyOrders.length === 0 ? (
                <div className="text-center py-5 text-muted-custom small">
                  No plates on the pass
                </div>
              ) : (
                readyOrders.map((ord) => (
                  <KotCard
                    key={ord.id}
                    order={ord}
                    onUpdateStatus={handleUpdateStatus}
                    onPrintKot={handlePrintKot}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 4: RECENTLY COMPLETED */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="app-card h-100 bg-surface border-subtle d-flex flex-column">
            <div className="p-3 border-bottom border-subtle bg-white d-flex align-items-center justify-content-between rounded-top-3">
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle bg-secondary" style={{ width: '10px', height: '10px' }} />
                <h6 className="fw-bold text-navy mb-0">Recently Served</h6>
              </div>
              <span className="badge bg-secondary text-white rounded-pill fw-bold">
                {completedOrders.length}
              </span>
            </div>

            <div className="p-3 d-flex flex-column gap-3 flex-grow-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {completedOrders.length === 0 ? (
                <div className="text-center py-5 text-muted-custom small">
                  No served orders in this session
                </div>
              ) : (
                completedOrders.map((ord) => (
                  <div key={ord.id} className="card p-3 border-subtle rounded-3 bg-white opacity-85 shadow-2xs">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-navy">#{ord.orderNumber}</span>
                      <span className="badge badge-soft-success">Served</span>
                    </div>
                    <div className="small text-muted-custom">
                      {ord.tableNumber ? `Table ${ord.tableNumber} • ` : `${ord.orderType} • `}
                      {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Thermal Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={receiptOrder}
      />
    </DashboardLayout>
  );
}
