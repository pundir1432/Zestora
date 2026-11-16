'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_STAFF_ATTENDANCE } from '@/data/saasData';
import { StaffAttendanceRecord } from '@/types/saas';
import {
  BiCalendarCheck,
  BiUserCheck,
  BiTimeFive,
  BiXCircle,
  BiPlus,
  BiSearch,
  BiFingerprint,
  BiCheckCircle,
} from 'react-icons/bi';

export default function BusinessOwnerAttendancePage() {
  const [attendance, setAttendance] = useState<StaffAttendanceRecord[]>(SAMPLE_STAFF_ATTENDANCE);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  // Manual Override Form
  const [staffName, setStaffName] = useState('Sunil Rao');
  const [role, setRole] = useState('Kitchen Helper');
  const [status, setStatus] = useState<StaffAttendanceRecord['status']>('Present');
  const [checkIn, setCheckIn] = useState('10:00 AM');
  const [checkOut, setCheckOut] = useState('06:00 PM');
  const [workHours, setWorkHours] = useState(8.0);

  const filteredAttendance = useMemo(() => {
    return attendance.filter((a) => {
      const matchSearch =
        a.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.branchName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [attendance, searchTerm, statusFilter]);

  const presentCount = useMemo(
    () => attendance.filter((a) => a.status === 'Present' || a.status === 'Late').length,
    [attendance]
  );

  const lateCount = useMemo(
    () => attendance.filter((a) => a.status === 'Late').length,
    [attendance]
  );

  const totalOvertime = useMemo(
    () => attendance.reduce((acc, a) => acc + a.overtimeHours, 0),
    [attendance]
  );

  const handleCreateOverride = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: StaffAttendanceRecord = {
      id: `att-${Date.now()}`,
      staffId: `stf-${Date.now()}`,
      staffName,
      role,
      branchName: 'Indiranagar Branch',
      date: new Date().toISOString().split('T')[0],
      checkIn,
      checkOut,
      workHours: Number(workHours),
      overtimeHours: Math.max(0, Number(workHours) - 8),
      status,
      verificationMethod: 'Manager PIN',
    };

    setAttendance([newRecord, ...attendance]);
    setShowOverrideModal(false);
  };

  const getStatusBadge = (s: StaffAttendanceRecord['status']) => {
    switch (s) {
      case 'Present':
        return <span className="badge bg-success-subtle text-success border border-success-subtle"><BiCheckCircle className="me-1" />Present</span>;
      case 'Late':
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"><BiTimeFive className="me-1" />Late Clock-in</span>;
      case 'Half Day':
        return <span className="badge bg-info-subtle text-info border border-info-subtle">Half Day</span>;
      case 'Absent':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle"><BiXCircle className="me-1" />Absent</span>;
    }
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Staff Daily Attendance & Overtime</h1>
            <p className="text-muted small mb-0">
              Live biometric punches, shift check-ins, work duration audit, and manager PIN authorizations.
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => setShowOverrideModal(true)}
            >
              <BiPlus size={18} /> Manager Attendance Override
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Present on Duty Today</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiUserCheck size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{presentCount} Staff Members</h3>
              <span className="text-success small fw-medium">All critical stations manned</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Late Clock-ins (&gt;15 mins)</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiTimeFive size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{lateCount} Staff Members</h3>
              <span className="text-muted small">Automatic 15-min grace window</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Total Overtime Hours</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiCalendarCheck size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{totalOvertime} hrs</h3>
              <span className="text-muted small">Eligible for 1.5x weekend pay</span>
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
                    placeholder="Search staff name or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
                {['All', 'Present', 'Late', 'Half Day', 'Absent'].map((st) => (
                  <button
                    key={st}
                    className={`btn btn-sm ${
                      statusFilter === st ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th className="ps-3 py-3">Staff Name</th>
                    <th>Role</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Work Hours</th>
                    <th>Overtime</th>
                    <th>Verification Mode</th>
                    <th className="pe-3">Status</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {filteredAttendance.map((a) => (
                    <tr key={a.id}>
                      <td className="ps-3 fw-bold text-dark">{a.staffName}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {a.role}
                        </span>
                      </td>
                      <td className="text-muted">{a.date}</td>
                      <td className="fw-semibold text-dark">{a.checkIn}</td>
                      <td className="text-muted">{a.checkOut || '-'}</td>
                      <td>{a.workHours > 0 ? `${a.workHours} hrs` : '-'}</td>
                      <td>
                        {a.overtimeHours > 0 ? (
                          <span className="text-success fw-bold">+{a.overtimeHours} hrs</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className="text-muted d-flex align-items-center gap-1">
                          <BiFingerprint className="text-primary" /> {a.verificationMethod}
                        </span>
                      </td>
                      <td className="pe-3">{getStatusBadge(a.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Manual Override */}
        {showOverrideModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleCreateOverride}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Manager Attendance Mark</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowOverrideModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Staff Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Role</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Attendance Status</label>
                        <select
                          className="form-select form-select-sm"
                          value={status}
                          onChange={(e) => setStatus(e.target.value as StaffAttendanceRecord['status'])}
                        >
                          <option value="Present">Present</option>
                          <option value="Late">Late</option>
                          <option value="Half Day">Half Day</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Check In</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Check Out</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-0">
                      <label className="form-label small fw-semibold">Total Duration (Hours)</label>
                      <input
                        type="number"
                        step="0.5"
                        className="form-control form-control-sm"
                        value={workHours}
                        onChange={(e) => setWorkHours(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowOverrideModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Confirm Punch
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
