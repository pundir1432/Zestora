'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/common/StatCard';
import { DateRangeFilter, DateFilterOption } from '@/components/common/DateRangeFilter';
import { StatusBadge } from '@/components/common/StatusBadge';
import { OrderDrawer } from '@/components/common/OrderDrawer';
import { ReceiptModal } from '@/components/common/ReceiptModal';
import { INITIAL_ORDERS } from '@/data/ordersData';
import { SAMPLE_MENU_ITEMS } from '@/data/menuData';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/types/order';
import { formatNumber } from '@/utils/formatters';
import { 
  BiTrendingUp, 
  BiReceipt, 
  BiTime, 
  BiCheckCircle, 
  BiXCircle, 
  BiRupee, 
  BiFoodMenu, 
  BiBuilding, 
  BiShow, 
  BiPrinter,
  BiPlus
} from 'react-icons/bi';
import { MdOutlinePointOfSale } from 'react-icons/md';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function OwnerDashboardPage() {
  const { currentRestaurant, currentBranch } = useAuth();
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('Today');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [salesView, setSalesView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Dynamic statistics based on date filter
  const filterMultipliers: Record<DateFilterOption, number> = {
    'Today': 1,
    'Yesterday': 0.92,
    'Last 7 Days': 6.8,
    'This Month': 28.5,
    'Custom': 3.2,
  };

  const mult = filterMultipliers[dateFilter];

  const baseSales = 68450;
  const baseOrders = 184;
  const pendingOrders = 8;
  const completedOrders = Math.round(168 * (dateFilter === 'Today' ? 1 : mult));
  const cancelledOrders = Math.round(8 * (dateFilter === 'Today' ? 1 : mult));
  const totalSales = Math.round(baseSales * mult);
  const totalOrders = Math.round(baseOrders * mult);
  const aov = Math.round(totalSales / (totalOrders || 1));

  // Chart data
  const dailySalesData = [
    { time: '11 AM', sales: 4200, orders: 12 },
    { time: '12 PM', sales: 8900, orders: 24 },
    { time: '01 PM', sales: 14500, orders: 38 },
    { time: '02 PM', sales: 11200, orders: 31 },
    { time: '03 PM', sales: 5400, orders: 15 },
    { time: '04 PM', sales: 3800, orders: 11 },
    { time: '05 PM', sales: 4600, orders: 13 },
    { time: '06 PM', sales: 6200, orders: 18 },
    { time: '07 PM', sales: 12400, orders: 34 },
    { time: '08 PM', sales: 18200, orders: 48 },
    { time: '09 PM', sales: 19800, orders: 52 },
    { time: '10 PM', sales: 13400, orders: 36 },
  ];

  const weeklySalesData = [
    { time: 'Mon', sales: 52000, orders: 140 },
    { time: 'Tue', sales: 58000, orders: 155 },
    { time: 'Wed', sales: 61000, orders: 165 },
    { time: 'Thu', sales: 64000, orders: 172 },
    { time: 'Fri', sales: 82000, orders: 215 },
    { time: 'Sat', sales: 98000, orders: 260 },
    { time: 'Sun', sales: 104000, orders: 280 },
  ];

  const monthlySalesData = [
    { time: 'Week 1', sales: 410000, orders: 1120 },
    { time: 'Week 2', sales: 445000, orders: 1210 },
    { time: 'Week 3', sales: 490000, orders: 1340 },
    { time: 'Week 4', sales: 530000, orders: 1460 },
  ];

  const activeChartData = 
    salesView === 'daily' ? dailySalesData :
    salesView === 'weekly' ? weeklySalesData : monthlySalesData;

  // Order status distribution
  const orderStatusPieData = [
    { name: 'Completed', value: 72, color: '#16A36A' },
    { name: 'Preparing', value: 14, color: '#F47B35' },
    { name: 'Ready', value: 8, color: '#3478D4' },
    { name: 'Cancelled', value: 6, color: '#E34B4B' },
  ];

  // Payment method breakdown
  const paymentBreakdownData = [
    { name: 'UPI (GPay/PhonePe)', value: 58, color: '#16A36A' },
    { name: 'Credit/Debit Card', value: 24, color: '#3478D4' },
    { name: 'Cash', value: 14, color: '#EAA12D' },
    { name: 'Aggregators / Online', value: 4, color: '#8B5CF6' },
  ];

  // Top selling items
  const topSellingItems = [
    { name: 'Hyderabadi Chicken Dum Biryani', qty: 94, revenue: '₹39,480', isVeg: false, category: 'Main Course' },
    { name: 'Paneer Butter Masala', qty: 82, revenue: '₹27,880', isVeg: true, category: 'Main Course' },
    { name: 'Garlic Butter Naan', qty: 240, revenue: '₹18,000', isVeg: true, category: 'Main Course' },
    { name: 'Farmhouse Veggie Pizza', qty: 46, revenue: '₹17,940', isVeg: true, category: 'Pizza' },
    { name: 'Classic Hazelnut Cold Coffee', qty: 78, revenue: '₹13,260', isVeg: true, category: 'Beverages' },
    { name: 'Hot Gulab Jamun with Rabdi', qty: 64, revenue: '₹10,240', isVeg: true, category: 'Desserts' },
  ];

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  const handlePrintReceipt = (order: Order) => {
    setReceiptOrder(order);
    setIsReceiptOpen(true);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      {/* Top Banner & Date Filter */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h4 className="fw-bold text-navy mb-0">{currentRestaurant.name} Overview</h4>
            <span className="badge badge-soft-brand rounded-pill small">
              {currentBranch ? currentBranch.name : 'Consolidated Outlets'}
            </span>
          </div>
          <p className="text-muted-custom small mb-0 mt-1">
            Live operations, revenue analytics, kitchen tickets and sales performance
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <DateRangeFilter selected={dateFilter} onChange={setDateFilter} />

          <Link href="/owner/pos" className="btn btn-brand btn-sm d-flex align-items-center gap-1 shadow-sm text-decoration-none">
            <MdOutlinePointOfSale size={16} />
            <span className="fw-semibold">New Bill POS</span>
          </Link>
        </div>
      </div>

      {/* Top 6 Statistic Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-2">
          <StatCard
            title="Today's Sales"
            value={`₹${formatNumber(totalSales)}`}
            change="+14.8%"
            isPositive={true}
            icon={BiRupee}
            iconColor="#F47B35"
            iconBg="rgba(244, 123, 53, 0.1)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <StatCard
            title="Total Orders"
            value={totalOrders}
            change="+12.2%"
            isPositive={true}
            icon={BiReceipt}
            iconColor="#3478D4"
            iconBg="rgba(52, 120, 212, 0.1)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <StatCard
            title="Pending / Live"
            value={pendingOrders}
            subtitle="In Kitchen KDS"
            icon={BiTime}
            iconColor="#EAA12D"
            iconBg="rgba(234, 161, 45, 0.1)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <StatCard
            title="Completed"
            value={completedOrders}
            change="95.4%"
            isPositive={true}
            icon={BiCheckCircle}
            iconColor="#16A36A"
            iconBg="rgba(22, 163, 106, 0.1)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <StatCard
            title="Cancelled"
            value={cancelledOrders}
            change="4.2%"
            isPositive={false}
            icon={BiXCircle}
            iconColor="#E34B4B"
            iconBg="rgba(227, 75, 75, 0.1)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <StatCard
            title="Avg Order Value"
            value={`₹${aov}`}
            change="+6.5%"
            isPositive={true}
            icon={BiTrendingUp}
            iconColor="#8B5CF6"
            iconBg="rgba(139, 92, 246, 0.1)"
          />
        </div>
      </div>

      {/* Main Charts Row: Sales Chart + Order Status Donut */}
      <div className="row g-4 mb-4">
        {/* Sales Performance Chart */}
        <div className="col-12 col-lg-8">
          <div className="app-card p-3 p-md-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h6 className="fw-bold text-navy mb-0">Sales Analytics</h6>
                <span className="text-muted-custom small">Revenue trend over hours and days</span>
              </div>

              {/* View Switcher: Daily / Weekly / Monthly */}
              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${salesView === 'daily' ? 'btn-brand fw-semibold' : 'btn-outline-secondary'}`}
                  onClick={() => setSalesView('daily')}
                >
                  Hourly (Today)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${salesView === 'weekly' ? 'btn-brand fw-semibold' : 'btn-outline-secondary'}`}
                  onClick={() => setSalesView('weekly')}
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${salesView === 'monthly' ? 'btn-brand fw-semibold' : 'btn-outline-secondary'}`}
                  onClick={() => setSalesView('monthly')}
                >
                  Monthly Weeks
                </button>
              </div>
            </div>

            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ownerSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F47B35" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F47B35" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18263B', color: '#fff', borderRadius: '8px', border: 'none' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    name="Sales (₹)" 
                    stroke="#F47B35" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#ownerSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="col-12 col-lg-4">
          <div className="app-card p-3 p-md-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h6 className="fw-bold text-navy mb-0">Order Status Distribution</h6>
              <span className="text-muted-custom small">Fulfilled vs in-kitchen tickets</span>

              <div style={{ height: '220px' }} className="my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {orderStatusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="d-flex flex-column gap-1 pt-2 border-top border-subtle small">
              {orderStatusPieData.map((s, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: s.color }} />
                    <span className="text-navy">{s.name}</span>
                  </div>
                  <span className="fw-bold text-navy">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Top Selling Food Items + Payment Methods + Branch Performance */}
      <div className="row g-4 mb-4">
        {/* Top Selling Food Items */}
        <div className="col-12 col-lg-7">
          <div className="app-card p-3 p-md-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 className="fw-bold text-navy mb-0">Top Selling Menu Items</h6>
                <span className="text-muted-custom small">Ranked by volume sold today</span>
              </div>
              <Link href="/owner/menu" className="btn btn-sm btn-link text-brand p-0 text-decoration-none small">
                Manage Menu &rarr;
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted-custom">
                    <th>Food Item</th>
                    <th>Category</th>
                    <th className="text-center">Units Sold</th>
                    <th className="text-end">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingItems.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`food-type-icon ${item.isVeg ? 'veg' : 'non-veg'}`} />
                          <span className="fw-semibold text-navy small">{item.name}</span>
                        </div>
                      </td>
                      <td className="small text-muted-custom">{item.category}</td>
                      <td className="text-center fw-bold small">{item.qty}</td>
                      <td className="text-end fw-bold text-brand small">{item.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment Methods Overview */}
        <div className="col-12 col-lg-5">
          <div className="app-card p-3 p-md-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h6 className="fw-bold text-navy mb-0">Payment Method Mix</h6>
              <span className="text-muted-custom small">UPI vs Card vs Cash settlement</span>

              <div style={{ height: '200px' }} className="my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentBreakdownData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      label={({ value }) => `${value}%`}
                    >
                      {paymentBreakdownData.map((entry, index) => (
                        <Cell key={`cell-pay-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="d-flex flex-column gap-2 pt-2 border-top border-subtle small">
              {paymentBreakdownData.map((p, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: p.color }} />
                    <span className="text-navy">{p.name}</span>
                  </div>
                  <span className="fw-bold text-navy">{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Multi-Branch Performance (if owner) */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="app-card p-3 p-md-4">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h6 className="fw-bold text-navy mb-0">Multi-Branch Performance Comparison</h6>
                <span className="text-muted-custom small">Daily sales and active order loads per branch</span>
              </div>
              <Link href="/owner/branches" className="btn btn-sm btn-outline-secondary">
                View All Outlets
              </Link>
            </div>

            <div className="row g-3">
              {currentRestaurant.branches.map((b) => (
                <div key={b.id} className="col-12 col-md-4">
                  <div className="p-3 bg-surface rounded-3 border border-subtle h-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold text-navy mb-0">{b.name}</h6>
                      <span className="badge badge-soft-success">Active</span>
                    </div>

                    <div className="d-flex align-items-baseline gap-2 mb-2">
                      <span className="fs-5 fw-bold text-navy" suppressHydrationWarning>₹{formatNumber(b.dailyRevenue)}</span>
                      <span className="small text-muted-custom">today's sales</span>
                    </div>

                    <div className="d-flex justify-content-between small text-muted-custom pt-2 border-top border-subtle">
                      <span>Active Orders: <strong className="text-navy">{b.activeOrdersCount}</strong></span>
                      <span>Seating: <strong>{b.seatingCapacity} Seats</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Orders Table */}
      <div className="app-card overflow-hidden">
        <div className="p-3 border-bottom border-subtle bg-surface d-flex align-items-center justify-content-between">
          <div>
            <h6 className="fw-bold text-navy mb-0">Recent Kitchen & Dine-In Orders</h6>
            <span className="text-muted-custom small">Real-time incoming orders stream</span>
          </div>
          <Link href="/owner/orders" className="btn btn-sm btn-brand shadow-sm">
            View All Orders &rarr;
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted-custom">
                <th>Order ID</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Items Ordered</th>
                <th>Amount (₹)</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <span className="fw-bold text-navy font-monospace">{ord.orderNumber}</span>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td>
                    <div className="fw-semibold text-navy small">{ord.customerName}</div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>{ord.customerPhone}</div>
                  </td>
                  <td>
                    <span className="badge badge-soft-brand">{ord.orderType}</span>
                    {ord.tableNumber && (
                      <span className="badge bg-light text-navy ms-1 border" style={{ fontSize: '10px' }}>
                        {ord.tableNumber}
                      </span>
                    )}
                  </td>
                  <td className="small text-truncate" style={{ maxWidth: '220px' }}>
                    {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="fw-bold text-navy small">₹{ord.grandTotal.toFixed(2)}</td>
                  <td>
                    <StatusBadge status={ord.paymentStatus} />
                    <span className="small text-muted-custom ms-1">({ord.paymentMethod})</span>
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
                        title="View Full Details"
                      >
                        <BiShow size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary p-1"
                        onClick={() => handlePrintReceipt(ord)}
                        title="Print Bill"
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

      {/* Order Details Drawer / Modal */}
      <OrderDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onPrintReceipt={handlePrintReceipt}
      />

      {/* Thermal Invoice Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={receiptOrder}
      />
    </DashboardLayout>
  );
}

