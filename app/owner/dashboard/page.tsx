'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { reportService } from '@/services';
import { formatNumber } from '@/utils/formatters';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BiRupee,
  BiStore,
  BiHotel,
  BiShieldAlt2,
  BiReceipt,
  BiCheckCircle,
  BiErrorCircle,
  BiTimeFive,
  BiTrendingUp,
  BiRightArrowAlt,
  BiTv,
  BiBed,
  BiFile,
  BiSync,
  BiBell,
  BiUserCheck,
  BiBrain,
} from 'react-icons/bi';
import { MdOutlinePointOfSale, MdOutlineMonitor } from 'react-icons/md';
import { TbTent, TbToolsKitchen2, TbFileInvoice } from 'react-icons/tb';

const REVENUE_TREND = [
  { day: '12 Nov', restaurant: 52400, rooms: 58000, camp: 21000 },
  { day: '13 Nov', restaurant: 58900, rooms: 62500, camp: 24500 },
  { day: '14 Nov', restaurant: 64200, rooms: 71000, camp: 32000 },
  { day: '15 Nov', restaurant: 76800, rooms: 84000, camp: 41500 },
  { day: '16 Nov', restaurant: 71400, rooms: 78500, camp: 36200 },
  { day: '17 Nov', restaurant: 62100, rooms: 69000, camp: 28400 },
  { day: 'Today', restaurant: 68450, rooms: 74200, camp: 31700 },
];

const PAYMENT_SPLIT = [
  { name: 'UPI / QR', value: 64200, color: '#F47B35' },
  { name: 'OTA Prepaid', value: 42800, color: '#3478D4' },
  { name: 'Card', value: 38900, color: '#16A36A' },
  { name: 'Cash', value: 28450, color: '#18263B' },
];

export default function HospitalityDashboardPage() {
  const {
    t,
    activeTenant,
    activeProperty,
    activeOutlet,
    activePlanConfig,
    readyBoardOrders,
    rooms,
    dorms,
    reservations,
    formIIIRecords,
    approvals,
    auditLogs,
    notifications,
    syncQueue,
    networkStatus,
  } = useHospitality();

  const [chartScope, setChartScope] = useState<'all' | 'restaurant' | 'rooms' | 'camp'>('all');
  const summary = reportService.getDashboardSummary();
  const otaSummary = reportService.getOtaSummary();

  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const totalDormBeds = dorms.reduce((s, d) => s + d.beds.length, 0);
  const occupiedDormBeds = dorms.reduce((s, d) => s + d.beds.filter(b => b.status === 'Occupied').length, 0);
  const occupancyPct = Math.round(((occupiedRooms + occupiedDormBeds) / Math.max(1, rooms.length + totalDormBeds)) * 100);

  const pendingOrders = readyBoardOrders.filter(o => o.stage === 'NEW' || o.stage === 'PREPARING').length;
  const readyOrders = readyBoardOrders.filter(o => o.stage === 'READY').length;
  const overdueFormIII = formIIIRecords.filter(f => f.status === 'Overdue').length;
  const pendingFormIII = formIIIRecords.filter(f => f.status !== 'Submitted').length;
  const pendingApprovals = approvals.filter(a => a.status === 'Pending').length;
  const pendingSync = syncQueue.filter(s => s.status !== 'Synced').length;

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'cashier', 'waiter', 'kitchen_staff', 'accountant']}>
      {/* Top Hospitality Context Banner */}
      <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
            <h3 className="fw-bold text-navy mb-0">{activeProperty.name}</h3>
            <span className="badge badge-soft-brand rounded-pill px-2.5 py-1">
              {activeProperty.city}, {activeProperty.state}
            </span>
            <span className="badge bg-navy text-white rounded-pill px-2.5 py-1" style={{ fontSize: '11px' }}>
              {activePlanConfig.label}
            </span>
          </div>
          <p className="text-muted-custom small mb-0">
            Tenant: <strong className="text-navy">{activeTenant.name}</strong> &bull; Active Desk:{' '}
            <strong className="text-brand">{activeOutlet.name}</strong> &bull; Unified Restaurant + Stay + Camp + Compliance Command
          </p>
        </div>

        {/* Quick Hospitality Actions */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link href="/owner/pos" className="btn btn-brand btn-sm text-white fw-semibold d-flex align-items-center gap-1 px-3 py-2 shadow-sm">
            <MdOutlinePointOfSale size={16} /> New POS Bill
          </Link>
          <Link href="/owner/front-desk" className="btn btn-outline-secondary btn-sm bg-white text-navy fw-semibold d-flex align-items-center gap-1 px-3 py-2">
            <BiHotel size={16} className="text-brand" /> Walk-in / Check-in
          </Link>
          <Link href="/ready-board" className="btn btn-outline-secondary btn-sm bg-white text-navy fw-semibold d-flex align-items-center gap-1 px-3 py-2">
            <BiTv size={16} className="text-success" /> Ready Board ({readyOrders})
          </Link>
          <Link href="/kiosk" className="btn btn-outline-secondary btn-sm bg-white text-navy fw-semibold d-flex align-items-center gap-1 px-3 py-2">
            <MdOutlineMonitor size={16} className="text-primary" /> Kiosk UI
          </Link>
        </div>
      </div>

      {/* Critical Compliance / Offline Alert Strip */}
      {(overdueFormIII > 0 || networkStatus === 'offline' || pendingSync > 0) && (
        <div className="row g-2 mb-4">
          {overdueFormIII > 0 && (
            <div className="col-12 col-xl-6">
              <div className="alert alert-danger border-0 bg-danger bg-opacity-10 rounded-3 py-2.5 px-3 mb-0 d-flex align-items-center justify-content-between gap-2">
                <div className="d-flex align-items-center gap-2">
                  <BiShieldAlt2 size={20} className="text-danger flex-shrink-0" />
                  <span className="small text-danger fw-semibold">
                    <strong>FRRO Form III Alert:</strong> {overdueFormIII} foreign guest OVERDUE (&gt;24h) &bull; {pendingFormIII} total pending
                  </span>
                </div>
                <Link href="/owner/form-iii" className="btn btn-danger btn-sm py-1 px-2.5 fw-semibold text-nowrap" style={{ fontSize: '11px' }}>
                  Complete Form III
                </Link>
              </div>
            </div>
          )}
          <div className="col-12 col-xl-6">
            <div className="alert alert-warning border-0 bg-warning bg-opacity-15 rounded-3 py-2.5 px-3 mb-0 d-flex align-items-center justify-content-between gap-2">
              <div className="d-flex align-items-center gap-2">
                <BiSync size={20} className="text-warning flex-shrink-0" />
                <span className="small text-navy fw-medium">
                  <strong>Offline-First Sync:</strong> {pendingSync} queued records (Shivpuri Camp Tablet &amp; POS) &bull; {pendingApprovals} pending approvals
                </span>
              </div>
              <Link href="/owner/sync-center" className="btn btn-dark btn-sm py-1 px-2.5 fw-semibold text-nowrap" style={{ fontSize: '11px' }}>
                Sync Center
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Row 1: Unified Revenue & Operations KPIs (Restaurant + Stay + Camp) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3.5 h-100 bg-navy text-white border-0">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-white-50 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                {t('todays_revenue')}
              </span>
              <span className="rounded-3 bg-brand bg-opacity-25 text-brand p-1.5">
                <BiRupee size={18} />
              </span>
            </div>
            <h3 className="fw-bold mb-1">₹{formatNumber(summary.todayTotalRevenue)}</h3>
            <div className="d-flex align-items-center gap-2 mt-2">
              <span className="badge bg-success bg-opacity-25 text-white fw-semibold" style={{ fontSize: '10px' }}>
                <BiTrendingUp size={12} /> +16.4% vs Yesterday
              </span>
              <span className="text-white-50" style={{ fontSize: '11px' }}>All Streams</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3.5 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted-custom text-uppercase fw-semibold" style={{ fontSize: '11px' }}>
                {t('restaurant_sales')}
              </span>
              <span className="rounded-3 badge-soft-brand p-1.5"><BiStore size={18} /></span>
            </div>
            <h3 className="fw-bold text-navy mb-1">₹{formatNumber(summary.restaurantSales)}</h3>
            <div className="d-flex align-items-center justify-content-between small mt-2">
              <span className="text-muted-custom">{summary.totalOrders} Orders</span>
              <span className="badge badge-soft-warning">{pendingOrders} Active</span>
              <span className="badge badge-soft-success">{readyOrders} Ready</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3.5 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted-custom text-uppercase fw-semibold" style={{ fontSize: '11px' }}>
                {t('room_revenue')}
              </span>
              <span className="rounded-3 badge-soft-info p-1.5"><BiHotel size={18} /></span>
            </div>
            <h3 className="fw-bold text-navy mb-1">₹{formatNumber(summary.roomRevenue)}</h3>
            <div className="d-flex align-items-center justify-content-between small mt-2">
              <span className="badge badge-soft-info">{occupancyPct}% Occ.</span>
              <span className="text-muted-custom">In: <strong>{summary.checkInsToday}</strong> / Out: <strong>{summary.checkOutsToday}</strong></span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3.5 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted-custom text-uppercase fw-semibold" style={{ fontSize: '11px' }}>
                {t('camp_revenue')}
              </span>
              <span className="rounded-3 badge-soft-success p-1.5"><TbTent size={18} /></span>
            </div>
            <h3 className="fw-bold text-navy mb-1">₹{formatNumber(summary.campRevenue)}</h3>
            <div className="d-flex align-items-center justify-content-between small mt-2">
              <span className="text-muted-custom">4 Active Slots</span>
              <Link href="/owner/camps" className="text-brand fw-semibold text-decoration-none">Waivers &rarr;</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Compliance, GST, Payments, OTA & Tasks Mini-Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <Link href="/owner/form-iii" className="app-card p-3 d-block text-decoration-none h-100">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="text-muted-custom small fw-semibold">{t('pending_form_iii')}</span>
              <BiShieldAlt2 className="text-danger" size={18} />
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-4 fw-bold text-danger">{pendingFormIII}</span>
              <span className="badge badge-soft-danger" style={{ fontSize: '10px' }}>{overdueFormIII} Overdue</span>
            </div>
            <div className="text-muted-custom mt-1" style={{ fontSize: '11px' }}>24h FRRO foreign guest timer</div>
          </Link>
        </div>

        <div className="col-6 col-lg-3">
          <Link href="/owner/gst" className="app-card p-3 d-block text-decoration-none h-100">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="text-muted-custom small fw-semibold">{t('gst_summary')}</span>
              <BiFile className="text-primary" size={18} />
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-4 fw-bold text-navy">₹{formatNumber(summary.gstCollectedToday)}</span>
              <span className="badge badge-soft-info" style={{ fontSize: '10px' }}>CGST+SGST</span>
            </div>
            <div className="text-muted-custom mt-1" style={{ fontSize: '11px' }}>₹7,500 Room Slab Active</div>
          </Link>
        </div>

        <div className="col-6 col-lg-3">
          <Link href="/owner/ota" className="app-card p-3 d-block text-decoration-none h-100">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="text-muted-custom small fw-semibold">{t('ota_bookings')}</span>
              <BiReceipt className="text-brand" size={18} />
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-4 fw-bold text-navy">{summary.otaBookingsCount}</span>
              <span className="badge badge-soft-warning" style={{ fontSize: '10px' }}>{otaSummary.mismatches} Mismatches</span>
            </div>
            <div className="text-muted-custom mt-1" style={{ fontSize: '11px' }}>MMT, Booking, Zomato, Swiggy</div>
          </Link>
        </div>

        <div className="col-6 col-lg-3">
          <Link href="/owner/approvals" className="app-card p-3 d-block text-decoration-none h-100">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="text-muted-custom small fw-semibold">{t('pending_tasks')}</span>
              <BiTimeFive className="text-warning" size={18} />
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-4 fw-bold text-navy">{pendingApprovals}</span>
              <span className="badge badge-soft-warning" style={{ fontSize: '10px' }}>Approvals</span>
            </div>
            <div className="text-muted-custom mt-1" style={{ fontSize: '11px' }}>Discounts, Voids, Reopen Day</div>
          </Link>
        </div>
      </div>

      {/* Row 3: Unified Multi-Stream Revenue Chart + Payment Breakdown */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-8">
          <div className="app-card p-3 p-md-4 h-100">
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-3">
              <div>
                <h6 className="fw-bold text-navy mb-0">7-Day Unified Hospitality Revenue</h6>
                <p className="text-muted-custom small mb-0">Restaurant + Rooms/Dorms + Camp &amp; Adventure performance</p>
              </div>
              <div className="btn-group btn-group-sm flex-wrap">
                {(['all', 'restaurant', 'rooms', 'camp'] as const).map(sc => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setChartScope(sc)}
                    className={`btn text-capitalize ${chartScope === sc ? 'btn-brand text-white' : 'btn-outline-secondary'}`}
                  >
                    {sc === 'all' ? 'All Streams' : sc}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ width: '100%', height: '270px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_TREND} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <Tooltip formatter={(val: any) => `₹${formatNumber(Number(val))}`} />
                  {(chartScope === 'all' || chartScope === 'rooms') && (
                    <Area type="monotone" dataKey="rooms" name="Rooms & Dorms" stackId="1" stroke="#3478D4" fill="#3478D4" fillOpacity={0.22} />
                  )}
                  {(chartScope === 'all' || chartScope === 'restaurant') && (
                    <Area type="monotone" dataKey="restaurant" name="Restaurant & Cafe" stackId="1" stroke="#F47B35" fill="#F47B35" fillOpacity={0.28} />
                  )}
                  {(chartScope === 'all' || chartScope === 'camp') && (
                    <Area type="monotone" dataKey="camp" name="Camp & Adventure" stackId="1" stroke="#16A36A" fill="#16A36A" fillOpacity={0.22} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="app-card p-3 p-md-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h6 className="fw-bold text-navy mb-0">Payments Mix (Cash vs Online)</h6>
              <p className="text-muted-custom small mb-2">Today&apos;s collected settlements across all outlets</p>
            </div>

            <div style={{ width: '100%', height: '185px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PAYMENT_SPLIT} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3}>
                    {PAYMENT_SPLIT.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => `₹${formatNumber(Number(val))}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="row g-2 mt-1">
              {PAYMENT_SPLIT.map(p => (
                <div key={p.name} className="col-6">
                  <div className="bg-surface rounded-3 p-2 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-1.5 overflow-hidden">
                      <span className="rounded-circle flex-shrink-0" style={{ width: '8px', height: '8px', background: p.color }} />
                      <span className="small text-muted-custom text-truncate" style={{ fontSize: '11px' }}>{p.name}</span>
                    </div>
                    <span className="fw-bold text-navy" style={{ fontSize: '11px' }}>₹{formatNumber(p.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Hospitality Ecosystem Launchpad + Live Staff Activity / Exceptions */}
      <div className="row g-3 mb-4">
        {/* Live Module Launchpad */}
        <div className="col-12 col-lg-7">
          <div className="app-card p-3 p-md-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 className="fw-bold text-navy mb-0">Unified Hospitality Modules &amp; Apps</h6>
                <p className="text-muted-custom small mb-0">Jump directly into specialized touch/role terminals</p>
              </div>
              <Link href="/owner/owner-app" className="small text-brand fw-semibold text-decoration-none">
                Owner Pulse &rarr;
              </Link>
            </div>

            <div className="row g-2">
              {[
                { title: 'Order Ready Board', sub: 'Domino’s-style TV view', href: '/ready-board', icon: BiTv, color: '#16A36A' },
                { title: 'Self-Order Kiosk', sub: 'Bilingual EN/HI touch UI', href: '/kiosk', icon: MdOutlineMonitor, color: '#F47B35' },
                { title: 'Captain App', sub: 'Table-side steward KOT', href: '/owner/captain', icon: BiUserCheck, color: '#3478D4' },
                { title: 'Front Desk & Calendar', sub: 'Check-in / Walk-in / Folio', href: '/owner/front-desk', icon: BiHotel, color: '#8B5CF6' },
                { title: 'Hostel Dorm Beds', sub: '16 beds • Gender zones', href: '/owner/dorms', icon: BiBed, color: '#0EA5E9' },
                { title: 'Unified Guest Folio', sub: 'Room + Food + Camp bill', href: '/owner/folio', icon: TbFileInvoice, color: '#18263B' },
                { title: 'Camp & Rafting Slots', sub: 'Waivers + Guide roster', href: '/owner/camps', icon: TbTent, color: '#10B981' },
                { title: 'Form III Countdown', sub: '24h FRRO compliance UI', href: '/owner/form-iii', icon: BiShieldAlt2, color: '#E34B4B' },
                { title: 'WhatsApp & AI Helper', sub: 'Ask sales, rooms, Form III', href: '/owner/ai-assistant', icon: BiBrain, color: '#F47B35' },
              ].map(mod => {
                const Icon = mod.icon;
                return (
                  <div key={mod.href} className="col-12 col-sm-6 col-md-4">
                    <Link
                      href={mod.href}
                      className="d-flex align-items-center gap-2.5 p-2.5 rounded-3 border border-subtle bg-surface text-decoration-none h-100"
                    >
                      <div
                        className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: '36px', height: '36px', backgroundColor: `${mod.color}18`, color: mod.color }}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="fw-bold text-navy text-truncate" style={{ fontSize: '12px' }}>{mod.title}</div>
                        <div className="text-muted-custom text-truncate" style={{ fontSize: '10px' }}>{mod.sub}</div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Staff Activity & Exceptions Feed */}
        <div className="col-12 col-lg-5">
          <div className="app-card p-3 p-md-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 className="fw-bold text-navy mb-0">Live Staff Activity &amp; Exceptions</h6>
                <p className="text-muted-custom small mb-0">Immutable audit events &amp; alerts</p>
              </div>
              <Link href="/owner/audit" className="small text-brand fw-semibold text-decoration-none">
                Audit Log &rarr;
              </Link>
            </div>

            <div className="d-flex flex-column gap-2">
              {auditLogs.slice(0, 5).map(log => (
                <div key={log.id} className="p-2.5 rounded-3 bg-surface border border-subtle">
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <span className="fw-bold text-navy small text-truncate">{log.action}</span>
                    <span
                      className={`badge rounded-pill ${
                        log.severity === 'High'
                          ? 'badge-soft-danger'
                          : log.severity === 'Warning'
                          ? 'badge-soft-warning'
                          : 'badge-soft-info'
                      }`}
                      style={{ fontSize: '10px' }}
                    >
                      {log.objectType}
                    </span>
                  </div>
                  <div className="text-muted-custom mt-1" style={{ fontSize: '11px' }}>
                    <strong>{log.user}</strong> ({log.role}) &bull; {log.newValue}
                  </div>
                  <div className="text-muted-custom mt-0.5" style={{ fontSize: '10px' }}>
                    {log.timestamp} &bull; {log.device}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Live In-House Arrivals & Active Kitchen Tickets */}
      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="app-card p-3 p-md-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-navy mb-0">In-House Guests &amp; Today&apos;s Arrivals</h6>
              <Link href="/owner/front-desk" className="small text-brand fw-semibold text-decoration-none d-flex align-items-center gap-1">
                Front Desk <BiRightArrowAlt size={16} />
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted-custom">
                    <th>Guest &amp; Nationality</th>
                    <th>Unit</th>
                    <th>Source</th>
                    <th>Form III</th>
                    <th className="text-end">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.slice(0, 5).map(res => (
                    <tr key={res.id}>
                      <td>
                        <div className="fw-semibold text-navy small">{res.guestName}</div>
                        <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                          {res.nationality} {res.isForeignGuest && <span className="badge badge-soft-warning ms-1" style={{ fontSize: '9px' }}>Foreign</span>}
                        </div>
                      </td>
                      <td className="small text-navy">{res.unitLabel}</td>
                      <td><span className="badge bg-light text-navy border" style={{ fontSize: '10px' }}>{res.source}</span></td>
                      <td>
                        {res.formIIIRequired ? (
                          <span className={`badge rounded-pill ${
                            res.formIIIStatus === 'Overdue' ? 'badge-soft-danger'
                            : res.formIIIStatus === 'Submitted' ? 'badge-soft-success'
                            : 'badge-soft-warning'
                          }`} style={{ fontSize: '10px' }}>
                            {res.formIIIStatus}
                          </span>
                        ) : (
                          <span className="text-muted-custom small">N/A</span>
                        )}
                      </td>
                      <td className="text-end fw-bold text-navy small">
                        ₹{formatNumber(Math.max(0, res.totalEstimate - res.paidAmount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="app-card p-3 p-md-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-navy mb-0">Live Kitchen &amp; Ready Orders</h6>
              <Link href="/owner/kot" className="small text-brand fw-semibold text-decoration-none d-flex align-items-center gap-1">
                KDS <TbToolsKitchen2 size={15} />
              </Link>
            </div>
            <div className="d-flex flex-column gap-2">
              {readyBoardOrders.slice(0, 5).map(ord => (
                <div key={ord.id} className="d-flex align-items-center justify-content-between p-2.5 rounded-3 bg-surface border border-subtle">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-navy text-white fw-bold">#{ord.tokenNumber}</span>
                      <span className="fw-semibold text-navy small">{ord.customerShortName}</span>
                      <span className="text-muted-custom" style={{ fontSize: '11px' }}>({ord.orderType})</span>
                    </div>
                    <div className="text-muted-custom mt-1" style={{ fontSize: '11px' }}>
                      {ord.sourceLabel} &bull; {ord.items.length} items &bull; ₹{ord.totalAmount}
                    </div>
                  </div>
                  <span className={`badge rounded-pill ${
                    ord.stage === 'READY' ? 'bg-success text-white'
                    : ord.stage === 'PREPARING' ? 'badge-soft-warning'
                    : ord.stage === 'NEW' ? 'badge-soft-brand'
                    : 'badge-soft-secondary'
                  }`}>
                    {ord.stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
