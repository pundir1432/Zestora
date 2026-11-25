'use client';

import React, { useState } from 'react';
import { DishItem, RestaurantThemeConfig } from '@/types/restaurantWebsite';
import { MenuAddButton, IconButton, PrimaryCtaButton } from './ButtonSystem';
import { BiHeart, BiSolidHeart, BiStar, BiRightArrowAlt } from 'react-icons/bi';

interface PopularDishesSectionProps {
  theme: RestaurantThemeConfig;
  onAddToCart?: (dish: DishItem) => void;
  addedDishIds?: string[];
  onOpenBookTable?: () => void;
}

export const PopularDishesSection: React.FC<PopularDishesSectionProps> = ({
  theme,
  onAddToCart,
  addedDishIds = [],
  onOpenBookTable,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'dish-1': true,
    'dish-4': true,
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredDishes =
    activeCategory === 'All'
      ? theme.dishes
      : theme.dishes.filter((d) => d.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="menu" className="py-5" style={{ backgroundColor: theme.colors.background }}>
      <div className="container py-4">
        {/* Section Heading */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ backgroundColor: theme.colors.softBackground }}>
            <span className="small fw-bold text-uppercase" style={{ color: theme.colors.primary, fontSize: '11px', letterSpacing: '0.08em' }}>
              Our Special
            </span>
          </div>
          <h2 className="fw-bolder text-food-dark mb-2" style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.02em' }}>
            Popular Dishes
          </h2>
          <p className="text-food-muted small mx-auto" style={{ maxWidth: '480px' }}>
            Handcrafted with fresh seasonal ingredients, rich spices, and authentic passion.
          </p>

          {/* Horizontal Category Chips */}
          <div className="d-flex align-items-center justify-content-start justify-content-md-center gap-2 overflow-x-auto py-3 px-2">
            {theme.categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`category-chip ${isActive ? 'active' : ''}`}
                  style={{
                    backgroundColor: isActive ? theme.colors.primary : '#ffffff',
                    borderColor: isActive ? theme.colors.primary : '#E8DED6',
                    color: isActive ? '#ffffff' : '#211A17',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="row g-4 align-items-stretch">
          {filteredDishes.map((dish) => {
            const isFav = !!favorites[dish.id];
            const isAdded = addedDishIds.includes(dish.id);

            return (
              <div key={dish.id} className="col-12 col-sm-6 col-lg-3">
                <div className="food-card h-100 d-flex flex-column justify-content-between position-relative">
                  {/* Top Image Container */}
                  <div className="position-relative card-img-zoom overflow-hidden" style={{ height: '200px' }}>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-100 h-100 object-fit-cover"
                      loading="lazy"
                    />

                    {/* Veg / Non-Veg Indicator */}
                    <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 2 }}>
                      <span className={`food-type-icon ${dish.isVeg ? 'veg' : 'non-veg'} bg-white shadow-sm`} />
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(dish.id, e)}
                      className="position-absolute top-0 end-0 m-3 btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center bg-white shadow-sm border-0 transition-all"
                      style={{ width: '34px', height: '34px', zIndex: 2 }}
                      aria-label="Toggle favorite"
                    >
                      {isFav ? (
                        <BiSolidHeart size={18} style={{ color: theme.colors.primary }} />
                      ) : (
                        <BiHeart size={18} className="text-secondary" />
                      )}
                    </button>

                    {/* Rating Pill */}
                    <div
                      className="position-absolute bottom-0 start-0 m-3 px-2 py-1 rounded-pill bg-dark bg-opacity-75 text-white d-flex align-items-center gap-1 small"
                      style={{ fontSize: '11px', backdropFilter: 'blur(4px)' }}
                    >
                      <BiStar size={12} className="text-warning fill-current" />
                      <span className="fw-bold">{dish.rating}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="text-muted small" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>
                          {dish.category}
                        </span>
                        {dish.calories && (
                          <span className="text-muted small" style={{ fontSize: '10px' }}>
                            {dish.calories}
                          </span>
                        )}
                      </div>

                      <h5 className="fw-bold text-food-dark mb-1 text-truncate" style={{ fontSize: '16.5px' }} title={dish.name}>
                        {dish.name}
                      </h5>

                      <p className="text-food-muted small mb-3 line-clamp-2" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {dish.description}
                      </p>
                    </div>

                    {/* Price and Add Button Row */}
                    <div className="d-flex align-items-center justify-content-between pt-2 border-top border-food">
                      <div>
                        <span className="small text-muted d-block" style={{ fontSize: '10px' }}>Price</span>
                        <span className="fw-bolder fs-5" style={{ color: theme.colors.primary }}>
                          ₹{dish.price}
                        </span>
                      </div>

                      <MenuAddButton
                        isAdded={isAdded}
                        onClick={() => onAddToCart && onAddToCart(dish)}
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Special Offer Promotional Card (Matching Image) */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div
              className="food-card h-100 p-4 text-white d-flex flex-column justify-content-between position-relative overflow-hidden"
              style={{
                backgroundColor: '#17120F',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '340px',
              }}
            >
              {/* Subtle Red Radial Glow */}
              <div
                className="position-absolute top-0 end-0 pointer-events-none"
                style={{
                  width: '180px',
                  height: '180px',
                  background: `radial-gradient(circle, ${theme.colors.primary}44 0%, transparent 70%)`,
                  filter: 'blur(30px)',
                }}
              />

              <div>
                <span className="badge rounded-pill px-3 py-1 small mb-3" style={{ backgroundColor: theme.colors.primary, fontSize: '11px' }}>
                  {theme.specialOffer.badge}
                </span>

                <h3 className="fw-bold text-white mb-1" style={{ fontSize: '26px', letterSpacing: '-0.02em' }}>
                  {theme.specialOffer.title}
                </h3>

                <p className="text-white-50 small mb-4" style={{ fontSize: '13px' }}>
                  {theme.specialOffer.subtitle}
                </p>

                <div className="p-2 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10 d-inline-block mb-3">
                  <span className="small text-white-50 d-block" style={{ fontSize: '10px' }}>Use Coupon Code</span>
                  <span className="fw-bold text-white tracking-widest" style={{ letterSpacing: '2px' }}>
                    {theme.specialOffer.code}
                  </span>
                </div>
              </div>

              <div>
                <PrimaryCtaButton
                  onClick={onOpenBookTable}
                  className="w-100 justify-content-center"
                >
                  {theme.specialOffer.ctaText}
                </PrimaryCtaButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
