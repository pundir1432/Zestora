'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { BiCompass, BiCheckCircle, BiShieldQuarter, BiErrorCircle, BiUserCheck } from 'react-icons/bi';

export default function CampGuideAppPage() {
  const { activitySlots, campBookings, signCampWaiver, toggleGuideCheckIn } = useHospitality();
  const [gearChecked, setGearChecked] = useState<string[]>(['Life Jackets (16)', 'Helmets (16)']);

  const gearChecklist = ['Life Jackets (16)', 'Helmets (16)', 'Throw Bags & First Aid Kit', 'Dry Bags (6)', 'Inflatable Raft Pressure Check', 'Rescue Kayak Escort Ready'];

  const toggleGear = (g: string) => {
    setGearChecked(prev => (prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]));
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="mx-auto" style={{ maxWidth: '760px' }}>
        <div className="app-card p-4 bg-navy text-white border-0 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-brand text-white rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1">
              <BiCompass /> Camp Guide Field Console
            </span>
            <span className="badge bg-success bg-opacity-25 text-white">River Grade III+ • Clear</span>
          </div>
          <h4 className="fw-bold mb-1">Lead Guide: Deepak Bisht (IRF Certified)</h4>
          <p className="text-white-50 small mb-0">Shivpuri Base Deck #1 &bull; Offline-capable mobile roster &amp; waiver verification</p>
        </div>

        {/* Pre-Trip Safety Gear Checklist */}
        <div className="app-card p-3 p-md-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-bold text-navy mb-0">Pre-Launch Safety &amp; Gear Checklist</h6>
            <span className="badge badge-soft-success">{gearChecked.length}/{gearChecklist.length} Verified</span>
          </div>
          <div className="row g-2">
            {gearChecklist.map(g => {
              const ok = gearChecked.includes(g);
              return (
                <div key={g} className="col-12 col-sm-6">
                  <button
                    type="button"
                    onClick={() => toggleGear(g)}
                    className={`btn btn-sm w-100 text-start d-flex align-items-center gap-2 p-3 rounded-3 border ${
                      ok ? 'bg-success bg-opacity-10 border-success text-success fw-semibold' : 'bg-surface border-subtle text-navy'
                    }`}
                  >
                    <BiCheckCircle size={17} />
                    <span>{g}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guest Roster & Waiver Gate */}
        <div className="app-card p-3 p-md-4 mb-4">
          <h6 className="fw-bold text-navy mb-3">Today&apos;s Guest Roster &amp; Waiver Check-In ({campBookings.length})</h6>
          <div className="d-flex flex-column gap-3">
            {campBookings.map(cb => (
              <div key={cb.id} className="p-3 rounded-3 bg-surface border border-subtle">
                <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                  <div>
                    <div className="fw-bold text-navy">{cb.guestName} ({cb.pax} Pax)</div>
                    <div className="text-muted-custom small">{cb.slotLabel} &bull; Emergency: {cb.emergencyContact}</div>
                  </div>
                  <span className={`badge rounded-pill ${cb.waiverStatus === 'Signed' ? 'badge-soft-success' : 'badge-soft-danger'}`}>
                    {cb.waiverStatus}
                  </span>
                </div>

                <div className="d-flex gap-2 flex-wrap mt-3">
                  {cb.waiverStatus !== 'Signed' && (
                    <button type="button" onClick={() => signCampWaiver(cb.id)} className="btn btn-sm btn-warning fw-semibold d-flex align-items-center gap-1">
                      <BiShieldQuarter /> Capture Digital Waiver Now
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={cb.waiverStatus !== 'Signed'}
                    onClick={() => toggleGuideCheckIn(cb.id)}
                    className={`btn btn-sm fw-semibold d-flex align-items-center gap-1 ${
                      cb.checkedInByGuide ? 'btn-success text-white' : 'btn-outline-primary'
                    }`}
                  >
                    <BiUserCheck /> {cb.checkedInByGuide ? 'Boarded / Checked-In' : 'Mark Boarded'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Slots Summary */}
        <div className="app-card p-3">
          <div className="d-flex align-items-center gap-2 text-warning small fw-semibold">
            <BiErrorCircle size={18} /> Weather &amp; River Advisory: {activitySlots[0]?.weatherStatus} — All {activitySlots.length} scheduled slots cleared for dispatch.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
