'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { reportService } from '@/services';
import { formatNumber, formatAxisCurrency } from '@/utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { BiBarChartAlt2, BiDownload, BiFilterAlt } from 'react-icons/bi';

const REPORT_CATEGORIES = [
  'Unified Sales',
  'Restaurant Sales',
  'Room Revenue',
  'Camp Revenue',
  'GST & HSN/SAC',
  'Payments & Cash',
  'Discounts & Voids',
  'Inventory & Stock',
  'OTA Payouts',
  'Occupancy & Bookings',
  'Guests & Form III',
  'Audit, Staff & Exceptions',
] as const;

const SAMPLE_REPORT_ROWS: Record<string, { col1: string; col2: string; col3: string; col4: string }[]> = {
  'Unified Sales': [
    { col1: 'Ganga Terrace Kitchen', col2: 'Restaurant & Cafe', col3: '184 Orders', col4: '₹68,450' },
    { col1: 'Tapovan Resort & Hostel', col2: 'Rooms & Dorm Beds', col3: '78% Occupancy', col4: '₹74,200' },
    { col1: 'Shivpuri Adventure Base', col2: 'Rafting & Camp Packages', col3: '4 Active Slots', col4: '₹31,700' },
  ],
  'Restaurant Sales': [
    { col1: 'Dine-In (Tables + Terrace)', col2: '94 Orders', col3: 'Avg ₹460', col4: '₹43,240' },
    { col1: 'Self-Order Kiosk & QR Web', col2: '48 Orders', col3: 'Avg ₹320', col4: '₹15,360' },
    { col1: 'Room Service & Delivery', col2: '42 Orders', col3: 'Avg ₹235', col4: '₹9,850' },
  ],
  'Room Revenue': [
    { col1: 'Ganga View Suites (>₹7,500 Slab)', col2: '18% GST Applied', col3: '4 Room Nights', col4: '₹34,000' },
    { col1: 'Deluxe & Standard Rooms (<=₹7,500)', col2: '12% GST Applied', col3: '6 Room Nights', col4: '₹28,800' },
    { col1: 'Hostel Dorm Beds (16 Bunks)', col2: '12% GST Applied', col3: '12 Bed Nights', col4: '₹11,400' },
  ],
  'Camp Revenue': [
    { col1: '16km White Water Rafting', col2: '23 Guests', col3: 'SAC 998552', col4: '₹27,600' },
    { col1: 'Neer Garh Sunset Trek', col2: '8 Guests', col3: 'SAC 998552', col4: '₹9,600' },
    { col1: 'GoPro & BBQ Add-ons', col2: '5 Add-ons', col3: '18% GST', col4: '₹5,400' },
  ],
};

const CHART_DATA = [
  { name: 'Mon', total: 131400 },
  { name: 'Tue', total: 145900 },
  { name: 'Wed', total: 167200 },
  { name: 'Thu', total: 202300 },
  { name: 'Fri', total: 186100 },
  { name: 'Sat', total: 159500 },
  { name: 'Today', total: 174350 },
];

export default function HospitalityReportsPage() {
  const { activeTenant, activeProperty, activeOutlet } = useHospitality();
  const [selectedReport, setSelectedReport] = useState<string>('Unified Sales');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const summary = reportService.getDashboardSummary();
  const ota = reportService.getOtaSummary();
  const gst = reportService.getGstSummary();

  const rows = SAMPLE_REPORT_ROWS[selectedReport] || SAMPLE_REPORT_ROWS['Unified Sales'];

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'accountant']}>
      <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <BiBarChartAlt2 className="text-brand" /> Unified Hospitality Reports Suite
          </h3>
          <p className="text-muted-custom small mb-0">
            {activeTenant.name} &rarr; {activeProperty.name} &rarr; {activeOutlet.name}
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <div className="input-group input-group-sm" style={{ width: 'auto' }}>
            <span className="input-group-text bg-white"><BiFilterAlt /></span>
            <select className="form-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>This Month (Nov 2026)</option>
              <option>FY 2026-27</option>
            </select>
          </div>
          <button type="button" onClick={() => alert(`Exported "${selectedReport}" (${dateRange}) as CSV & PDF (Mock)!`)} className="btn btn-brand btn-sm text-white fw-semibold d-flex align-items-center gap-1">
            <BiDownload /> Export CSV / PDF
          </button>
        </div>
      </div>

      {/* Report Selector Chips (All 12 Unified Report Packs covering all 20 documented reports) */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        {REPORT_CATEGORIES.map(rep => (
          <button
            key={rep}
            type="button"
            onClick={() => setSelectedReport(rep)}
            className={`btn btn-sm rounded-pill px-3 ${
              selectedReport === rep ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary bg-white text-navy'
            }`}
            style={{ fontSize: '12px' }}
          >
            {rep}
          </button>
        ))}
      </div>

      {/* Summary KPI Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="app-card p-3">
            <div className="text-muted-custom small">Today Gross Sales</div>
            <div className="fs-4 fw-bold text-navy">₹{formatNumber(summary.todayTotalRevenue)}</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="app-card p-3">
            <div className="text-muted-custom small">GST Register Tax</div>
            <div className="fs-4 fw-bold text-primary">₹{formatNumber(gst.tax)}</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="app-card p-3">
            <div className="text-muted-custom small">OTA Expected Payout</div>
            <div className="fs-4 fw-bold text-success">₹{formatNumber(ota.netExpected)}</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="app-card p-3">
            <div className="text-muted-custom small">Occupancy / Form III</div>
            <div className="fs-4 fw-bold text-brand">{summary.occupancyPercent}% • {summary.pendingFormIII} Due</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="app-card p-3 p-md-4 h-100">
            <h6 className="fw-bold text-navy mb-3">{selectedReport} Trend ({dateRange})</h6>
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={formatAxisCurrency} width={60} />
                  <Tooltip formatter={(v: any) => `₹${formatNumber(Number(v))}`} />
                  <Bar dataKey="total" fill="#F47B35" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="app-card p-3 p-md-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-navy mb-0">{selectedReport} Breakdown Table</h6>
              <span className="badge badge-soft-brand">{dateRange}</span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr className="text-muted-custom">
                    <th>Segment / Unit</th>
                    <th>Classification</th>
                    <th>Volume / Metric</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td className="fw-bold text-navy">{r.col1}</td>
                      <td className="text-muted-custom">{r.col2}</td>
                      <td><span className="badge badge-soft-info">{r.col3}</span></td>
                      <td className="text-end fw-bold text-navy">{r.col4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
