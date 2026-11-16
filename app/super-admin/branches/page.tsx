'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SAMPLE_PLATFORM_BRANCHES } from '@/data/saasData';
import { PlatformBranchRecord } from '@/types/saas';
import { Modal } from '@/components/common/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatNumber } from '@/utils/formatters';
import {
  BiBuilding,
  BiSearch,
  BiFilterAlt,
  BiMapPin,
  BiPhone,
  BiUser,
  BiTrendingUp,
  BiPowerOff,
  BiStore,
  BiCheckCircle,
  BiDetail,
} from 'react-icons/bi';
import { MdTableRestaurant } from 'react-icons/md';

export default function SuperAdminBranchesPage() {
  const [branches, setBranches] = useState<PlatformBranchRecord[]>(SAMPLE_PLATFORM_BRANCHES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState<PlatformBranchRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Derived filter options
  const cities = ['All', ...Array.from(new Set(branches.map((b) => b.city)))];

  // Filtering
  const filteredBranches = branches.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.managerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = selectedCity === 'All' || b.city === selectedCity;
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;

    return matchesSearch && matchesCity && matchesStatus;
  });

  // Aggregate metrics
  const totalBranches = branches.length;
  const activeBranches = branches.filter((b) => b.status === 'active').length;
  const totalSeating = branches.reduce((acc, b) => acc + b.seatingCapacity, 0);
  const totalDailyRevenue = branches.reduce((acc, b) => acc + b.dailyRevenue, 0);

  const handleToggleStatus = (id: string) => {
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const next = b.status === 'active' ? 'inactive' : 'active';
          return { ...b, status: next, dailyRevenue: next === 'active' ? 32000 : 0 };
        }
        return b;
      })
    );
  };

  const handleViewDetails = (branch: PlatformBranchRecord) => {
    setSelectedBranch(branch);
    setIsDetailModalOpen(true);
  };

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Platform Branches & Outlets</h4>
          <p className="text-muted-custom small mb-0">
            Cross-tenant branch network monitoring, regional outlet distribution, and branch health
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Total Registered Outlets</span>
              <h3 className="fw-bold text-navy mb-0">{totalBranches}</h3>
              <span className="text-success small fw-medium" style={{ fontSize: '11px' }}>
                Across {cities.length - 1} major cities
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand bg-opacity-10 text-brand"
              style={{ width: '48px', height: '48px' }}
            >
              <BiBuilding size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Active Online Outlets</span>
              <h3 className="fw-bold text-success mb-0">{activeBranches}</h3>
              <span className="text-muted-custom small" style={{ fontSize: '11px' }}>
                {Math.round((activeBranches / totalBranches) * 100)}% Operational
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-success"
              style={{ width: '48px', height: '48px' }}
            >
              <BiCheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Total Seating Capacity</span>
              <h3 className="fw-bold text-navy mb-0" suppressHydrationWarning>{formatNumber(totalSeating)} Pax</h3>
              <span className="text-info small fw-medium" style={{ fontSize: '11px' }}>
                Dine-in table coverage
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-info bg-opacity-10 text-info"
              style={{ width: '48px', height: '48px' }}
            >
              <MdTableRestaurant size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Daily Outlets Revenue</span>
              <h3 className="fw-bold text-brand mb-0">₹{(totalDailyRevenue / 100000).toFixed(2)} L</h3>
              <span className="text-success small fw-medium" style={{ fontSize: '11px' }}>
                +14.2% vs last week
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-warning bg-opacity-10 text-warning"
              style={{ width: '48px', height: '48px' }}
            >
              <BiTrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="app-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-subtle text-muted-custom">
                <BiSearch size={16} />
              </span>
              <input
                type="text"
                className="form-control border-subtle shadow-none"
                placeholder="Search by branch name, code, restaurant, or manager..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted-custom small">City:</span>
              <select
                className="form-select form-select-sm border-subtle shadow-none"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted-custom small">Status:</span>
              <select
                className="form-select form-select-sm border-subtle shadow-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="col-12 col-md-1 text-md-end">
            <span className="badge bg-light text-navy border">
              {filteredBranches.length} Outlets
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-surface border-bottom border-subtle">
              <tr>
                <th className="text-muted-custom small py-3 ps-3">OUTLET CODE</th>
                <th className="text-muted-custom small py-3">BRANCH NAME</th>
                <th className="text-muted-custom small py-3">PARENT BUSINESS</th>
                <th className="text-muted-custom small py-3">LOCATION</th>
                <th className="text-muted-custom small py-3">BRANCH MANAGER</th>
                <th className="text-muted-custom small py-3 text-center">CAPACITY</th>
                <th className="text-muted-custom small py-3 text-end">TODAY REVENUE</th>
                <th className="text-muted-custom small py-3 text-center">STATUS</th>
                <th className="text-muted-custom small py-3 text-end pe-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((b) => (
                <tr key={b.id}>
                  <td className="ps-3 font-monospace small fw-bold text-navy">{b.code}</td>
                  <td>
                    <div className="fw-semibold text-navy">{b.name}</div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      Added {b.joinedDate}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1 text-navy fw-medium">
                      <BiStore className="text-brand flex-shrink-0" size={15} />
                      <span>{b.restaurantName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="small text-navy d-flex align-items-center gap-1">
                      <BiMapPin className="text-brand flex-shrink-0" size={14} />
                      <span>{b.city}, {b.state}</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-navy small fw-medium">{b.managerName}</div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      {b.managerPhone}
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="badge bg-light text-navy border">
                      {b.seatingCapacity} seats ({b.tablesCount} tbls)
                    </span>
                  </td>
                  <td className="text-end fw-bold text-navy" suppressHydrationWarning>
                    {b.dailyRevenue > 0 ? `₹${formatNumber(b.dailyRevenue)}` : <span className="text-muted">₹0</span>}
                  </td>
                  <td className="text-center">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="text-end pe-3">
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-secondary p-1"
                        title="View Full Branch Details"
                        onClick={() => handleViewDetails(b)}
                      >
                        <BiDetail size={16} />
                      </button>
                      <button
                        type="button"
                        className={`btn p-1 ${
                          b.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'
                        }`}
                        title={b.status === 'active' ? 'Deactivate Branch' : 'Activate Branch'}
                        onClick={() => handleToggleStatus(b.id)}
                      >
                        <BiPowerOff size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBranches.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-5 text-muted-custom">
                    No branches found matching your search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Branch Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Branch Outlet Profile & Performance"
        subtitle={selectedBranch ? `${selectedBranch.name} (${selectedBranch.code})` : ''}
        size="lg"
      >
        {selectedBranch && (
          <div>
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <div className="p-3 bg-surface rounded-3 border border-subtle">
                  <div className="text-muted-custom small mb-1">Parent Restaurant</div>
                  <div className="fw-bold fs-6 text-navy">{selectedBranch.restaurantName}</div>
                  <div className="small text-muted-custom mt-2">
                    <strong>Address:</strong> {selectedBranch.address}, {selectedBranch.city}, {selectedBranch.state}
                  </div>
                  <div className="small text-muted-custom mt-1">
                    <strong>Outlet Phone:</strong> {selectedBranch.phone}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 bg-surface rounded-3 border border-subtle">
                  <div className="text-muted-custom small mb-1">Branch Operations & Manager</div>
                  <div className="fw-bold fs-6 text-navy">{selectedBranch.managerName}</div>
                  <div className="small text-muted-custom mt-2">
                    <strong>Direct Contact:</strong> {selectedBranch.managerPhone}
                  </div>
                  <div className="small text-muted-custom mt-1">
                    <strong>Onboarded Date:</strong> {selectedBranch.joinedDate}
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-2 mb-4 text-center">
              <div className="col-3">
                <div className="p-2 border border-subtle rounded-3 bg-white">
                  <div className="small text-muted-custom">Seating</div>
                  <strong className="fs-5 text-navy">{selectedBranch.seatingCapacity} Pax</strong>
                </div>
              </div>
              <div className="col-3">
                <div className="p-2 border border-subtle rounded-3 bg-white">
                  <div className="small text-muted-custom">Tables</div>
                  <strong className="fs-5 text-navy">{selectedBranch.tablesCount} Tables</strong>
                </div>
              </div>
              <div className="col-3">
                <div className="p-2 border border-subtle rounded-3 bg-white">
                  <div className="small text-muted-custom">Active Orders</div>
                  <strong className="fs-5 text-brand">{selectedBranch.activeOrdersCount}</strong>
                </div>
              </div>
              <div className="col-3">
                <div className="p-2 border border-subtle rounded-3 bg-white">
                  <div className="small text-muted-custom">Today Revenue</div>
                  <strong className="fs-5 text-success" suppressHydrationWarning>₹{formatNumber(selectedBranch.dailyRevenue)}</strong>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-3 border-top border-subtle">
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted-custom">Branch Status:</span>
                <StatusBadge status={selectedBranch.status} />
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
