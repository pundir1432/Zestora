'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useHospitality } from '@/context/HospitalityContext';
import { formatNumber, formatAxisCurrency } from '@/utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  BiReceipt,
  BiTrendingUp,
  BiRightArrowAlt,
  BiPlus,
  BiDish,
  BiTimeFive,
  BiCheckCircle,
} from 'react-icons/bi';
import { MdOutlinePointOfSale, MdTableRestaurant } from 'react-icons/md';
import { TbToolsKitchen2 } from 'react-icons/tb';

// Weekly Restaurant Sales Data matching Image 6
const WEEKLY_SALES_DATA = [
  { day: 'Mon', sales: 4200, orders: 48 },
  { day: 'Tue', sales: 6800, orders: 72 },
  { day: 'Wed', sales: 5500, orders: 61 },
  { day: 'Thu', sales: 8400, orders: 94 },
  { day: 'Fri', sales: 9600, orders: 112 },
  { day: 'Sat', sales: 11200, orders: 138 },
  { day: 'Sun', sales: 10400, orders: 125 },
];

// Top Dishes matching Image 6
const TOP_DISHES = [
  {
    id: 1,
    name: 'Butter Paneer',
    orders: '1,250',
    price: '₹320',
    category: 'North Indian',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=120&h=120&q=80',
    tag: 'Bestseller',
  },
  {
    id: 2,
    name: 'Masala Dosa',
    orders: '980',
    price: '₹140',
    category: 'South Indian',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=120&h=120&q=80',
    tag: 'Trending',
  },
  {
    id: 3,
    name: 'Veg Biryani',
    orders: '870',
    price: '₹260',
    category: 'Biryani & Rice',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=120&h=120&q=80',
    tag: 'Popular',
  },
  {
    id: 4,
    name: 'Dal Makhani Royal',
    orders: '740',
    price: '₹280',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=120&h=120&q=80',
    tag: 'Chef Special',
  },
  {
    id: 5,
    name: 'Paneer Butter Masala',
    orders: '620',
    price: '₹310',
    category: 'North Indian',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=120&h=120&q=80',
    tag: 'Classic',
  },
];

// Live Orders
const RECENT_ORDERS = [
  { id: '#FP-8924', table: 'Table 4', type: 'Dine In', items: 'Dal Makhani, Butter Naan (2)', amount: 480, status: 'Preparing', time: '5m ago' },
  { id: '#FP-8923', table: 'Counter', type: 'Takeaway', items: 'Farmhouse Veggie Pizza', amount: 350, status: 'Ready', time: '8m ago' },
  { id: '#FP-8922', table: 'Table 9', type: 'Dine In', items: 'Butter Paneer, Tandoori Roti (4)', amount: 620, status: 'Served', time: '14m ago' },
  { id: '#FP-8921', table: 'Table 2', type: 'Dine In', items: 'Masala Dosa (2), Filter Coffee', amount: 360, status: 'Paid', time: '22m ago' },
];

export default function RestaurantDashboardPage() {
  const { user } = useAuth();
  const { readyBoardOrders } = useHospitality();
  const [salesPeriod, setSalesPeriod] = useState<'week' | 'month'>('week');

  const readyCount = readyBoardOrders.filter(o => o.stage === 'READY').length;

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'cashier', 'waiter', 'kitchen_staff', 'accountant']}>
      {/* Top Welcome Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-navy mb-1" style={{ letterSpacing: '-0.5px' }}>
            Dashboard
          </h2>
          <p className="text-muted-custom mb-0 small">
            Welcome back, <strong className="text-navy">{user?.name || 'Pankaj'}</strong> 👋 &bull; Here is what is happening at your restaurant today.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link href="/owner/pos" className="btn btn-brand text-white fw-semibold d-flex align-items-center gap-1 shadow-sm">
            <BiPlus size={18} /> New POS Bill
          </Link>
          <Link href="/owner/orders" className="btn btn-outline-brand bg-white fw-semibold d-flex align-items-center gap-1">
            <BiReceipt size={18} /> Live Orders
          </Link>
          <Link href="/owner/kot" className="btn btn-soft-brand fw-semibold d-flex align-items-center gap-1">
            <TbToolsKitchen2 size={18} /> Kitchen KOT
          </Link>
        </div>
      </div>

      {/* 3 Prominent KPI Cards (Matching Image 6 RestroPro Theme) */}
      <div className="row g-3 mb-4">
        {/* Card 1: Total Orders */}
        <div className="col-12 col-md-4">
          <div className="app-card p-4 h-100 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted-custom small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                Total Orders
              </span>
              <div 
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: '40px', height: '40px', backgroundColor: '#FFF0F3', color: '#E63946' }}
              >
                <BiReceipt size={22} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-2">
              <h2 className="fw-bold text-navy mb-0" style={{ fontSize: '2rem' }}>
                1,830
              </h2>
              <span className="badge-soft-success px-2 py-1 rounded-pill small fw-semibold" style={{ fontSize: '11px' }}>
                <BiTrendingUp className="me-1" /> +14.2%
              </span>
            </div>
            <p className="text-muted-custom small mb-0" style={{ fontSize: '12px' }}>
              vs last week &bull; 184 orders placed today
            </p>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="col-12 col-md-4">
          <div className="app-card p-4 h-100 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted-custom small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                Total Revenue
              </span>
              <div 
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: '40px', height: '40px', backgroundColor: '#ECFDF5', color: '#16A36A' }}
              >
                <MdOutlinePointOfSale size={22} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-2">
              <h2 className="fw-bold text-navy mb-0" style={{ fontSize: '2rem' }}>
                {formatNumber(312450)}
              </h2>
              <span className="badge-soft-success px-2 py-1 rounded-pill small fw-semibold" style={{ fontSize: '11px' }}>
                <BiTrendingUp className="me-1" /> +20.1%
              </span>
            </div>
            <p className="text-muted-custom small mb-0" style={{ fontSize: '12px' }}>
              vs last week &bull; Average order value ₹360
            </p>
          </div>
        </div>

        {/* Card 3: Today's Sales */}
        <div className="col-12 col-md-4">
          <div className="app-card p-4 h-100 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted-custom small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                Today&apos;s Sales
              </span>
              <div 
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: '40px', height: '40px', backgroundColor: '#FEF3C7', color: '#D97706' }}
              >
                <BiDish size={22} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-2">
              <h2 className="fw-bold text-navy mb-0" style={{ fontSize: '2rem' }}>
                {formatNumber(12430)}
              </h2>
              <span className="badge-soft-success px-2 py-1 rounded-pill small fw-semibold" style={{ fontSize: '11px' }}>
                <BiTrendingUp className="me-1" /> +8.5%
              </span>
            </div>
            <p className="text-muted-custom small mb-0" style={{ fontSize: '12px' }}>
              vs yesterday &bull; Peak hours: 1:30 PM &amp; 8:30 PM
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts & Top Dishes Grid (Image 6 Layout) */}
      <div className="row g-4 mb-4">
        {/* Left Column: Sales Overview Bar Chart */}
        <div className="col-12 col-lg-7 col-xl-8">
          <div className="app-card p-4 bg-white h-100">
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-4">
              <div>
                <h5 className="fw-bold text-navy mb-1">Sales Overview</h5>
                <p className="text-muted-custom small mb-0">
                  Daily revenue trend across the week
                </p>
              </div>

              {/* Time Selector */}
              <div className="d-flex align-items-center gap-1 bg-surface p-1 rounded-3 border border-subtle">
                <button
                  type="button"
                  onClick={() => setSalesPeriod('week')}
                  className={`btn btn-sm ${salesPeriod === 'week' ? 'btn-brand text-white' : 'btn-ghost text-muted-custom'} px-3 py-1`}
                  style={{ fontSize: '12px', borderRadius: '8px' }}
                >
                  This Week
                </button>
                <button
                  type="button"
                  onClick={() => setSalesPeriod('month')}
                  className={`btn btn-sm ${salesPeriod === 'month' ? 'btn-brand text-white' : 'btn-ghost text-muted-custom'} px-3 py-1`}
                  style={{ fontSize: '12px', borderRadius: '8px' }}
                >
                  This Month
                </button>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_SALES_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E63946" stopOpacity={1} />
                      <stop offset="100%" stopColor="#FF758F" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F4F9" />
                  <XAxis 
                    dataKey="day" 
                    tickLine={false} 
                    axisLine={{ stroke: '#E2E8F0' }} 
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} 
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => formatAxisCurrency(v)} 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(230, 57, 70, 0.04)' }}
                    formatter={(val: any) => [formatNumber(Number(val)), 'Sales']}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #FFD1D8', 
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      backgroundColor: '#ffffff',
                      fontSize: '13px'
                    }}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="url(#salesBarGrad)" 
                    radius={[8, 8, 0, 0]} 
                    maxBarSize={48} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Summary Pill Bar */}
            <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top border-subtle flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="badge-soft-brand px-2 py-1 rounded-pill small">
                  Highest: Saturday ({formatNumber(11200)})
                </span>
                <span className="text-muted-custom small">
                  &bull; 650 total orders this week
                </span>
              </div>
              <Link href="/owner/reports" className="small fw-semibold text-brand text-decoration-none d-flex align-items-center gap-1">
                View Full Analytics <BiRightArrowAlt size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Top Dishes (Matching Image 6) */}
        <div className="col-12 col-lg-5 col-xl-4">
          <div className="app-card p-4 bg-white h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold text-navy mb-0">Top Dishes</h5>
                <Link href="/owner/menu" className="small text-brand text-decoration-none fw-semibold">
                  View Menu &rarr;
                </Link>
              </div>

              {/* Dish Items */}
              <div className="d-flex flex-column gap-3">
                {TOP_DISHES.map((dish) => (
                  <div key={dish.id} className="d-flex align-items-center justify-content-between p-2 rounded-3 hover-bg-light transition-all">
                    <div className="d-flex align-items-center gap-3 overflow-hidden">
                      <img 
                        src={dish.image} 
                        alt={dish.name}
                        className="rounded-3 flex-shrink-0"
                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                      />
                      <div className="overflow-hidden">
                        <span className="fw-bold text-navy d-block text-truncate" style={{ fontSize: '13.5px' }}>
                          {dish.name}
                        </span>
                        <div className="d-flex align-items-center gap-2 text-muted-custom small" style={{ fontSize: '11px' }}>
                          <span>{dish.category}</span>
                          <span>&bull;</span>
                          <span className="fw-semibold text-brand">{dish.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-end flex-shrink-0 ms-2">
                      <span className="fw-bold text-navy d-block" style={{ fontSize: '13px' }}>
                        {dish.orders}
                      </span>
                      <span className="text-muted-custom" style={{ fontSize: '11px' }}>
                        orders
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Menu Action */}
            <div className="pt-3 mt-3 border-top border-subtle">
              <Link 
                href="/owner/menu" 
                className="btn btn-outline-brand btn-sm w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
              >
                <BiDish size={16} /> Manage Menu Items
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders & Table Status */}
      <div className="row g-4">
        {/* Recent Orders Table */}
        <div className="col-12 col-xl-8">
          <div className="app-card p-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="fw-bold text-navy mb-1">Recent Orders</h5>
                <p className="text-muted-custom small mb-0">
                  Real-time restaurant dining &amp; takeaway orders
                </p>
              </div>
              <Link href="/owner/orders" className="btn btn-soft-brand btn-sm fw-semibold">
                View All Orders &rarr;
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted-custom small text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  <tr>
                    <th>Order #</th>
                    <th>Table / Type</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '13px' }}>
                  {RECENT_ORDERS.map((ord) => (
                    <tr key={ord.id}>
                      <td className="fw-bold text-navy">{ord.id}</td>
                      <td>
                        <span className="badge bg-surface text-navy border border-subtle rounded-pill px-2 py-1">
                          {ord.table}
                        </span>
                      </td>
                      <td className="text-navy">{ord.items}</td>
                      <td className="fw-bold text-navy">{formatNumber(ord.amount)}</td>
                      <td>
                        <span 
                          className={`badge rounded-pill ${
                            ord.status === 'Preparing'
                              ? 'badge-soft-warning'
                              : ord.status === 'Ready'
                              ? 'badge-soft-brand'
                              : 'badge-soft-success'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="text-muted-custom small">{ord.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Dine-In Tables Quick Status */}
        <div className="col-12 col-xl-4">
          <div className="app-card p-4 bg-white h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold text-navy mb-0">Table Status</h5>
                <Link href="/owner/tables" className="small text-brand text-decoration-none fw-semibold">
                  Open Floor Plan &rarr;
                </Link>
              </div>

              {/* Status Counters */}
              <div className="row g-2 mb-3">
                <div className="col-4">
                  <div className="p-2 rounded-3 text-center bg-surface border border-subtle">
                    <span className="d-block fw-bold fs-5 text-success">8</span>
                    <span className="text-muted-custom" style={{ fontSize: '11px' }}>Available</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded-3 text-center bg-surface border border-subtle">
                    <span className="d-block fw-bold fs-5 text-brand">4</span>
                    <span className="text-muted-custom" style={{ fontSize: '11px' }}>Occupied</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded-3 text-center bg-surface border border-subtle">
                    <span className="d-block fw-bold fs-5 text-warning">2</span>
                    <span className="text-muted-custom" style={{ fontSize: '11px' }}>Billed</span>
                  </div>
                </div>
              </div>

              {/* Mini Table Grid */}
              <div className="row g-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((tNum) => {
                  const isOcc = [2, 4, 7, 8].includes(tNum);
                  return (
                    <div key={tNum} className="col-3">
                      <div 
                        className="p-2 rounded-3 text-center transition-all"
                        style={{
                          backgroundColor: isOcc ? '#FFF0F3' : '#F8FAFC',
                          border: isOcc ? '1.5px solid #FFD1D8' : '1px solid #E2E8F0',
                          color: isOcc ? '#E63946' : '#475569',
                          fontWeight: 600,
                          fontSize: '12px'
                        }}
                      >
                        T-{tNum}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 mt-3 border-top border-subtle">
              <Link 
                href="/owner/pos" 
                className="btn btn-brand btn-sm w-100 text-white fw-semibold d-flex align-items-center justify-content-center gap-2"
              >
                <MdOutlinePointOfSale size={16} /> Open POS Quick Bill
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
