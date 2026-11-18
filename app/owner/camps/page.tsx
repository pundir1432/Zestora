'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { formatNumber } from '@/utils/formatters';
import { TbTent } from 'react-icons/tb';
import { BiCompass, BiCheckCircle, BiPlus, BiTimeFive, BiShieldQuarter, BiUserCheck } from 'react-icons/bi';

export default function CampsAdventurePage() {
  const { campPackages, activitySlots, campBookings, addCampBooking, signCampWaiver } = useHospitality();
  const [tab, setTab] = useState<'slots' | 'packages' | 'waivers'>('slots');
  const [showBookModal, setShowBookModal] = useState(false);

  const [slotId, setSlotId] = useState(activitySlots[0]?.id || '');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [pax, setPax] = useState(2);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Posted to Folio'>('Posted to Folio');

  const handleBookActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const slot = activitySlots.find(s => s.id === slotId);
    if (!slot || !guestName.trim()) return;
    addCampBooking({
      slotId: slot.id,
      slotLabel: `${slot.startTime} • ${slot.packageName}`,
      guestName: guestName.trim(),
      guestPhone: guestPhone || '+91 98370 00000',
      nationality: 'India',
      roomOrUnit: 'Room 101 / Walk-in',
      pax,
      addOnsSelected: ['Safety Gear Included'],
      totalAmount: pax * 1200,
      paymentStatus,
      waiverStatus: 'Pending Signature',
      emergencyContact: 'On File',
      medicalFitDeclared: true,
      checkedInByGuide: false,
    });
    setShowBookModal(false);
    setGuestName('');
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <TbTent className="text-brand" /> Camp &amp; Adventure Operations
          </h3>
          <p className="text-muted-custom small mb-0">
            Shivpuri &amp; Rishikesh Rafting, Trekking, Riverside Camping, Activity Slots, Capacity, Pricing Add-ons &amp; Liability Waivers
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button type="button" onClick={() => setShowBookModal(true)} className="btn btn-brand btn-sm text-white fw-semibold d-flex align-items-center gap-1">
            <BiPlus /> Book Activity Slot
          </button>
          <Link href="/owner/camp-guide" className="btn btn-outline-primary btn-sm fw-semibold d-flex align-items-center gap-1">
            <BiCompass /> Camp Guide App
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        {[
          { k: 'slots' as const, label: `Today's Activity Slots & Capacity (${activitySlots.length})` },
          { k: 'packages' as const, label: `Camp & Meal Packages (${campPackages.length})` },
          { k: 'waivers' as const, label: `Guest Assignments & Waivers (${campBookings.length})` },
        ].map(tItem => (
          <button
            key={tItem.k}
            type="button"
            onClick={() => setTab(tItem.k)}
            className={`btn btn-sm rounded-pill px-3 ${tab === tItem.k ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary bg-white text-navy'}`}
          >
            {tItem.label}
          </button>
        ))}
      </div>

      {tab === 'slots' && (
        <div className="row g-3">
          {activitySlots.map(slot => {
            const pct = Math.round((slot.bookedCount / slot.capacity) * 100);
            return (
              <div key={slot.id} className="col-12 col-md-6">
                <div className="app-card p-3.5 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge badge-soft-brand mb-1">{slot.category}</span>
                      <h6 className="fw-bold text-navy mb-0">{slot.packageName}</h6>
                      <div className="text-muted-custom small d-flex align-items-center gap-1 mt-1">
                        <BiTimeFive /> {slot.startTime} – {slot.endTime} &bull; {slot.meetingPoint}
                      </div>
                    </div>
                    <span className={`badge rounded-pill ${slot.status === 'Filling Fast' ? 'badge-soft-warning' : slot.status === 'Full' ? 'badge-soft-danger' : 'badge-soft-success'}`}>
                      {slot.status}
                    </span>
                  </div>

                  {slot.riverGrade && (
                    <div className="small text-primary fw-semibold mb-2">River Condition: {slot.riverGrade} • {slot.weatherStatus}</div>
                  )}

                  <div className="mb-2">
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-muted-custom">Slot Capacity</span>
                      <span className="fw-bold text-navy">{slot.bookedCount} / {slot.capacity} Guests ({pct}%)</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className={`progress-bar ${pct >= 85 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="pt-2 border-top d-flex justify-content-between align-items-center small">
                    <span className="text-muted-custom">Lead Guide: <strong className="text-navy">{slot.guideName}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setSlotId(slot.id);
                        setShowBookModal(true);
                      }}
                      className="btn btn-sm btn-outline-brand"
                    >
                      + Assign Guest
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'packages' && (
        <div className="row g-3">
          {campPackages.map(pkg => (
            <div key={pkg.id} className="col-12 col-lg-6">
              <div className="app-card p-3.5 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge badge-soft-info me-1">{pkg.category}</span>
                      <span className="badge bg-light text-navy border">{pkg.difficulty} • Min Age {pkg.minAge}+</span>
                      <h6 className="fw-bold text-navy mt-1 mb-0">{pkg.name}</h6>
                      <div className="text-muted-custom small">{pkg.duration}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bolder fs-5 text-brand">₹{formatNumber(pkg.basePrice)}</div>
                      <div className="text-muted-custom" style={{ fontSize: '10px' }}>+{pkg.gstRate}% GST / Pax</div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="small fw-semibold text-navy mb-1">Inclusions:</div>
                    <div className="d-flex flex-wrap gap-1">
                      {pkg.inclusions.map(inc => (
                        <span key={inc} className="badge bg-surface text-navy border" style={{ fontSize: '10px' }}>{inc}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="small fw-semibold text-navy mb-1">Optional Add-ons:</div>
                    <div className="d-flex flex-wrap gap-1">
                      {pkg.addOns.map(ao => (
                        <span key={ao.id} className="badge badge-soft-warning" style={{ fontSize: '10px' }}>
                          {ao.name} {ao.price > 0 ? `(+₹${ao.price})` : '(Free)'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'waivers' && (
        <div className="app-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>Guest &amp; Unit</th>
                  <th>Activity Slot</th>
                  <th>Pax &amp; Add-ons</th>
                  <th>Payment</th>
                  <th>Liability Waiver</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {campBookings.map(cb => (
                  <tr key={cb.id}>
                    <td>
                      <div className="fw-bold text-navy small">{cb.guestName}</div>
                      <div className="text-muted-custom" style={{ fontSize: '11px' }}>{cb.roomOrUnit} &bull; {cb.nationality}</div>
                    </td>
                    <td className="small fw-semibold text-navy">{cb.slotLabel}</td>
                    <td className="small">
                      <strong>{cb.pax} Pax</strong>
                      {cb.addOnsSelected.length > 0 && (
                        <div className="text-muted-custom" style={{ fontSize: '10px' }}>{cb.addOnsSelected.join(', ')}</div>
                      )}
                    </td>
                    <td>
                      <div className="fw-bold text-navy small">₹{formatNumber(cb.totalAmount)}</div>
                      <span className="badge badge-soft-info" style={{ fontSize: '10px' }}>{cb.paymentStatus}</span>
                    </td>
                    <td>
                      {cb.waiverStatus === 'Signed' ? (
                        <span className="badge badge-soft-success d-inline-flex align-items-center gap-1">
                          <BiCheckCircle /> Signed ({cb.waiverSignedAt})
                        </span>
                      ) : (
                        <span className="badge badge-soft-danger d-inline-flex align-items-center gap-1">
                          <BiShieldQuarter /> Pending Waiver
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      {cb.waiverStatus !== 'Signed' ? (
                        <button type="button" onClick={() => signCampWaiver(cb.id)} className="btn btn-sm btn-brand text-white fw-semibold">
                          Capture Digital Waiver
                        </button>
                      ) : (
                        <span className="badge bg-light text-success border"><BiUserCheck /> Guide Ready</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Activity Modal */}
      {showBookModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <form onSubmit={handleBookActivity} className="modal-content rounded-4 overflow-hidden">
              <div className="modal-header bg-navy text-white">
                <h6 className="modal-title fw-bold">Book Camp / Adventure Slot</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowBookModal(false)} />
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Activity Slot</label>
                  <select className="form-select" value={slotId} onChange={e => setSlotId(e.target.value)}>
                    {activitySlots.map(s => (
                      <option key={s.id} value={s.id}>{s.startTime} — {s.packageName} ({s.capacity - s.bookedCount} left)</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Guest Name *</label>
                  <input className="form-control" required value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="e.g., Arjun Verma" />
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">Phone</label>
                    <input className="form-control" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+91..." />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">Guests (Pax)</label>
                    <input type="number" min={1} max={10} className="form-control" value={pax} onChange={e => setPax(Number(e.target.value))} />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="form-label small fw-semibold text-navy">Billing Mode</label>
                  <select className="form-select" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value as any)}>
                    <option value="Posted to Folio">Post to In-House Room/Dorm Folio</option>
                    <option value="Paid">Direct Walk-in Cash/UPI Paid</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowBookModal(false)} className="btn btn-outline-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-brand btn-sm text-white fw-semibold px-4">Confirm Slot Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
