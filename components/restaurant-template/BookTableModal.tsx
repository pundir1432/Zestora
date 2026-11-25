'use client';

import React, { useState } from 'react';
import { BiX, BiCalendar, BiTime, BiUser, BiPhone, BiDish, BiCheckCircle } from 'react-icons/bi';
import { InteractiveLoadingButton } from './ButtonSystem';

interface BookTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  primaryColor?: string;
}

export const BookTableModal: React.FC<BookTableModalProps> = ({
  isOpen,
  onClose,
  restaurantName,
  primaryColor = '#E63946',
}) => {
  const [date, setDate] = useState('2026-11-26');
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState('2 Guests');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        zIndex: 2000,
        backgroundColor: 'rgba(23, 18, 15, 0.75)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="bg-white rounded-4 shadow-lg w-100 overflow-hidden border border-food"
        style={{ maxWidth: '520px', animation: 'fadeIn 0.2s ease-out' }}
      >
        {/* Modal Header */}
        <div
          className="p-4 d-flex align-items-center justify-content-between text-white"
          style={{ backgroundColor: '#17120F', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge rounded-pill" style={{ backgroundColor: primaryColor, fontSize: '11px' }}>
                Instant Confirmation
              </span>
              <span className="small text-white-50">{restaurantName}</span>
            </div>
            <h4 className="fw-bold mb-0 mt-1 text-white">Reserve Your Table</h4>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm text-white-50 p-1 border-0"
            aria-label="Close modal"
          >
            <BiX size={26} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 bg-food-cream">
          {isSuccess ? (
            <div className="py-4 text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width: '64px', height: '64px', backgroundColor: '#ECFDF5', color: '#16845B' }}
              >
                <BiCheckCircle size={36} />
              </div>
              <h4 className="fw-bold text-food-dark mb-1">Table Reserved Successfully!</h4>
              <p className="text-food-muted small mb-3">
                We have saved a premium table for {guests} on {date} at {time}. An SMS confirmation has been dispatched.
              </p>
              <div className="p-3 bg-white rounded-3 border border-food text-start mb-2">
                <div className="small fw-semibold text-food-dark">Booking ID: #TB-{Math.floor(1000 + Math.random() * 9000)}</div>
                <div className="small text-food-muted">Guest: {name || 'Valued Guest'} &bull; {phone || '+91 98765 43210'}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-food-dark mb-1">
                    <BiCalendar className="me-1 text-food-primary" /> Date
                  </label>
                  <input
                    type="date"
                    required
                    className="form-control form-control-sm rounded-3 border-food"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold text-food-dark mb-1">
                    <BiTime className="me-1 text-food-primary" /> Time Slot
                  </label>
                  <select
                    className="form-select form-select-sm rounded-3 border-food"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    <option value="12:30">12:30 PM (Lunch)</option>
                    <option value="13:30">01:30 PM (Lunch)</option>
                    <option value="19:00">07:00 PM (Dinner)</option>
                    <option value="19:30">07:30 PM (Dinner)</option>
                    <option value="20:30">08:30 PM (Dinner)</option>
                    <option value="21:15">09:15 PM (Dinner)</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-food-dark mb-1">
                  <BiDish className="me-1 text-food-primary" /> Guests
                </label>
                <div className="d-flex gap-2">
                  {['2 Guests', '4 Guests', '6 Guests', '8+ Guests'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGuests(g)}
                      className="btn btn-sm flex-grow-1 rounded-3 fw-semibold transition-all"
                      style={{
                        backgroundColor: guests === g ? primaryColor : '#ffffff',
                        color: guests === g ? '#ffffff' : '#211A17',
                        border: guests === g ? `1px solid ${primaryColor}` : '1px solid #E8DED6',
                        fontSize: '12px',
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-food-dark mb-1">
                    <BiUser className="me-1 text-food-primary" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    className="form-control form-control-sm rounded-3 border-food"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold text-food-dark mb-1">
                    <BiPhone className="me-1 text-food-primary" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    className="form-control form-control-sm rounded-3 border-food"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-food-dark mb-1">
                  Special Request (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Window seat, anniversary celebration"
                  className="form-control form-control-sm rounded-3 border-food"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <InteractiveLoadingButton
                isLoading={isLoading}
                isSuccess={isSuccess}
                defaultText="Confirm Table Reservation"
                loadingText="Securing Table..."
                successText="✓ Table Reserved"
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
