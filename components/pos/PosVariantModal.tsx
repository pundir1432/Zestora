'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { MenuItem, FoodVariant, FoodAddon } from '@/types/menu';
import { CartItem, ItemCoffeeCustomization } from '@/types/order';

interface PosVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onConfirm: (cartItem: CartItem) => void;
}

export const PosVariantModal: React.FC<PosVariantModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirm,
}) => {
  if (!isOpen || !item) return null;

  const defaultVariant = item.variants && item.variants.length > 0 ? item.variants[0] : undefined;
  const [selectedVariant, setSelectedVariant] = useState<FoodVariant | undefined>(defaultVariant);
  const [selectedAddons, setSelectedAddons] = useState<FoodAddon[]>([]);
  const [instructions, setInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Multi-business states
  // 1. Weight-based states (for sweets, mithai, bulk dry goods)
  const isWeightItem = !!item.isWeightBased;
  const pricePerKg = item.pricePerKg || item.price;
  const [selectedWeightGrams, setSelectedWeightGrams] = useState<number>(500);

  // 2. Custom Cake states (for bakeries)
  const isCakeItem = !!item.isCustomCake;
  const [cakeMessage, setCakeMessage] = useState('');
  const [isEggless, setIsEggless] = useState(false);

  // 3. Coffee & Beverage customization (for cafes)
  const isCoffeeItem = item.category === 'Coffee & Brews' || item.category === 'Beverages';
  const [milkType, setMilkType] = useState<string>('Whole Milk');
  const [sugarLevel, setSugarLevel] = useState<string>('Normal Sweet');
  const [temperature, setTemperature] = useState<string>('Hot');
  const [extraShots, setExtraShots] = useState<number>(0);

  // Price calculations
  let basePrice = 0;
  let weightLabelStr: string | undefined = undefined;

  if (isWeightItem) {
    basePrice = Math.round((selectedWeightGrams / 1000) * pricePerKg);
    weightLabelStr = selectedWeightGrams >= 1000 
      ? `${(selectedWeightGrams / 1000).toFixed(1)} kg` 
      : `${selectedWeightGrams}g`;
  } else if (selectedVariant) {
    basePrice = selectedVariant.price;
  } else {
    basePrice = item.discountedPrice || item.price;
  }

  // Beverage additions
  let beverageExtras = 0;
  if (isCoffeeItem) {
    if (milkType === 'Oat Milk' || milkType === 'Almond Milk') beverageExtras += 35;
    if (temperature === 'Iced') beverageExtras += 20;
    if (extraShots > 0) beverageExtras += extraShots * 40;
  }

  // Cake eggless addition
  let cakeExtras = 0;
  if (isCakeItem && isEggless) {
    cakeExtras += 50;
  }

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + addonsTotal + beverageExtras + cakeExtras;
  const totalPrice = unitPrice * quantity;

  const handleToggleAddon = (addon: FoodAddon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAddToCart = () => {
    const coffeeCustom: ItemCoffeeCustomization | undefined = isCoffeeItem ? {
      milkType,
      sugarLevel,
      temperature,
      extraShots,
    } : undefined;

    const cartItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      menuItemId: item.id,
      name: item.name,
      price: unitPrice,
      quantity,
      isVeg: isCakeItem && isEggless ? true : item.isVeg,
      selectedVariant,
      selectedAddons,
      specialInstructions: instructions.trim() || undefined,
      selectedWeightGrams: isWeightItem ? selectedWeightGrams : undefined,
      weightLabel: weightLabelStr,
      coffeeCustomization: coffeeCustom,
      customCakeMessage: isCakeItem && cakeMessage.trim() ? cakeMessage.trim() : undefined,
      isEggless: isCakeItem ? isEggless : undefined,
    };
    onConfirm(cartItem);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Customize: ${item.name}`}
      subtitle={isWeightItem ? 'Select weight portion (Price per Kg: ₹' + pricePerKg + ')' : isCakeItem ? 'Custom Artisan Cake Specifications' : isCoffeeItem ? 'Coffee Brewing & Milk Customization' : 'Select portion size and optional accompaniments'}
      size="md"
      footer={
        <div className="d-flex align-items-center justify-content-between w-100">
          <div>
            <span className="text-muted-custom small d-block">Total Amount</span>
            <span className="fw-bold fs-5 text-navy">₹{totalPrice}</span>
          </div>
          <button
            type="button"
            className="btn btn-brand px-4 py-2 shadow-sm"
            onClick={handleAddToCart}
          >
            Add to Bill (₹{totalPrice})
          </button>
        </div>
      }
    >
      <div className="d-flex flex-column gap-3">
        {/* 1. Weight-based billing section for Mithai / Bakeries */}
        {isWeightItem && (
          <div className="p-3 bg-light rounded-3 border border-subtle">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <label className="fw-bold text-navy small text-uppercase mb-0">Select Weight / Portion</label>
              <span className="badge badge-soft-brand">Rate: ₹{pricePerKg}/kg</span>
            </div>
            <div className="row g-2 mb-3">
              {[
                { label: '250g (Quarter kg)', grams: 250 },
                { label: '500g (Half kg)', grams: 500 },
                { label: '1.0 kg (Standard)', grams: 1000 },
                { label: '2.0 kg (Party Pack)', grams: 2000 },
              ].map(w => {
                const isSelected = selectedWeightGrams === w.grams;
                const cost = Math.round((w.grams / 1000) * pricePerKg);
                return (
                  <div key={w.grams} className="col-6">
                    <div
                      className={`p-2 rounded-3 border text-center cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand bg-brand bg-opacity-10 text-brand fw-bold shadow-sm'
                          : 'border-subtle bg-white text-navy'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedWeightGrams(w.grams)}
                    >
                      <div className="small">{w.label}</div>
                      <div className="small fw-semibold mt-1">₹{cost}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom grams slider / input */}
            <div>
              <div className="d-flex justify-content-between small text-navy fw-medium mb-1">
                <span>Custom Weight (Grams):</span>
                <span className="fw-bold text-brand">{selectedWeightGrams} grams (₹{Math.round((selectedWeightGrams / 1000) * pricePerKg)})</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="100"
                max="5000"
                step="50"
                value={selectedWeightGrams}
                onChange={(e) => setSelectedWeightGrams(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* 2. Custom Cake Builder for Bakeries */}
        {isCakeItem && (
          <div className="p-3 bg-light rounded-3 border border-subtle">
            <label className="fw-bold text-navy small mb-2 text-uppercase">Artisan Cake Details</label>
            
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="egglessCheck"
                checked={isEggless}
                onChange={(e) => setIsEggless(e.target.checked)}
              />
              <label className="form-check-label small fw-semibold text-navy" htmlFor="egglessCheck">
                Make 100% Eggless (+₹50)
              </label>
            </div>

            <div>
              <label className="form-label small text-muted-custom mb-1">Custom Message / Name on Cake</label>
              <input
                type="text"
                className="form-control form-control-sm border-subtle"
                placeholder="e.g. Happy 25th Birthday Rhea! 🎉"
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* 3. Coffee & Beverage customizer for Cafes */}
        {isCoffeeItem && (
          <div className="p-3 bg-light rounded-3 border border-subtle">
            <label className="fw-bold text-navy small mb-2 text-uppercase">Barista Customization</label>
            
            <div className="row g-2 mb-2">
              <div className="col-6">
                <label className="small text-muted-custom mb-1">Milk Choice</label>
                <select
                  className="form-select form-select-sm"
                  value={milkType}
                  onChange={(e) => setMilkType(e.target.value)}
                >
                  <option value="Whole Milk">Whole Milk (Regular)</option>
                  <option value="Oat Milk">Oat Milk (+₹35)</option>
                  <option value="Almond Milk">Almond Milk (+₹35)</option>
                  <option value="Skimmed Milk">Skimmed Milk (Free)</option>
                </select>
              </div>

              <div className="col-6">
                <label className="small text-muted-custom mb-1">Sweetness</label>
                <select
                  className="form-select form-select-sm"
                  value={sugarLevel}
                  onChange={(e) => setSugarLevel(e.target.value)}
                >
                  <option value="No Sugar">No Sugar</option>
                  <option value="Less Sweet">Less Sweet (50%)</option>
                  <option value="Normal Sweet">Normal Sweet</option>
                  <option value="Jaggery / Honey">Jaggery / Honey (+₹15)</option>
                </select>
              </div>
            </div>

            <div className="row g-2">
              <div className="col-6">
                <label className="small text-muted-custom mb-1">Serving Style</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm flex-grow-1 ${temperature === 'Hot' ? 'btn-brand text-white' : 'btn-outline-secondary'}`}
                    onClick={() => setTemperature('Hot')}
                  >
                    Hot
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm flex-grow-1 ${temperature === 'Iced' ? 'btn-brand text-white' : 'btn-outline-secondary'}`}
                    onClick={() => setTemperature('Iced')}
                  >
                    Iced (+₹20)
                  </button>
                </div>
              </div>

              <div className="col-6">
                <label className="small text-muted-custom mb-1">Espresso Shots</label>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary px-2"
                    onClick={() => setExtraShots(Math.max(0, extraShots - 1))}
                  >
                    -
                  </button>
                  <span className="small fw-semibold text-navy">+{extraShots} shot</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary px-2"
                    onClick={() => setExtraShots(extraShots + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Variants Selection (if not weight based) */}
        {!isWeightItem && item.variants && item.variants.length > 0 && (
          <div>
            <label className="fw-bold text-navy small mb-2 text-uppercase">Select Portion Size</label>
            <div className="row g-2">
              {item.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <div key={v.id} className="col-12 col-sm-6">
                    <div
                      className={`p-2 rounded-3 border d-flex justify-content-between align-items-center cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand bg-brand bg-opacity-10 text-brand fw-bold shadow-sm'
                          : 'border-subtle bg-white text-navy'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedVariant(v)}
                    >
                      <span className="small">{v.name}</span>
                      <span className="small">₹{v.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add-ons Selection */}
        {item.addons && item.addons.length > 0 && (
          <div>
            <label className="fw-bold text-navy small mb-2 text-uppercase">Optional Add-ons</label>
            <div className="d-flex flex-column gap-2">
              {item.addons.map((a) => {
                const isSelected = selectedAddons.some(addon => addon.id === a.id);
                return (
                  <div
                    key={a.id}
                    className={`p-2 rounded-3 border d-flex justify-content-between align-items-center cursor-pointer ${
                      isSelected ? 'border-brand bg-surface fw-semibold' : 'border-subtle bg-white'
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleToggleAddon(a)}
                  >
                    <div className="form-check mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                      />
                      <label className="form-check-label small text-navy ms-1">
                        {a.name}
                      </label>
                    </div>
                    <span className="small text-muted-custom">+₹{a.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Special Cooking Instructions */}
        <div>
          <label className="fw-bold text-navy small mb-1">Kitchen / Chef Notes</label>
          <input
            type="text"
            className="form-control form-control-sm border-subtle"
            placeholder="e.g. Less spicy, extra crispy, no onions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        {/* Quantity selector */}
        <div className="d-flex align-items-center justify-content-between pt-2 border-top border-subtle">
          <span className="small fw-semibold text-navy">Item Quantity</span>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-circle p-1"
              style={{ width: '28px', height: '28px' }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="fw-bold px-2">{quantity}</span>
            <button
              type="button"
              className="btn btn-sm btn-brand rounded-circle p-1"
              style={{ width: '28px', height: '28px' }}
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
