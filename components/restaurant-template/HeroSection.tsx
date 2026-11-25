'use client';

import React from 'react';
import { PrimaryCtaButton, OutlineButton } from './ButtonSystem';
import { RestaurantThemeConfig } from '@/types/restaurantWebsite';
import { BiPlay, BiStar, BiHeart } from 'react-icons/bi';

interface HeroSectionProps {
  theme: RestaurantThemeConfig;
  onOpenBookTable: () => void;
  onExploreMenu: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  onOpenBookTable,
  onExploreMenu,
}) => {
  return (
    <section
      id="home"
      className="position-relative d-flex align-items-center min-vh-100 overflow-hidden"
      style={{
        backgroundColor: '#17120F',
        paddingTop: '100px',
        paddingBottom: '60px',
      }}
    >
      {/* Background Food Photography with Dark Luxury Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: `url(${theme.hero.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.32)',
          transform: 'scale(1.02)',
        }}
      />

      {/* Subtle Radial Glow in Theme Color */}
      <div
        className="position-absolute top-50 start-0 translate-middle-y pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, ${theme.colors.primary}22 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container position-relative py-5">
        <div className="row align-items-center g-5">
          {/* Left Column: Hero Text & CTAs */}
          <div className="col-12 col-lg-7 text-white">
            {/* Small Top Badge */}
            <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-15 mb-4 shadow-sm">
              <span
                className="d-inline-block rounded-circle"
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: theme.colors.primary,
                  boxShadow: `0 0 10px ${theme.colors.primary}`,
                }}
              />
              <span className="small fw-semibold text-white tracking-wide" style={{ fontSize: '12px' }}>
                {theme.hero.badge}
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="fw-bolder mb-3 text-white lh-1 tracking-tight"
              style={{
                fontSize: 'clamp(40px, 6vw, 68px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
              }}
            >
              <span className="d-block">{theme.hero.headingLine1}</span>
              <span className="d-block" style={{ color: theme.colors.primary }}>
                {theme.hero.headingLine2}
              </span>
            </h1>

            {/* Hero Description */}
            <p
              className="text-white-50 mb-4 pe-lg-4"
              style={{
                fontSize: 'clamp(15px, 2vw, 17px)',
                lineHeight: 1.6,
                maxWidth: '540px',
              }}
            >
              {theme.hero.description}
            </p>

            {/* CTA Buttons (Primary Shine + Book a Table) */}
            <div className="d-flex align-items-center gap-3 flex-wrap mb-5">
              <PrimaryCtaButton onClick={onExploreMenu}>
                {theme.hero.exploreBtnText}
              </PrimaryCtaButton>

              <OutlineButton onClick={onOpenBookTable} className="border-white text-white border-opacity-35 hover-white">
                {theme.hero.bookBtnText}
              </OutlineButton>
            </div>

            {/* Customer Trust Strip */}
            <div className="d-flex align-items-center gap-3 pt-3 border-top border-white border-opacity-10">
              {/* Overlapping Avatars */}
              <div className="d-flex align-items-center">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80',
                ].map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar}
                    alt="Customer"
                    className="rounded-circle border border-2 border-dark"
                    style={{
                      width: '36px',
                      height: '36px',
                      objectFit: 'cover',
                      marginLeft: idx > 0 ? '-10px' : '0',
                    }}
                  />
                ))}
              </div>

              {/* Trust Metric */}
              <div>
                <div className="d-flex align-items-center gap-1 text-warning mb-0" style={{ fontSize: '13px' }}>
                  <BiStar size={14} className="fill-current" />
                  <span className="fw-bold text-white">4.9</span>
                  <span className="text-white-50" style={{ fontSize: '11px' }}>(2,400+ Reviews)</span>
                </div>
                <span className="text-white-50 small fw-medium" style={{ fontSize: '12px' }}>
                  {theme.hero.happyCustomersCount}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Signature Dish Plate (Matching Screenshot) */}
          <div className="col-12 col-lg-5 d-flex justify-content-center position-relative">
            <div className="position-relative text-center" style={{ maxWidth: '440px' }}>
              {/* Floating Badge "Delicious Forever" */}
              <div
                className="position-absolute top-0 end-0 translate-middle-y px-3 py-1 rounded-pill bg-white text-food-dark shadow-lg d-flex align-items-center gap-1"
                style={{ zIndex: 3, border: '1px solid #E8DED6' }}
              >
                <BiHeart size={14} className="text-food-primary" />
                <span className="small fw-bold" style={{ fontSize: '11px' }}>
                  {theme.hero.dishTag || 'Delicious Forever'}
                </span>
              </div>

              {/* Main Dish Image with Soft Shadow & Subtle Border */}
              <div
                className="rounded-circle overflow-hidden p-2 position-relative shadow-2xl"
                style={{
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(23, 18, 15, 0.4)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=650&q=85"
                  alt="Signature Dish"
                  className="rounded-circle img-fluid transition-all"
                  style={{
                    maxHeight: '380px',
                    width: '380px',
                    objectFit: 'cover',
                    animation: 'floatSlow 6s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Floating Chef Specialty Card */}
              <div
                className="position-absolute bottom-0 start-0 translate-middle-y p-3 rounded-4 text-start bg-white text-food-dark shadow-xl"
                style={{
                  maxWidth: '220px',
                  border: '1px solid #E8DED6',
                  zIndex: 3,
                }}
              >
                <span className="badge rounded-pill bg-danger bg-opacity-10 text-food-primary small px-2 py-1 mb-1" style={{ fontSize: '10px' }}>
                  ★ Chef Special
                </span>
                <div className="fw-bold small text-food-dark mb-0">Paneer Tikka Royale</div>
                <div className="fw-bolder text-food-primary" style={{ fontSize: '14px' }}>₹320</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
