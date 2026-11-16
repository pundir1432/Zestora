'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiBarChartAlt2,
  BiPieChartAlt,
  BiTimeFive,
  BiUser,
  BiTrendingUp,
  BiRestaurant,
  BiShoppingBag,
  BiCycling,
  BiFilterAlt,
} from 'react-icons/bi';

export default function BusinessOwnerAnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 7 Days');

  // Hourly rush distribution mock
  const hourlyRush = [
    { hour: '11 AM', percentage: 15, sales: 4200 },
    { hour: '12 PM', percentage: 40, sales: 12400 },
    { hour: '01 PM', percentage: 88, sales: 28900, peak: true },
    { hour: '02 PM', percentage: 95, sales: 31200, peak: true },
    { hour: '03 PM', percentage: 45, sales: 14000 },
    { hour: '04 PM', percentage: 20, sales: 6200 },
    { hour: '05 PM', percentage: 30, sales: 9500 },
    { hour: '06 PM', percentage: 48, sales: 15200 },
    { hour: '07 PM', percentage: 70, sales: 22800 },
    { hour: '08 PM', percentage: 98, sales: 34500, peak: true },
    { hour: '09 PM', percentage: 100, sales: 38200, peak: true },
    { hour: '10 PM', percentage: 82, sales: 26400, peak: true },
    { hour: '11 PM', percentage: 35, sales: 11000 },
  ];

  // Channel distribution
  const channels = [
    { name: 'Dine In Tables', share: 58, revenue: 148500, icon: BiRestaurant, color: '#F47B35' },
    { name: 'Takeaway & Pickup', share: 22, revenue: 56300, icon: BiShoppingBag, color: '#18263B' },
    { name: 'Direct Home Delivery', share: 20, revenue: 51200, icon: BiCycling, color: '#0d6efd' },
  ];

  // Category mix
  const categories = [
    { name: 'Biryani & Rice Bowls', count: 480, revenue: 168000, margin: 69.8 },
    { name: 'Main Course & Curries', count: 410, revenue: 127100, margin: 68.5 },
    { name: 'Artisan Breads & Naan', count: 620, revenue: 49600, margin: 78.2 },
    { name: 'Beverages & Mocktails', count: 340, revenue: 51000, margin: 82.4 },
    { name: 'Desserts & Sweets', count: 210, revenue: 29400, margin: 76.0 },
  ];

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'accountant']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Business Analytics & Peak Rush Heatmap</h1>
            <p className="text-muted small mb-0">
              Detailed sales mix, hourly kitchen rush heatmaps, and dining channel revenue contributions.
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {['Today', 'Last 7 Days', 'Last 30 Days', 'This Quarter'].map((range) => (
              <button
                key={range}
                className={`btn btn-sm ${
                  dateRange === range ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setDateRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Top Operational Metrics Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Avg Table Turn Time</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiTimeFive size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">42 Minutes</h3>
              <span className="text-success small fw-medium">Fast turnover | High utilization</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Average Spend / Cover (APC)</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiUser size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">₹385 / guest</h3>
              <span className="text-success small fw-medium">+8.2% vs previous period</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Kitchen Prep Speed</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiTrendingUp size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">11.4 Minutes</h3>
              <span className="text-muted small">KOT order to service ready</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Total Period Sales</span>
                <span className="p-2 rounded bg-info-subtle text-info">
                  <BiBarChartAlt2 size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(256000)}</h3>
              <span className="text-muted small">Across all ordering channels</span>
            </div>
          </div>
        </div>

        {/* Hourly Rush Heatmap Bar Chart */}
        <div className="card border-0 shadow-sm rounded-3 bg-white mb-4">
          <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold mb-0 text-dark">Hourly Kitchen Rush & Customer Volume</h5>
              <div className="text-muted small">Peak dining rush hours identified for staffing optimization</div>
            </div>
            <span className="badge bg-warning text-dark">Dual Peak: 1-3 PM & 8-11 PM</span>
          </div>
          <div className="card-body p-4">
            <div className="row g-2 align-items-end text-center" style={{ minHeight: '180px' }}>
              {hourlyRush.map((hr) => (
                <div key={hr.hour} className="col d-flex flex-column align-items-center h-100 justify-content-end">
                  <div
                    className="w-100 rounded-top"
                    style={{
                      height: `${hr.percentage * 1.5}px`,
                      backgroundColor: hr.peak ? '#F47B35' : '#18263B',
                      opacity: hr.peak ? 1 : 0.6,
                      transition: 'height 0.3s ease',
                    }}
                    title={`${hr.hour}: ₹${hr.sales} (${hr.percentage}% capacity)`}
                  ></div>
                  <div className="text-muted mt-2 fw-semibold" style={{ fontSize: '11px' }}>
                    {hr.hour}
                  </div>
                  <div className="fw-bold text-dark" style={{ fontSize: '10px' }} suppressHydrationWarning>
                    ₹{(hr.sales / 1000).toFixed(0)}k
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Channel Mix & Category Performance */}
        <div className="row g-4">
          {/* Ordering Channels */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-3 bg-white h-100">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="fw-bold mb-0 text-dark">Fulfillment Channel Sales Mix</h5>
              </div>
              <div className="card-body p-4">
                {channels.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <div key={ch.name} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-semibold text-dark d-flex align-items-center gap-2">
                          <Icon style={{ color: ch.color }} size={18} /> {ch.name}
                        </span>
                        <div>
                          <span className="fw-bold text-dark me-2" suppressHydrationWarning>₹{formatNumber(ch.revenue)}</span>
                          <span className="badge bg-light text-dark border">{ch.share}%</span>
                        </div>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${ch.share}%`,
                            backgroundColor: ch.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category Sales & Margins */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-3 bg-white h-100">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="fw-bold mb-0 text-dark">Category Contribution & Margins</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-uppercase text-muted">
                      <tr>
                        <th className="ps-3 py-3">Menu Category</th>
                        <th className="text-center">Units Sold</th>
                        <th className="text-end">Revenue</th>
                        <th className="text-end pe-3">Gross Margin</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {categories.map((cat) => (
                        <tr key={cat.name}>
                          <td className="ps-3 fw-semibold text-dark">{cat.name}</td>
                          <td className="text-center" suppressHydrationWarning>{formatNumber(cat.count)} items</td>
                          <td className="text-end fw-bold text-dark" suppressHydrationWarning>₹{formatNumber(cat.revenue)}</td>
                          <td className="text-end pe-3">
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                              {cat.margin}% Margin
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
