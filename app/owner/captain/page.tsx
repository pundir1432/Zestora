'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { SAMPLE_MENU_ITEMS } from '@/data/menuData';
import { BiUserCheck, BiCheckCircle, BiPlus, BiMinus, BiSend, BiHotel } from 'react-icons/bi';

const TABLES = [
  { id: 'T-01', zone: 'Ganga Terrace', status: 'Available', guests: 0 },
  { id: 'T-02', zone: 'Ganga Terrace', status: 'Occupied', guests: 4 },
  { id: 'T-03', zone: 'Ganga Terrace', status: 'Occupied', guests: 2 },
  { id: 'T-04', zone: 'Indoor Cafe', status: 'Available', guests: 0 },
  { id: 'T-05', zone: 'Indoor Cafe', status: 'Ready to Serve', guests: 3 },
  { id: 'T-06', zone: 'Family Deck', status: 'Occupied', guests: 5 },
  { id: 'RM-101', zone: 'Room Service', status: 'In-House Guest', guests: 1 },
  { id: 'RM-201', zone: 'Room Service', status: 'In-House Guest', guests: 2 },
];

export default function CaptainAppPage() {
  const { addLiveOrder, readyBoardOrders, advanceOrderStage, folios, postChargeToFolio } = useHospitality();
  const [selectedTable, setSelectedTable] = useState(TABLES[0].id);
  const [search, setSearch] = useState('');
  const [kotNote, setKotNote] = useState('');
  const [cart, setCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [toast, setToast] = useState('');

  const quickMenu = SAMPLE_MENU_ITEMS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 12);

  const addItem = (id: string, name: string, price: number) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === id);
      if (ex) return prev.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id, name, price, qty: 1 }];
    });
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const fireKot = (postToFolio: boolean) => {
    if (cart.length === 0) return;
    const token = String(Math.floor(110 + Math.random() * 88));
    addLiveOrder({
      tokenNumber: token,
      orderNumber: `CAP-${token}`,
      customerShortName: selectedTable.startsWith('RM-') ? `Guest ${selectedTable}` : `Table ${selectedTable}`,
      orderType: selectedTable.startsWith('RM-') ? 'Room Service' : 'Dine-In',
      sourceLabel: selectedTable,
      stage: 'NEW',
      priority: 'Normal',
      items: cart.map(c => ({ name: c.name, qty: c.qty, notes: kotNote || undefined })),
      totalAmount: total,
    });

    if (postToFolio && folios.length > 0) {
      const targetFolio = selectedTable === 'RM-201' ? folios[1] || folios[0] : folios[0];
      postChargeToFolio(targetFolio.id, {
        date: 'Just now',
        category: 'Restaurant',
        description: `Captain Order #CAP-${token} (${cart.map(c => `${c.qty}x ${c.name}`).join(', ')})`,
        referenceNo: `CAP-${token}`,
        amount: total,
        gstRate: 5,
        gstAmount: Math.round(total * 0.05),
        postedBy: 'Captain App',
      });
    }

    setCart([]);
    setKotNote('');
    setToast(`KOT #${token} fired to Kitchen KDS${postToFolio ? ' & posted to Guest Folio' : ''}!`);
    setTimeout(() => setToast(''), 3500);
  };

  const readyToServe = readyBoardOrders.filter(o => o.stage === 'READY');

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'waiter']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <BiUserCheck className="text-brand" /> Captain App (Table-Side KOT Ordering)
          </h3>
          <p className="text-muted-custom small mb-0">
            Mobile &amp; tablet steward interface — tap table, add items, fire KOT straight to KDS &amp; Ready Board
          </p>
        </div>
        {toast && <span className="badge bg-success text-white px-3 py-2">{toast}</span>}
      </div>

      {/* Ready-to-Serve Alert Banner */}
      {readyToServe.length > 0 && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 rounded-4 p-3 mb-4">
          <div className="fw-bold text-success small mb-2">Ready in Kitchen — Pick Up &amp; Serve ({readyToServe.length})</div>
          <div className="d-flex gap-2 flex-wrap">
            {readyToServe.map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => advanceOrderStage(o.id, 'SERVED')}
                className="btn btn-sm btn-success text-white fw-semibold d-flex align-items-center gap-1"
              >
                <BiCheckCircle /> #{o.tokenNumber} ({o.sourceLabel}) — Mark Served
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="row g-3">
        {/* Left: Tables & Menu */}
        <div className="col-12 col-lg-8">
          <div className="app-card p-3 mb-3">
            <div className="fw-bold text-navy small mb-2">1. Select Table or Room Service</div>
            <div className="row g-2">
              {TABLES.map(tb => (
                <div key={tb.id} className="col-6 col-sm-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTable(tb.id)}
                    className={`btn w-100 text-start p-2.5 rounded-3 border ${
                      selectedTable === tb.id ? 'btn-brand text-white border-brand shadow-sm' : 'bg-surface text-navy border-subtle'
                    }`}
                  >
                    <div className="fw-bold">{tb.id}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{tb.zone}</div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="app-card p-3">
            <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
              <span className="fw-bold text-navy small">2. Tap Menu Items</span>
              <input
                className="form-control form-control-sm"
                style={{ maxWidth: '220px' }}
                placeholder="Search dishes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="row g-2">
              {quickMenu.map(item => (
                <div key={item.id} className="col-6 col-md-4">
                  <button
                    type="button"
                    onClick={() => addItem(item.id, item.name, item.price)}
                    className="btn w-100 h-100 text-start p-2.5 rounded-3 bg-surface border border-subtle"
                  >
                    <div className="fw-semibold text-navy small text-truncate">{item.name}</div>
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <span className="text-muted-custom" style={{ fontSize: '10px' }}>{item.category}</span>
                      <span className="fw-bold text-brand small">₹{item.price}</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active KOT Tray */}
        <div className="col-12 col-lg-4">
          <div className="app-card p-3 sticky-top" style={{ top: '86px' }}>
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
              <div>
                <h6 className="fw-bold text-navy mb-0">KOT Draft • {selectedTable}</h6>
                <span className="text-muted-custom" style={{ fontSize: '11px' }}>Direct to Kitchen KDS</span>
              </div>
              <span className="badge badge-soft-brand">{cart.reduce((s, c) => s + c.qty, 0)} items</span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center text-muted-custom small py-4">Tap menu items to build KOT</div>
            ) : (
              <div className="d-flex flex-column gap-2 mb-3">
                {cart.map(c => (
                  <div key={c.id} className="d-flex align-items-center justify-content-between bg-surface p-2 rounded-2">
                    <div className="overflow-hidden me-2">
                      <div className="small fw-semibold text-navy text-truncate">{c.name}</div>
                      <div className="text-muted-custom" style={{ fontSize: '11px' }}>₹{c.price * c.qty}</div>
                    </div>
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        onClick={() =>
                          setCart(prev =>
                            prev.map(x => (x.id === c.id ? { ...x, qty: x.qty - 1 } : x)).filter(x => x.qty > 0)
                          )
                        }
                        className="btn btn-outline-secondary"
                      >
                        <BiMinus />
                      </button>
                      <span className="btn btn-light fw-bold">{c.qty}</span>
                      <button
                        type="button"
                        onClick={() => setCart(prev => prev.map(x => (x.id === c.id ? { ...x, qty: x.qty + 1 } : x)))}
                        className="btn btn-outline-secondary"
                      >
                        <BiPlus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <input
              className="form-control form-control-sm mb-3"
              placeholder="Kitchen note (less spicy / Jain / allergy)..."
              value={kotNote}
              onChange={e => setKotNote(e.target.value)}
            />

            <div className="d-flex justify-content-between fw-bold text-navy mb-3">
              <span>Estimated Total</span>
              <span className="text-brand">₹{total}</span>
            </div>

            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => fireKot(false)}
                className="btn btn-brand text-white fw-semibold d-flex align-items-center justify-content-center gap-1"
              >
                <BiSend /> Fire KOT to Kitchen
              </button>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => fireKot(true)}
                className="btn btn-outline-primary btn-sm fw-semibold d-flex align-items-center justify-content-center gap-1"
              >
                <BiHotel /> Fire KOT &amp; Post to Room Folio
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
