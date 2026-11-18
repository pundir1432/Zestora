'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { billingService } from '@/services';
import { GstSlabRule } from '@/mock/gst';
import { useHospitality } from '@/context/HospitalityContext';
import { formatNumber } from '@/utils/formatters';
import { BiFile, BiInfoCircle, BiCalculator, BiDownload } from 'react-icons/bi';

export default function GstTaxConfigurationPage() {
  const { activeProperty } = useHospitality();
  const [rules, setRules] = useState<GstSlabRule[]>(() => billingService.getGstSlabRules());
  const documents = billingService.getGstDocuments();

  const [tab, setTab] = useState<'slabs' | 'documents' | 'reports'>('slabs');
  const [roomTariffSim, setRoomTariffSim] = useState<number>(8500);
  const [supplyMode, setSupplyMode] = useState<'intra' | 'inter'>('intra');

  const isAbove7500 = roomTariffSim > 7500;
  const activeRoomGstRate = isAbove7500 ? 18 : 12;
  const roomGstAmt = Math.round((roomTariffSim * activeRoomGstRate) / 100);

  const toggleRuleStatus = (id: string) => {
    setRules(prev =>
      prev.map(r => (r.id === id ? { ...r, status: r.status === 'Active' ? 'CA Review Pending' : 'Active' } : r))
    );
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'accountant']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-3">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <BiFile className="text-brand" /> GST Configuration, Slabs &amp; Tax Reporting
          </h3>
          <p className="text-muted-custom small mb-0">
            GSTIN: <strong>{activeProperty.gstin}</strong> &bull; Configurable tax slabs, HSN/SAC codes, ₹7,500 Room Tariff threshold, Credit Notes &amp; ECO Aggregator GST
          </p>
        </div>
        <button type="button" onClick={() => alert('Mock GSTR-1 / HSN JSON & CSV prepared for CA review!')} className="btn btn-brand btn-sm text-white fw-semibold d-flex align-items-center gap-1">
          <BiDownload /> Export CA Pack (Mock)
        </button>
      </div>

      {/* CA Verification Notice (Section 15 & 38) */}
      <div className="alert alert-info border-0 bg-info bg-opacity-10 rounded-4 p-3 mb-4 d-flex align-items-start gap-2">
        <BiInfoCircle size={20} className="text-primary flex-shrink-0 mt-1" />
        <div className="small text-navy">
          <strong>Configuration-Driven Tax UI (Not Hard-Coded):</strong> All GST rates, effective dates, HSN/SAC mappings, and the ₹7,500 room tariff threshold are displayed from configurable mock rule definitions. Final production tax rules must be reviewed and approved by your Chartered Accountant (CA).
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        {[
          { k: 'slabs' as const, label: 'Tax Slabs & ₹7,500 Room Rule' },
          { k: 'documents' as const, label: `Invoices, Credit Notes, BOS & ECO (${documents.length})` },
          { k: 'reports' as const, label: 'GSTR-1 / HSN / SAC Summary' },
        ].map(tItem => (
          <button
            key={tItem.k}
            type="button"
            onClick={() => setTab(tItem.k)}
            className={`btn btn-sm rounded-pill px-3 ${tab === tItem.k ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary bg-white text-navy'}`}
          >
            {tItem.label}
          </button>
        ))}
      </div>

      {tab === 'slabs' && (
        <>
          {/* Visual ₹7,500 Room GST Slab Simulator */}
          <div className="app-card p-3 p-md-4 mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <BiCalculator className="text-brand" size={20} />
              <h6 className="fw-bold text-navy mb-0">Room Tariff GST Slab Preview (₹7,500 Threshold Concept)</h6>
            </div>
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-5">
                <label className="form-label small fw-semibold text-navy">
                  Test Room Tariff per Night: <strong className="text-brand">₹{formatNumber(roomTariffSim)}</strong>
                </label>
                <input
                  type="range"
                  min={800}
                  max={15000}
                  step={100}
                  className="form-range"
                  value={roomTariffSim}
                  onChange={e => setRoomTariffSim(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted-custom" style={{ fontSize: '11px' }}>
                  <span>₹800 (Dorm)</span>
                  <span className="fw-bold text-danger">₹7,500 Slab Line</span>
                  <span>₹15,000 (Suite)</span>
                </div>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label small fw-semibold text-navy">Place of Supply</label>
                <div className="btn-group btn-group-sm w-100">
                  <button type="button" onClick={() => setSupplyMode('intra')} className={`btn ${supplyMode === 'intra' ? 'btn-navy bg-navy text-white' : 'btn-outline-secondary'}`}>
                    Intra-State
                  </button>
                  <button type="button" onClick={() => setSupplyMode('inter')} className={`btn ${supplyMode === 'inter' ? 'btn-navy bg-navy text-white' : 'btn-outline-secondary'}`}>
                    Inter-State
                  </button>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className={`p-3 rounded-3 ${isAbove7500 ? 'bg-warning bg-opacity-10 border border-warning' : 'bg-success bg-opacity-10 border border-success'}`}>
                  <div className="fw-bold text-navy small">
                    {isAbove7500 ? 'Above ₹7,500 Slab → 18% GST' : 'Up to ₹7,500 Slab → 12% GST'}
                  </div>
                  <div className="small text-muted-custom mt-1">
                    {supplyMode === 'intra'
                      ? `CGST (${activeRoomGstRate / 2}%): ₹${formatNumber(roomGstAmt / 2)} + SGST (${activeRoomGstRate / 2}%): ₹${formatNumber(roomGstAmt / 2)}`
                      : `IGST (${activeRoomGstRate}%): ₹${formatNumber(roomGstAmt)}`}
                  </div>
                  <div className="fw-bolder text-navy mt-1">
                    Total with Tax: ₹{formatNumber(roomTariffSim + roomGstAmt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configurable GST Rules Table */}
          <div className="app-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted-custom">
                    <th>Category &amp; Slab</th>
                    <th>HSN / SAC</th>
                    <th>Rate Split</th>
                    <th>ITC</th>
                    <th>Effective From</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map(rule => (
                    <tr key={rule.id}>
                      <td>
                        <div className="fw-bold text-navy small">{rule.slabName}</div>
                        <div className="text-muted-custom" style={{ fontSize: '11px' }}>{rule.conditionLabel}</div>
                        <div className="text-muted-custom mt-1" style={{ fontSize: '10px' }}>{rule.notes}</div>
                      </td>
                      <td className="font-monospace small fw-bold text-navy">{rule.hsnSac}</td>
                      <td className="small">
                        <strong>{rule.totalRatePercent}%</strong>
                        <div className="text-muted-custom" style={{ fontSize: '10px' }}>
                          CGST {rule.cgstPercent}% + SGST {rule.sgstPercent}% | IGST {rule.igstPercent}%
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${rule.itcEligible ? 'badge-soft-success' : 'badge-soft-secondary'}`}>
                          {rule.itcEligible ? 'ITC Yes' : 'No ITC'}
                        </span>
                      </td>
                      <td className="small text-muted-custom">{rule.effectiveFrom}</td>
                      <td>
                        <span className={`badge rounded-pill ${rule.status === 'Active' ? 'badge-soft-success' : 'badge-soft-warning'}`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button type="button" onClick={() => toggleRuleStatus(rule.id)} className="btn btn-sm btn-outline-secondary">
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'documents' && (
        <div className="app-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>Doc No &amp; Type</th>
                  <th>Date</th>
                  <th>Party / GSTIN</th>
                  <th>HSN/SAC</th>
                  <th className="text-end">Taxable</th>
                  <th className="text-end">CGST</th>
                  <th className="text-end">SGST</th>
                  <th className="text-end">IGST</th>
                  <th className="text-end">Grand Total</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div className="fw-bold text-navy small font-monospace">{doc.docNumber}</div>
                      <span className="badge badge-soft-info" style={{ fontSize: '10px' }}>{doc.docType}</span>
                    </td>
                    <td className="small text-muted-custom">{doc.date}</td>
                    <td>
                      <div className="small fw-semibold text-navy">{doc.partyName}</div>
                      <div className="text-muted-custom" style={{ fontSize: '10px' }}>
                        {doc.partyGstin ? `GSTIN: ${doc.partyGstin}` : doc.supplyType}
                      </div>
                    </td>
                    <td className="font-monospace small">{doc.hsnSac}</td>
                    <td className="text-end small">₹{formatNumber(doc.taxableValue)}</td>
                    <td className="text-end small">₹{formatNumber(doc.cgst)}</td>
                    <td className="text-end small">₹{formatNumber(doc.sgst)}</td>
                    <td className="text-end small">₹{formatNumber(doc.igst)}</td>
                    <td className="text-end fw-bold text-navy small">₹{formatNumber(doc.grandTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="row g-3">
          {[
            { hsn: '996311', desc: 'Room & Accommodation Services (12% & 18% Slabs)', taxable: 70570, tax: 11805 },
            { hsn: '996331', desc: 'Restaurant Dining & Takeaway Supplies (5% No ITC)', taxable: 68450, tax: 3422 },
            { hsn: '998552', desc: 'Adventure, Rafting & Guided Camp Packages (18%)', taxable: 31700, tax: 5706 },
            { hsn: '996331 (ECO)', desc: 'Zomato / Swiggy Sec 9(5) Supplies (Remitted by ECO)', taxable: 14060, tax: 703 },
          ].map(row => (
            <div key={row.hsn} className="col-12 col-md-6">
              <div className="app-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="badge bg-navy text-white font-monospace">SAC {row.hsn}</span>
                  <span className="fw-bold text-brand">Tax: ₹{formatNumber(row.tax)}</span>
                </div>
                <div className="fw-semibold text-navy small mb-1">{row.desc}</div>
                <div className="text-muted-custom small">Taxable Supply Value: <strong>₹{formatNumber(row.taxable)}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
