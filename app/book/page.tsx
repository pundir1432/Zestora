'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useHospitality } from '@/context/HospitalityContext';
import { formatNumber } from '@/utils/formatters';
import { BiCheckCircle, BiHotel, BiBed, BiArrowBack, BiShieldAlt2 } from 'react-icons/bi';
import { TbTent } from 'react-icons/tb';

const BOOKABLE_OFFERINGS = [
  { id: 'bk-room-1', category: 'Room' as const, title: 'Deluxe River Balcony Room', sub: 'Ganga View Resort, Tapovan • 2 Adults • Free Breakfast', price: 4800, gst: 12, img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=500&q=80' },
  { id: 'bk-room-2', category: 'Room' as const, title: 'Ganga View Luxury Suite', sub: 'Panoramic River Deck • Yoga Balcony • > ₹7,500 Slab', price: 8500, gst: 18, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80' },
  { id: 'bk-dorm-1', category: 'Dorm Bed' as const, title: 'Himalaya 6-Bed Mixed Hostel Bunk', sub: 'Privacy Curtain • Locker • Social Terrace Cafe', price: 899, gst: 12, img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=500&q=80' },
  { id: 'bk-camp-1', category: 'Camp Tent' as const, title: 'Shivpuri Luxury Swiss Camp + 16km Rafting', sub: 'Attached Bath • 3 Buffet Meals • Bonfire + Rafting', price: 5500, gst: 18, img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=500&q=80' },
];

export default function GuestDirectBookingPage() {
  const { addReservation, activeProperty } = useHospitality();
  const [selectedId, setSelectedId] = useState(BOOKABLE_OFFERINGS[0].id);
  const [nights, setNights] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [nationality, setNationality] = useState('India');
  const [addRafting, setAddRafting] = useState(true);
  const [confirmedCode, setConfirmedCode] = useState('');

  const item = BOOKABLE_OFFERINGS.find(b => b.id === selectedId) || BOOKABLE_OFFERINGS[0];
  const stayBase = item.price * nights;
  const addonAmt = addRafting ? 1200 : 0;
  const tax = Math.round(((stayBase + addonAmt) * item.gst) / 100);
  const total = stayBase + addonAmt + tax;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    const isForeign = nationality !== 'India';
    const created = addReservation({
      propertyId: activeProperty.id,
      guestName: guestName.trim(),
      guestPhone: guestPhone || '+91 98111 00000',
      guestEmail: `${guestName.toLowerCase().replace(/\s+/g, '.')}@guest.com`,
      nationality,
      isForeignGuest: isForeign,
      idType: isForeign ? 'Passport' : 'Aadhaar',
      idNumber: 'Direct Web Capture',
      idVerified: false,
      unitType: item.category,
      unitLabel: item.title,
      checkInDate: '2026-11-19',
      checkOutDate: `2026-11-${19 + nights}`,
      nights,
      adults: 2,
      children: 0,
      source: 'Direct',
      status: 'Confirmed',
      totalEstimate: total,
      paidAmount: Math.round(total * 0.3),
      formIIIRequired: isForeign,
      formIIIStatus: isForeign ? 'Pending' : undefined,
    });
    setConfirmedCode(created.bookingCode);
  };

  return (
    <div className="min-vh-100 bg-surface d-flex flex-column">
      <header className="bg-navy text-white px-4 py-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-3 bg-brand text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px', fontSize: '20px' }}>Z</div>
          <div>
            <div className="fw-bold fs-5 lh-1">Ganga Heritage Direct Booking</div>
            <div className="text-white-50" style={{ fontSize: '11px' }}>0% OTA Commission • Rishikesh Hotels, Hostels &amp; Rafting Camps</div>
          </div>
        </div>
        <Link href="/owner/front-desk" className="btn btn-sm btn-outline-light d-flex align-items-center gap-1">
          <BiArrowBack /> Staff Front Desk
        </Link>
      </header>

      <main className="container py-4 flex-grow-1">
        {confirmedCode ? (
          <div className="app-card p-5 text-center mx-auto" style={{ maxWidth: '580px' }}>
            <BiCheckCircle size={64} className="text-success mb-3" />
            <h3 className="fw-bold text-navy mb-2">Booking Confirmed!</h3>
            <p className="text-muted-custom">
              Your direct booking <strong className="text-brand">{confirmedCode}</strong> for <strong>{item.title}</strong> ({nights} nights) is synced directly into the Front Desk &amp; Unified Guest Folio.
            </p>
            {nationality !== 'India' && (
              <div className="alert alert-info small">
                <BiShieldAlt2 className="me-1" /> Foreign guest pre-check-in link for Passport &amp; Form III will be shared on WhatsApp.
              </div>
            )}
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button type="button" onClick={() => setConfirmedCode('')} className="btn btn-outline-secondary">Book Another Stay</button>
              <Link href="/owner/front-desk" className="btn btn-brand text-white fw-semibold">View in Front Desk &rarr;</Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-lg-7">
              <h5 className="fw-bold text-navy mb-3">1. Choose Your Stay — Hotel, Hostel Dorm or Riverside Camp</h5>
              <div className="row g-3">
                {BOOKABLE_OFFERINGS.map(off => (
                  <div key={off.id} className="col-12 col-sm-6">
                    <div
                      onClick={() => setSelectedId(off.id)}
                      className={`app-card overflow-hidden h-100 ${selectedId === off.id ? 'border-2 border-brand shadow' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={off.img} alt={off.title} style={{ height: '150px', width: '100%', objectFit: 'cover' }} />
                      <div className="p-3">
                        <span className="badge badge-soft-brand mb-1">
                          {off.category === 'Room' ? <BiHotel /> : off.category === 'Dorm Bed' ? <BiBed /> : <TbTent />} {off.category}
                        </span>
                        <h6 className="fw-bold text-navy mb-1">{off.title}</h6>
                        <p className="text-muted-custom small mb-2">{off.sub}</p>
                        <div className="fw-bolder text-navy">
                          ₹{formatNumber(off.price)} <span className="fw-normal text-muted-custom small">/ night (+{off.gst}% GST)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <form onSubmit={handleBook} className="app-card p-4">
                <h5 className="fw-bold text-navy mb-3">2. Guest Details &amp; Instant Confirmation</h5>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Full Name *</label>
                  <input className="form-control" required value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Your full name" />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">WhatsApp / Phone</label>
                    <input className="form-control" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+91..." />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">Nationality</label>
                    <select className="form-select" value={nationality} onChange={e => setNationality(e.target.value)}>
                      <option value="India">India</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="USA">USA</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Nights</label>
                  <input type="number" min={1} max={14} className="form-control" value={nights} onChange={e => setNights(Number(e.target.value))} />
                </div>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" id="addRaft" checked={addRafting} onChange={e => setAddRafting(e.target.checked)} />
                  <label className="form-check-label small fw-semibold text-navy" htmlFor="addRaft">
                    Add 16km Shivpuri White Water Rafting (+₹1,200)
                  </label>
                </div>

                <div className="bg-surface rounded-3 p-3 mb-3 small">
                  <div className="d-flex justify-content-between mb-1"><span>{item.title} ({nights}N)</span><strong>₹{formatNumber(stayBase)}</strong></div>
                  {addRafting && <div className="d-flex justify-content-between mb-1"><span>Rafting Adventure Add-on</span><strong>₹1,200</strong></div>}
                  <div className="d-flex justify-content-between mb-2"><span>Estimated GST ({item.gst}%)</span><strong>₹{formatNumber(tax)}</strong></div>
                  <div className="d-flex justify-content-between fs-5 fw-bolder text-navy border-top pt-2">
                    <span>Total Estimate</span><span className="text-brand">₹{formatNumber(total)}</span>
                  </div>
                </div>

                <button type="submit" className="btn btn-brand w-100 py-2.5 text-white fw-bold">
                  Confirm Direct Booking (30% Mock Deposit)
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
