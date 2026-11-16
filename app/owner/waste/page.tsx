'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_FOOD_WASTE } from '@/data/saasData';
import { FoodWasteEntry } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiTrash,
  BiPlus,
  BiSearch,
  BiTrendingDown,
  BiPieChartAlt,
  BiBrain,
  BiFilterAlt,
  BiDownload,
  BiInfoCircle,
} from 'react-icons/bi';

export default function BusinessOwnerWastePage() {
  const [wasteEntries, setWasteEntries] = useState<FoodWasteEntry[]>(SAMPLE_FOOD_WASTE);
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Waste Entry Form
  const [dishName, setDishName] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [quantity, setQuantity] = useState(2);
  const [unit, setUnit] = useState('kg');
  const [costPerUnit, setCostPerUnit] = useState(150);
  const [reason, setReason] = useState<FoodWasteEntry['reason']>('Overproduction');
  const [recordedBy, setRecordedBy] = useState('Chef Naresh');
  const [branchName, setBranchName] = useState('Indiranagar Branch');

  const filteredEntries = useMemo(() => {
    return wasteEntries.filter((w) => {
      const matchSearch =
        w.dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.recordedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.branchName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchReason = reasonFilter === 'All' || w.reason === reasonFilter;
      return matchSearch && matchReason;
    });
  }, [wasteEntries, searchTerm, reasonFilter]);

  const totalWasteCost = useMemo(
    () => wasteEntries.reduce((acc, w) => acc + w.totalCost, 0),
    [wasteEntries]
  );

  const topReason = useMemo(() => {
    const counts: Record<string, number> = {};
    wasteEntries.forEach((w) => {
      counts[w.reason] = (counts[w.reason] || 0) + w.totalCost;
    });
    let maxR = 'Overproduction';
    let maxC = 0;
    Object.entries(counts).forEach(([r, cost]) => {
      if (cost > maxC) {
        maxC = cost;
        maxR = r;
      }
    });
    return maxR;
  }, [wasteEntries]);

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    const totalCost = Math.round(Number(quantity) * Number(costPerUnit));
    const newEntry: FoodWasteEntry = {
      id: `wst-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dishName,
      category,
      quantity: Number(quantity),
      unit,
      costPerUnit: Number(costPerUnit),
      totalCost,
      reason,
      recordedBy,
      branchName,
    };

    setWasteEntries([newEntry, ...wasteEntries]);
    setShowAddModal(false);
    setDishName('');
  };

  const getReasonBadge = (r: FoodWasteEntry['reason']) => {
    switch (r) {
      case 'Overproduction':
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">Overproduction</span>;
      case 'Expired / Spoilage':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Expired / Spoilage</span>;
      case 'Preparation Error':
        return <span className="badge bg-secondary-subtle text-dark border">Preparation Error</span>;
      case 'Customer Return':
        return <span className="badge bg-info-subtle text-info border border-info-subtle">Customer Return</span>;
      case 'Dropped / Damaged':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Dropped / Damaged</span>;
    }
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'kitchen_staff']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Food Waste Management & Cost Audit</h1>
            <p className="text-muted small mb-0">
              Track kitchen prep wastage, spoilage losses, and customer returns to prevent margin leakage.
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <BiPlus size={18} /> Log Food Wastage
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Wastage Loss This Month</span>
                <span className="p-2 rounded bg-danger-subtle text-danger">
                  <BiTrash size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(totalWasteCost)}</h3>
              <span className="text-muted small">Representing 1.8% of total raw procurement</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Primary Loss Cause</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiPieChartAlt size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{topReason}</h3>
              <span className="text-muted small">Highest financial impact category</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">AI Waste Reduction Index</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiTrendingDown size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">-26.4%</h3>
              <span className="text-success small fw-medium">Waste trimmed vs last month baseline</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations Card */}
        <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white border-start border-4 border-primary">
          <div className="card-body p-3">
            <div className="d-flex align-items-start gap-3">
              <div className="p-2 rounded bg-primary-subtle text-primary mt-1">
                <BiBrain size={24} />
              </div>
              <div>
                <h6 className="fw-bold text-dark mb-1">AI Kitchen Intelligence Insights</h6>
                <p className="text-muted small mb-0">
                  <strong>Paneer Makhani Gravy</strong> accounted for ₹630 in overproduction on Sunday. Consider reducing evening batch preparation from 8kg to 5.5kg on weekdays. Also, 4L milk spoiled due to refrigerator door seal leakage in Indiranagar; inspection scheduled.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-5">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <BiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search dish name, chef, or branch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-7 d-flex justify-content-md-end gap-2 overflow-auto">
                {['All', 'Overproduction', 'Expired / Spoilage', 'Preparation Error', 'Customer Return'].map((r) => (
                  <button
                    key={r}
                    className={`btn btn-sm ${
                      reasonFilter === r ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => setReasonFilter(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wastage Table */}
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th className="ps-3 py-3">Date</th>
                    <th>Dish / Ingredient</th>
                    <th>Category</th>
                    <th>Wasted Quantity</th>
                    <th>Rate / Unit</th>
                    <th>Financial Loss</th>
                    <th>Reason</th>
                    <th>Logged By</th>
                    <th className="pe-3">Branch</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {filteredEntries.map((w) => (
                    <tr key={w.id}>
                      <td className="ps-3 text-muted">{w.date}</td>
                      <td>
                        <div className="fw-semibold text-dark">{w.dishName}</div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {w.category}
                        </span>
                      </td>
                      <td className="fw-bold text-dark">
                        {w.quantity} {w.unit}
                      </td>
                      <td className="text-muted" suppressHydrationWarning>
                        ₹{formatCurrency(w.costPerUnit)}
                      </td>
                      <td className="fw-bold text-danger" suppressHydrationWarning>
                        ₹{formatNumber(w.totalCost)}
                      </td>
                      <td>{getReasonBadge(w.reason)}</td>
                      <td>{w.recordedBy}</td>
                      <td className="pe-3 text-muted">{w.branchName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Log Food Waste */}
        {showAddModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleCreateEntry}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Log Food Wastage</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Dish / Ingredient Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Paneer Makhani Gravy"
                        required
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Category</label>
                        <select
                          className="form-select form-select-sm"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="Main Course">Main Course</option>
                          <option value="Dairy">Dairy</option>
                          <option value="Produce">Produce</option>
                          <option value="Bakery">Bakery</option>
                          <option value="Rice & Biryani">Rice & Biryani</option>
                          <option value="Breads">Breads</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Root Cause *</label>
                        <select
                          className="form-select form-select-sm"
                          value={reason}
                          onChange={(e) => setReason(e.target.value as FoodWasteEntry['reason'])}
                        >
                          <option value="Overproduction">Overproduction</option>
                          <option value="Expired / Spoilage">Expired / Spoilage</option>
                          <option value="Preparation Error">Preparation Error</option>
                          <option value="Customer Return">Customer Return</option>
                          <option value="Dropped / Damaged">Dropped / Damaged</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-4">
                        <label className="form-label small fw-semibold">Quantity *</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control form-control-sm"
                          min={0.1}
                          required
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                      </div>
                      <div className="col-4">
                        <label className="form-label small fw-semibold">Unit</label>
                        <select
                          className="form-select form-select-sm"
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                        >
                          <option value="kg">kg</option>
                          <option value="litres">litres</option>
                          <option value="pcs">pcs</option>
                          <option value="portion">portion</option>
                        </select>
                      </div>
                      <div className="col-4">
                        <label className="form-label small fw-semibold">Cost / Unit (₹) *</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min={1}
                          required
                          value={costPerUnit}
                          onChange={(e) => setCostPerUnit(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-light rounded text-center small mb-3">
                      <span className="text-muted me-2">Total Financial Loss Impact:</span>
                      <span className="fw-bold text-danger fs-6" suppressHydrationWarning>
                        ₹{formatNumber(Math.round(quantity * costPerUnit))}
                      </span>
                    </div>

                    <div className="row g-2 mb-0">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Logged By</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={recordedBy}
                          onChange={(e) => setRecordedBy(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Branch</label>
                        <select
                          className="form-select form-select-sm"
                          value={branchName}
                          onChange={(e) => setBranchName(e.target.value)}
                        >
                          <option value="Indiranagar Branch">Indiranagar Branch</option>
                          <option value="Koramangala Branch">Koramangala Branch</option>
                          <option value="Whitefield Branch">Whitefield Branch</option>
                        </select>
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
                      Log Wastage Entry
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
