'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { StayReservation } from '@/mock/reservations';
import { formatNumber } from '@/utils/formatters';
import {
  BiHotel,
  BiPlus,
  BiLogIn,
  BiLogOut,
  BiCalendar,
  BiShieldAlt2,
  BiReceipt,
  BiIdCard,
  BiTransfer,
  BiRestaurant,
  BiWallet,
} from 'react-icons/bi';

const CALENDAR_DAYS = ['17 Nov', '18 Nov (Today)', '19 Nov', '20 Nov', '21 Nov', '22 Nov', '23 Nov'];

export default function FrontDeskPage() {
  const {
    activeProperty,
    rooms,
    reservations,
    addReservation,
    updateReservationStatus,
    folios,
    postChargeToFolio,
  } = useHospitality();

  const [tab, setTab] = useState<'all' | 'arrivals' | 'inhouse' | 'departures' | 'calendar'>('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'Reservation' | 'Walk-in'>('Walk-in');

  // New Booking / Walk-in form
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [nationality, setNationality] = useState('India');
  const [idNumber, setIdNumber] = useState('');
  const [unitLabel, setUnitLabel] = useState('Room 103 • Standard Mountain');
  const [nights, setNights] = useState(2);
  const [rate, setRate] = useState(3200);
  const [advance, setAdvance] = useState(2000);
  const [toast, setToast] = useState('');

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    const isForeign = nationality.trim().toLowerCase() !== 'india';
    addReservation({
      propertyId: activeProperty.id,
      guestName: guestName.trim(),
      guestPhone: guestPhone || '+91 98000 00000',
      guestEmail: `${guestName.toLowerCase().replace(/\s+/g, '.')}@guest.in`,
      nationality,
      isForeignGuest: isForeign,
      idType: isForeign ? 'Passport' : 'Aadhaar',
      idNumber: idNumber || (isForeign ? 'P8819204' : 'XXXX-XXXX-9910'),
      idVerified: !!idNumber,
      unitType: unitLabel.includes('Dorm') ? 'Dorm Bed' : unitLabel.includes('Tent') ? 'Camp Tent' : 'Room',
      unitLabel,
      checkInDate: '2026-11-18',
      checkOutDate: `2026-11-${18 + nights}`,
      nights,
      adults: 2,
      children: 0,
      source: modalMode === 'Walk-in' ? 'Walk-in' : 'Direct',
      status: modalMode === 'Walk-in' ? 'Checked In' : 'Confirmed',
      totalEstimate: Math.round(rate * nights * (rate > 7500 ? 1.18 : 1.12)),
      paidAmount: advance,
      formIIIRequired: isForeign,
      formIIIStatus: isForeign ? 'Pending' : undefined,
    });
    setShowModal(false);
    setGuestName('');
    setGuestPhone('');
    setIdNumber('');
    setToast(
      isForeign
        ? `${modalMode} created! Foreign guest detected — 24h Form III countdown task created automatically.`
        : `${modalMode} created & unified Guest Folio opened!`
    );
    setTimeout(() => setToast(''), 4500);
  };

  const quickPostRestBill = (res: StayReservation) => {
    const target = folios.find(f => f.id === res.folioId) || folios[0];
    if (!target) return;
    postChargeToFolio(target.id, {
      date: 'Just now',
      category: 'Restaurant',
      description: 'Ganga Terrace Kitchen • Quick Dinner Post (#POS-4440)',
      referenceNo: 'POS-4440',
      amount: 950,
      gstRate: 5,
      gstAmount: 48,
      postedBy: 'Front Desk Quick Post',
    });
    setToast(`Posted ₹998 restaurant bill to ${res.guestName}'s Folio (${target.id})!`);
    setTimeout(() => setToast(''), 3500);
  };

  const filteredRes = reservations.filter(r => {
    if (tab === 'arrivals') return r.status === 'Confirmed';
    if (tab === 'inhouse') return r.status === 'Checked In';
    if (tab === 'departures') return r.checkOutDate === '2026-11-19' || r.status === 'Checked Out';
    return true;
  });

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'cashier']}>
      <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <BiHotel className="text-brand" /> Front Desk Operations
          </h3>
          <p className="text-muted-custom small mb-0">
            {activeProperty.name} &bull; Walk-ins, Check-in/out, ID Verification, Folio Posting &amp; Form III Foreign Guest Detection
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setModalMode('Walk-in');
              setShowModal(true);
            }}
            className="btn btn-brand btn-sm text-white fw-semibold d-flex align-items-center gap-1 px-3 py-2"
          >
            <BiLogIn size={16} /> Quick Walk-In Check-In
          </button>
          <button
            type="button"
            onClick={() => {
              setModalMode('Reservation');
              setShowModal(true);
            }}
            className="btn btn-outline-secondary btn-sm bg-white text-navy fw-semibold d-flex align-items-center gap-1 px-3 py-2"
          >
            <BiPlus size={16} /> New Reservation
          </button>
          <Link href="/owner/folio" className="btn btn-outline-primary btn-sm fw-semibold d-flex align-items-center gap-1 px-3 py-2">
            <BiReceipt size={16} /> Open Folios
          </Link>
        </div>
      </div>

      {toast && <div className="alert alert-success border-0 rounded-3 py-2 px-3 small fw-semibold mb-3">{toast}</div>}

      {/* Front Desk Quick Action Bar (Section 11) */}
      <div className="app-card p-3 mb-4">
        <div className="small fw-bold text-muted-custom text-uppercase mb-2" style={{ fontSize: '11px' }}>
          Front Desk Quick Actions
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button type="button" onClick={() => { setModalMode('Reservation'); setShowModal(true); }} className="btn btn-sm bg-surface border text-navy fw-semibold"><BiCalendar className="text-brand me-1" />New Reservation</button>
          <button type="button" onClick={() => { setModalMode('Walk-in'); setShowModal(true); }} className="btn btn-sm bg-surface border text-navy fw-semibold"><BiLogIn className="text-success me-1" />Walk-In</button>
          <Link href="/owner/rooms" className="btn btn-sm bg-surface border text-navy fw-semibold"><BiTransfer className="text-primary me-1" />Change / Inspect Room</Link>
          <Link href="/owner/dorms" className="btn btn-sm bg-surface border text-navy fw-semibold"><BiHotel className="text-info me-1" />Assign Dorm Bed</Link>
          <Link href="/owner/folio" className="btn btn-sm bg-surface border text-navy fw-semibold"><BiWallet className="text-success me-1" />Add Payment / Folio</Link>
          <Link href="/owner/pos" className="btn btn-sm bg-surface border text-navy fw-semibold"><BiRestaurant className="text-brand me-1" />Post Restaurant Bill</Link>
          <Link href="/owner/form-iii" className="btn btn-sm bg-surface border text-danger fw-semibold"><BiShieldAlt2 className="text-danger me-1" />View Form III Tasks</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        {[
          { k: 'all' as const, label: `All Bookings (${reservations.length})` },
          { k: 'arrivals' as const, label: `Arrivals (${reservations.filter(r => r.status === 'Confirmed').length})` },
          { k: 'inhouse' as const, label: `In-House (${reservations.filter(r => r.status === 'Checked In').length})` },
          { k: 'departures' as const, label: 'Departures / Checkout' },
          { k: 'calendar' as const, label: '7-Day Availability Calendar' },
        ].map(tItem => (
          <button
            key={tItem.k}
            type="button"
            onClick={() => setTab(tItem.k)}
            className={`btn btn-sm rounded-pill px-3 ${
              tab === tItem.k ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary bg-white text-navy'
            }`}
          >
            {tItem.label}
          </button>
        ))}
      </div>

      {/* Availability Calendar View */}
      {tab === 'calendar' ? (
        <div className="app-card p-3 p-md-4">
          <h6 className="fw-bold text-navy mb-3">Room &amp; Tent Availability Tape Chart (7 Days)</h6>
          <div className="table-responsive">
            <table className="table table-bordered align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th style={{ minWidth: '170px' }}>Unit / Tariff</th>
                  {CALENDAR_DAYS.map(d => (
                    <th key={d} className="text-center" style={{ minWidth: '115px' }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map(rm => (
                  <tr key={rm.id}>
                    <td>
                      <div className="fw-bold text-navy">{rm.roomNumber} • {rm.roomType}</div>
                      <div className="text-muted-custom" style={{ fontSize: '11px' }}>₹{formatNumber(rm.tariffPerNight)}/night</div>
                    </td>
                    {CALENDAR_DAYS.map((d, idx) => {
                      const isOccupiedCell = rm.status === 'Occupied' && idx <= 3;
                      const isReservedCell = rm.status === 'Reserved' && idx >= 1 && idx <= 3;
                      const isOoo = rm.status === 'Out of Order';
                      return (
                        <td key={d} className="p-1 text-center">
                          {isOoo ? (
                            <div className="rounded-2 py-1.5 px-2 bg-dark text-white" style={{ fontSize: '10px' }}>Out of Order</div>
                          ) : isOccupiedCell ? (
                            <div className="rounded-2 py-1.5 px-2 bg-brand text-white fw-semibold text-truncate" style={{ fontSize: '10px' }}>
                              {rm.currentGuestName || 'Occupied'}
                            </div>
                          ) : isReservedCell ? (
                            <div className="rounded-2 py-1.5 px-2 bg-primary bg-opacity-15 text-primary fw-semibold text-truncate" style={{ fontSize: '10px' }}>
                              Reserved
                            </div>
                          ) : (
                            <div className="rounded-2 py-1.5 px-2 bg-success bg-opacity-10 text-success" style={{ fontSize: '10px' }}>
                              Open
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="app-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>Booking &amp; Guest</th>
                  <th>Unit &amp; Dates</th>
                  <th>ID &amp; Form III</th>
                  <th>Source &amp; Status</th>
                  <th className="text-end">Estimate / Paid</th>
                  <th className="text-end">Front Desk Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRes.map(res => (
                  <tr key={res.id}>
                    <td>
                      <div className="fw-bold text-navy small">{res.guestName}</div>
                      <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                        {res.bookingCode} &bull; {res.guestPhone} &bull; <strong>{res.nationality}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-navy small">{res.unitLabel}</div>
                      <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                        {res.checkInDate} &rarr; {res.checkOutDate} ({res.nights}N)
                      </div>
                    </td>
                    <td>
                      <div className="small d-flex align-items-center gap-1">
                        <BiIdCard className={res.idVerified ? 'text-success' : 'text-warning'} />
                        <span>{res.idType}: {res.idNumber}</span>
                      </div>
                      {res.formIIIRequired && (
                        <Link
                          href="/owner/form-iii"
                          className={`badge rounded-pill text-decoration-none mt-1 ${
                            res.formIIIStatus === 'Overdue'
                              ? 'bg-danger text-white'
                              : res.formIIIStatus === 'Submitted'
                              ? 'badge-soft-success'
                              : 'badge-soft-warning'
                          }`}
                          style={{ fontSize: '10px' }}
                        >
                          Form III: {res.formIIIStatus}
                        </Link>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-light text-navy border me-1" style={{ fontSize: '10px' }}>{res.source}</span>
                      <span
                        className={`badge rounded-pill ${
                          res.status === 'Checked In'
                            ? 'badge-soft-success'
                            : res.status === 'Confirmed'
                            ? 'badge-soft-info'
                            : 'badge-soft-secondary'
                        }`}
                        style={{ fontSize: '10px' }}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="text-end small">
                      <div className="fw-bold text-navy">₹{formatNumber(res.totalEstimate)}</div>
                      <div className="text-success" style={{ fontSize: '11px' }}>Paid: ₹{formatNumber(res.paidAmount)}</div>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1 flex-wrap justify-content-end">
                        {res.status === 'Confirmed' && (
                          <button
                            type="button"
                            onClick={() => updateReservationStatus(res.id, 'Checked In')}
                            className="btn btn-sm btn-success text-white fw-semibold"
                          >
                            <BiLogIn /> Check In
                          </button>
                        )}
                        {res.status === 'Checked In' && (
                          <>
                            <button
                              type="button"
                              onClick={() => quickPostRestBill(res)}
                              className="btn btn-sm btn-outline-secondary"
                              title="Post Restaurant Bill to Folio"
                            >
                              +F&amp;B
                            </button>
                            <Link href="/owner/folio" className="btn btn-sm btn-outline-primary">
                              Folio
                            </Link>
                            <button
                              type="button"
                              onClick={() => updateReservationStatus(res.id, 'Checked Out')}
                              className="btn btn-sm btn-outline-danger"
                              title="Check Out Guest"
                            >
                              <BiLogOut />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Walk-In / Reservation Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <form onSubmit={handleCreateBooking} className="modal-content rounded-4 overflow-hidden">
              <div className="modal-header bg-navy text-white">
                <h6 className="modal-title fw-bold">New {modalMode} — Tapovan / Shivpuri Desk</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-navy">Guest Full Name *</label>
                    <input className="form-control" required value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="e.g., Clara Jensen or Vikram Mehta" />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">Phone / WhatsApp</label>
                    <input className="form-control" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+91 / Intl" />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">Nationality (Auto Form III)</label>
                    <select className="form-select" value={nationality} onChange={e => setNationality(e.target.value)}>
                      <option value="India">India (Domestic)</option>
                      <option value="Germany">Germany (Foreign — Triggers Form III)</option>
                      <option value="France">France (Foreign — Triggers Form III)</option>
                      <option value="United Kingdom">United Kingdom (Foreign — Triggers Form III)</option>
                      <option value="Israel">Israel (Foreign — Triggers Form III)</option>
                      <option value="USA">USA (Foreign — Triggers Form III)</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">ID / Passport Number</label>
                    <input className="form-control" value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="Aadhaar or Passport No" />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">Unit / Room / Dorm / Tent</label>
                    <select className="form-select" value={unitLabel} onChange={e => setUnitLabel(e.target.value)}>
                      <option value="Room 103 • Standard Mountain">Room 103 • Standard (₹3,200)</option>
                      <option value="Room 202 • Ganga View Suite">Room 202 • Ganga Suite (₹8,500)</option>
                      <option value="Dorm D-01 • Bed B3 (Lower)">Dorm D-01 • Bed B3 (₹949)</option>
                      <option value="Tent T-02 • Luxury Swiss Tent">Tent T-02 • Swiss Tent (₹5,500)</option>
                    </select>
                  </div>
                  <div className="col-4">
                    <label className="form-label small fw-semibold text-navy">Nights</label>
                    <input type="number" min={1} className="form-control" value={nights} onChange={e => setNights(Number(e.target.value))} />
                  </div>
                  <div className="col-4">
                    <label className="form-label small fw-semibold text-navy">Tariff/Night (₹)</label>
                    <input type="number" className="form-control" value={rate} onChange={e => setRate(Number(e.target.value))} />
                  </div>
                  <div className="col-4">
                    <label className="form-label small fw-semibold text-navy">Advance Paid (₹)</label>
                    <input type="number" className="form-control" value={advance} onChange={e => setAdvance(Number(e.target.value))} />
                  </div>
                </div>
                {nationality !== 'India' && (
                  <div className="alert alert-warning py-2 px-3 small mt-3 mb-0">
                    Foreign guest detected! A 24-hour <strong>FRRO Form III</strong> compliance record will be auto-generated.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-brand btn-sm text-white fw-semibold px-4">
                  Confirm {modalMode}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
