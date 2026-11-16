'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_FRANCHISE_OUTLETS } from '@/data/saasData';
import { FranchiseOutletRecord } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiNetworkChart,
  BiPlus,
  BiStore,
  BiMoney,
  BiCheckCircle,
  BiTimeFive,
  BiSearch,
  BiFile,
} from 'react-icons/bi';

export default function BusinessOwnerFranchisePage() {
  const [outlets, setOutlets] = useState<FranchiseOutletRecord[]>(SAMPLE_FRANCHISE_OUTLETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Franchise form
  const [branchName, setBranchName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [city, setCity] = useState('');
  const [royaltyPercentage, setRoyaltyPercentage] = useState(5.0);
  const [agreementEnd, setAgreementEnd] = useState('2028-12-31');

  const filteredOutlets = useMemo(() => {
    return outlets.filter((o) => {
      const matchSearch =
        o.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.franchiseCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || o.royaltyStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [outlets, searchTerm, statusFilter]);

  const totalNetworkSales = useMemo(
    () => outlets.reduce((acc, o) => acc + o.monthlySales, 0),
    [outlets]
  );

  const totalRoyaltyEarned = useMemo(
    () => outlets.reduce((acc, o) => acc + o.royaltyDue, 0),
    [outlets]
  );

  const totalPendingRoyalty = useMemo(
    () => outlets.filter((o) => o.royaltyStatus !== 'Paid').reduce((acc, o) => acc + o.royaltyDue, 0),
    [outlets]
  );

  const handleCreateFranchise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) return;

    const newFr: FranchiseOutletRecord = {
      id: `fr-${Date.now()}`,
      franchiseCode: `FRAN-${city.slice(0, 3).toUpperCase()}-0${outlets.length + 1}`,
      branchName,
      ownerName,
      city,
      monthlySales: 1200000,
      royaltyPercentage: Number(royaltyPercentage),
      royaltyDue: Math.round(1200000 * (Number(royaltyPercentage) / 100)),
      royaltyStatus: 'Pending',
      agreementEnd,
    };

    setOutlets([...outlets, newFr]);
    setShowAddModal(false);
  };

  const handleMarkPaid = (id: string) => {
    setOutlets((prev) =>
      prev.map((o) => (o.id === id ? { ...o, royaltyStatus: 'Paid' } : o))
    );
    alert('Royalty payment settlement marked as Paid.');
  };

  const getStatusBadge = (s: FranchiseOutletRecord['royaltyStatus']) => {
    switch (s) {
      case 'Paid':
        return <span className="badge bg-success-subtle text-success border border-success-subtle"><BiCheckCircle className="me-1" />Paid</span>;
      case 'Pending':
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"><BiTimeFive className="me-1" />Pending</span>;
      case 'Overdue':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Overdue</span>;
    }
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Franchise Network & Royalty Management</h1>
            <p className="text-muted small mb-0">
              Track franchisee outlet gross turnover, enforce standardized brand menus, and calculate monthly franchise royalty fees.
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <BiPlus size={18} /> Onboard Franchise Partner
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Franchise Outlets</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiStore size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{outlets.length} Outlets</h3>
              <span className="text-muted small">Across 5 major metro hubs</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Network Gross Sales</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiNetworkChart size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(totalNetworkSales)}</h3>
              <span className="text-success small fw-medium">+15.2% YoY brand growth</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Monthly Royalty Due</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiMoney size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(totalRoyaltyEarned)}</h3>
              <span className="text-muted small">Based on signed revenue-share %</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Pending Inward Royalty</span>
                <span className="p-2 rounded bg-info-subtle text-info">
                  <BiTimeFive size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(totalPendingRoyalty)}</h3>
              <span className="text-muted small">Auto-generated tax invoice sent</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-6">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <BiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search franchise code, branch, owner, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2 flex-wrap">
                {['All', 'Paid', 'Pending', 'Overdue'].map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ${
                      statusFilter === s ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Outlets Table */}
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th className="ps-3 py-3">Franchise Code</th>
                    <th>Branch Outlet</th>
                    <th>Franchisee Partner</th>
                    <th>City</th>
                    <th>Monthly POS Sales</th>
                    <th>Royalty %</th>
                    <th>Royalty Due</th>
                    <th>Agreement Valid Till</th>
                    <th>Royalty Status</th>
                    <th className="text-end pe-3">Action</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {filteredOutlets.map((o) => (
                    <tr key={o.id}>
                      <td className="ps-3 fw-bold text-dark font-monospace">{o.franchiseCode}</td>
                      <td className="fw-semibold text-dark">{o.branchName}</td>
                      <td>{o.ownerName}</td>
                      <td>{o.city}</td>
                      <td className="fw-bold text-dark" suppressHydrationWarning>₹{formatNumber(o.monthlySales)}</td>
                      <td>{o.royaltyPercentage}%</td>
                      <td className="fw-bold text-primary" suppressHydrationWarning>₹{formatNumber(o.royaltyDue)}</td>
                      <td className="text-muted">{o.agreementEnd}</td>
                      <td>{getStatusBadge(o.royaltyStatus)}</td>
                      <td className="text-end pe-3">
                        {o.royaltyStatus !== 'Paid' ? (
                          <button
                            className="btn btn-outline-success btn-sm px-2 py-0"
                            onClick={() => handleMarkPaid(o.id)}
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-secondary btn-sm px-2 py-0"
                            onClick={() => alert(`Downloading Royalty Receipt for ${o.franchiseCode}...`)}
                          >
                            Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Add Franchise */}
        {showAddModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleCreateFranchise}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Onboard Franchise Outlet</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Branch Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Food Palace - HSR Layout Franchise"
                        required
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Franchisee Owner *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">City *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mb-0">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Royalty % *</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control form-control-sm"
                          min={1}
                          max={30}
                          required
                          value={royaltyPercentage}
                          onChange={(e) => setRoyaltyPercentage(Number(e.target.value))}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Agreement Valid Till</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={agreementEnd}
                          onChange={(e) => setAgreementEnd(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Register Franchise Partner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
