'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_STAFF_SHIFTS } from '@/data/saasData';
import { StaffShiftRecord } from '@/types/saas';
import {
  BiCalendar,
  BiTimeFive,
  BiUser,
  BiPlus,
  BiCheckCircle,
  BiTransferAlt,
  BiEdit,
} from 'react-icons/bi';

export default function BusinessOwnerShiftsPage() {
  const [shifts, setShifts] = useState<StaffShiftRecord[]>(SAMPLE_STAFF_SHIFTS);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Shift form
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('04:00 PM');
  const [assignedCount, setAssignedCount] = useState(6);
  const [branchName, setBranchName] = useState('Indiranagar Branch');
  const [color, setColor] = useState('#0d6efd');

  // Days of week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newShf: StaffShiftRecord = {
      id: `shf-${Date.now()}`,
      name,
      startTime,
      endTime,
      assignedStaffCount: Number(assignedCount),
      branchName,
      color,
    };

    setShifts([...shifts, newShf]);
    setShowAddModal(false);
    setName('');
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Staff Shifts & Roster Scheduling</h1>
            <p className="text-muted small mb-0">
              Plan weekly shift coverage, allocate kitchen captains and floor stewards, and balance weekend rush staffing.
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <BiPlus size={18} /> Add New Shift Template
            </button>
          </div>
        </div>

        {/* Shift Template Cards */}
        <div className="row g-3 mb-4">
          {shifts.map((shf) => (
            <div key={shf.id} className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-3 bg-white h-100 position-relative overflow-hidden">
                <div style={{ height: '4px', backgroundColor: shf.color }}></div>
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold text-dark mb-0">{shf.name}</h6>
                    <span className="p-1 rounded bg-light text-muted">
                      <BiTimeFive />
                    </span>
                  </div>
                  <div className="text-muted small mb-2">
                    {shf.startTime} - {shf.endTime}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                    <span className="badge bg-light text-dark border">
                      <BiUser className="me-1" /> {shf.assignedStaffCount} Staff Assigned
                    </span>
                    <span className="text-muted small">{shf.branchName.replace(' Branch', '')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Roster Grid */}
        <div className="card border-0 shadow-sm rounded-3 bg-white mb-4">
          <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-dark">Weekly Master Roster (Nov 16 - Nov 22)</h5>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                onClick={() => alert('Shift swap request notification sent to Floor Captain.')}
              >
                <BiTransferAlt /> Shift Swap Request
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-bordered align-middle mb-0 text-center">
                <thead className="table-light small">
                  <tr>
                    <th style={{ width: '16%' }}>Shift Type</th>
                    {days.map((day) => (
                      <th key={day} style={{ width: '12%' }}>
                        <div>{day}</div>
                        <div className="text-muted fw-normal" style={{ fontSize: '11px' }}>
                          {day === 'Saturday' || day === 'Sunday' ? 'Rush Day' : 'Regular'}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="small">
                  {shifts.map((shf) => (
                    <tr key={shf.id}>
                      <td className="text-start fw-bold ps-3 text-dark bg-light">
                        <div>{shf.name}</div>
                        <div className="text-muted fw-normal" style={{ fontSize: '11px' }}>
                          {shf.startTime} - {shf.endTime}
                        </div>
                      </td>
                      {days.map((day, idx) => (
                        <td key={idx} className="p-2">
                          <div
                            className="p-2 rounded text-white small"
                            style={{
                              backgroundColor: shf.color,
                              opacity: 0.9,
                            }}
                          >
                            <div className="fw-semibold">
                              {day === 'Saturday' || day === 'Sunday'
                                ? shf.assignedStaffCount + 3
                                : shf.assignedStaffCount}{' '}
                              Staff
                            </div>
                            <div style={{ fontSize: '10px' }}>Active</div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Create Shift */}
        {showAddModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleCreateShift}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Create New Shift Template</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Shift Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Evening Peak Dinner Shift"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Start Time *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">End Time *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Target Staff Headcount</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min={1}
                          value={assignedCount}
                          onChange={(e) => setAssignedCount(Number(e.target.value))}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Roster Color Code</label>
                        <input
                          type="color"
                          className="form-control form-control-color form-control-sm w-100"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-0">
                      <label className="form-label small fw-semibold">Assigned Outlet</label>
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
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Save Shift Schedule
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
