'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DateRangeFilter, DateFilterOption } from '@/components/common/DateRangeFilter';
import { StatCard } from '@/components/common/StatCard';
import { PLATFORM_REVENUE_CHART_DATA, TOP_PERFORMING_RESTAURANTS } from '@/data/superAdminData';
import { 
  BiTrendingUp, 
  BiReceipt, 
  BiStore, 
  BiCreditCard, 
  BiDownload, 
  BiPrinter,
  BiCheck
} from 'react-icons/bi';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function SuperAdminReportsPage() {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('This Month');
  const [reportType, setReportType] = useState<'revenue' | 'orders' | 'owners' | 'subscriptions'>('revenue');
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      {/* Title & Date Range */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h4 className="fw-bold text-navy mb-1">Platform Analytics & Reports</h4>
          <p className="text-muted-custom small mb-0">
            Cross-tenant reporting on platform transaction volume, billing, and restaurant growth
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <DateRangeFilter selected={dateFilter} onChange={setDateFilter} />

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 shadow-sm"
            onClick={handleExport}
          >
            {exportSuccess ? <BiCheck className="text-success" size={16} /> : <BiDownload size={16} />}
            <span>{exportSuccess ? 'Downloaded CSV' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Consolidated Platform Volume"
            value="₹42.8 Cr"
            change="+18.4%"
            subtitle="vs prior period"
            icon={BiTrendingUp}
            iconColor="#16A36A"
            iconBg="rgba(22, 163, 106, 0.1)"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Food Orders Placed"
            value="1.82M"
            change="+24.1%"
            subtitle="98.2% completion rate"
            icon={BiReceipt}
            iconColor="#3478D4"
            iconBg="rgba(52, 120, 212, 0.1)"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Active Restaurant Partners"
            value="2,840"
            change="+12.6%"
            subtitle="across 38 cities"
            icon={BiStore}
            iconColor="#F47B35"
            iconBg="rgba(244, 123, 53, 0.1)"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="SaaS Subscription ARR"
            value="₹17.4 Cr"
            change="+15.8%"
            subtitle="Recurring software fee"
            icon={BiCreditCard}
            iconColor="#8B5CF6"
            iconBg="rgba(139, 92, 246, 0.1)"
          />
        </div>
      </div>

      {/* Report Section Tabs */}
      <div className="app-card mb-4 bg-white p-2">
        <ul className="nav nav-pills gap-1">
          {[
            { id: 'revenue', label: 'Revenue Analytics' },
            { id: 'orders', label: 'Order Volume Breakdown' },
            { id: 'owners', label: 'Owner & Chain Growth' },
            { id: 'subscriptions', label: 'Subscription Tiers' },
          ].map((tab) => (
            <li key={tab.id} className="nav-item">
              <button
                type="button"
                className={`nav-link btn-sm rounded-2 px-3 py-2 ${
                  reportType === tab.id ? 'bg-brand text-white fw-semibold' : 'text-navy hover-bg-light'
                }`}
                onClick={() => setReportType(tab.id as any)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Dynamic Chart Display based on Tab */}
      <div className="app-card p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h6 className="fw-bold text-navy mb-0">
              {reportType === 'revenue' && 'Platform Revenue & MRR Growth (₹ Lakhs)'}
              {reportType === 'orders' && 'Order Processing Volume Trend (Thousands)'}
              {reportType === 'owners' && 'New Restaurant Chain Onboardings'}
              {reportType === 'subscriptions' && 'Active Subscriptions Distribution'}
            </h6>
            <span className="text-muted-custom small">Filtered for {dateFilter}</span>
          </div>
          <span className="badge badge-soft-brand rounded-pill">Aggregated Daily</span>
        </div>

        <div style={{ height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {reportType === 'revenue' ? (
              <AreaChart data={PLATFORM_REVENUE_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis
                  stroke="#94a3b8"
                  tickFormatter={(v) => (v >= 100 ? `₹${parseFloat((v / 100).toFixed(2))}Cr` : `₹${v}L`)}
                  width={62}
                />
                <Tooltip contentStyle={{ backgroundColor: '#18263B', color: '#fff', borderRadius: '8px' }} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Total Gross Revenue (₹L)" stroke="#F47B35" fill="#F47B35" fillOpacity={0.2} strokeWidth={2.5} />
                <Area type="monotone" dataKey="subscriptions" name="SaaS Recurring MRR (₹L)" stroke="#3478D4" fill="#3478D4" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            ) : reportType === 'orders' ? (
              <BarChart data={PLATFORM_REVENUE_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#18263B', color: '#fff', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="revenue" name="Order Count ('00s)" fill="#16A36A" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : reportType === 'owners' ? (
              <LineChart data={PLATFORM_REVENUE_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#18263B', color: '#fff', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="newOwners" name="New Owners" stroke="#F47B35" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            ) : (
              <BarChart data={PLATFORM_REVENUE_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#18263B', color: '#fff', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="subscriptions" name="Active Paid Licenses" fill="#3478D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Performance Table */}
      <div className="app-card overflow-hidden">
        <div className="p-3 border-bottom border-subtle bg-surface d-flex align-items-center justify-content-between">
          <h6 className="fw-bold text-navy mb-0">City-Wise Restaurant Performance Breakdown</h6>
          <span className="small text-muted-custom">Sorted by GMV</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted-custom">
                <th>City / Region</th>
                <th className="text-center">Active Outlets</th>
                <th className="text-center">Total Orders</th>
                <th>Gross Merchandise Value (GMV)</th>
                <th>SaaS Revenue</th>
                <th>Avg Fulfillment Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { city: 'Bengaluru, Karnataka', outlets: 1420, orders: '640,000', gmv: '₹18.4 Cr', saas: '₹58.2 L', time: '18 mins' },
                { city: 'Mumbai & MMR, Maharashtra', outlets: 980, orders: '490,000', gmv: '₹14.2 Cr', saas: '₹44.1 L', time: '21 mins' },
                { city: 'Delhi NCR (Gurugram/Noida)', outlets: 850, orders: '380,000', gmv: '₹11.6 Cr', saas: '₹37.5 L', time: '19 mins' },
                { city: 'Ahmedabad & Surat, Gujarat', outlets: 420, orders: '190,000', gmv: '₹5.8 Cr', saas: '₹18.9 L', time: '16 mins' },
                { city: 'Hyderabad, Telangana', outlets: 510, orders: '220,000', gmv: '₹6.9 Cr', saas: '₹22.4 L', time: '17 mins' },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="fw-semibold text-navy">{row.city}</td>
                  <td className="text-center small">{row.outlets}</td>
                  <td className="text-center small">{row.orders}</td>
                  <td className="fw-bold text-brand small">{row.gmv}</td>
                  <td className="fw-semibold text-success small">{row.saas}</td>
                  <td className="small text-muted-custom">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

