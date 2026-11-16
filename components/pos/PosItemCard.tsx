'use client';

import React from 'react';
import { MenuItem } from '@/types/menu';
import { BiPlus } from 'react-icons/bi';

interface PosItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export const PosItemCard: React.FC<PosItemCardProps> = ({ item, onAddToCart }) => {
  const isOutOfStock = !item.isAvailable;

  return (
    <div 
      className={`card border-subtle h-100 shadow-sm transition-all overflow-hidden ${
        isOutOfStock ? 'opacity-50' : 'hover-shadow'
      }`}
      style={{
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
      }}
      onClick={() => {
        if (!isOutOfStock) onAddToCart(item);
      }}
    >
      <div className="position-relative" style={{ height: '110px' }}>
        <img
          src={item.image}
          alt={item.name}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
        {/* Veg / Non-Veg Indicator */}
        <div 
          className="position-absolute top-0 start-0 m-2 bg-white rounded-1 p-1 shadow-sm d-flex align-items-center justify-content-center"
          style={{ width: '22px', height: '22px' }}
        >
          <span className={`food-type-icon ${item.isVeg ? 'veg' : 'non-veg'}`} />
        </div>

        {/* Popular Badge */}
        {item.isPopular && (
          <span className="position-absolute top-0 end-0 m-2 badge bg-brand text-white rounded-pill px-2 py-1 shadow-sm" style={{ fontSize: '10px' }}>
            Popular
          </span>
        )}

        {isOutOfStock && (
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center text-white fw-bold small text-uppercase">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-2 d-flex flex-column justify-content-between flex-grow-1">
        <div>
          <h6 className="fw-bold text-navy mb-1 text-truncate" style={{ fontSize: '13px' }} title={item.name}>
            {item.name}
          </h6>
          <div className="d-flex align-items-center gap-1 text-muted-custom" style={{ fontSize: '11px' }}>
            <span>{item.category}</span>
            {item.variants && <span>• {item.variants.length} Sizes</span>}
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top border-subtle">
          <div>
            <span className="fw-bold text-navy" style={{ fontSize: '14px' }}>
              ₹{item.discountedPrice || item.price}
            </span>
            {item.discountedPrice && (
              <span className="text-muted text-decoration-line-through ms-1" style={{ fontSize: '11px' }}>
                ₹{item.price}
              </span>
            )}
          </div>

          <button
            type="button"
            className="btn btn-sm btn-brand rounded-circle p-1 d-flex align-items-center justify-content-center shadow-none"
            style={{ width: '28px', height: '28px' }}
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) onAddToCart(item);
            }}
            title="Add to Bill"
          >
            <BiPlus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

