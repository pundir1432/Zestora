'use client';

import React from 'react';
import { ReviewItem, RestaurantThemeConfig } from '@/types/restaurantWebsite';
import { BiStar, BiSolidQuoteAltLeft } from 'react-icons/bi';

interface ReviewsSectionProps {
  theme: RestaurantThemeConfig;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ theme }) => {
  return (
    <section id="reviews" className="py-5 bg-white border-top border-bottom border-food">
      <div className="container py-4">
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ backgroundColor: theme.colors.softBackground }}>
            <span className="small fw-bold text-uppercase" style={{ color: theme.colors.primary, fontSize: '11px', letterSpacing: '0.08em' }}>
              Guest Testimonials
            </span>
          </div>
          <h2 className="fw-bolder text-food-dark mb-2" style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.02em' }}>
            Loved by Diners &amp; Critics
          </h2>
          <p className="text-food-muted small mx-auto" style={{ maxWidth: '480px' }}>
            Discover what our guests love about our flavors, service, and dining atmosphere.
          </p>
        </div>

        {/* Reviews Cards Row */}
        <div className="row g-4 align-items-stretch">
          {theme.reviews.map((rev) => (
            <div key={rev.id} className="col-12 col-md-4">
              <div
                className="food-card p-4 h-100 d-flex flex-column justify-content-between"
                style={{ backgroundColor: '#ffffff' }}
              >
                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-1 text-warning">
                      {[...Array(rev.rating)].map((_, i) => (
                        <BiStar key={i} size={18} className="fill-current text-warning" />
                      ))}
                    </div>
                    <BiSolidQuoteAltLeft size={28} className="text-secondary text-opacity-25" />
                  </div>

                  <p className="text-food-dark mb-4" style={{ fontSize: '14.5px', lineHeight: 1.6, fontStyle: 'italic' }}>
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* User Avatar & Info */}
                <div className="d-flex align-items-center gap-3 pt-3 border-top border-food">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="rounded-circle object-fit-cover flex-shrink-0 border border-2 border-food"
                    style={{ width: '44px', height: '44px' }}
                  />
                  <div className="overflow-hidden">
                    <div className="fw-bold text-food-dark text-truncate" style={{ fontSize: '14px' }}>
                      {rev.name}
                    </div>
                    <div className="text-food-muted small text-truncate" style={{ fontSize: '11.5px' }}>
                      {rev.role || 'Verified Guest'} &bull; <span className="text-muted">{rev.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
