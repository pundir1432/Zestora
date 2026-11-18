'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { RoomStatus } from '@/mock/rooms';
import { formatNumber } from '@/utils/formatters';
import { BiBuilding, BiShieldAlt2, BiWrench, BiReceipt } from 'react-icons/bi';

const ALL_STATUSES: ('All' | RoomStatus)[] = [
  'All',
  'Available',
  'Occupied',
  'Dirty',
  'Cleaning',
  'Clean',
  'Out of Order',
  'Reserved',
];

const STATUS_STYLE: Record<RoomStatus, string> = {
  Available: 'badge-soft-success',
  Occupied: 'badge-soft-brand',
  Dirty: 'badge-soft-danger',
  Cleaning: 'badge-soft-warning',
  Clean: 'badge-soft-info',
  'Out of Order': 'bg-dark text-white',
  Reserved: 'bg-primary bg-opacity-10 text-primary',
};

export default function RoomsPropertyPage() {
  const { rooms, updateRoomStatus, activeProperty } = useHospitality();
  const [statusFilter, setStatusFilter] = useState<'All' | RoomStatus>('All');

  const filtered = statusFilter === 'All' ? rooms : rooms.filter(r => r.status === statusFilter);

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <BiBuilding className="text-brand" /> Rooms, Suites &amp; Property Inventory
          </h3>
          <p className="text-muted-custom small mb-0">
            {activeProperty.name} &bull; Live 7-state room status board, ₹7,500 GST slab markers &amp; housekeeping controls
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/owner/dorms" className="btn btn-outline-info btn-sm fw-semibold">Hostel Dorm Beds &rarr;</Link>
          <Link href="/owner/housekeeping" className="btn btn-brand btn-sm text-white fw-semibold">Housekeeping Board</Link>
        </div>
      </div>

      {/* 7-Status Filter Bar */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        {ALL_STATUSES.map(st => {
          const count = st === 'All' ? rooms.length : rooms.filter(r => r.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm rounded-pill px-3 ${
                statusFilter === st ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary bg-white text-navy'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Room Cards Grid */}
      <div className="row g-3">
        {filtered.map(rm => {
          const highGstSlab = rm.tariffPerNight > 7500;
          return (
            <div key={rm.id} className="col-12 col-md-6 col-xl-4">
              <div className="app-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bolder fs-5 text-navy">#{rm.roomNumber}</span>
                        <span className="badge bg-light text-muted-custom border" style={{ fontSize: '10px' }}>{rm.floor}</span>
                      </div>
                      <div className="fw-semibold text-navy small">{rm.roomType}</div>
                    </div>
                    <span className={`badge rounded-pill px-3 py-1 ${STATUS_STYLE[rm.status]}`}>
                      {rm.status}
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between bg-surface rounded-3 p-3 mb-3">
                    <div>
                      <div className="fw-bold text-navy">₹{formatNumber(rm.tariffPerNight)} <span className="fw-normal text-muted-custom small">/ night</span></div>
                      <div className="text-muted-custom" style={{ fontSize: '10px' }}>Max {rm.maxGuests} Guests</div>
                    </div>
                    <span className={`badge ${highGstSlab ? 'badge-soft-warning' : 'badge-soft-info'}`} style={{ fontSize: '10px' }}>
                      {highGstSlab ? '18% GST (>₹7,500)' : '12% GST (≤₹7,500)'}
                    </span>
                  </div>

                  {rm.currentGuestName && (
                    <div className="p-3 rounded-3 border border-subtle mb-2">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="fw-bold text-navy small">{rm.currentGuestName}</span>
                        {rm.isForeignGuest && (
                          <Link href="/owner/form-iii" className="badge badge-soft-danger text-decoration-none d-inline-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                            <BiShieldAlt2 /> {rm.currentGuestNationality} (Form III)
                          </Link>
                        )}
                      </div>
                      <div className="text-muted-custom mt-1" style={{ fontSize: '11px' }}>
                        {rm.checkInDate} &rarr; {rm.checkOutDate} &bull; {rm.reservationId}
                      </div>
                    </div>
                  )}

                  {rm.maintenanceNote && (
                    <div className="alert alert-dark py-2 px-3 small mb-2 d-flex align-items-start gap-2">
                      <BiWrench className="flex-shrink-0 mt-1 text-warning" />
                      <span>{rm.maintenanceNote}</span>
                    </div>
                  )}

                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {rm.amenities.map(am => (
                      <span key={am} className="badge bg-light text-muted-custom border" style={{ fontSize: '10px' }}>
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Live Status Switcher */}
                <div className="pt-2 border-top d-flex align-items-center justify-content-between gap-2">
                  <select
                    className="form-select form-select-sm border-subtle text-navy"
                    style={{ maxWidth: '170px' }}
                    value={rm.status}
                    onChange={e => updateRoomStatus(rm.id, e.target.value as RoomStatus)}
                  >
                    {(['Available', 'Occupied', 'Dirty', 'Cleaning', 'Clean', 'Out of Order', 'Reserved'] as RoomStatus[]).map(st => (
                      <option key={st} value={st}>Set: {st}</option>
                    ))}
                  </select>

                  {rm.status === 'Occupied' ? (
                    <Link href="/owner/folio" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1">
                      <BiReceipt /> Folio
                    </Link>
                  ) : (
                    <span className="text-muted-custom" style={{ fontSize: '10px' }}>
                      HK: {rm.housekeeperAssigned || 'Unassigned'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
