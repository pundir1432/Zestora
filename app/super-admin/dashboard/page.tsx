'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/common/StatCard';
import { formatNumber } from '@/utils/formatters';
import { 
  PLATFORM_OVERVIEW_STATS, 
  PLATFORM_REVENUE_CHART_DATA, 
  TOP_PERFORMING_RESTAURANTS, 
  PLATFORM_ACTIVITIES,
  SAMPLE_PLATFORM_OWNERS
} from '@/data/superAdminData';
import { 
  BiGroup, 
  BiStore, 
  BiBuilding, 
  BiReceipt, 
  BiCreditCard, 
  BiTime, 
  BiTrendingUp, 
  BiCheckCircle,
  BiStar,
  BiFile,
  BiMoney
} from 'react-icons/bi';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function SuperAdminDashboardPage() {
  const [revenuePeriod, setRevenuePeriod] = useState<'monthly' | 'quarterly'>('monthly');
  const [registrations, setRegistrations] = useState(SAMPLE_PLATFORM_OWNERS.slice(0, 5));

  const handleApprove = (id: string) => {
    setRegistrations(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'active' as const } : r)
    );
  };

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      {/* Page Title & Controls */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Platform Headquarters Dashboard</h4>
          <p className="text-muted-custom small mb-0">
            Real-time platform metrics across all onboarded restaurants and owners
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge badge-soft-success py-2 px-3 rounded-pill fw-semibold">
            All Systems Operational • 99.98% SLA
          </span>
        </div>
      </div>

      {/* Top 7 Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Restaurant Owners"
            value={formatNumber(PLATFORM_OVERVIEW_STATS.totalOwners)}
            change="+14.2%"
            subtitle="from last month"
            icon={BiGroup}
            iconColor="#3478D4"
            iconBg="rgba(52, 120, 212, 0.1)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Restaurants"
            value={formatNumber(PLATFORM_OVERVIEW_STATS.totalRestaurants)}
            change="+12.6%"
            subtitle="across 38 cities"
            icon={BiStore}
            iconColor="#F47B35"
            iconBg="rgba(244, 123, 53, 0.1)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Active Branches"
            value={formatNumber(PLATFORM_OVERVIEW_STATS.totalBranches)}
            change="+18.4%"
            subtitle="multi-outlet chains"
            icon={BiBuilding}
            iconColor="#16A36A"
            iconBg="rgba(22, 163, 106, 0.1)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Orders Processed"
            value={PLATFORM_OVERVIEW_STATS.totalOrders}
            change="+24.1%"
            subtitle="all-time platform"
            icon={BiReceipt}
            iconColor="#8B5CF6"
            iconBg="rgba(139, 92, 246, 0.1)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <StatCard
            title="Total Platform Revenue"
            value={PLATFORM_OVERVIEW_STATS.totalRevenue}
            change="+18.4%"
            subtitle="Gross volume processed"
            icon={BiTrendingUp}
            iconColor="#16A36A"
            iconBg="rgba(22, 163, 106, 0.1)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <StatCard
            title="Active Subscriptions (SaaS)"
            value={formatNumber(PLATFORM_OVERVIEW_STATS.activeSubscriptions)}
            change="+8.5%"
            subtitle="MRR: ₹1.45 Cr / mo"
            icon={BiCreditCard}
            iconColor="#3478D4"
            iconBg="rgba(52, 120, 212, 0.1)"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <StatCard
            title="Pending Approvals"
            value={PLATFORM_OVERVIEW_STATS.pendingApprovals}
            change="Action Needed"
            isPositive={false}
            subtitle="KYC & Food License check"
            icon={BiTime}
            iconColor="#EAA12D"
            iconBg="rgba(234, 161, 45, 0.1)"
          />
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="row g-4 mb-4">
        {/* Revenue Analytics Chart */}
        <div className="col-12 col-lg-8">
          <div className="app-card p-3 p-md-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h6 className="fw-bold text-navy mb-0">Platform Revenue Trend (₹ Lakhs)</h6>
                <span className="text-muted-custom small">Consolidated SaaS subscriptions & billing volume</span>
              </div>
              <div className="btn-group btn-group-sm flex-wrap">
                <button
                  type="button"
                  className={`btn btn-sm ${revenuePeriod === 'monthly' ? 'btn-brand fw-semibold' : 'btn-outline-secondary'}`}
                  onClick={() => setRevenuePeriod('monthly')}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${revenuePeriod === 'quarterly' ? 'btn-brand fw-semibold' : 'btn-outline-secondary'}`}
                  onClick={() => setRevenuePeriod('quarterly')}
                >
                  Quarterly
                </button>
              </div>
            </div>

            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PLATFORM_REVENUE_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F47B35" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F47B35" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3478D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3478D4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18263B', color: '#fff', borderRadius: '8px', border: 'none' }}
                  />
                  <Area type="monotone" dataKey="revenue" name="Total Revenue (₹L)" stroke="#F47B35" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="subscriptions" name="SaaS MRR (₹L)" stroke="#3478D4" strokeWidth={2} fillOpacity={1} fill="url(#colorSub)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Restaurant Registration Trend Chart */}
        <div className="col-12 col-lg-4">
          <div className="app-card p-3 p-md-4 h-100">
            <h6 className="fw-bold text-navy mb-0">New Owners Onboarded</h6>
            <span className="text-muted-custom small d-block mb-3">Monthly new restaurant registrations</span>

            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PLATFORM_REVENUE_CHART_DATA.slice(-6)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18263B', color: '#fff', borderRadius: '8px', border: 'none' }}
                  />
                  <Bar dataKey="newOwners" name="New Owners" fill="#16A36A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard & Recent Activities Row */}
      <div className="row g-4 mb-4">
        {/* Top Performing Restaurants */}
        <div className="col-12 col-lg-7">
          <div className="app-card p-3 p-md-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 className="fw-bold text-navy mb-0">Top Performing Restaurants</h6>
                <span className="text-muted-custom small">Leaderboard based on volume and customer rating</span>
              </div>
              <span className="badge badge-soft-brand rounded-pill">Top 5 Chains</span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted-custom">
                    <th>Rank</th>
                    <th>Restaurant</th>
                    <th>City</th>
                    <th>Branches</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_PERFORMING_RESTAURANTS.map((r) => (
                    <tr key={r.rank}>
                      <td>
                        <span className="badge rounded-circle bg-navy text-white" style={{ width: '24px', height: '24px', lineHeight: '18px', textAlign: 'center' }}>
                          {r.rank}
                        </span>
                      </td>
                      <td>
                        <span className="fw-semibold text-navy">{r.name}</span>
                      </td>
                      <td className="small text-muted-custom">{r.city}</td>
                      <td className="text-center">{r.branches}</td>
                      <td className="small fw-semibold">{r.orders}</td>
                      <td className="small fw-bold text-brand">{r.revenue}</td>
                      <td>
                        <span className="badge badge-soft-warning d-inline-flex align-items-center gap-1">
                          <BiStar size={12} /> {r.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Platform Activities */}
        <div className="col-12 col-lg-5">
          <div className="app-card p-3 p-md-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-navy mb-0">Recent Platform Activities</h6>
              <span className="text-muted-custom small">Live stream</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {PLATFORM_ACTIVITIES.map((act) => (
                <div key={act.id} className="d-flex align-items-start gap-3 pb-2 border-bottom border-subtle">
                  <div 
                    className="p-2 rounded-circle flex-shrink-0"
                    style={{ 
                      backgroundColor: act.type === 'branch' ? 'rgba(244, 123, 53, 0.1)' :
                        act.type === 'sub' ? 'rgba(52, 120, 212, 0.1)' :
                        act.type === 'finance' ? 'rgba(22, 163, 106, 0.1)' : 'rgba(234, 161, 45, 0.1)',
                      color: act.type === 'branch' ? '#F47B35' :
                        act.type === 'sub' ? '#3478D4' :
                        act.type === 'finance' ? '#16A36A' : '#EAA12D',
                    }}
                  >
                    {act.type === 'branch' ? <BiBuilding size={16} /> :
                     act.type === 'sub' ? <BiCreditCard size={16} /> :
                     act.type === 'finance' ? <BiMoney size={16} /> : <BiFile size={16} />}
                  </div>

                  <div className="flex-grow-1">
                    <p className="small text-navy mb-0 fw-medium">{act.text}</p>
                    <span className="text-muted-custom" style={{ fontSize: '11px' }}>{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Restaurant Registrations Table with actions */}
      <div className="app-card p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div>
            <h6 className="fw-bold text-navy mb-0">Recent Restaurant Registrations</h6>
            <span className="text-muted-custom small">Latest applicants for SaaS onboarding and verification</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted-custom">
                <th>Owner Name</th>
                <th>Contact</th>
                <th>City</th>
                <th>Branches</th>
                <th>Plan</th>
                <th>Reg. Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((owner) => (
                <tr key={owner.id}>
                  <td>
                    <div className="fw-semibold text-navy">{owner.name}</div>
                    <div className="text-muted-custom small">{owner.email}</div>
                  </td>
                  <td className="small">{owner.phone}</td>
                  <td className="small">{owner.city}</td>
                  <td className="text-center small">{owner.branchesCount}</td>
                  <td>
                    <span className="badge badge-soft-brand">{owner.subscriptionPlan}</span>
                  </td>
                  <td className="small text-muted-custom">{owner.registeredDate}</td>
                  <td>
                    <span className={`badge rounded-pill ${
                      owner.status === 'active' ? 'badge-soft-success' :
                      owner.status === 'pending' ? 'badge-soft-warning' : 'badge-soft-danger'
                    }`}>
                      {owner.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {owner.status === 'pending' ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-success py-1 px-2 d-flex align-items-center gap-1"
                        onClick={() => handleApprove(owner.id)}
                      >
                        <BiCheckCircle size={14} /> Approve
                      </button>
                    ) : (
                      <span className="text-muted-custom small">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

