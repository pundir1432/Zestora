'use client';

import React, { useState } from 'react';
import { DishItem } from '@/types/restaurantWebsite';
import { BiX, BiTrash, BiPlus, BiMinus, BiShoppingBag, BiCheck } from 'react-icons/bi';
import { PrimaryCtaButton } from './ButtonSystem';

export interface CartItem {
  dish: DishItem;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  primaryColor?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  primaryColor = '#E63946',
}) => {
  const [isOrdered, setIsOrdered] = useState(false);
  const [couponApplied, setCouponApplied] = useState(true);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.2) : 0;
  const delivery = subtotal > 0 ? 40 : 0;
  const total = Math.max(0, subtotal - discount + delivery);

  const handleCheckout = () => {
    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
      onClose();
    }, 3000);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-end"
      style={{
        zIndex: 2200,
        backgroundColor: 'rgba(23, 18, 15, 0.65)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        className="bg-white h-100 d-flex flex-column justify-content-between shadow-2xl"
        style={{
          width: 'min(440px, 100vw)',
          animation: 'slideLeft 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-3 d-flex align-items-center justify-content-between border-bottom text-white"
          style={{ backgroundColor: '#17120F' }}
        >
          <div className="d-flex align-items-center gap-2">
            <BiShoppingBag size={22} style={{ color: primaryColor }} />
            <h5 className="fw-bold mb-0 text-white">Your Order</h5>
            <span className="badge rounded-pill bg-white bg-opacity-20 small" style={{ fontSize: '11px' }}>
              {items.length} items
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm text-white-50 p-1 border-0"
            aria-label="Close cart"
          >
            <BiX size={26} />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex-grow-1 overflow-y-auto bg-food-cream">
          {isOrdered ? (
            <div className="py-5 text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow"
                style={{ width: '60px', height: '60px', backgroundColor: '#ECFDF5', color: '#16845B' }}
              >
                <BiCheck size={36} />
              </div>
              <h4 className="fw-bold text-food-dark mb-1">Order Received!</h4>
              <p className="text-food-muted small mb-3">
                Your dishes are being freshly prepared in the kitchen.
              </p>
              <div className="p-3 bg-white rounded-3 border border-food text-start mb-2">
                <div className="small fw-semibold text-food-dark">Order #ORD-{Math.floor(1000 + Math.random() * 9000)}</div>
                <div className="small text-food-muted">Estimated Prep Time: 15–20 minutes</div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-5 text-center">
              <div className="p-3 rounded-circle d-inline-block bg-white border border-food mb-3 text-muted">
                <BiShoppingBag size={36} />
              </div>
              <h5 className="fw-bold text-food-dark mb-1">Your cart is empty</h5>
              <p className="text-food-muted small mb-3">
                Explore our popular dishes and click the &ldquo;+&rdquo; button to add delicious food.
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {/* Promo Applied Banner */}
              {couponApplied && (
                <div
                  className="p-2 px-3 rounded-3 d-flex align-items-center justify-content-between"
                  style={{ backgroundColor: '#FFE5E7', border: '1px solid #FFD1D8' }}
                >
                  <div className="small fw-semibold" style={{ color: primaryColor, fontSize: '12px' }}>
                    🎉 20% First Order Discount Applied!
                  </div>
                  <span className="badge rounded-pill text-white fw-bold" style={{ backgroundColor: primaryColor, fontSize: '10px' }}>
                    -₹{discount}
                  </span>
                </div>
              )}

              {/* Items List */}
              {items.map((item) => (
                <div
                  key={item.dish.id}
                  className="p-3 bg-white rounded-3 border border-food shadow-sm d-flex align-items-center justify-content-between gap-3"
                >
                  <img
                    src={item.dish.image}
                    alt={item.dish.name}
                    className="rounded-3 object-fit-cover flex-shrink-0"
                    style={{ width: '56px', height: '56px' }}
                  />

                  <div className="overflow-hidden flex-grow-1">
                    <div className="fw-bold text-food-dark text-truncate" style={{ fontSize: '13.5px' }}>
                      {item.dish.name}
                    </div>
                    <div className="text-muted small" style={{ fontSize: '11px' }}>
                      ₹{item.dish.price} each
                    </div>
                    <div className="fw-bold text-food-primary" style={{ fontSize: '13px' }}>
                      ₹{item.dish.price * item.quantity}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="d-flex align-items-center gap-1 bg-surface rounded-pill p-1 border border-subtle">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.dish.id, -1)}
                      className="btn btn-sm p-0 rounded-circle d-flex align-items-center justify-content-center text-muted"
                      style={{ width: '24px', height: '24px' }}
                      aria-label="Decrease quantity"
                    >
                      <BiMinus size={14} />
                    </button>
                    <span className="small fw-bold px-1" style={{ fontSize: '12px', minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.dish.id, 1)}
                      className="btn btn-sm p-0 rounded-circle d-flex align-items-center justify-content-center text-muted"
                      style={{ width: '24px', height: '24px' }}
                      aria-label="Increase quantity"
                    >
                      <BiPlus size={14} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.dish.id)}
                    className="btn btn-sm text-muted p-1 border-0"
                    title="Remove item"
                  >
                    <BiTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {items.length > 0 && !isOrdered && (
          <div className="p-3 bg-white border-top border-food">
            <div className="d-flex justify-content-between small text-muted mb-1" style={{ fontSize: '12px' }}>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            {couponApplied && (
              <div className="d-flex justify-content-between small mb-1" style={{ color: primaryColor, fontSize: '12px' }}>
                <span>Coupon Discount (20%)</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="d-flex justify-content-between small text-muted mb-2" style={{ fontSize: '12px' }}>
              <span>Taxes &amp; Packaging</span>
              <span>₹{delivery}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold text-food-dark fs-5 pt-2 border-top border-food mb-3">
              <span>Total Payable</span>
              <span style={{ color: primaryColor }}>₹{total}</span>
            </div>

            <PrimaryCtaButton
              onClick={handleCheckout}
              className="w-100 justify-content-center"
            >
              Place Order &bull; ₹{total}
            </PrimaryCtaButton>
          </div>
        )}
      </div>
    </div>
  );
};
