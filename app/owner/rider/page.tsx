'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { BiCycling, BiMapPin, BiPhone, BiCheckCircle, BiMoney } from 'react-icons/bi';

export default function RiderAppPage() {
  const { readyBoardOrders, updateRiderDeliveryStatus } = useHospitality();
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});

  const deliveries = readyBoardOrders.filter(o => o.orderType === 'Delivery');
  const codTotal = deliveries.reduce((s, d) => s + (d.codAmount || 0), 0);

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'cashier']}>
      <div className="mx-auto" style={{ maxWidth: '720px' }}>
        <div className="app-card p-4 bg-navy text-white border-0 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="badge bg-brand text-white rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1">
              <BiCycling size={15} /> Rider Delivery App
            </span>
            <span className="badge bg-success bg-opacity-25 text-white">On Duty • Tapovan Zone</span>
          </div>
          <h4 className="fw-bold mb-1">Rider: Vikas Rana</h4>
          <div className="d-flex gap-4 mt-3 small">
            <div>
              <div className="text-white-50">Active Drops</div>
              <div className="fw-bold fs-5">{deliveries.filter(d => d.deliveryStatus !== 'Delivered').length}</div>
            </div>
            <div>
              <div className="text-white-50">COD Cash in Hand</div>
              <div className="fw-bold fs-5 text-brand">₹{codTotal}</div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column gap-3">
          {deliveries.map(ord => (
            <div key={ord.id} className="app-card p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                <div>
                  <span className="badge bg-navy text-white me-2">#{ord.tokenNumber}</span>
                  <span className="fw-bold text-navy">{ord.customerShortName}</span>
                </div>
                <span
                  className={`badge rounded-pill ${
                    ord.deliveryStatus === 'Delivered'
                      ? 'badge-soft-success'
                      : ord.deliveryStatus === 'Picked Up'
                      ? 'badge-soft-warning'
                      : 'badge-soft-info'
                  }`}
                >
                  {ord.deliveryStatus || 'Assigned'}
                </span>
              </div>

              <div className="small text-muted-custom d-flex align-items-center gap-1 mb-2">
                <BiMapPin className="text-brand flex-shrink-0" />
                <span>{ord.deliveryAddress || ord.sourceLabel}</span>
              </div>

              <div className="bg-surface rounded-3 p-3 small mb-3">
                {ord.items.map((it, idx) => (
                  <div key={idx} className="text-navy">
                    {it.qty}x {it.name}
                  </div>
                ))}
                <div className="d-flex justify-content-between mt-2 pt-2 border-top fw-semibold">
                  <span className="d-flex align-items-center gap-1">
                    <BiMoney className="text-success" />
                    {ord.codAmount && ord.codAmount > 0 ? `Collect COD: ₹${ord.codAmount}` : 'Prepaid Online'}
                  </span>
                  <span className="text-muted-custom">Demo OTP: {ord.deliveryOtp}</span>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 align-items-center">
                <button type="button" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                  <BiPhone /> Call Guest
                </button>
                {ord.deliveryStatus === 'Assigned' && (
                  <button
                    type="button"
                    onClick={() => updateRiderDeliveryStatus(ord.id, 'Picked Up')}
                    className="btn btn-brand btn-sm text-white fw-semibold"
                  >
                    Confirm Kitchen Pickup
                  </button>
                )}
                {ord.deliveryStatus === 'Picked Up' && (
                  <div className="d-flex gap-2 align-items-center flex-grow-1">
                    <input
                      className="form-control form-control-sm"
                      style={{ maxWidth: '130px' }}
                      placeholder={`OTP (${ord.deliveryOtp})`}
                      value={otpInputs[ord.id] || ''}
                      onChange={e => setOtpInputs(prev => ({ ...prev, [ord.id]: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => updateRiderDeliveryStatus(ord.id, 'Delivered')}
                      className="btn btn-success btn-sm fw-semibold d-flex align-items-center gap-1"
                    >
                      <BiCheckCircle /> Complete Delivery
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
