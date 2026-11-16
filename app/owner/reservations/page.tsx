'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_RESERVATIONS } from '@/data/saasData';
import { Reservation } from '@/types/saas';
import { Modal } from '@/components/common/Modal';
import {
  MdTableRestaurant,
  MdOutlineEventSeat,
  MdCelebration,
} from 'react-icons/md';
import {
  BiCalendar,
  BiPlus,
  BiSearch,
  BiUser,
  BiPhone,
  BiTime,
  BiCheckCircle,
  BiXCircle,
  BiCheck,
} from 'react-icons/bi';

export default function ReservationsPage() {
  const { currentRestaurant, currentBranch, tables, updateTableStatus } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>(SAMPLE_RESERVATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('2026-11-16');

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    partySize: 4,
    date: '2026-11-16',
    timeSlot: '08:00 PM',
    tableNumber: 'T-01',
    occasion: 'Casual' as Reservation['occasion'],
    specialNotes: '',
  });

  // Filter
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.guestPhone.includes(searchQuery) ||
      r.tableNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesDate = !selectedDate || r.date === selectedDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Metrics
  const totalBookings = reservations.filter((r) => r.date === selectedDate).length;
  const totalGuests = reservations
    .filter((r) => r.date === selectedDate && r.status !== 'Cancelled')
    .reduce((acc, r) => acc + r.partySize, 0);
  const seatedCount = reservations.filter((r) => r.date === selectedDate && r.status === 'Seated').length;
  const confirmedCount = reservations.filter((r) => r.date === selectedDate && r.status === 'Confirmed').length;

  const handleSeatGuest = (res: Reservation) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === res.id ? { ...r, status: 'Seated' } : r))
    );

    // Sync with live tables state in AuthContext
    const matchedTable = tables.find((t) => t.number === res.tableNumber);
    if (matchedTable) {
      updateTableStatus(matchedTable.id, 'occupied', {
        activeGuests: res.partySize,
        seatedAt: 'Just now',
        assignedWaiter: res.assignedWaiter || 'Ramesh Kumar',
      });
    }
  };

  const handleMarkArrived = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Arrived' } : r))
    );
  };

  const handleCancel = (res: Reservation) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === res.id ? { ...r, status: 'Cancelled' } : r))
    );

    const matchedTable = tables.find((t) => t.number === res.tableNumber);
    if (matchedTable && matchedTable.status === 'reserved') {
      updateTableStatus(matchedTable.id, 'available');
    }
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      restaurantId: currentRestaurant.id,
      branchId: currentBranch ? currentBranch.id : 'branch-1',
      guestName: formData.guestName,
      guestPhone: formData.guestPhone,
      guestEmail: formData.guestEmail,
      partySize: Number(formData.partySize),
      date: formData.date,
      timeSlot: formData.timeSlot,
      tableNumber: formData.tableNumber,
      status: 'Confirmed',
      occasion: formData.occasion,
      specialNotes: formData.specialNotes,
      assignedWaiter: 'Deepak Sharma',
      createdAt: 'Just now',
    };

    setReservations([newRes, ...reservations]);
    setIsNewModalOpen(false);

    // Update table status to reserved
    const matchedTable = tables.find((t) => t.number === formData.tableNumber);
    if (matchedTable) {
      updateTableStatus(matchedTable.id, 'reserved');
    }

    // Reset form
    setFormData({
      guestName: '',
      guestPhone: '',
      guestEmail: '',
      partySize: 4,
      date: '2026-11-16',
      timeSlot: '08:00 PM',
      tableNumber: 'T-01',
      occasion: 'Casual',
      specialNotes: '',
    });
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'waiter']}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Table Reservations & Guest Bookings</h4>
          <p className="text-muted-custom small mb-0">
            Manage advance table bookings, party sizes, special occasions, and seat guests directly
          </p>
        </div>

        <button
          type="button"
          className="btn btn-brand d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setIsNewModalOpen(true)}
        >
          <BiPlus size={20} />
          <span>New Reservation</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Today Bookings</span>
              <h3 className="fw-bold text-navy mb-0">{totalBookings}</h3>
              <span className="text-muted-custom small" style={{ fontSize: '11px' }}>
                Date: {selectedDate}
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand bg-opacity-10 text-brand"
              style={{ width: '48px', height: '48px' }}
            >
              <BiCalendar size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Expected Guests</span>
              <h3 className="fw-bold text-navy mb-0">{totalGuests} Pax</h3>
              <span className="text-info small fw-medium" style={{ fontSize: '11px' }}>
                Covers planned for today
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-info bg-opacity-10 text-info"
              style={{ width: '48px', height: '48px' }}
            >
              <BiUser size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Currently Seated</span>
              <h3 className="fw-bold text-success mb-0">{seatedCount}</h3>
              <span className="text-success small fw-medium" style={{ fontSize: '11px' }}>
                Active at dining tables
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-success"
              style={{ width: '48px', height: '48px' }}
            >
              <MdOutlineEventSeat size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Upcoming Confirmed</span>
              <h3 className="fw-bold text-warning mb-0">{confirmedCount}</h3>
              <span className="text-warning small fw-medium" style={{ fontSize: '11px' }}>
                Arriving in evening slots
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-warning bg-opacity-10 text-warning"
              style={{ width: '48px', height: '48px' }}
            >
              <BiCheckCircle size={24} />
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
                placeholder="Search guest name, phone, or table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted-custom small">Date:</span>
              <input
                type="date"
                className="form-control form-control-sm border-subtle shadow-none"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted-custom small">Status:</span>
              <select
                className="form-select form-select-sm border-subtle shadow-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Arrived">Arrived</option>
                <option value="Seated">Seated</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="col-12 col-md-1 text-md-end">
            <span className="badge bg-light text-navy border">
              {filteredReservations.length} Bookings
            </span>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-surface border-bottom border-subtle">
              <tr>
                <th className="text-muted-custom small py-3 ps-3">GUEST DETAILS</th>
                <th className="text-muted-custom small py-3 text-center">PARTY SIZE</th>
                <th className="text-muted-custom small py-3">TIME SLOT</th>
                <th className="text-muted-custom small py-3 text-center">TABLE</th>
                <th className="text-muted-custom small py-3">OCCASION & NOTES</th>
                <th className="text-muted-custom small py-3 text-center">STATUS</th>
                <th className="text-muted-custom small py-3 text-end pe-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((r) => (
                <tr key={r.id}>
                  <td className="ps-3">
                    <div className="fw-semibold text-navy">{r.guestName}</div>
                    <div className="text-muted-custom small d-flex align-items-center gap-1">
                      <BiPhone size={13} className="text-brand flex-shrink-0" />
                      <span>{r.guestPhone}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="badge bg-light text-navy border fw-bold fs-6">
                      {r.partySize} Pax
                    </span>
                  </td>
                  <td>
                    <div className="text-navy fw-medium d-flex align-items-center gap-1">
                      <BiTime size={15} className="text-brand flex-shrink-0" />
                      <span>{r.timeSlot}</span>
                    </div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      {r.date}
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="badge bg-navy text-white font-monospace px-2 py-1">
                      {r.tableNumber}
                    </span>
                  </td>
                  <td>
                    {r.occasion && (
                      <span className="badge badge-soft-brand d-inline-flex align-items-center gap-1 mb-1">
                        <MdCelebration size={13} /> {r.occasion}
                      </span>
                    )}
                    {r.specialNotes && (
                      <div className="text-muted-custom small text-truncate" style={{ maxWidth: '240px' }} title={r.specialNotes}>
                        {r.specialNotes}
                      </div>
                    )}
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge rounded-pill ${
                        r.status === 'Seated'
                          ? 'bg-success text-white'
                          : r.status === 'Arrived'
                          ? 'bg-info text-white'
                          : r.status === 'Confirmed'
                          ? 'bg-warning text-dark'
                          : 'bg-secondary text-white'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="text-end pe-3">
                    <div className="d-flex align-items-center justify-content-end gap-1">
                      {r.status === 'Confirmed' && (
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm py-1 px-2"
                          title="Mark Guest Arrived in Waiting Lobby"
                          onClick={() => handleMarkArrived(r.id)}
                        >
                          Arrived
                        </button>
                      )}

                      {(r.status === 'Confirmed' || r.status === 'Arrived') && (
                        <button
                          type="button"
                          className="btn btn-brand btn-sm py-1 px-2.5 d-flex align-items-center gap-1"
                          title="Seat Guest at Table (Updates Table status to Occupied)"
                          onClick={() => handleSeatGuest(r)}
                        >
                          <MdOutlineEventSeat size={15} /> Seat Guest
                        </button>
                      )}

                      {r.status !== 'Cancelled' && r.status !== 'Seated' && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm p-1"
                          title="Cancel Reservation"
                          onClick={() => handleCancel(r)}
                        >
                          <BiXCircle size={17} />
                        </button>
                      )}

                      {r.status === 'Seated' && (
                        <span className="badge badge-soft-success d-inline-flex align-items-center gap-1">
                          <BiCheck size={16} /> Table Occupied
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReservations.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted-custom">
                    No reservations found for the selected date and filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Reservation */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Book Table Reservation"
        subtitle={`Dining at ${currentRestaurant.name}`}
        size="md"
      >
        <form onSubmit={handleCreateReservation}>
          <div className="row g-2 mb-3">
            <div className="col-7">
              <label className="form-label small fw-semibold text-navy">Guest Full Name</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                placeholder="e.g. Rahul Deshpande"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                required
              />
            </div>
            <div className="col-5">
              <label className="form-label small fw-semibold text-navy">Contact Phone</label>
              <input
                type="tel"
                className="form-control form-control-sm border-subtle"
                placeholder="+91 98450 00000"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-4">
              <label className="form-label small fw-semibold text-navy">Party Size (Pax)</label>
              <input
                type="number"
                min="1"
                max="24"
                className="form-control form-control-sm border-subtle"
                value={formData.partySize}
                onChange={(e) => setFormData({ ...formData, partySize: Number(e.target.value) })}
                required
              />
            </div>
            <div className="col-4">
              <label className="form-label small fw-semibold text-navy">Date</label>
              <input
                type="date"
                className="form-control form-control-sm border-subtle"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="col-4">
              <label className="form-label small fw-semibold text-navy">Time Slot</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              >
                <option value="12:30 PM">12:30 PM (Lunch)</option>
                <option value="01:30 PM">01:30 PM (Lunch)</option>
                <option value="02:30 PM">02:30 PM (Lunch)</option>
                <option value="07:00 PM">07:00 PM (Dinner)</option>
                <option value="07:30 PM">07:30 PM (Dinner)</option>
                <option value="08:00 PM">08:00 PM (Dinner)</option>
                <option value="08:30 PM">08:30 PM (Dinner)</option>
                <option value="09:00 PM">09:00 PM (Dinner)</option>
                <option value="09:30 PM">09:30 PM (Dinner)</option>
              </select>
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Assign Table</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.tableNumber}
                onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.number}>
                    {t.number} ({t.floorName} / {t.section} - {t.capacity} Pax - {t.status})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Occasion</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.occasion}
                onChange={(e: any) => setFormData({ ...formData, occasion: e.target.value })}
              >
                <option value="Casual">Casual Dining</option>
                <option value="Birthday">Birthday Celebration</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Business">Business Lunch / Dinner</option>
                <option value="Family Dinner">Family Dinner</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-navy">Guest Requests & Special Notes</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              placeholder="e.g. Window seat, baby chair, cake arrangement..."
              value={formData.specialNotes}
              onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setIsNewModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm">
              Confirm Reservation
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
