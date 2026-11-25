'use client';

import React from 'react';
import { RestaurantThemeConfig } from '@/types/restaurantWebsite';
import { BookTableButton, OutlineButton } from './ButtonSystem';
import { BiPhoneCall } from 'react-icons/bi';

interface ReservationSectionProps {
  theme: RestaurantThemeConfig;
  onOpenBookTable: () => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  theme,
  onOpenBookTable,
}) => {
  return (
    <section
      className="py-5 position-relative text-white overflow-hidden"
      style={{
        backgroundColor: '#17120F',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Background Radial Glow */}
      <div
        className="position-absolute top-50 start-50 translate-middle pointer-events-none"
        style={{
          width: '600px',
          height: '400px',
          background: `radial-gradient(circle, ${theme.colors.primary}22 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      <div className="container position-relative py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-7">
            <span
              className="badge rounded-pill px-3 py-1 mb-3 text-uppercase fw-semibold"
              style={{ backgroundColor: theme.colors.primary, fontSize: '11px', letterSpacing: '0.08em' }}
            >
              Priority Reservations
            </span>

            <h2
              className="fw-bolder mb-3 text-white lh-1 tracking-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.02em' }}
            >
              {theme.reservation.heading}
            </h2>

            <p className="text-white-50 mb-5 fs-6 mx-auto" style={{ maxWidth: '520px', lineHeight: 1.6 }}>
              {theme.reservation.subheading}
            </p>

            <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
              <BookTableButton onClick={onOpenBookTable}>
                Book a Table
              </BookTableButton>

              <OutlineButton
                href={`tel:${theme.reservation.phone}`}
                icon={<BiPhoneCall size={18} />}
                className="border-white text-white border-opacity-30 hover-white"
              >
                Call {theme.reservation.phone}
              </OutlineButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
