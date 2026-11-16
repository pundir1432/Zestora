'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DateRangeFilter, DateFilterOption } from '@/components/common/DateRangeFilter';
import { StatCard } from '@/components/common/StatCard';
import { formatNumber } from '@/utils/formatters';
import { 
  BiTrendingUp, 
  BiRupee, 
  BiReceipt, 
  BiDownload, 
  BiPrinter, 
  BiCheckCircle,
  BiPieChartAlt2,
  BiFoodMenu,
  BiGroup,
  BiWallet,
  BiTrendingDown
} from 'react-icons/bi';
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

export default function ReportsAnalyticsPage() {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('This Month');
  const [activeReportTab, setActiveReportTab] = useState<
    'sales' | 'categories' | 'branches' | 'pnl' | 'staff' | 'gst' | 'discounts'
  >('sales');

  const [exportNotice, setExportNotice] = useState(false);

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  // Sample data for charts
  const salesTrendData = [
    { period: '01 Nov', dineIn: 34000, takeaway: 18000, delivery: 16000, total: 68000 },
    { period: '03 Nov', dineIn: 38000, takeaway: 19000, delivery: 17500, total: 74500 },
    { period: '05 Nov', dineIn: 42000, takeaway: 21000, delivery: 19000, total: 82000 },
    { period: '07 Nov', dineIn: 39000, takeaway: 17000, delivery: 18000, total: 74000 },
    { period: '09 Nov', dineIn: 45000, takeaway: 24000, delivery: 22000, total: 91000 },
    { period: '11 Nov', dineIn: 48000, takeaway: 26000, delivery: 24000, total: 98000 },
    { period: '13 Nov', dineIn: 52000, takeaway: 28000, delivery: 25000, total: 105000 },
  ];

  const categorySalesData = [
    { name: 'Main Course', sales: 420000, orders: 1140 },
    { name: 'Starters', sales: 260000, orders: 860 },
    { name: 'Sweets/Mithai', sales: 210000, orders: 640 },
    { name: 'Bakery', sales: 165000, orders: 480 },
    { name: 'Pizza', sales: 180000, orders: 420 },
    { name: 'Coffee & Brews', sales: 125000, orders: 710 },
    { name: 'Beverages', sales: 95000, orders: 620 },
  ];

  const branchSalesData = [
    { branch: 'Indiranagar Flagship', sales: 684500, orders: 1840, share: '44%', avgOrder: '₹372' },
    { branch: 'Whitefield Mall Outlet', sales: 521800, orders: 1420, share: '33%', avgOrder: '₹367' },
    { branch: 'Koramangala Cloud Kitchen', sales: 360200, orders: 980, share: '23%', avgOrder: '₹368' },
  ];

  const staffPerformanceData = [
    { name: 'Manoj Kumar', role: 'Captain / Waiter', ordersServed: 420, totalSales: 248500, avgTicket: 591, rating: '4.9 ★' },
    { name: 'Sunil Rao', role: 'Captain / Waiter', ordersServed: 385, totalSales: 219400, avgTicket: 570, rating: '4.8 ★' },
    { name: 'Priya Menon', role: 'Cashier / Front Desk', ordersServed: 610, totalSales: 345000, avgTicket: 565, rating: '4.9 ★' },
    { name: 'Deepak Sharma', role: 'Captain / Waiter', ordersServed: 310, totalSales: 178200, avgTicket: 574, rating: '4.7 ★' },
    { name: 'Rahul Joshi', role: 'Cashier', ordersServed: 480, totalSales: 268000, avgTicket: 558, rating: '4.8 ★' },
  ];

  const gstReportData = [
    { date: '14-Nov-2026', taxableAmount: 65190, cgst: 1629.75, sgst: 1629.75, totalGst: 3259.50 },
    { date: '13-Nov-2026', taxableAmount: 58400, cgst: 1460.00, sgst: 1460.00, totalGst: 2920.00 },
    { date: '12-Nov-2026', taxableAmount: 61200, cgst: 1530.00, sgst: 1530.00, totalGst: 3060.00 },
    { date: '11-Nov-2026', taxableAmount: 54900, cgst: 1372.50, sgst: 1372.50, totalGst: 2745.00 },
    { date: '10-Nov-2026', taxableAmount: 69800, cgst: 1745.00, sgst: 1745.00, totalGst: 3490.00 },
  ];

  const discountReportData = [
    { campaign: 'WELCOME50 (Flat ₹50)', ordersUsed: 84, totalDiscount: 4200, salesGenerated: 78500 },
    { campaign: 'FLAT100 (Orders > ₹1000)', ordersUsed: 42, totalDiscount: 4200, salesGenerated: 54600 },
    { campaign: 'CORP10 (10% Tech Parks)', ordersUsed: 26, totalDiscount: 3840, salesGenerated: 38400 },
  ];

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      {/* Title */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h4 className="fw-bold text-navy mb-1">Reports & Business Analytics</h4>
          <p className="text-muted-custom small mb-0">
            Granular sales trends, item profitability, P&L breakdown, staff leaderboards, and GST audits
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <DateRangeFilter selected={dateFilter} onChange={setDateFilter} />

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 shadow-sm"
            onClick={handleExport}
          >
            {exportNotice ? <BiCheckCircle className="text-success" size={16} /> : <BiDownload size={16} />}
            <span>{exportNotice ? 'Exported (CSV)' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Period Sales"
            value="₹15.66 L"
            change="+16.4%"
            subtitle="vs previous cycle"
            icon={BiRupee}
            iconColor="#F47B35"
            iconBg="rgba(244, 123, 53, 0.1)"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Orders Count"
            value="4,240"
            change="+11.2%"
            subtitle="Avg 141 orders/day"
            icon={BiReceipt}
            iconColor="#3478D4"
            iconBg="rgba(52, 120, 212, 0.1)"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total GST Collected"
            value="₹78,300"
            change="5% Rate"
            subtitle="CGST: ₹39.1k | SGST: ₹39.1k"
            icon={BiTrendingUp}
            iconColor="#16A36A"
            iconBg="rgba(22, 163, 106, 0.1)"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Net Operating Margin"
            value="24.8%"
            change="Healthy"
            subtitle="After COGS & Staff"
            icon={BiWallet}
            iconColor="#8B5CF6"
            iconBg="rgba(139, 92, 246, 0.1)"
          />
        </div>
      </div>

      {/* Report Module Navigation Bar */}
      <div className="app-card mb-4 bg-white p-2">
        <ul className="nav nav-pills gap-1 flex-nowrap overflow-x-auto pb-1 pb-md-0">
          {[
            { id: 'sales', label: 'Sales Trends' },
            { id: 'categories', label: 'Category-wise' },
            { id: 'branches', label: 'Branch-wise' },
            { id: 'pnl', label: 'Profit & Loss (P&L)' },
            { id: 'staff', label: 'Staff Leaderboard' },
            { id: 'gst', label: 'GST Tax Audit' },
            { id: 'discounts', label: 'Discounts Report' },
          ].map((tab) => (
            <li key={tab.id} className="nav-item">
              <button
                type="button"
                className={`nav-link btn-sm rounded-2 px-3 py-2 text-nowrap ${
                  activeReportTab === tab.id ? 'bg-brand text-white fw-semibold' : 'text-navy hover-bg-light'
                }`}
                onClick={() => setActiveReportTab(tab.id as any)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* TAB 1: SALES TRENDS */}
      {activeReportTab === 'sales' && (
        <div className="d-flex flex-column gap-4">
          <div className="app-card p-4">
            <h6 className="fw-bold text-navy mb-0">Sales by Order Type (Dine In vs Takeaway vs Delivery)</h6>
            <span className="text-muted-custom small d-block mb-3">Daily performance chart for {dateFilter}</span>

            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="period" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#18263B', color: '#fff', borderRadius: '8px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="dineIn" name="Dine In (₹)" stackId="1" stroke="#F47B35" fill="#F47B35" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="takeaway" name="Takeaway (₹)" stackId="1" stroke="#3478D4" fill="#3478D4" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="delivery" name="Delivery (₹)" stackId="1" stroke="#16A36A" fill="#16A36A" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORY SALES */}
      {activeReportTab === 'categories' && (
        <div className="d-flex flex-column gap-4">
          <div className="app-card p-4">
            <h6 className="fw-bold text-navy mb-0">Revenue Contribution by Food Category</h6>
            <span className="text-muted-custom small d-block mb-3">Which sections drive the highest revenue</span>

            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#18263B', color: '#fff', borderRadius: '8px' }} />
                  <Bar dataKey="sales" name="Sales (₹)" fill="#F47B35" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BRANCH SALES */}
      {activeReportTab === 'branches' && (
        <div className="app-card overflow-hidden">
          <div className="p-3 border-bottom border-subtle bg-surface">
            <h6 className="fw-bold text-navy mb-0">Outlet-wise Sales & Volume Comparison</h6>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>Branch Outlet</th>
                  <th className="text-center">Orders Served</th>
                  <th className="text-center">Average Ticket</th>
                  <th className="text-end">Revenue Generated</th>
                  <th className="text-center">Share</th>
                </tr>
              </thead>
              <tbody>
                {branchSalesData.map((b, idx) => (
                  <tr key={idx}>
                    <td className="fw-semibold text-navy">{b.branch}</td>
                    <td className="text-center fw-bold">{b.orders}</td>
                    <td className="text-center small text-muted-custom">{b.avgOrder}</td>
                    <td className="text-end fw-bold text-brand" suppressHydrationWarning>₹{formatNumber(b.sales)}</td>
                    <td className="text-center">
                      <span className="badge badge-soft-brand">{b.share}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PROFIT & LOSS (P&L) STATEMENT */}
      {activeReportTab === 'pnl' && (
        <div className="app-card overflow-hidden">
          <div className="p-3 border-bottom border-subtle bg-surface d-flex justify-content-between align-items-center">
            <div>
              <h6 className="fw-bold text-navy mb-0">Monthly Profit & Loss (P&L) Statement</h6>
              <span className="text-muted-custom small">Operating performance breakdown for {dateFilter}</span>
            </div>
            <span className="badge bg-success text-white">Net Margin: +24.8%</span>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>Line Item Description</th>
                  <th className="text-center">Category</th>
                  <th className="text-end">Amount (₹)</th>
                  <th className="text-end">% of Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-light fw-bold">
                  <td>Gross Food & Beverage Sales</td>
                  <td className="text-center text-success">Revenue</td>
                  <td className="text-end text-success">₹15,66,500</td>
                  <td className="text-end">100.0%</td>
                </tr>
                <tr>
                  <td className="ps-4">Cost of Goods Sold (COGS - Raw Materials)</td>
                  <td className="text-center text-danger">Expense</td>
                  <td className="text-end text-danger">-₹4,85,600</td>
                  <td className="text-end">31.0%</td>
                </tr>
                <tr className="fw-semibold bg-light">
                  <td>Gross Operating Profit</td>
                  <td className="text-center text-navy">Margin</td>
                  <td className="text-end text-navy">₹10,80,900</td>
                  <td className="text-end">69.0%</td>
                </tr>
                <tr>
                  <td className="ps-4">Staff Payroll & Salaries</td>
                  <td className="text-center text-danger">Expense</td>
                  <td className="text-end text-danger">-₹3,20,000</td>
                  <td className="text-end">20.4%</td>
                </tr>
                <tr>
                  <td className="ps-4">Kitchen Rent, Power & Gas Utilities</td>
                  <td className="text-center text-danger">Expense</td>
                  <td className="text-end text-danger">-₹1,85,000</td>
                  <td className="text-end">11.8%</td>
                </tr>
                <tr>
                  <td className="ps-4">Delivery Partner / Aggregator Commissions</td>
                  <td className="text-center text-danger">Expense</td>
                  <td className="text-end text-danger">-₹1,42,000</td>
                  <td className="text-end">9.1%</td>
                </tr>
                <tr>
                  <td className="ps-4">Marketing & Customer Loyalty Discounts</td>
                  <td className="text-center text-danger">Expense</td>
                  <td className="text-end text-danger">-₹45,000</td>
                  <td className="text-end">2.9%</td>
                </tr>
                <tr className="table-success fw-bold fs-6">
                  <td>Net Operating Profit (EBITDA)</td>
                  <td className="text-center text-success">Net Income</td>
                  <td className="text-end text-success">₹3,88,900</td>
                  <td className="text-end text-success">24.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: STAFF LEADERBOARD */}
      {activeReportTab === 'staff' && (
        <div className="app-card overflow-hidden">
          <div className="p-3 border-bottom border-subtle bg-surface">
            <h6 className="fw-bold text-navy mb-0">Staff Sales & Upselling Performance</h6>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>Employee Name</th>
                  <th>Designation</th>
                  <th className="text-center">Orders Handled</th>
                  <th className="text-center">Average Ticket (₹)</th>
                  <th className="text-end">Total Billed Volume</th>
                  <th className="text-center">Guest Rating</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformanceData.map((s, idx) => (
                  <tr key={idx}>
                    <td className="fw-semibold text-navy">{s.name}</td>
                    <td className="small text-muted-custom">{s.role}</td>
                    <td className="text-center fw-bold">{s.ordersServed}</td>
                    <td className="text-center small fw-semibold text-navy">₹{s.avgTicket}</td>
                    <td className="text-end fw-bold text-brand" suppressHydrationWarning>₹{formatNumber(s.totalSales)}</td>
                    <td className="text-center">
                      <span className="badge badge-soft-warning">{s.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: GST TAX AUDIT */}
      {activeReportTab === 'gst' && (
        <div className="app-card overflow-hidden">
          <div className="p-3 border-bottom border-subtle bg-surface">
            <h6 className="fw-bold text-navy mb-0">Daily GST Tax Audit Log (GSTR-1 Ready)</h6>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>Transaction Date</th>
                  <th className="text-end">Taxable Sales (₹)</th>
                  <th className="text-end">CGST 2.5% (₹)</th>
                  <th className="text-end">SGST 2.5% (₹)</th>
                  <th className="text-end">Total GST Payable (₹)</th>
                </tr>
              </thead>
              <tbody>
                {gstReportData.map((g, idx) => (
                  <tr key={idx}>
                    <td className="small text-muted-custom">{g.date}</td>
                    <td className="text-end fw-semibold text-navy" suppressHydrationWarning>₹{formatNumber(g.taxableAmount)}</td>
                    <td className="text-end small">₹{g.cgst.toFixed(2)}</td>
                    <td className="text-end small">₹{g.sgst.toFixed(2)}</td>
                    <td className="text-end fw-bold text-brand">₹{g.totalGst.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: DISCOUNTS REPORT */}
      {activeReportTab === 'discounts' && (
        <div className="app-card overflow-hidden">
          <div className="p-3 border-bottom border-subtle bg-surface">
            <h6 className="fw-bold text-navy mb-0">Discount & Promo Coupon Audit</h6>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>Campaign Name</th>
                  <th className="text-center">Redemptions</th>
                  <th className="text-end">Discount Given (₹)</th>
                  <th className="text-end">Associated Order Volume (₹)</th>
                </tr>
              </thead>
              <tbody>
                {discountReportData.map((d, idx) => (
                  <tr key={idx}>
                    <td className="fw-semibold text-navy">{d.campaign}</td>
                    <td className="text-center fw-bold">{d.ordersUsed}</td>
                    <td className="text-end text-danger fw-semibold" suppressHydrationWarning>-₹{formatNumber(d.totalDiscount)}</td>
                    <td className="text-end fw-bold text-success" suppressHydrationWarning>₹{formatNumber(d.salesGenerated)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
