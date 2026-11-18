'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { billingService } from '@/services';
import { formatNumber } from '@/utils/formatters';
import { TbFileInvoice } from 'react-icons/tb';
import { BiPlus, BiWallet, BiPrinter, BiShieldAlt2, BiMinusCircle } from 'react-icons/bi';

export default function UnifiedGuestFolioPage() {
  const { folios, postChargeToFolio, addPaymentToFolio } = useHospitality();
  const [selectedId, setSelectedId] = useState(folios[0]?.id || '');
  const activeFolio = folios.find(f => f.id === selectedId) || folios[0];

  const [showChargeModal, setShowChargeModal] = useState(false);
  const [chargeCategory, setChargeCategory] = useState<'Restaurant' | 'Camp Activity' | 'Service' | 'Credit Adjustment'>('Restaurant');
  const [chargeDesc, setChargeDesc] = useState('');
  const [chargeAmt, setChargeAmt] = useState(850);

  const [showPayModal, setShowPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Card' | 'Cash' | 'Bank Transfer'>('UPI');
  const [payAmount, setPayAmount] = useState(2000);
  const [payRef, setPayRef] = useState('');

  if (!activeFolio) return null;

  const totals = billingService.calculateFolioTotals(activeFolio);

  const handleAddCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chargeDesc.trim()) return;
    const isCredit = chargeCategory === 'Credit Adjustment';
    const signedAmt = isCredit ? -Math.abs(chargeAmt) : Math.abs(chargeAmt);
    const gstRate = isCredit ? 0 : chargeCategory === 'Restaurant' ? 5 : 18;
    postChargeToFolio(activeFolio.id, {
      date: 'Just now',
      category: chargeCategory,
      description: chargeDesc.trim(),
      referenceNo: `${chargeCategory.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 8999)}`,
      amount: signedAmt,
      gstRate,
      gstAmount: Math.round((signedAmt * gstRate) / 100),
      postedBy: 'Front Desk / POS',
    });
    setShowChargeModal(false);
    setChargeDesc('');
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    addPaymentToFolio(activeFolio.id, {
      date: 'Just now',
      method: payMethod,
      referenceNo: payRef || `${payMethod.toUpperCase()}-${Math.floor(10000 + Math.random() * 89999)}`,
      amount: Number(payAmount),
      receivedBy: 'Kavita Reddy (Front Desk)',
    });
    setShowPayModal(false);
    setPayRef('');
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'cashier', 'accountant']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <TbFileInvoice className="text-brand" /> Unified Guest Folio
          </h3>
          <p className="text-muted-custom small mb-0">
            Room / Dorm + Restaurant + Camp Activity + Services &minus; Payments &minus; Discounts = Consolidated Balance
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button type="button" onClick={() => setShowChargeModal(true)} className="btn btn-brand btn-sm text-white fw-semibold d-flex align-items-center gap-1">
            <BiPlus /> Post Charge / Adjustment
          </button>
          <button type="button" onClick={() => setShowPayModal(true)} className="btn btn-success btn-sm text-white fw-semibold d-flex align-items-center gap-1">
            <BiWallet /> Record Payment
          </button>
          <button type="button" onClick={() => window.print()} className="btn btn-outline-secondary btn-sm bg-white text-navy d-flex align-items-center gap-1">
            <BiPrinter /> Print Tax Invoice
          </button>
        </div>
      </div>

      <div className="row g-3">
        {/* Left: Active Folios Selector */}
        <div className="col-12 col-lg-4">
          <div className="app-card p-3">
            <div className="fw-bold text-navy small mb-3">Active Guest Folios ({folios.length})</div>
            <div className="d-flex flex-column gap-2">
              {folios.map(f => {
                const fTot = billingService.calculateFolioTotals(f);
                const selected = f.id === activeFolio.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedId(f.id)}
                    className={`btn text-start p-3 rounded-3 border ${
                      selected ? 'bg-navy text-white border-navy shadow-sm' : 'bg-surface text-navy border-subtle'
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small">{f.guestName}</span>
                      <span className={`badge ${selected ? 'bg-brand text-white' : 'badge-soft-info'}`} style={{ fontSize: '10px' }}>
                        {f.id}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>{f.unitLabel}</div>
                    <div className="d-flex justify-content-between mt-2 pt-2 border-top border-secondary border-opacity-25" style={{ fontSize: '11px' }}>
                      <span>Gross: ₹{formatNumber(fTot.grandTotal)}</span>
                      <span className={fTot.balance > 0 ? 'text-warning fw-bold' : 'text-success fw-bold'}>
                        Bal: ₹{formatNumber(fTot.balance)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Detailed Consolidated Ledger */}
        <div className="col-12 col-lg-8">
          <div className="app-card p-3 p-md-4 mb-3">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-2 pb-3 mb-3 border-bottom">
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h5 className="fw-bold text-navy mb-0">{activeFolio.guestName}</h5>
                  {activeFolio.isForeignGuest && (
                    <span className="badge badge-soft-warning d-inline-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                      <BiShieldAlt2 /> {activeFolio.nationality}
                    </span>
                  )}
                </div>
                <div className="text-muted-custom small mt-1">
                  {activeFolio.unitLabel} &bull; {activeFolio.checkInDate} &rarr; {activeFolio.checkOutDate} &bull; Invoice: <strong>{activeFolio.invoiceNumber}</strong>
                </div>
              </div>
              <span className="badge bg-light text-navy border px-3 py-2">{activeFolio.bookingSource}</span>
            </div>

            {/* Balance Equation Cards */}
            <div className="row g-2 mb-4">
              <div className="col-6 col-sm-3">
                <div className="p-2.5 rounded-3 bg-surface">
                  <div className="text-muted-custom" style={{ fontSize: '11px' }}>Taxable Charges</div>
                  <div className="fw-bold text-navy">₹{formatNumber(totals.subtotal)}</div>
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="p-2.5 rounded-3 bg-surface">
                  <div className="text-muted-custom" style={{ fontSize: '11px' }}>CGST + SGST</div>
                  <div className="fw-bold text-primary">₹{formatNumber(totals.totalTax)}</div>
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="p-2.5 rounded-3 bg-surface">
                  <div className="text-muted-custom" style={{ fontSize: '11px' }}>Total Paid</div>
                  <div className="fw-bold text-success">₹{formatNumber(totals.totalPaid)}</div>
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className={`p-2.5 rounded-3 ${totals.balance > 0 ? 'bg-warning bg-opacity-15' : 'bg-success bg-opacity-15'}`}>
                  <div className="text-muted-custom" style={{ fontSize: '11px' }}>Outstanding Balance</div>
                  <div className={`fw-bolder ${totals.balance > 0 ? 'text-danger' : 'text-success'}`}>
                    ₹{formatNumber(totals.balance)}
                  </div>
                </div>
              </div>
            </div>

            {/* Charge History Table */}
            <h6 className="fw-bold text-navy small mb-2">Charge History (Room + Restaurant + Camp + Services)</h6>
            <div className="table-responsive mb-4">
              <table className="table table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted-custom">
                    <th>Date</th>
                    <th>Stream</th>
                    <th>Description &amp; Ref</th>
                    <th className="text-end">Base</th>
                    <th className="text-end">GST</th>
                    <th className="text-end">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {activeFolio.charges.map(ch => (
                    <tr key={ch.id}>
                      <td className="small text-muted-custom text-nowrap">{ch.date}</td>
                      <td>
                        <span className={`badge ${ch.amount < 0 ? 'badge-soft-danger' : 'badge-soft-info'}`} style={{ fontSize: '10px' }}>
                          {ch.category}
                        </span>
                      </td>
                      <td>
                        <div className="small fw-semibold text-navy">{ch.description}</div>
                        <div className="text-muted-custom" style={{ fontSize: '10px' }}>Ref: {ch.referenceNo} &bull; By: {ch.postedBy}</div>
                      </td>
                      <td className="text-end small">₹{formatNumber(ch.amount)}</td>
                      <td className="text-end small text-muted-custom">{ch.gstRate > 0 ? `₹${formatNumber(ch.gstAmount)} (${ch.gstRate}%)` : '—'}</td>
                      <td className={`text-end small fw-bold ${ch.amount < 0 ? 'text-success' : 'text-navy'}`}>
                        ₹{formatNumber(ch.amount + ch.gstAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment History Table */}
            <h6 className="fw-bold text-navy small mb-2">Payment History</h6>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted-custom">
                    <th>Date</th>
                    <th>Method</th>
                    <th>Reference</th>
                    <th>Received By</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {activeFolio.payments.map(p => (
                    <tr key={p.id}>
                      <td className="small text-muted-custom">{p.date}</td>
                      <td><span className="badge badge-soft-success">{p.method}</span></td>
                      <td className="small font-monospace text-navy">{p.referenceNo}</td>
                      <td className="small text-muted-custom">{p.receivedBy}</td>
                      <td className="text-end fw-bold text-success small">₹{formatNumber(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Post Charge / Adjustment Modal */}
      {showChargeModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <form onSubmit={handleAddCharge} className="modal-content rounded-4 overflow-hidden">
              <div className="modal-header bg-navy text-white">
                <h6 className="modal-title fw-bold">Post Charge or Credit Adjustment to {activeFolio.id}</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowChargeModal(false)} />
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Stream / Category</label>
                  <select className="form-select" value={chargeCategory} onChange={e => setChargeCategory(e.target.value as any)}>
                    <option value="Restaurant">Restaurant-to-Room Bill (5% GST)</option>
                    <option value="Camp Activity">Camp / Rafting Activity (18% GST)</option>
                    <option value="Service">Other Service / Laundry / Shuttle (18% GST)</option>
                    <option value="Credit Adjustment">Credit / Courtesy Adjustment (Deducts from Balance)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Description *</label>
                  <input className="form-control" required value={chargeDesc} onChange={e => setChargeDesc(e.target.value)} placeholder="e.g., Dinner Bill #POS-4451 or Rafting GoPro Video" />
                </div>
                <div>
                  <label className="form-label small fw-semibold text-navy">Amount (₹)</label>
                  <input type="number" min={1} className="form-control" value={chargeAmt} onChange={e => setChargeAmt(Number(e.target.value))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowChargeModal(false)} className="btn btn-outline-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-brand btn-sm text-white fw-semibold px-4 d-flex align-items-center gap-1">
                  {chargeCategory === 'Credit Adjustment' ? <BiMinusCircle /> : <BiPlus />} Post to Folio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPayModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <form onSubmit={handleAddPayment} className="modal-content rounded-4 overflow-hidden">
              <div className="modal-header bg-navy text-white">
                <h6 className="modal-title fw-bold">Record Payment for {activeFolio.guestName}</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPayModal(false)} />
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Payment Method</label>
                  <select className="form-select" value={payMethod} onChange={e => setPayMethod(e.target.value as any)}>
                    <option value="UPI">UPI / QR</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Amount (₹)</label>
                  <input type="number" min={1} className="form-control" value={payAmount} onChange={e => setPayAmount(Number(e.target.value))} />
                </div>
                <div>
                  <label className="form-label small fw-semibold text-navy">Transaction Reference</label>
                  <input className="form-control" value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="Optional UTR / Card last 4 digits" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowPayModal(false)} className="btn btn-outline-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-success btn-sm text-white fw-semibold px-4">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
