'use client';

import React, { useState } from 'react';
import { CartItem, OrderType, PaymentMethod, Order, SplitPaymentDetail } from '@/types/order';
import { Customer } from '@/types/customer';
import { RestaurantTable, BusinessFeatures } from '@/types/restaurant';
import {
  BiTrash,
  BiUserPlus,
  BiPrinter,
  BiCheck,
  BiCreditCard,
  BiMoney,
  BiQrScan,
  BiGlobe,
  BiReceipt,
  BiLayer
} from 'react-icons/bi';
import { Modal } from '@/components/common/Modal';

interface PosCartProps {
  items: CartItem[];
  customers: Customer[];
  tables: RestaurantTable[];
  features?: BusinessFeatures;
  initialTable?: string;
  onUpdateQty: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (orderData: Partial<Order>) => void;
  onPrintPreview: () => void;
}

export const PosCart: React.FC<PosCartProps> = ({
  items,
  customers,
  tables,
  features,
  initialTable,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  onPrintPreview,
}) => {
  const allowDineIn = features ? features.dineIn : true;
  const allowTables = features ? features.tableManagement : true;
  const allowSplitPayment = features ? features.splitBilling : true;
  const hasPackaging = features ? features.packagingCharges : true;

  const [orderType, setOrderType] = useState<OrderType>(allowDineIn ? 'Dine In' : 'Takeaway');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [customCustomerName, setCustomCustomerName] = useState<string>('');
  const [customCustomerPhone, setCustomCustomerPhone] = useState<string>('');
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState<boolean>(false);
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>(initialTable || tables[0]?.number || 'T-01');
  const [assignedWaiter, setAssignedWaiter] = useState<string>('Manoj Kumar');
  const [discountType, setDiscountType] = useState<'none' | '50' | '100' | '10%'>('none');
  const [applyServiceCharge, setApplyServiceCharge] = useState<boolean>(false);
  const [applyPackagingCharge, setApplyPackagingCharge] = useState<boolean>(orderType !== 'Dine In');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');

  // Split payment modal state
  const [showSplitModal, setShowSplitModal] = useState<boolean>(false);
  const [splitDetails, setSplitDetails] = useState<SplitPaymentDetail>({
    cashAmount: 0,
    upiAmount: 0,
    cardAmount: 0,
  });

  // Math calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (discountType === '50') discountAmount = Math.min(subtotal, 50);
  else if (discountType === '100') discountAmount = Math.min(subtotal, 100);
  else if (discountType === '10%') discountAmount = Math.round(subtotal * 0.1);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstAmount = +(taxableAmount * 0.05).toFixed(2); // 5% GST
  const serviceChargeAmount = (orderType === 'Dine In' && applyServiceCharge) ? +(taxableAmount * 0.05).toFixed(2) : 0;
  const packagingFee = (hasPackaging && (orderType === 'Takeaway' || orderType === 'Delivery') && applyPackagingCharge) ? 25 : 0;
  const grandTotal = +(taxableAmount + gstAmount + serviceChargeAmount + packagingFee).toFixed(2);

  // Active customer info
  const activeCustomer = customers.find(c => c.id === selectedCustomerId);
  const finalCustName = isNewCustomerOpen ? (customCustomerName.trim() || 'Walk-in Customer') : (activeCustomer?.name || 'Walk-in Customer');
  const finalCustPhone = isNewCustomerOpen ? (customCustomerPhone.trim() || '+91 98765 43210') : (activeCustomer?.phone || '+91 98765 43210');

  const handleCheckout = () => {
    if (items.length === 0) return;

    onPlaceOrder({
      customerName: finalCustName,
      customerPhone: finalCustPhone,
      orderType,
      tableNumber: (orderType === 'Dine In' && allowTables) ? selectedTableNumber : undefined,
      assignedWaiter: (orderType === 'Dine In' && allowTables) ? assignedWaiter : undefined,
      subtotal,
      discount: discountAmount,
      discountCode: discountType !== 'none' ? `OFFER-${discountType}` : undefined,
      taxGst: gstAmount,
      serviceCharge: serviceChargeAmount,
      packagingCharge: packagingFee,
      grandTotal,
      paymentMethod,
      splitPaymentDetails: paymentMethod === 'Split Payment' ? splitDetails : undefined,
      paymentStatus: 'Paid',
      orderStatus: 'Preparing',
    });
  };

  const handleOpenSplitModal = () => {
    // initialize half and half as default
    const half = Math.round(grandTotal / 2);
    setSplitDetails({
      cashAmount: half,
      upiAmount: grandTotal - half,
      cardAmount: 0,
    });
    setShowSplitModal(true);
  };

  const availableOrderTypes: OrderType[] = [
    ...(allowDineIn ? ['Dine In' as OrderType] : []),
    'Takeaway',
    'Delivery',
    'Counter Orders',
  ];

  return (
    <div className="app-card h-100 d-flex flex-column bg-white shadow-sm overflow-hidden">
      {/* Header & Order Type Tabs */}
      <div className="p-3 border-bottom border-subtle bg-surface">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h6 className="fw-bold text-navy mb-0 d-flex align-items-center gap-1">
            <BiReceipt className="text-brand" size={18} /> Active Order Bill
          </h6>
          {items.length > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-link text-danger p-0 text-decoration-none small"
              onClick={onClearCart}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Order Type Pills */}
        <div className="btn-group btn-group-sm w-100" role="group">
          {availableOrderTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={`btn ${orderType === type ? 'btn-brand fw-semibold text-white' : 'btn-outline-secondary'}`}
              onClick={() => {
                setOrderType(type);
                if (type === 'Takeaway' || type === 'Delivery') {
                  setApplyPackagingCharge(true);
                }
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Seating / Customer selector */}
      <div className="px-3 py-2 border-bottom border-subtle bg-light small">
        <div className="row g-2">
          {orderType === 'Dine In' && allowTables && (
            <>
              <div className="col-6">
                <label className="text-muted-custom fw-semibold mb-1" style={{ fontSize: '11px' }}>Table Number</label>
                <select
                  className="form-select form-select-sm border-subtle fw-bold text-navy"
                  value={selectedTableNumber}
                  onChange={(e) => setSelectedTableNumber(e.target.value)}
                >
                  {tables.map(tbl => (
                    <option key={tbl.id} value={tbl.number}>
                      {tbl.number} ({tbl.capacity} Seats • {tbl.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6">
                <label className="text-muted-custom fw-semibold mb-1" style={{ fontSize: '11px' }}>Assigned Waiter</label>
                <select
                  className="form-select form-select-sm border-subtle text-navy"
                  value={assignedWaiter}
                  onChange={(e) => setAssignedWaiter(e.target.value)}
                >
                  <option value="Manoj Kumar">Manoj Kumar</option>
                  <option value="Sunil Rao">Sunil Rao</option>
                  <option value="Deepak Sharma">Deepak Sharma</option>
                  <option value="Priya Menon">Priya Menon</option>
                </select>
              </div>
            </>
          )}

          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="text-muted-custom fw-semibold mb-0" style={{ fontSize: '11px' }}>Customer Contact</label>
              <button
                type="button"
                className="btn btn-sm btn-link text-brand p-0 text-decoration-none"
                style={{ fontSize: '11px' }}
                onClick={() => setIsNewCustomerOpen(!isNewCustomerOpen)}
              >
                {isNewCustomerOpen ? 'Pick Existing' : '+ Walk-in Customer'}
              </button>
            </div>

            {!isNewCustomerOpen ? (
              <select
                className="form-select form-select-sm border-subtle text-navy"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone.slice(-4)}) {c.customerGroup ? `• ${c.customerGroup}` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="d-flex gap-1">
                <input
                  type="text"
                  placeholder="Guest Name"
                  className="form-control form-control-sm border-subtle"
                  value={customCustomerName}
                  onChange={(e) => setCustomCustomerName(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="form-control form-control-sm border-subtle"
                  value={customCustomerPhone}
                  onChange={(e) => setCustomCustomerPhone(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-grow-1 overflow-y-auto p-3" style={{ maxHeight: '320px' }}>
        {items.length === 0 ? (
          <div className="text-center py-5 text-muted-custom">
            <div className="d-inline-flex p-3 rounded-circle bg-light mb-2">
              <BiReceipt size={32} className="text-muted" />
            </div>
            <p className="mb-0 small fw-semibold">No food items added yet</p>
            <span className="text-muted" style={{ fontSize: '11px' }}>Click dishes from the menu to add</span>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {items.map((cartItem) => (
              <div
                key={cartItem.id}
                className="p-2 rounded-2 border border-subtle bg-white d-flex align-items-center justify-content-between shadow-2xs"
              >
                <div className="d-flex align-items-start gap-2 overflow-hidden me-2">
                  <span className={`food-type-icon mt-1 flex-shrink-0 ${cartItem.isVeg ? 'veg' : 'non-veg'}`} />
                  <div className="text-truncate">
                    <div className="fw-semibold text-navy small text-truncate">{cartItem.name}</div>

                    {/* Multi-business item indicators */}
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      {cartItem.weightLabel && <span className="badge badge-soft-brand me-1">{cartItem.weightLabel}</span>}
                      {cartItem.selectedVariant?.name || ''}
                      {cartItem.selectedAddons && cartItem.selectedAddons.length > 0 && ` • +${cartItem.selectedAddons.length} adds`}
                    </div>

                    {cartItem.coffeeCustomization && (
                      <div className="text-muted-custom small" style={{ fontSize: '10px' }}>
                        {cartItem.coffeeCustomization.temperature} • {cartItem.coffeeCustomization.milkType} • {cartItem.coffeeCustomization.sugarLevel}
                        {cartItem.coffeeCustomization.extraShots ? ` (+${cartItem.coffeeCustomization.extraShots} shot)` : ''}
                      </div>
                    )}

                    {cartItem.customCakeMessage && (
                      <div className="text-primary small fst-italic text-truncate" style={{ fontSize: '10px' }}>
                        Cake: &ldquo;{cartItem.customCakeMessage}&rdquo; {cartItem.isEggless ? '(Eggless)' : ''}
                      </div>
                    )}

                    {cartItem.specialInstructions && (
                      <div className="text-warning text-truncate fst-italic" style={{ fontSize: '10px' }}>
                        Note: {cartItem.specialInstructions}
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  {/* Quantity Stepper */}
                  <div className="d-flex align-items-center border border-subtle rounded-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-light p-1 lh-1 border-0"
                      onClick={() => onUpdateQty(cartItem.id, cartItem.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="px-2 small fw-bold text-navy">{cartItem.quantity}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-light p-1 lh-1 border-0"
                      onClick={() => onUpdateQty(cartItem.id, cartItem.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <span className="fw-bold text-navy small" style={{ minWidth: '55px', textAlign: 'right' }}>
                    ₹{cartItem.price * cartItem.quantity}
                  </span>

                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted hover-danger p-0 border-0"
                    onClick={() => onRemoveItem(cartItem.id)}
                    title="Remove item"
                  >
                    <BiTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calculations & Discounts */}
      {items.length > 0 && (
        <div className="p-3 border-top border-subtle bg-surface">
          {/* Quick Discount Pill Selector */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="small text-muted-custom fw-semibold" style={{ fontSize: '11px' }}>DISCOUNT</span>
            <div className="btn-group btn-group-sm" role="group">
              {(['none', '50', '100', '10%'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`btn btn-xs py-0 px-2 ${discountType === d ? 'btn-brand fw-bold text-white' : 'btn-outline-secondary'
                    }`}
                  style={{ fontSize: '10px' }}
                  onClick={() => setDiscountType(d)}
                >
                  {d === 'none' ? 'None' : d === '10%' ? '10% Off' : `₹${d}`}
                </button>
              ))}
            </div>
          </div>

          {/* Subtotal, GST, Service Charge, Packaging fee breakdown */}
          <div className="d-flex flex-column gap-1 small mb-2">
            <div className="d-flex justify-content-between text-muted-custom">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="d-flex justify-content-between text-success fw-semibold">
                <span>Discount</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between text-muted-custom">
              <span>GST 5% (CGST 2.5% + SGST 2.5%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            {orderType === 'Dine In' && (
              <div className="d-flex justify-content-between align-items-center text-muted-custom">
                <label className="form-check-label mb-0 cursor-pointer" style={{ fontSize: '11px' }}>
                  <input
                    type="checkbox"
                    className="form-check-input me-1"
                    checked={applyServiceCharge}
                    onChange={(e) => setApplyServiceCharge(e.target.checked)}
                  />
                  Service Charge (5%)
                </label>
                <span>₹{serviceChargeAmount.toFixed(2)}</span>
              </div>
            )}
            {(orderType === 'Takeaway' || orderType === 'Delivery') && hasPackaging && (
              <div className="d-flex justify-content-between align-items-center text-muted-custom">
                <label className="form-check-label mb-0 cursor-pointer" style={{ fontSize: '11px' }}>
                  <input
                    type="checkbox"
                    className="form-check-input me-1"
                    checked={applyPackagingCharge}
                    onChange={(e) => setApplyPackagingCharge(e.target.checked)}
                  />
                  Eco Packaging Fee
                </label>
                <span>₹{packagingFee.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div className="d-flex justify-content-between align-items-center py-2 border-top border-subtle">
            <span className="fw-bold text-navy">Payable Total:</span>
            <span className="fw-bolder fs-5 text-brand">₹{grandTotal.toFixed(2)}</span>
          </div>

          {/* Payment Method Pills */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="small text-muted-custom fw-semibold mb-0" style={{ fontSize: '11px' }}>
                PAYMENT METHOD
              </label>
              {allowSplitPayment && (
                <button
                  type="button"
                  className="btn btn-sm btn-link text-brand p-0 text-decoration-none small"
                  style={{ fontSize: '10px' }}
                  onClick={handleOpenSplitModal}
                >
                  <BiLayer size={12} className="me-1" />
                  Split Payment Mode
                </button>
              )}
            </div>

            <div className="row g-1">
              {[
                { mode: 'UPI' as PaymentMethod, icon: BiQrScan },
                { mode: 'Cash' as PaymentMethod, icon: BiMoney },
                { mode: 'Card' as PaymentMethod, icon: BiCreditCard },
                { mode: 'Online Payment' as PaymentMethod, icon: BiGlobe },
              ].map(({ mode, icon: Icon }) => (
                <div key={mode} className="col-3">
                  <button
                    type="button"
                    className={`btn btn-sm w-100 p-1 d-flex flex-column align-items-center gap-1 rounded-2 ${paymentMethod === mode ? 'btn-brand text-white fw-bold' : 'btn-outline-secondary'
                      }`}
                    style={{ fontSize: '10px' }}
                    onClick={() => setPaymentMethod(mode)}
                  >
                    <Icon size={14} />
                    <span>{mode.split(' ')[0]}</span>
                  </button>
                </div>
              ))}
            </div>

            {paymentMethod === 'Split Payment' && (
              <div className="p-2 mt-2 rounded bg-light border border-subtle small d-flex justify-content-between align-items-center">
                <span>Split: Cash ₹{splitDetails.cashAmount} + UPI ₹{splitDetails.upiAmount}</span>
                <button type="button" className="btn btn-xs btn-link p-0" onClick={handleOpenSplitModal}>Edit</button>
              </div>
            )}
          </div>

          {/* Checkout & Print Buttons */}
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-2.5 d-flex align-items-center justify-content-center"
              onClick={onPrintPreview}
              title="Print Receipt"
            >
              <BiPrinter size={18} />
            </button>
            <button
              type="button"
              className="btn btn-brand flex-grow-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-1 shadow-sm text-white"
              onClick={handleCheckout}
            >
              <BiCheck size={20} />
              <span className="text-truncate">Charge & KOT (₹{grandTotal.toFixed(2)})</span>
            </button>
          </div>
        </div>
      )}

      {/* Split Payment Modal */}
      <Modal
        isOpen={showSplitModal}
        onClose={() => setShowSplitModal(false)}
        title="Split Bill Across Payment Methods"
      >
        <div>
          <div className="p-3 bg-light rounded-3 mb-3 d-flex justify-content-between align-items-center">
            <span className="small text-muted">Total Payable:</span>
            <span className="fs-5 fw-bold text-navy">₹{grandTotal.toFixed(2)}</span>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Cash Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={splitDetails.cashAmount}
              onChange={(e) => setSplitDetails({ ...splitDetails, cashAmount: Number(e.target.value) })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">UPI / QR Code Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={splitDetails.upiAmount}
              onChange={(e) => setSplitDetails({ ...splitDetails, upiAmount: Number(e.target.value) })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Credit / Debit Card Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={splitDetails.cardAmount}
              onChange={(e) => setSplitDetails({ ...splitDetails, cardAmount: Number(e.target.value) })}
            />
          </div>

          <div className="d-flex justify-content-between small text-muted mb-4">
            <span>Entered Total: ₹{splitDetails.cashAmount + splitDetails.upiAmount + splitDetails.cardAmount}</span>
            <span className={splitDetails.cashAmount + splitDetails.upiAmount + splitDetails.cardAmount === grandTotal ? 'text-success fw-bold' : 'text-danger fw-bold'}>
              {splitDetails.cashAmount + splitDetails.upiAmount + splitDetails.cardAmount === grandTotal ? 'Matches Grand Total' : 'Difference: ₹' + (grandTotal - (splitDetails.cashAmount + splitDetails.upiAmount + splitDetails.cardAmount)).toFixed(2)}
            </span>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={() => setShowSplitModal(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-brand"
              onClick={() => {
                setPaymentMethod('Split Payment');
                setShowSplitModal(false);
              }}
            >
              Apply Split
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
