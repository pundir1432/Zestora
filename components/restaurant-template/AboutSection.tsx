'use client';

import React from 'react';
import { RestaurantThemeConfig } from '@/types/restaurantWebsite';
import { PrimaryCtaButton, OutlineButton } from './ButtonSystem';

interface AboutSectionProps {
  theme: RestaurantThemeConfig;
  onOpenBookTable: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  theme,
  onOpenBookTable,
}) => {
  return (
    <section id="about" className="py-5 bg-white border-top border-bottom border-food">
      <div className="container py-4">
        <div className="row align-items-center g-5">
          {/* Left Column: Large Restaurant Interior / Plating Image */}
          <div className="col-12 col-lg-6">
            <div className="position-relative">
              <div className="rounded-4 overflow-hidden shadow-xl position-relative border border-food">
                <img
                  src={theme.about.image}
                  alt={theme.name}
                  className="w-100 img-fluid object-fit-cover"
                  style={{ maxHeight: '480px', minHeight: '380px' }}
                />
              </div>

              {/* Floating Stat Card Badge */}
              <div
                className="position-absolute bottom-0 end-0 translate-middle-y me-3 p-3 rounded-4 bg-white text-food-dark shadow-xl border border-food"
                style={{ maxWidth: '220px' }}
              >
                <div className="fw-bolder fs-4" style={{ color: theme.colors.primary }}>
                  4.9★
                </div>
                <div className="fw-bold small text-food-dark">Diner Excellence Award</div>
                <div className="text-muted small" style={{ fontSize: '11px' }}>Recognized for Best Modern Ambiance &amp; Hospitality</div>
              </div>
            </div>
          </div>

          {/* Right Column: "More Than Just Food" & Story */}
          <div className="col-12 col-lg-6">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ backgroundColor: theme.colors.softBackground }}>
              <span className="small fw-bold text-uppercase" style={{ color: theme.colors.primary, fontSize: '11px', letterSpacing: '0.08em' }}>
                {theme.about.subheading}
              </span>
            </div>

            <h2 className="fw-bolder text-food-dark mb-3" style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {theme.about.heading}
            </h2>

            <p className="text-food-muted mb-3" style={{ fontSize: '15px', lineHeight: 1.7 }}>
              {theme.about.story1}
            </p>

            <p className="text-food-muted mb-4" style={{ fontSize: '15px', lineHeight: 1.7 }}>
              {theme.about.story2}
            </p>

            {/* Statistics Row */}
            <div className="row g-3 py-3 mb-4 border-top border-bottom border-food">
              {theme.about.stats.map((stat, idx) => (
                <div key={idx} className="col-6 col-sm-3">
                  <div className="fw-bolder fs-3 lh-1" style={{ color: theme.colors.primary }}>
                    {stat.value}
                  </div>
                  <div className="text-food-muted small mt-1" style={{ fontSize: '12px' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="d-flex align-items-center gap-3">
              <PrimaryCtaButton onClick={onOpenBookTable}>
                Reserve a Table
              </PrimaryCtaButton>
              <OutlineButton href="#menu" arrow={true}>
                Explore Menu
              </OutlineButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
