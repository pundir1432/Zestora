'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { BedStatus } from '@/mock/beds';
import { BiBed, BiTransfer, BiUserPlus, BiShieldAlt2, BiLockAlt } from 'react-icons/bi';

const BED_BADGE: Record<BedStatus, string> = {
  Available: 'badge-soft-success',
  Occupied: 'badge-soft-brand',
  Dirty: 'badge-soft-danger',
  Reserved: 'badge-soft-info',
  'Out of Order': 'bg-dark text-white',
};

export default function HostelDormBedsPage() {
  const { dorms, updateDormBed, transferDormBed } = useHospitality();
  const [assignModal, setAssignModal] = useState<{ dormId: string; bedId: string; bedCode: string } | null>(null);
  const [transferModal, setTransferModal] = useState<{ dormId: string; bedId: string; guestName: string } | null>(null);
  const [guestName, setGuestName] = useState('');
  const [nationality, setNationality] = useState('India');
  const [targetBedChoice, setTargetBedChoice] = useState('');

  const totalBeds = dorms.reduce((s, d) => s + d.beds.length, 0);
  const occupiedBeds = dorms.reduce((s, d) => s + d.beds.filter(b => b.status === 'Occupied').length, 0);
  const availableBeds = dorms.reduce((s, d) => s + d.beds.filter(b => b.status === 'Available').length, 0);
  const occupancyPct = Math.round((occupiedBeds / Math.max(1, totalBeds)) * 100);

  const allAvailableTargets = dorms.flatMap(d =>
    d.beds
      .filter(b => b.status === 'Available')
      .map(b => ({ key: `${d.id}|${b.id}`, label: `${d.code} (${d.genderCategory}) — Bed ${b.bedCode} (${b.position})` }))
  );

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModal || !guestName.trim()) return;
    const isForeign = nationality !== 'India';
    updateDormBed(assignModal.dormId, assignModal.bedId, {
      status: 'Occupied',
      guestName: guestName.trim(),
      guestNationality: nationality,
      isForeignGuest: isForeign,
      checkInDate: '2026-11-18',
      checkOutDate: '2026-11-21',
    });
    setAssignModal(null);
    setGuestName('');
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferModal || !targetBedChoice) return;
    const [tDorm, tBed] = targetBedChoice.split('|');
    transferDormBed(transferModal.dormId, transferModal.bedId, tDorm, tBed);
    setTransferModal(null);
    setTargetBedChoice('');
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <BiBed className="text-brand" /> Hostel Dorm &amp; Individual Bed Management
          </h3>
          <p className="text-muted-custom small mb-0">
            Purpose-built hostel bunk inventory: individual bed assignment, gender-specific dorm rules, locker tracking &amp; bed transfers
          </p>
        </div>
        <Link href="/owner/front-desk" className="btn btn-outline-secondary btn-sm bg-white text-navy fw-semibold">
          Front Desk &rarr;
        </Link>
      </div>

      {/* Dorm KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="app-card p-3">
            <div className="text-muted-custom small">Dorm Occupancy</div>
            <div className="fs-3 fw-bold text-navy">{occupancyPct}%</div>
            <div className="text-muted-custom" style={{ fontSize: '11px' }}>{occupiedBeds} of {totalBeds} beds occupied</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="app-card p-3">
            <div className="text-muted-custom small">Beds Available Now</div>
            <div className="fs-3 fw-bold text-success">{availableBeds}</div>
            <div className="text-muted-custom" style={{ fontSize: '11px' }}>Ready for walk-in backpackers</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="app-card p-3">
            <div className="text-muted-custom small">Dorm Categories</div>
            <div className="fs-3 fw-bold text-primary">{dorms.length}</div>
            <div className="text-muted-custom" style={{ fontSize: '11px' }}>Mixed, Female-Only, Male-Only</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="app-card p-3">
            <div className="text-muted-custom small">Foreign Backpackers</div>
            <div className="fs-3 fw-bold text-danger">
              {dorms.reduce((s, d) => s + d.beds.filter(b => b.isForeignGuest && b.status === 'Occupied').length, 0)}
            </div>
            <div className="text-muted-custom" style={{ fontSize: '11px' }}>Linked to Form III FRRO tracker</div>
          </div>
        </div>
      </div>

      {/* Dorm Rooms with Individual Bunk Grids */}
      <div className="d-flex flex-column gap-4">
        {dorms.map(dorm => {
          const occ = dorm.beds.filter(b => b.status === 'Occupied').length;
          return (
            <div key={dorm.id} className="app-card p-3 p-md-4">
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 pb-3 mb-3 border-bottom">
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="badge bg-navy text-white">{dorm.code}</span>
                    <h5 className="fw-bold text-navy mb-0">{dorm.name}</h5>
                    <span
                      className={`badge rounded-pill ${
                        dorm.genderCategory === 'Female-Only Dorm'
                          ? 'bg-danger bg-opacity-15 text-danger'
                          : dorm.genderCategory === 'Male-Only Dorm'
                          ? 'bg-primary bg-opacity-15 text-primary'
                          : 'bg-success bg-opacity-15 text-success'
                      }`}
                    >
                      {dorm.genderCategory}
                    </span>
                  </div>
                  <div className="text-muted-custom small mt-1">
                    {dorm.floor} &bull; Base Tariff ₹{dorm.baseBedTariff}/bed &bull; {dorm.amenities.join(' • ')}
                  </div>
                </div>
                <span className="badge badge-soft-brand px-3 py-2">
                  Occupancy: {occ}/{dorm.totalBeds} Beds
                </span>
              </div>

              <div className="row g-3">
                {dorm.beds.map(bed => (
                  <div key={bed.id} className="col-12 col-sm-6 col-lg-4">
                    <div className="p-3 rounded-4 bg-surface border border-subtle h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <span className="fw-bolder text-navy fs-6">Bed {bed.bedCode}</span>
                            <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                              {bed.position} &bull; <BiLockAlt size={11} /> Locker {bed.lockerNumber}
                            </div>
                          </div>
                          <span className={`badge rounded-pill ${BED_BADGE[bed.status]}`}>{bed.status}</span>
                        </div>

                        {bed.guestName ? (
                          <div className="p-2 rounded-3 bg-white border border-subtle mb-2">
                            <div className="fw-bold text-navy small d-flex align-items-center justify-content-between">
                              <span>{bed.guestName}</span>
                              {bed.isForeignGuest && (
                                <Link href="/owner/form-iii" className="badge badge-soft-danger text-decoration-none" style={{ fontSize: '9px' }}>
                                  <BiShieldAlt2 /> {bed.guestNationality}
                                </Link>
                              )}
                            </div>
                            <div className="text-muted-custom" style={{ fontSize: '10px' }}>
                              {bed.checkInDate} &rarr; {bed.checkOutDate}
                            </div>
                          </div>
                        ) : (
                          <div className="small text-muted-custom mb-2">₹{bed.pricePerNight} / night</div>
                        )}
                      </div>

                      <div className="d-flex gap-1.5 flex-wrap pt-2 border-top">
                        {bed.status === 'Available' && (
                          <button
                            type="button"
                            onClick={() => setAssignModal({ dormId: dorm.id, bedId: bed.id, bedCode: `${dorm.code}-${bed.bedCode}` })}
                            className="btn btn-brand btn-sm text-white fw-semibold flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                          >
                            <BiUserPlus /> Check-In Bed
                          </button>
                        )}
                        {bed.status === 'Occupied' && (
                          <>
                            <button
                              type="button"
                              onClick={() => setTransferModal({ dormId: dorm.id, bedId: bed.id, guestName: bed.guestName || 'Guest' })}
                              className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                            >
                              <BiTransfer /> Transfer Bed
                            </button>
                            <button
                              type="button"
                              onClick={() => updateDormBed(dorm.id, bed.id, { status: 'Dirty', guestName: undefined, guestNationality: undefined, isForeignGuest: false })}
                              className="btn btn-outline-danger btn-sm"
                            >
                              Out
                            </button>
                          </>
                        )}
                        {bed.status === 'Dirty' && (
                          <button
                            type="button"
                            onClick={() => updateDormBed(dorm.id, bed.id, { status: 'Available' })}
                            className="btn btn-success btn-sm text-white fw-semibold w-100"
                          >
                            Mark Clean &amp; Ready
                          </button>
                        )}
                        {bed.status === 'Reserved' && (
                          <button
                            type="button"
                            onClick={() => updateDormBed(dorm.id, bed.id, { status: 'Occupied' })}
                            className="btn btn-primary btn-sm text-white fw-semibold w-100"
                          >
                            Confirm Arrival Check-In
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Bed Modal */}
      {assignModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <form onSubmit={handleAssignSubmit} className="modal-content rounded-4 overflow-hidden">
              <div className="modal-header bg-navy text-white">
                <h6 className="modal-title fw-bold">Assign Guest to Bed {assignModal.bedCode}</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setAssignModal(null)} />
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Backpacker / Guest Name *</label>
                  <input className="form-control" required value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="e.g., Maya Patel or Tom Becker" />
                </div>
                <div>
                  <label className="form-label small fw-semibold text-navy">Nationality</label>
                  <select className="form-select" value={nationality} onChange={e => setNationality(e.target.value)}>
                    <option value="India">India</option>
                    <option value="Germany">Germany (Foreign)</option>
                    <option value="Israel">Israel (Foreign)</option>
                    <option value="UK">United Kingdom (Foreign)</option>
                    <option value="Australia">Australia (Foreign)</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setAssignModal(null)} className="btn btn-outline-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-brand btn-sm text-white fw-semibold px-4">Assign &amp; Check In</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bed Transfer Modal */}
      {transferModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <form onSubmit={handleTransferSubmit} className="modal-content rounded-4 overflow-hidden">
              <div className="modal-header bg-navy text-white">
                <h6 className="modal-title fw-bold">Transfer {transferModal.guestName} to Another Bed</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setTransferModal(null)} />
              </div>
              <div className="modal-body p-4">
                <label className="form-label small fw-semibold text-navy">Select Target Available Bed</label>
                <select className="form-select" required value={targetBedChoice} onChange={e => setTargetBedChoice(e.target.value)}>
                  <option value="">-- Choose Available Bunk --</option>
                  {allAvailableTargets.map(t => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
                <div className="text-muted-custom small mt-2">
                  The vacated bed will automatically switch to <strong>Dirty</strong> for linen change.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setTransferModal(null)} className="btn btn-outline-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm fw-semibold px-4">Complete Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
