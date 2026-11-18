'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { FormIIIStatus } from '@/mock/compliance';
import {
  BiShieldAlt2,
  BiTimeFive,
  BiCheckCircle,
  BiErrorCircle,
  BiUpload,
  BiFile,
  BiLogOut,
  BiSave,
} from 'react-icons/bi';

export default function FormIIICompliancePage() {
  const { formIIIRecords, updateFormIIIRecord } = useHospitality();
  const [statusFilter, setStatusFilter] = useState<'All' | FormIIIStatus>('All');
  const [selectedId, setSelectedId] = useState(formIIIRecords[0]?.id || '');
  const [ackInput, setAckInput] = useState('');
  const [savedNotice, setSavedNotice] = useState('');

  const filtered = statusFilter === 'All' ? formIIIRecords : formIIIRecords.filter(r => r.status === statusFilter);
  const activeRec = formIIIRecords.find(r => r.id === selectedId) || formIIIRecords[0];

  const counts = {
    Overdue: formIIIRecords.filter(r => r.status === 'Overdue').length,
    'Due Soon': formIIIRecords.filter(r => r.status === 'Due Soon').length,
    Pending: formIIIRecords.filter(r => r.status === 'Pending').length,
    Submitted: formIIIRecords.filter(r => r.status === 'Submitted').length,
  };

  const handleSaveField = (field: string, value: string) => {
    if (!activeRec) return;
    updateFormIIIRecord(activeRec.id, { [field]: value });
  };

  const handleFixOversizeDoc = () => {
    if (!activeRec) return;
    const fixedDocs = activeRec.documents.map(d =>
      !d.valid ? { ...d, fileSizeKb: 240, valid: true, validationNote: 'Compressed <= 500KB FRRO spec OK' } : d
    );
    updateFormIIIRecord(activeRec.id, { documents: fixedDocs });
    setSavedNotice('Document compressed & validated to FRRO size specs (<= 500KB).');
    setTimeout(() => setSavedNotice(''), 3000);
  };

  const handleSubmitAck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRec) return;
    const ackNo = ackInput.trim() || `FRRO-UK-2026-${Math.floor(1000000 + Math.random() * 8999999)}`;
    updateFormIIIRecord(activeRec.id, {
      status: 'Submitted',
      acknowledgementNumber: ackNo,
      acknowledgementUploadedAt: 'Just now (Mock Upload)',
      deadlineLabel: 'Submitted — Acknowledgement Recorded',
    });
    setAckInput('');
    setSavedNotice(`Acknowledgement ${ackNo} recorded & guest marked Submitted!`);
    setTimeout(() => setSavedNotice(''), 4000);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-3">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <BiShieldAlt2 className="text-danger" /> Form III / Foreign Guest Compliance (FRRO)
          </h3>
          <p className="text-muted-custom small mb-0">
            Foreign guest detection, 24-hour reporting countdown, document preparation, mock acknowledgement &amp; departure tracking
          </p>
        </div>
        <span className="badge badge-soft-info px-3 py-2">
          Frontend Mock Workflow • Manual FRRO Portal Export Ready
        </span>
      </div>

      {savedNotice && <div className="alert alert-success py-2 px-3 small fw-semibold border-0 mb-3">{savedNotice}</div>}

      {/* Compliance Status KPIs */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Overdue (>24h)', count: counts.Overdue, cls: 'text-danger', bg: 'bg-danger bg-opacity-10', key: 'Overdue' as const },
          { label: 'Due Soon (<6h)', count: counts['Due Soon'], cls: 'text-warning', bg: 'bg-warning bg-opacity-15', key: 'Due Soon' as const },
          { label: 'Pending Prep', count: counts.Pending, cls: 'text-primary', bg: 'bg-primary bg-opacity-10', key: 'Pending' as const },
          { label: 'Submitted (Ack OK)', count: counts.Submitted, cls: 'text-success', bg: 'bg-success bg-opacity-10', key: 'Submitted' as const },
        ].map(c => (
          <div key={c.label} className="col-6 col-lg-3">
            <div
              onClick={() => setStatusFilter(statusFilter === c.key ? 'All' : c.key)}
              className={`app-card p-3 h-100 ${c.bg} border-0`}
              style={{ cursor: 'pointer' }}
            >
              <div className="small fw-semibold text-navy">{c.label}</div>
              <div className={`fs-2 fw-bolder ${c.cls}`}>{c.count}</div>
              <div className="text-muted-custom" style={{ fontSize: '10px' }}>Click to filter queue</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Left: Foreign Guest Queue with 24-Hour Countdown */}
        <div className="col-12 col-lg-4">
          <div className="app-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold text-navy small">Detected Foreign Guests ({filtered.length})</span>
              {statusFilter !== 'All' && (
                <button type="button" onClick={() => setStatusFilter('All')} className="btn btn-link btn-sm p-0 text-brand">Show All</button>
              )}
            </div>
            <div className="d-flex flex-column gap-2">
              {filtered.map(rec => {
                const isSel = activeRec?.id === rec.id;
                const isOverdue = rec.status === 'Overdue';
                const isDueSoon = rec.status === 'Due Soon';
                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => setSelectedId(rec.id)}
                    className={`btn text-start p-3 rounded-3 border ${
                      isSel ? 'bg-navy text-white border-navy shadow' : 'bg-surface text-navy border-subtle'
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                      <div>
                        <div className="fw-bold small">{rec.guestName}</div>
                        <div style={{ fontSize: '11px', opacity: 0.8 }}>{rec.nationality} &bull; {rec.unitLabel}</div>
                      </div>
                      <span
                        className={`badge rounded-pill ${
                          isOverdue
                            ? 'bg-danger text-white'
                            : isDueSoon
                            ? 'bg-warning text-dark'
                            : rec.status === 'Submitted'
                            ? 'bg-success text-white'
                            : 'bg-primary text-white'
                        }`}
                        style={{ fontSize: '10px' }}
                      >
                        {rec.status}
                      </span>
                    </div>

                    {/* 24-Hour Countdown Strip */}
                    <div
                      className={`mt-2 px-2 py-1 rounded-2 d-flex align-items-center gap-1 fw-semibold ${
                        isOverdue
                          ? 'bg-danger text-white'
                          : isDueSoon
                          ? 'bg-warning text-dark'
                          : rec.status === 'Submitted'
                          ? 'bg-success bg-opacity-25 text-success'
                          : 'bg-white bg-opacity-10'
                      }`}
                      style={{ fontSize: '11px' }}
                    >
                      <BiTimeFive size={14} />
                      <span>{rec.deadlineLabel}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Form III Builder, 24h Timer Banner, Document Prep, Acknowledgement & Departure */}
        {activeRec && (
          <div className="col-12 col-lg-8">
            {/* Prominent 24-Hour Countdown Alert Card */}
            <div
              className={`rounded-4 p-3 p-md-4 mb-3 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 ${
                activeRec.status === 'Overdue'
                  ? 'bg-danger text-white'
                  : activeRec.status === 'Due Soon'
                  ? 'bg-warning text-dark'
                  : activeRec.status === 'Submitted'
                  ? 'bg-success text-white'
                  : 'bg-navy text-white'
              }`}
            >
              <div>
                <div className="text-uppercase fw-bold small opacity-75">
                  24-Hour Mandatory Arrival Reporting Countdown &bull; FRRO Code: {activeRec.frroPropertyCode}
                </div>
                <h4 className="fw-bolder mb-1 mt-1">
                  {activeRec.status === 'Overdue'
                    ? `OVERDUE: ${Math.abs(activeRec.hoursRemaining).toFixed(1)} hrs past 24h deadline`
                    : activeRec.status === 'Submitted'
                    ? `SUBMITTED • Ack #${activeRec.acknowledgementNumber}`
                    : `${activeRec.hoursRemaining.toFixed(1)} Hours Remaining`}
                </h4>
                <div className="small opacity-90">
                  Arrival: {activeRec.arrivalDateTime} &rarr; Property: {activeRec.propertyName}
                </div>
              </div>
              <div className="text-md-end">
                <div className="badge bg-white text-navy px-3 py-2 fw-bold">
                  {activeRec.nationality} &bull; {activeRec.passportNumber}
                </div>
              </div>
            </div>

            {/* Form III Builder Fields */}
            <div className="app-card p-3 p-md-4 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-navy mb-0">Form III Guest &amp; Passport / Visa Builder</h6>
                <button
                  type="button"
                  onClick={() => {
                    setSavedNotice('Form III draft saved locally (ready for FRRO pack).');
                    setTimeout(() => setSavedNotice(''), 2500);
                  }}
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                >
                  <BiSave /> Save Draft
                </button>
              </div>

              <div className="row g-3 small">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-navy mb-1">Guest Full Name (as per Passport)</label>
                  <input className="form-control form-control-sm" value={activeRec.guestName} onChange={e => handleSaveField('guestName', e.target.value)} />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold text-navy mb-1">Nationality</label>
                  <input className="form-control form-control-sm" value={activeRec.nationality} onChange={e => handleSaveField('nationality', e.target.value)} />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold text-navy mb-1">Date of Birth</label>
                  <input className="form-control form-control-sm" value={activeRec.dateOfBirth} onChange={e => handleSaveField('dateOfBirth', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-navy mb-1">Passport Number</label>
                  <input className="form-control form-control-sm font-monospace" value={activeRec.passportNumber} onChange={e => handleSaveField('passportNumber', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-navy mb-1">Passport Expiry</label>
                  <input className="form-control form-control-sm" value={activeRec.passportExpiryDate} onChange={e => handleSaveField('passportExpiryDate', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-navy mb-1">Place of Issue</label>
                  <input className="form-control form-control-sm" value={activeRec.passportPlaceOfIssue} onChange={e => handleSaveField('passportPlaceOfIssue', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-navy mb-1">Indian Visa / e-Visa Number</label>
                  <input className="form-control form-control-sm font-monospace" value={activeRec.visaNumber} onChange={e => handleSaveField('visaNumber', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-navy mb-1">Visa Type</label>
                  <input className="form-control form-control-sm" value={activeRec.visaType} onChange={e => handleSaveField('visaType', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-navy mb-1">Visa Valid Till</label>
                  <input className="form-control form-control-sm" value={activeRec.visaExpiryDate} onChange={e => handleSaveField('visaExpiryDate', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-navy mb-1">Arrived From</label>
                  <input className="form-control form-control-sm" value={activeRec.arrivedFrom} onChange={e => handleSaveField('arrivedFrom', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-navy mb-1">Next Destination</label>
                  <input className="form-control form-control-sm" value={activeRec.nextDestination} onChange={e => handleSaveField('nextDestination', e.target.value)} />
                </div>
                <div className="col-md-8">
                  <label className="form-label fw-semibold text-navy mb-1">Address in India</label>
                  <input className="form-control form-control-sm" value={activeRec.addressInIndia} onChange={e => handleSaveField('addressInIndia', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-navy mb-1">Purpose of Visit</label>
                  <input className="form-control form-control-sm" value={activeRec.purposeOfVisit} onChange={e => handleSaveField('purposeOfVisit', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Document Preparation & Validation */}
            <div className="app-card p-3 p-md-4 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-navy mb-0 d-flex align-items-center gap-1">
                  <BiFile className="text-brand" /> Document Preparation &amp; Size Validation
                </h6>
                {activeRec.documents.some(d => !d.valid) && (
                  <button type="button" onClick={handleFixOversizeDoc} className="btn btn-sm btn-warning fw-semibold">
                    Auto-Compress Oversize PDF
                  </button>
                )}
              </div>

              <div className="row g-2">
                {activeRec.documents.length === 0 ? (
                  <div className="col-12 text-muted-custom small">No documents attached yet — use mock uploader below.</div>
                ) : (
                  activeRec.documents.map((doc, idx) => (
                    <div key={idx} className="col-12 col-md-4">
                      <div className={`p-2.5 rounded-3 border h-100 ${doc.valid ? 'border-success bg-success bg-opacity-10' : 'border-danger bg-danger bg-opacity-10'}`}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <img src={doc.previewUrl} alt={doc.type} className="rounded-2" style={{ width: '42px', height: '42px', objectFit: 'cover' }} />
                          <div className="overflow-hidden">
                            <div className="fw-bold text-navy small text-truncate">{doc.type}</div>
                            <div className="text-muted-custom text-truncate" style={{ fontSize: '10px' }}>{doc.fileName}</div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '11px' }}>
                          <span>{doc.fileSizeKb} KB / {doc.maxAllowedKb} KB</span>
                          {doc.valid ? (
                            <span className="text-success fw-bold d-inline-flex align-items-center gap-1"><BiCheckCircle /> Valid</span>
                          ) : (
                            <span className="text-danger fw-bold d-inline-flex align-items-center gap-1"><BiErrorCircle /> Too Large</span>
                          )}
                        </div>
                        <div className="text-muted-custom mt-1" style={{ fontSize: '10px' }}>{doc.validationNote}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Mock Acknowledgement & Departure Reporting */}
            <div className="row g-3">
              <div className="col-12 col-md-7">
                <form onSubmit={handleSubmitAck} className="app-card p-3 h-100">
                  <h6 className="fw-bold text-navy small mb-2 d-flex align-items-center gap-1">
                    <BiUpload className="text-brand" /> Record FRRO Acknowledgement (Mock)
                  </h6>
                  {activeRec.acknowledgementNumber ? (
                    <div className="alert alert-success py-2 px-3 small mb-2">
                      <strong>Ack No:</strong> {activeRec.acknowledgementNumber}<br />
                      <span className="text-muted-custom">Uploaded: {activeRec.acknowledgementUploadedAt}</span>
                    </div>
                  ) : (
                    <p className="text-muted-custom small mb-2">
                      After filing on the official FRRO portal, record the acknowledgement number &amp; receipt PDF here.
                    </p>
                  )}
                  <div className="input-group input-group-sm">
                    <input
                      className="form-control"
                      placeholder="e.g., FRRO-UK-2026-8849201"
                      value={ackInput}
                      onChange={e => setAckInput(e.target.value)}
                    />
                    <button type="submit" className="btn btn-brand text-white fw-semibold">
                      Save &amp; Mark Submitted
                    </button>
                  </div>
                </form>
              </div>

              <div className="col-12 col-md-5">
                <div className="app-card p-3 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="fw-bold text-navy small mb-1 d-flex align-items-center gap-1">
                      <BiLogOut className="text-primary" /> Departure Reporting Task
                    </h6>
                    <div className="text-muted-custom small mb-2">
                      Expected Departure: <strong>{activeRec.departureDate || 'TBD'}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateFormIIIRecord(activeRec.id, { departureReported: !activeRec.departureReported })}
                    className={`btn btn-sm fw-semibold w-100 ${
                      activeRec.departureReported ? 'btn-success text-white' : 'btn-outline-primary'
                    }`}
                  >
                    {activeRec.departureReported ? 'Departure Reported ✓' : 'Mark Departure Reported'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
