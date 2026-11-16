'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DEFAULT_PLATFORM_SETTINGS } from '@/data/saasData';
import { PlatformSettingsData } from '@/types/saas';
import {
  BiCog,
  BiSave,
  BiShieldQuarter,
  BiCreditCard,
  BiEnvelope,
  BiGlobe,
  BiReceipt,
  BiCheckCircle,
  BiRefresh,
} from 'react-icons/bi';

export default function SuperAdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettingsData>(DEFAULT_PLATFORM_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_PLATFORM_SETTINGS);
  };

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Global SaaS Platform Configuration</h4>
          <p className="text-muted-custom small mb-0">
            System-wide settings, payment gateway credentials, taxation rules, and multi-tenant security
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {savedSuccess && (
            <span className="badge badge-soft-success d-flex align-items-center gap-1 py-2 px-3 fw-semibold animate__animated animate__fadeIn">
              <BiCheckCircle size={16} /> Platform Settings Saved!
            </span>
          )}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={handleReset}
          >
            <BiRefresh size={16} /> Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-brand btn-sm d-flex align-items-center gap-1 shadow-sm px-3"
          >
            <BiSave size={16} /> Save Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Section 1: Platform Branding & Contact */}
          <div className="col-12 col-xl-6">
            <div className="app-card p-4 h-100">
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-subtle">
                <BiGlobe className="text-brand" size={22} />
                <h5 className="fw-bold text-navy mb-0">Platform Branding & Support</h5>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-navy">SaaS Platform Brand Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm border-subtle"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-navy">Support Email</label>
                  <input
                    type="email"
                    className="form-control form-control-sm border-subtle"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-navy">Support Helpline Phone</label>
                  <input
                    type="tel"
                    className="form-control form-control-sm border-subtle"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-navy">Portal Website URL</label>
                <input
                  type="url"
                  className="form-control form-control-sm border-subtle"
                  value={settings.websiteUrl}
                  onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2">
                <div className="col-4">
                  <label className="form-label small fw-semibold text-navy">Currency</label>
                  <input
                    type="text"
                    className="form-control form-control-sm border-subtle"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold text-navy">Timezone</label>
                  <input
                    type="text"
                    className="form-control form-control-sm border-subtle"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold text-navy">Date Format</label>
                  <input
                    type="text"
                    className="form-control form-control-sm border-subtle"
                    value={settings.dateFormat}
                    onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Taxation & SaaS Compliance */}
          <div className="col-12 col-xl-6">
            <div className="app-card p-4 h-100">
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-subtle">
                <BiReceipt className="text-brand" size={22} />
                <h5 className="fw-bold text-navy mb-0">Taxation & Invoicing Rules</h5>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-navy">SaaS Subscription GST Rate (%)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm border-subtle"
                    value={settings.saasGstRate}
                    onChange={(e) => setSettings({ ...settings, saasGstRate: Number(e.target.value) })}
                    required
                  />
                  <div className="form-text" style={{ fontSize: '11px' }}>
                    Standard software services (18% IGST)
                  </div>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold text-navy">SAC Code</label>
                  <input
                    type="text"
                    className="form-control form-control-sm border-subtle font-monospace"
                    value={settings.sacCode}
                    onChange={(e) => setSettings({ ...settings, sacCode: e.target.value })}
                    required
                  />
                  <div className="form-text" style={{ fontSize: '11px' }}>
                    998315 - SaaS and cloud hosting
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-navy">HQ Company GSTIN</label>
                <input
                  type="text"
                  className="form-control form-control-sm border-subtle font-monospace text-uppercase"
                  value={settings.saasGstin}
                  onChange={(e) => setSettings({ ...settings, saasGstin: e.target.value })}
                  required
                />
              </div>

              <div className="p-3 bg-surface rounded-3 border border-subtle small text-muted-custom">
                <strong>Invoicing Compliance Note:</strong> Automated invoice sequences (`INV-SAAS-YYYY-XXXX`) are generated at the beginning of each tenant renewal cycle with digital signature hashing.
              </div>
            </div>
          </div>

          {/* Section 3: Payment Gateways */}
          <div className="col-12 col-xl-6">
            <div className="app-card p-4 h-100">
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-subtle">
                <BiCreditCard className="text-brand" size={22} />
                <h5 className="fw-bold text-navy mb-0">Subscription Payment Gateways</h5>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-semibold text-navy mb-0">Razorpay AutoPay Integration</label>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={settings.razorpayEnabled}
                      onChange={(e) => setSettings({ ...settings, razorpayEnabled: e.target.checked })}
                    />
                  </div>
                </div>
                <input
                  type="text"
                  className="form-control form-control-sm border-subtle font-monospace"
                  placeholder="rzp_live_xxxxxxxxxxxxx"
                  value={settings.razorpayKeyId}
                  onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-semibold text-navy mb-0">Stripe Global Billing</label>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={settings.stripeEnabled}
                      onChange={(e) => setSettings({ ...settings, stripeEnabled: e.target.checked })}
                    />
                  </div>
                </div>
                <input
                  type="password"
                  className="form-control form-control-sm border-subtle font-monospace"
                  placeholder="pk_live_xxxxxxxxxxxxx"
                  defaultValue="pk_live_44921094821034"
                />
              </div>

              <div className="small text-muted-custom">
                Enables instant recurring mandate creation (UPI AutoPay, e-NACH, and Credit Card tokenization).
              </div>
            </div>
          </div>

          {/* Section 4: Security & Email Infrastructure */}
          <div className="col-12 col-xl-6">
            <div className="app-card p-4 h-100">
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-subtle">
                <BiShieldQuarter className="text-brand" size={22} />
                <h5 className="fw-bold text-navy mb-0">Security & Email Infrastructure</h5>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-8">
                  <label className="form-label small fw-semibold text-navy">SMTP Host</label>
                  <input
                    type="text"
                    className="form-control form-control-sm border-subtle font-monospace"
                    value={settings.smtpServer}
                    onChange={(e) => setSettings({ ...settings, smtpServer: e.target.value })}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold text-navy">SMTP Port</label>
                  <input
                    type="number"
                    className="form-control form-control-sm border-subtle font-monospace"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-navy">Sender Address</label>
                <input
                  type="email"
                  className="form-control form-control-sm border-subtle"
                  value={settings.senderEmail}
                  onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                />
              </div>

              <div className="p-3 bg-surface rounded-3 border border-subtle d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-navy small d-block">Enforce Two-Factor Authentication</strong>
                    <span className="text-muted-custom" style={{ fontSize: '11px' }}>
                      Require 6-digit OTP for all Restaurant Owners upon login
                    </span>
                  </div>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={settings.twoFactorEnforced}
                      onChange={(e) => setSettings({ ...settings, twoFactorEnforced: e.target.checked })}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-subtle">
                  <div>
                    <strong className="text-danger small d-block">Maintenance Mode</strong>
                    <span className="text-muted-custom" style={{ fontSize: '11px' }}>
                      Temporary block on new registrations and logins
                    </span>
                  </div>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
