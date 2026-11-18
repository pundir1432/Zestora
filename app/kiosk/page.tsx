'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useHospitality } from '@/context/HospitalityContext';
import { Language } from '@/i18n/translations';
import {
  BiCart,
  BiCheckCircle,
  BiPlus,
  BiMinus,
  BiArrowBack,
  BiQrScan,
  BiCreditCard,
  BiMoney,
  BiStore,
  BiShoppingBag,
  BiTv,
} from 'react-icons/bi';

interface KioskItem {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'Pahadi Specials' | 'Woodfired Pizza' | 'Cafe & Chai' | 'Healthy Bowls';
  price: number;
  veg: boolean;
  image: string;
  variants: { label: string; delta: number }[];
  modifiers: { label: string; price: number }[];
}

const KIOSK_MENU: KioskItem[] = [
  {
    id: 'km-1', nameEn: 'Garhwali Paneer Tikka Platter', nameHi: 'गढ़वाली पनीर टिक्का प्लैटर',
    category: 'Pahadi Specials', price: 320, veg: true,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80',
    variants: [{ label: 'Regular (6 pcs)', delta: 0 }, { label: 'Jumbo (10 pcs)', delta: 140 }],
    modifiers: [{ label: 'Extra Mint Chutney', price: 30 }, { label: 'Less Spicy', price: 0 }, { label: 'Jain (No Onion/Garlic)', price: 0 }],
  },
  {
    id: 'km-2', nameEn: 'Himalayan Woodfired Margherita', nameHi: 'हिमालयन वुडफायर्ड मार्गरिटा पिज़्ज़ा',
    category: 'Woodfired Pizza', price: 420, veg: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80',
    variants: [{ label: '10" Thin Crust', delta: 0 }, { label: '12" Artisanal', delta: 150 }],
    modifiers: [{ label: 'Extra Burrata Cheese', price: 90 }, { label: 'Fresh Basil & Chili Oil', price: 40 }],
  },
  {
    id: 'km-3', nameEn: 'Rishikesh Ginger Lemon Honey Tea', nameHi: 'ऋषिकेश अदरक नींबू शहद चाय',
    category: 'Cafe & Chai', price: 140, veg: true,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80',
    variants: [{ label: 'Single Cup', delta: 0 }, { label: 'Kettle (2 Cups)', delta: 100 }],
    modifiers: [{ label: 'Organic Forest Honey', price: 35 }, { label: 'Extra Ginger', price: 0 }],
  },
  {
    id: 'km-4', nameEn: 'Iced Himalayan Hazelnut Cold Brew', nameHi: 'आइस्ड हेज़लनट कोल्ड ब्रू',
    category: 'Cafe & Chai', price: 240, veg: true,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80',
    variants: [{ label: 'Regular', delta: 0 }, { label: 'Large', delta: 60 }],
    modifiers: [{ label: 'Oat Milk', price: 60 }, { label: 'Double Espresso Shot', price: 70 }],
  },
  {
    id: 'km-5', nameEn: 'Sattvik Yoga Buddha Bowl', nameHi: 'सात्विक योगा बुद्धा बाउल',
    category: 'Healthy Bowls', price: 380, veg: true,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    variants: [{ label: 'Quinoa Base', delta: 0 }, { label: 'Brown Rice Base', delta: 0 }],
    modifiers: [{ label: 'Add Avocado', price: 110 }, { label: 'Roasted Tofu', price: 80 }],
  },
  {
    id: 'km-6', nameEn: 'Royal Garhwali Thali', nameHi: 'शाही गढ़वाली थाली',
    category: 'Pahadi Specials', price: 490, veg: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
    variants: [{ label: 'Classic Thali', delta: 0 }, { label: 'Maharaja Thali + Lassi', delta: 160 }],
    modifiers: [{ label: 'Extra Mandua Roti (2)', price: 60 }, { label: 'Ghee Tadka', price: 40 }],
  },
];

type KioskStep = 'welcome' | 'menu' | 'cart' | 'payment' | 'confirmed';

export default function SelfOrderKioskPage() {
  const { addLiveOrder, activeOutlet } = useHospitality();
  const [step, setStep] = useState<KioskStep>('welcome');
  const [lang, setLang] = useState<Language>('en');
  const [orderType, setOrderType] = useState<'Dine-In' | 'Takeaway'>('Dine-In');
  const [activeCat, setActiveCat] = useState<string>('All');

  // Customization Modal
  const [customItem, setCustomItem] = useState<KioskItem | null>(null);
  const [selVariant, setSelVariant] = useState(0);
  const [selMods, setSelMods] = useState<string[]>([]);
  const [itemNote, setItemNote] = useState('');

  // Cart & Payment
  const [cart, setCart] = useState<{ key: string; name: string; variant: string; modifiers: string[]; notes: string; unitPrice: number; qty: number }[]>([]);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI QR' | 'Card Tap' | 'Pay at Counter'>('UPI QR');
  const [confirmedToken, setConfirmedToken] = useState('');

  const subtotal = cart.reduce((s, c) => s + c.unitPrice * c.qty, 0);
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  const openCustomize = (item: KioskItem) => {
    setCustomItem(item);
    setSelVariant(0);
    setSelMods([]);
    setItemNote('');
  };

  const addCustomizedToCart = () => {
    if (!customItem) return;
    const v = customItem.variants[selVariant];
    const modSum = customItem.modifiers.filter(m => selMods.includes(m.label)).reduce((s, m) => s + m.price, 0);
    const unitPrice = customItem.price + v.delta + modSum;
    const key = `${customItem.id}-${v.label}-${selMods.join(',')}`;
    setCart(prev => {
      const existing = prev.find(c => c.key === key);
      if (existing) {
        return prev.map(c => (c.key === key ? { ...c, qty: c.qty + 1 } : c));
      }
      return [
        ...prev,
        {
          key,
          name: lang === 'hi' ? customItem.nameHi : customItem.nameEn,
          variant: v.label,
          modifiers: selMods,
          notes: itemNote,
          unitPrice,
          qty: 1,
        },
      ];
    });
    setCustomItem(null);
  };

  const completeOrder = () => {
    const token = `K-${Math.floor(20 + Math.random() * 75)}`;
    addLiveOrder({
      tokenNumber: token,
      orderNumber: `KSK-${Math.floor(1000 + Math.random() * 8999)}`,
      customerShortName: guestName.trim() || 'Kiosk Guest',
      orderType: 'Kiosk',
      sourceLabel: `Kiosk #1 • ${orderType}`,
      stage: 'NEW',
      priority: 'Normal',
      items: cart.map(c => ({ name: c.name, qty: c.qty, variant: c.variant, modifiers: c.modifiers, notes: c.notes })),
      totalAmount: grandTotal,
    });
    setConfirmedToken(token);
    setStep('confirmed');
  };

  const resetKiosk = () => {
    setCart([]);
    setGuestName('');
    setGuestPhone('');
    setConfirmedToken('');
    setStep('welcome');
  };

  // STEP 1: Touch-First Welcome & Language Selection
  if (step === 'welcome') {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-between p-4 text-white"
        style={{ background: 'linear-gradient(155deg, #18263B 0%, #0F172A 65%, #2B1810 100%)' }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-3 bg-brand text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', fontSize: '22px' }}>
              Z
            </div>
            <div>
              <div className="fw-bold fs-4 lh-1">ZEST<span className="text-brand">ORA</span> KIOSK</div>
              <div className="text-white-50 small">{activeOutlet.name} • Rishikesh</div>
            </div>
          </div>
          <Link href="/owner/dashboard" className="btn btn-sm btn-outline-light">
            Exit Kiosk (Staff)
          </Link>
        </div>

        <div className="text-center my-auto py-5 mx-auto" style={{ maxWidth: '680px' }}>
          <span className="badge bg-brand text-white rounded-pill px-4 py-2 mb-3 fs-6">
            TOUCH SELF-ORDER TERMINAL
          </span>
          <h1 className="display-4 fw-bolder mb-3">
            {lang === 'en' ? 'Fresh Himalayan Kitchen, Zero Queue' : 'ताज़ा हिमालयन स्वाद, बिना इंतज़ार'}
          </h1>
          <p className="fs-5 text-white-50 mb-4">
            {lang === 'en' ? 'Choose language & dining mode to start ordering' : 'ऑर्डर शुरू करने के लिए भाषा और विकल्प चुनें'}
          </p>

          {/* Language Selection */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`btn btn-lg px-5 py-3 rounded-4 fw-bold ${lang === 'en' ? 'btn-brand text-white shadow-lg' : 'btn-outline-light'}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`btn btn-lg px-5 py-3 rounded-4 fw-bold ${lang === 'hi' ? 'btn-brand text-white shadow-lg' : 'btn-outline-light'}`}
            >
              हिंदी (Hindi)
            </button>
          </div>

          {/* Dine-in vs Takeaway Big Touch Cards */}
          <div className="row g-3 mt-2">
            <div className="col-6">
              <button
                type="button"
                onClick={() => {
                  setOrderType('Dine-In');
                  setStep('menu');
                }}
                className="btn w-100 p-4 rounded-4 text-white fw-bold fs-4 d-flex flex-column align-items-center gap-2 shadow-lg"
                style={{ backgroundColor: '#F47B35', border: 'none' }}
              >
                <BiStore size={42} />
                <span>{lang === 'en' ? 'Dine-In Here' : 'यहीं खाएं'}</span>
              </button>
            </div>
            <div className="col-6">
              <button
                type="button"
                onClick={() => {
                  setOrderType('Takeaway');
                  setStep('menu');
                }}
                className="btn w-100 p-4 rounded-4 text-white fw-bold fs-4 d-flex flex-column align-items-center gap-2 shadow-lg"
                style={{ backgroundColor: '#1E293B', border: '2px solid rgba(255,255,255,0.2)' }}
              >
                <BiShoppingBag size={42} className="text-brand" />
                <span>{lang === 'en' ? 'Takeaway / Pack' : 'पैक कराएं'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-white-50 small">
          Live connected to Kitchen Display (KDS) &amp; Order Ready Board TV
        </div>
      </div>
    );
  }

  // STEP 5: Order Confirmation Screen with Huge Token Number
  if (step === 'confirmed') {
    return (
      <div className="min-vh-100 bg-navy text-white d-flex flex-column align-items-center justify-content-center p-4 text-center">
        <div className="rounded-circle bg-success bg-opacity-25 text-success p-4 mb-3">
          <BiCheckCircle size={72} />
        </div>
        <h2 className="fw-bold mb-1">{lang === 'en' ? 'Order Sent to Kitchen!' : 'आपका ऑर्डर किचन में भेज दिया गया!'}</h2>
        <p className="text-white-50 fs-5 mb-4">
          {lang === 'en' ? 'Watch your token number on the Order Ready Board TV' : 'कृपया ऑर्डर रेडी बोर्ड टीवी पर अपना टोकन नंबर देखें'}
        </p>

        <div className="rounded-4 px-5 py-4 mb-4 shadow-lg" style={{ backgroundColor: '#F47B35' }}>
          <div className="text-uppercase fw-semibold small text-white-50">
            {lang === 'en' ? 'YOUR TOKEN NUMBER' : 'आपका टोकन नंबर'}
          </div>
          <div className="display-1 fw-bolder text-white">#{confirmedToken}</div>
          <div className="fw-semibold">{orderType} &bull; ₹{grandTotal} ({paymentMethod})</div>
        </div>

        <div className="d-flex gap-3 flex-wrap justify-content-center">
          <button type="button" onClick={resetKiosk} className="btn btn-light btn-lg fw-bold px-4 rounded-pill">
            {lang === 'en' ? 'Start New Order' : 'नया ऑर्डर करें'}
          </button>
          <Link href="/ready-board" className="btn btn-outline-light btn-lg fw-bold px-4 rounded-pill d-flex align-items-center gap-2">
            <BiTv size={22} /> View Live Ready Board
          </Link>
        </div>
      </div>
    );
  }

  // STEPS 2, 3, 4: Menu, Cart, Payment
  const categories = ['All', 'Pahadi Specials', 'Woodfired Pizza', 'Cafe & Chai', 'Healthy Bowls'];
  const visibleItems = activeCat === 'All' ? KIOSK_MENU : KIOSK_MENU.filter(i => i.category === activeCat);

  return (
    <div className="min-vh-100 bg-surface d-flex flex-column">
      {/* Kiosk Top Bar */}
      <header className="bg-navy text-white px-4 py-3 d-flex align-items-center justify-content-between sticky-top shadow">
        <div className="d-flex align-items-center gap-3">
          <button type="button" onClick={() => setStep(step === 'menu' ? 'welcome' : 'menu')} className="btn btn-outline-light btn-sm">
            <BiArrowBack size={18} />
          </button>
          <div>
            <div className="fw-bold fs-5">ZEST<span className="text-brand">ORA</span> Self-Order</div>
            <div className="text-white-50 small">{orderType} &bull; {activeOutlet.name}</div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button type="button" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="btn btn-sm btn-outline-light">
            {lang === 'en' ? 'हिंदी' : 'EN'}
          </button>
          <button
            type="button"
            onClick={() => setStep('cart')}
            className="btn btn-brand text-white fw-bold px-3 py-2 d-flex align-items-center gap-2"
          >
            <BiCart size={20} />
            <span>{cart.reduce((s, c) => s + c.qty, 0)} Items &bull; ₹{grandTotal}</span>
          </button>
        </div>
      </header>

      <main className="container py-4 flex-grow-1">
        {step === 'menu' && (
          <>
            {/* Large Touch Categories */}
            <div className="d-flex gap-2 flex-wrap mb-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  className={`btn btn-lg rounded-pill px-4 fw-semibold ${
                    activeCat === cat ? 'btn-brand text-white shadow' : 'btn-white bg-white border text-navy'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="row g-4">
              {visibleItems.map(item => (
                <div key={item.id} className="col-12 col-sm-6 col-lg-4">
                  <div className="app-card overflow-hidden h-100 d-flex flex-column">
                    <img src={item.image} alt={item.nameEn} style={{ height: '190px', width: '100%', objectFit: 'cover' }} />
                    <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
                      <div>
                        <span className="badge badge-soft-success mb-1">100% Veg</span>
                        <h5 className="fw-bold text-navy mb-1">{lang === 'hi' ? item.nameHi : item.nameEn}</h5>
                        <div className="text-muted-custom small mb-2">{item.category}</div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                        <span className="fs-4 fw-bolder text-navy">₹{item.price}</span>
                        <button
                          type="button"
                          onClick={() => openCustomize(item)}
                          className="btn btn-brand text-white fw-bold px-4 py-2 rounded-pill"
                        >
                          + {lang === 'en' ? 'Customize' : 'चुनें'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 'cart' && (
          <div className="mx-auto" style={{ maxWidth: '680px' }}>
            <div className="app-card p-4">
              <h4 className="fw-bold text-navy mb-3">{lang === 'en' ? 'Your Order Tray' : 'आपकी ऑर्डर ट्रे'}</h4>
              {cart.length === 0 ? (
                <div className="text-center py-4 text-muted-custom">Your tray is empty. Go back to add items.</div>
              ) : (
                <>
                  <div className="d-flex flex-column gap-3 mb-4">
                    {cart.map(c => (
                      <div key={c.key} className="p-3 rounded-3 bg-surface d-flex align-items-center justify-content-between gap-2">
                        <div>
                          <div className="fw-bold text-navy">{c.name}</div>
                          <div className="text-muted-custom small">
                            {c.variant} {c.modifiers.length > 0 && `• ${c.modifiers.join(', ')}`}
                          </div>
                          {c.notes && <div className="text-brand small">Note: {c.notes}</div>}
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <div className="btn-group">
                            <button
                              type="button"
                              onClick={() =>
                                setCart(prev =>
                                  prev
                                    .map(x => (x.key === c.key ? { ...x, qty: x.qty - 1 } : x))
                                    .filter(x => x.qty > 0)
                                )
                              }
                              className="btn btn-outline-secondary btn-sm"
                            >
                              <BiMinus />
                            </button>
                            <span className="btn btn-light btn-sm fw-bold">{c.qty}</span>
                            <button
                              type="button"
                              onClick={() => setCart(prev => prev.map(x => (x.key === c.key ? { ...x, qty: x.qty + 1 } : x)))}
                              className="btn btn-outline-secondary btn-sm"
                            >
                              <BiPlus />
                            </button>
                          </div>
                          <span className="fw-bold text-navy">₹{c.unitPrice * c.qty}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="row g-2 mb-4">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-navy">Your Name (for Ready Board)</label>
                      <input
                        className="form-control form-control-lg"
                        placeholder="e.g., Rahul / Elena"
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-navy">Mobile (Optional SMS/WhatsApp)</label>
                      <input
                        className="form-control form-control-lg"
                        placeholder="+91 98..."
                        value={guestPhone}
                        onChange={e => setGuestPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="border-top pt-3 mb-4">
                    <div className="d-flex justify-content-between mb-1"><span>Subtotal</span><strong>₹{subtotal}</strong></div>
                    <div className="d-flex justify-content-between mb-2"><span>GST (5%)</span><strong>₹{gst}</strong></div>
                    <div className="d-flex justify-content-between fs-4 fw-bolder text-navy"><span>Total Payable</span><span className="text-brand">₹{grandTotal}</span></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="btn btn-brand btn-lg w-100 text-white fw-bold py-3 rounded-4"
                  >
                    {lang === 'en' ? 'Proceed to Payment' : 'भुगतान के लिए आगे बढ़ें'} &rarr;
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="mx-auto" style={{ maxWidth: '580px' }}>
            <div className="app-card p-4 text-center">
              <h4 className="fw-bold text-navy mb-2">Select Payment Method</h4>
              <p className="text-muted-custom mb-4">Amount to Pay: <strong className="text-brand fs-4">₹{grandTotal}</strong></p>

              <div className="row g-3 mb-4">
                {[
                  { id: 'UPI QR' as const, icon: BiQrScan, label: 'Scan UPI QR' },
                  { id: 'Card Tap' as const, icon: BiCreditCard, label: 'Tap Card / NFC' },
                  { id: 'Pay at Counter' as const, icon: BiMoney, label: 'Pay at Counter' },
                ].map(pm => {
                  const Icon = pm.icon;
                  return (
                    <div key={pm.id} className="col-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`btn w-100 p-3 rounded-4 d-flex flex-column align-items-center gap-2 ${
                          paymentMethod === pm.id ? 'btn-brand text-white shadow' : 'btn-outline-secondary bg-white text-navy'
                        }`}
                      >
                        <Icon size={32} />
                        <span className="fw-bold small">{pm.label}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={completeOrder}
                className="btn btn-success btn-lg w-100 fw-bold py-3 rounded-4"
              >
                Confirm &amp; Generate Order Token (Mock Payment)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Touch Customization Modal */}
      {customItem && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 overflow-hidden">
              <div className="modal-header bg-navy text-white">
                <h5 className="modal-title fw-bold">{lang === 'hi' ? customItem.nameHi : customItem.nameEn}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setCustomItem(null)} />
              </div>
              <div className="modal-body p-4">
                <h6 className="fw-bold text-navy mb-2">Choose Size / Variant</h6>
                <div className="d-flex flex-column gap-2 mb-3">
                  {customItem.variants.map((v, idx) => (
                    <button
                      key={v.label}
                      type="button"
                      onClick={() => setSelVariant(idx)}
                      className={`btn text-start d-flex justify-content-between ${
                        selVariant === idx ? 'btn-brand text-white fw-bold' : 'btn-outline-secondary'
                      }`}
                    >
                      <span>{v.label}</span>
                      <span>₹{customItem.price + v.delta}</span>
                    </button>
                  ))}
                </div>

                <h6 className="fw-bold text-navy mb-2">Add-ons &amp; Modifiers</h6>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {customItem.modifiers.map(m => {
                    const active = selMods.includes(m.label);
                    return (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() =>
                          setSelMods(prev => (prev.includes(m.label) ? prev.filter(x => x !== m.label) : [...prev, m.label]))
                        }
                        className={`btn btn-sm rounded-pill ${active ? 'btn-dark text-white' : 'btn-outline-secondary'}`}
                      >
                        {m.label} {m.price > 0 && `(+₹${m.price})`}
                      </button>
                    );
                  })}
                </div>

                <label className="form-label small fw-semibold text-navy">Special Kitchen Instructions</label>
                <input
                  className="form-control"
                  placeholder="e.g., No coriander, extra hot..."
                  value={itemNote}
                  onChange={e => setItemNote(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setCustomItem(null)} className="btn btn-outline-secondary">Cancel</button>
                <button type="button" onClick={addCustomizedToCart} className="btn btn-brand text-white fw-bold px-4">
                  Add to Tray
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
