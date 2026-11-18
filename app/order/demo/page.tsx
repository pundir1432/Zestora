'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useHospitality } from '@/context/HospitalityContext';
import { SAMPLE_STORE_BRANDING, SAMPLE_MENU_ITEMS } from '@/data/saasData';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiRestaurant,
  BiShoppingBag,
  BiCycling,
  BiSearch,
  BiPlus,
  BiMinus,
  BiCheck,
  BiTimeFive,
  BiPhone,
  BiMapPin,
  BiReceipt,
  BiCheckCircle,
  BiArrowBack,
  BiQrScan,
} from 'react-icons/bi';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
}

export default function CustomerOrderDemoPage() {
  const { addLiveOrder } = useHospitality();
  const [store] = useState(SAMPLE_STORE_BRANDING);
  const [menuItems] = useState(SAMPLE_MENU_ITEMS);

  // Ordering mode: 'Dine In' | 'Takeaway' | 'Delivery'
  const [fulfillmentMode, setFulfillmentMode] = useState<'Dine In' | 'Takeaway' | 'Delivery'>('Dine In');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [deliveryAddress, setDeliveryAddress] = useState('Indiranagar 12th Main, Bengaluru');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([
    { id: 'mi-1', name: 'Hyderabadi Chicken Dum Biryani', price: 380, quantity: 1, isVeg: false },
    { id: 'mi-3', name: 'Butter Garlic Naan', price: 85, quantity: 2, isVeg: true },
  ]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Checkout & Tracking
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [guestName, setGuestName] = useState('Ananya Sharma');
  const [guestPhone, setGuestPhone] = useState('+91 98451 22334');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash'>('UPI');
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  // Filtered menu
  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchVeg = isVegOnly ? item.isVeg : true;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchVeg && matchSearch;
    });
  }, [menuItems, selectedCategory, isVegOnly, searchQuery]);

  const categories = useMemo(() => {
    const setCats = new Set<string>();
    menuItems.forEach((m) => setCats.add(m.category));
    return ['All', ...Array.from(setCats)];
  }, [menuItems]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, it) => acc + it.price * it.quantity, 0);
  }, [cart]);

  const gstAmount = Math.round(cartSubtotal * 0.05);
  const deliveryFee = fulfillmentMode === 'Delivery' ? store.deliveryFee : 0;
  const grandTotal = Math.max(0, cartSubtotal + gstAmount + deliveryFee - appliedDiscount);

  const handleAddToCart = (dish: any) => {
    setCart((prev) => {
      const existing = prev.find((it) => it.id === dish.id);
      if (existing) {
        return prev.map((it) =>
          it.id === dish.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      } else {
        return [
          ...prev,
          { id: dish.id, name: dish.name, price: dish.price, quantity: 1, isVeg: dish.isVeg },
        ];
      }
    });
  };

  const handleRemoveOne = (dishId: string) => {
    setCart((prev) => {
      const existing = prev.find((it) => it.id === dishId);
      if (existing && existing.quantity > 1) {
        return prev.map((it) =>
          it.id === dishId ? { ...it, quantity: it.quantity - 1 } : it
        );
      } else {
        return prev.filter((it) => it.id !== dishId);
      }
    });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'WELCOME50' || couponCode.toUpperCase() === 'CELEBRATE20') {
      const discount = Math.min(150, Math.round(cartSubtotal * 0.2));
      setAppliedDiscount(discount);
      alert(`Coupon ${couponCode.toUpperCase()} applied! Saved ₹${discount}`);
    } else {
      alert('Invalid coupon code. Try WELCOME50 or CELEBRATE20.');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const tokenNum = `QR-${Math.floor(10 + Math.random() * 89)}`;
    const ordNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = {
      orderNumber: ordNum,
      guestName,
      guestPhone,
      fulfillmentMode,
      location: fulfillmentMode === 'Dine In' ? tableNumber : deliveryAddress,
      items: [...cart],
      grandTotal,
      paymentMethod,
      time: 'Just now',
    };
    addLiveOrder({
      tokenNumber: tokenNum,
      orderNumber: ordNum,
      customerShortName: guestName || 'QR Guest',
      orderType: 'QR Web',
      sourceLabel: fulfillmentMode === 'Dine In' ? `QR ${tableNumber}` : `QR ${fulfillmentMode}`,
      stage: 'NEW',
      priority: 'Normal',
      items: cart.map(c => ({ name: c.name, qty: c.quantity })),
      totalAmount: grandTotal,
    });
    setConfirmedOrder(orderData);
    setShowCheckoutModal(false);
    setCart([]);
  };

  return (
    <div className="bg-light min-vh-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top Brand Hero */}
      <div
        className="position-relative text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(24, 38, 59, 0.82), rgba(24, 38, 59, 0.94)), url(${store.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '40px 0 24px 0',
        }}
      >
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center gap-4">
            <img
              src={store.logo}
              alt={store.storeName}
              width={90}
              height={90}
              className="rounded-circle shadow border border-3 border-white object-fit-cover"
            />
            <div className="text-center text-md-start flex-grow-1">
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start align-items-center gap-2 mb-1">
                <h2 className="fw-bold mb-0">{store.storeName}</h2>
                <span className="badge bg-success-subtle text-success border border-success-subtle">
                  ● Kitchen Active & Accepting Orders
                </span>
              </div>
              <p className="text-light opacity-75 small mb-2">{store.tagline}</p>
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 small text-light opacity-80">
                <span><BiMapPin /> {store.address}</span>
                <span>•</span>
                <span><BiPhone /> {store.phone}</span>
                <span>•</span>
                <span><BiTimeFive /> ~{store.estimatedDeliveryMins} mins prep</span>
              </div>
            </div>
            <div className="text-center">
              <Link href="/owner/dashboard" className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1">
                <BiArrowBack /> Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Bar */}
      {store.announcementText && (
        <div className="bg-warning-subtle text-warning-emphasis py-2 px-3 text-center small fw-semibold border-bottom">
          {store.announcementText}
        </div>
      )}

      {/* Live Order Confirmation View */}
      {confirmedOrder ? (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card border-0 shadow rounded-4 text-center p-4 p-md-5 bg-white">
                <div className="p-3 bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px' }}>
                  <BiCheckCircle size={40} />
                </div>
                <h3 className="fw-bold text-dark mb-1">Order Placed Successfully!</h3>
                <p className="text-muted small mb-3">
                  Your order <strong>{confirmedOrder.orderNumber}</strong> has been routed directly to the kitchen display screen.
                </p>

                {/* Progress Stepper */}
                <div className="p-3 bg-light rounded-3 my-3 text-start small">
                  <div className="fw-bold text-dark mb-2">Live Kitchen Preparation Tracker:</div>
                  <div className="d-flex align-items-center gap-2 mb-2 text-success fw-semibold">
                    <BiCheckCircle /> 1. Order Received & KOT Printed
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2 text-primary fw-semibold">
                    <div className="spinner-border spinner-border-sm" role="status"></div> 2. Chef preparing your meal at station
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <span className="badge bg-secondary-subtle text-dark border">3</span> 3. Quality Check & Serving ({confirmedOrder.fulfillmentMode === 'Dine In' ? confirmedOrder.location : 'Dispatched to Delivery Runner'})
                  </div>
                </div>

                <div className="list-group list-group-flush border rounded-3 mb-4 text-start small">
                  <div className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Guest</span>
                    <span className="fw-semibold">{confirmedOrder.guestName} ({confirmedOrder.guestPhone})</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Fulfillment</span>
                    <span className="fw-semibold">{confirmedOrder.fulfillmentMode} - {confirmedOrder.location}</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Amount Paid</span>
                    <span className="fw-bold text-primary" suppressHydrationWarning>₹{formatNumber(confirmedOrder.grandTotal)} via {confirmedOrder.paymentMethod}</span>
                  </div>
                </div>

                <button
                  className="btn btn-primary rounded-pill py-2"
                  onClick={() => setConfirmedOrder(null)}
                >
                  <BiPlus /> Order More Dishes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Main Catalog & Cart View */
        <div className="container py-4">
          <div className="row g-4">
            {/* Left 8 Cols: Menu and Filters */}
            <div className="col-12 col-lg-8">
              {/* Fulfillment Switcher */}
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-3">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div className="btn-group btn-group-sm flex-wrap">
                    {(['Dine In', 'Takeaway', 'Delivery'] as const).map((mode) => (
                      <button
                        key={mode}
                        className={`btn ${
                          fulfillmentMode === mode ? 'btn-primary' : 'btn-outline-secondary'
                        }`}
                        onClick={() => setFulfillmentMode(mode)}
                      >
                        {mode === 'Dine In' && <BiRestaurant className="me-1" />}
                        {mode === 'Takeaway' && <BiShoppingBag className="me-1" />}
                        {mode === 'Delivery' && <BiCycling className="me-1" />}
                        {mode}
                      </button>
                    ))}
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {fulfillmentMode === 'Dine In' ? (
                      <span className="badge bg-light text-dark border px-2 py-1">
                        <BiQrScan className="me-1 text-primary" /> Table: <strong>{tableNumber}</strong>
                      </span>
                    ) : (
                      <span className="text-muted small">
                        {fulfillmentMode === 'Delivery' ? 'Delivery to Doorstep' : 'Pickup at Counter'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Search & Veg Toggle */}
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-3">
                <div className="row g-2 align-items-center">
                  <div className="col-12 col-md-8">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <BiSearch />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search for biryani, pizza, beverage..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4 d-flex justify-content-md-end">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isVegOnly}
                        onChange={(e) => setIsVegOnly(e.target.checked)}
                      />
                      <label className="form-check-label small fw-semibold">
                        🟢 Veg Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              <div className="d-flex gap-2 overflow-auto pb-2 mb-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${
                      selectedCategory === cat ? 'btn-primary' : 'btn-white border bg-white'
                    }`}
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Dishes Grid */}
              <div className="row g-3">
                {filteredMenu.map((dish) => {
                  const inCartItem = cart.find((c) => c.id === dish.id);
                  return (
                    <div key={dish.id} className="col-12 col-md-6">
                      <div className="card border-0 shadow-sm rounded-3 bg-white h-100 d-flex flex-column overflow-hidden">
                        <div className="row g-0 flex-grow-1">
                          <div className="col-8 p-3 d-flex flex-column justify-content-between">
                            <div>
                              <div className="d-flex align-items-center gap-1 mb-1">
                                <span style={{ fontSize: '12px' }}>
                                  {dish.isVeg ? '🟢' : '🔴'}
                                </span>
                                <span className="badge bg-light text-muted border" style={{ fontSize: '10px' }}>
                                  {dish.category}
                                </span>
                              </div>
                              <h6 className="fw-bold text-dark mb-1">{dish.name}</h6>
                              <p className="text-muted small mb-2" style={{ fontSize: '12px' }}>
                                {dish.description}
                              </p>
                            </div>
                            <div className="fw-bold text-dark fs-6" suppressHydrationWarning>
                              ₹{formatNumber(dish.price)}
                            </div>
                          </div>
                          <div className="col-4 p-2 d-flex flex-column align-items-center justify-content-center position-relative">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="rounded-3 w-100 object-fit-cover shadow-sm"
                              style={{ height: '100px' }}
                            />
                            <div className="mt-2">
                              {inCartItem ? (
                                <div className="btn-group btn-group-sm border rounded shadow-sm bg-white">
                                  <button
                                    className="btn btn-light py-0 px-2 text-danger fw-bold"
                                    onClick={() => handleRemoveOne(dish.id)}
                                  >
                                    -
                                  </button>
                                  <span className="btn btn-light py-0 px-2 fw-bold text-primary disabled">
                                    {inCartItem.quantity}
                                  </span>
                                  <button
                                    className="btn btn-light py-0 px-2 text-success fw-bold"
                                    onClick={() => handleAddToCart(dish)}
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1 fw-semibold shadow-sm"
                                  onClick={() => handleAddToCart(dish)}
                                >
                                  ADD +
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 4 Cols: Sticky Order Cart */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 bg-white sticky-top" style={{ top: '20px' }}>
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0 text-dark">Your Order Cart</h5>
                  <span className="badge bg-light text-dark border">
                    {cart.reduce((a, b) => a + b.quantity, 0)} Items
                  </span>
                </div>
                <div className="card-body p-3">
                  {cart.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <div className="fs-1 mb-2">🍽️</div>
                      <p className="small mb-0">Your cart is empty. Add delicious items from the menu!</p>
                    </div>
                  ) : (
                    <div>
                      {/* Cart line items */}
                      <div className="mb-3" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                        {cart.map((item) => (
                          <div key={item.id} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom small">
                            <div>
                              <div className="fw-semibold text-dark">{item.name}</div>
                              <div className="text-muted" suppressHydrationWarning>₹{formatNumber(item.price)} each</div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <div className="btn-group btn-group-sm border rounded">
                                <button
                                  className="btn btn-light py-0 px-1"
                                  onClick={() => handleRemoveOne(item.id)}
                                >
                                  -
                                </button>
                                <span className="btn btn-light py-0 px-2 fw-bold disabled">
                                  {item.quantity}
                                </span>
                                <button
                                  className="btn btn-light py-0 px-1"
                                  onClick={() =>
                                    setCart((prev) =>
                                      prev.map((it) =>
                                        it.id === item.id ? { ...it, quantity: it.quantity + 1 } : it
                                      )
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                              <span className="fw-bold text-dark" style={{ minWidth: '55px', textAlign: 'right' }} suppressHydrationWarning>
                                ₹{formatNumber(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Promo Code Input */}
                      <form onSubmit={handleApplyCoupon} className="mb-3">
                        <div className="input-group input-group-sm">
                          <input
                            type="text"
                            className="form-control text-uppercase font-monospace"
                            placeholder="Promo Code (e.g. WELCOME50)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                          <button type="submit" className="btn btn-outline-primary">
                            Apply
                          </button>
                        </div>
                      </form>

                      {/* Price breakdown */}
                      <div className="list-group list-group-flush small mb-3">
                        <div className="list-group-item d-flex justify-content-between px-0 py-1 border-0">
                          <span className="text-muted">Item Subtotal</span>
                          <span className="fw-semibold" suppressHydrationWarning>₹{formatNumber(cartSubtotal)}</span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between px-0 py-1 border-0">
                          <span className="text-muted">Restaurant GST (5%)</span>
                          <span suppressHydrationWarning>₹{formatNumber(gstAmount)}</span>
                        </div>
                        {fulfillmentMode === 'Delivery' && (
                          <div className="list-group-item d-flex justify-content-between px-0 py-1 border-0">
                            <span className="text-muted">Direct Delivery Fee</span>
                            <span suppressHydrationWarning>₹{formatNumber(deliveryFee)}</span>
                          </div>
                        )}
                        {appliedDiscount > 0 && (
                          <div className="list-group-item d-flex justify-content-between px-0 py-1 border-0 text-success">
                            <span>Promo Discount</span>
                            <span suppressHydrationWarning>-₹{formatNumber(appliedDiscount)}</span>
                          </div>
                        )}
                        <div className="list-group-item d-flex justify-content-between px-0 py-2 border-top mt-1 fw-bold fs-6 text-dark">
                          <span>Grand Total</span>
                          <span className="text-primary" suppressHydrationWarning>₹{formatNumber(grandTotal)}</span>
                        </div>
                      </div>

                      {/* Checkout button */}
                      <button
                        className="btn btn-primary w-100 py-2 fw-semibold d-flex justify-content-between align-items-center"
                        onClick={() => setShowCheckoutModal(true)}
                      >
                        <span suppressHydrationWarning>₹{formatNumber(grandTotal)}</span>
                        <span>Proceed to Order &rarr;</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Customer Checkout */}
      {showCheckoutModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handlePlaceOrder}>
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold">Confirm & Send to Kitchen</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCheckoutModal(false)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Your Name *</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Mobile Number (For WhatsApp Bill) *</label>
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                    />
                  </div>

                  {fulfillmentMode === 'Dine In' ? (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Table Number</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                      />
                    </div>
                  ) : fulfillmentMode === 'Delivery' ? (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Delivery Address</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                      ></textarea>
                    </div>
                  ) : null}

                  <div className="mb-0">
                    <label className="form-label small fw-semibold">Payment Mode</label>
                    <div className="d-flex gap-2">
                      {(['UPI', 'Card', 'Cash'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          className={`btn btn-sm flex-fill ${
                            paymentMethod === mode ? 'btn-primary' : 'btn-outline-secondary'
                          }`}
                          onClick={() => setPaymentMethod(mode)}
                        >
                          {mode === 'UPI' ? 'UPI (GPay / PhonePe)' : mode === 'Card' ? 'Card at Counter' : 'Cash on Service'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowCheckoutModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-4">
                    Place Order (₹{grandTotal})
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
