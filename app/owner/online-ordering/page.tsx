'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_STORE_BRANDING } from '@/data/saasData';
import { OnlineStoreBranding } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiGlobe,
  BiQrScan,
  BiStore,
  BiCopy,
  BiCheck,
  BiLinkExternal,
  BiDownload,
  BiCheckCircle,
  BiSave,
  BiRestaurant,
  BiCycling,
  BiShoppingBag,
} from 'react-icons/bi';

export default function BusinessOwnerOnlineOrderingPage() {
  const [branding, setBranding] = useState<OnlineStoreBranding>(SAMPLE_STORE_BRANDING);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Channels toggle
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [takeawayEnabled, setTakeawayEnabled] = useState(true);
  const [tableQrEnabled, setTableQrEnabled] = useState(true);

  // Table QR demo tables
  const tables = [
    { number: 'T-01', section: 'Main Hall', capacity: 4 },
    { number: 'T-02', section: 'Main Hall', capacity: 4 },
    { number: 'T-03', section: 'Main Hall', capacity: 6 },
    { number: 'T-04', section: 'Outdoor Terrace', capacity: 2 },
    { number: 'T-05', section: 'Outdoor Terrace', capacity: 4 },
    { number: 'T-06', section: 'VIP Lounge', capacity: 8 },
  ];

  const storefrontUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/order/demo`
    : 'https://zestora.app/order/demo';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storefrontUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Direct Online Ordering & QR Menu</h1>
            <p className="text-muted small mb-0">
              Your commission-free direct ordering website, contactless table QR menus, and digital brand presence.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link
              href="/order/demo"
              target="_blank"
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
            >
              <BiLinkExternal size={16} /> Open Live Customer Store
            </Link>
          </div>
        </div>

        {/* Live URL Banner */}
        <div className="card border-0 shadow-sm rounded-3 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #18263B 0%, #2A3F5F 100%)' }}>
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-12 col-lg-8">
                <span className="badge bg-warning text-dark mb-2 fw-semibold">0% Commission Direct Channel</span>
                <h4 className="fw-bold mb-1">Your Branded Customer Ordering Web App</h4>
                <p className="text-light opacity-75 small mb-3">
                  Share your personalized link on Instagram Bio, Google Maps Business Profile, and WhatsApp to take direct orders without paying 20-30% aggregator commissions.
                </p>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <div className="bg-white bg-opacity-10 border border-white border-opacity-25 rounded px-3 py-2 text-white font-monospace small text-break">
                    {storefrontUrl}
                  </div>
                  <button
                    className="btn btn-light btn-sm fw-medium d-flex align-items-center gap-1"
                    onClick={handleCopyLink}
                  >
                    {copiedLink ? <BiCheck className="text-success" /> : <BiCopy />}
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </button>
                  <Link
                    href="/order/demo"
                    target="_blank"
                    className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                  >
                    <BiGlobe /> Preview Store
                  </Link>
                </div>
              </div>
              <div className="col-12 col-lg-4 text-lg-end mt-3 mt-lg-0">
                <div className="d-inline-block p-3 bg-white rounded-3 shadow text-dark text-center">
                  <div className="mb-2">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                        storefrontUrl
                      )}`}
                      alt="Store QR"
                      width={120}
                      height={120}
                      className="rounded"
                    />
                  </div>
                  <div className="small fw-bold">Scan to Order</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>Food Palace Indiranagar</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isSavedAlert && (
          <div className="alert alert-success alert-dismissible fade show shadow-sm border-0 d-flex align-items-center gap-2 mb-4">
            <BiCheckCircle size={20} />
            <div>Online store configuration and branding settings have been updated successfully!</div>
          </div>
        )}

        {/* Settings & Branding Tabs / Sections */}
        <div className="row g-4 mb-4">
          {/* Store Settings Form */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-3 bg-white h-100">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="fw-bold mb-0 text-dark">Storefront Branding & Operations</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSaveSettings}>
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-8">
                      <label className="form-label small fw-semibold">Public Store Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={branding.storeName}
                        onChange={(e) => setBranding({ ...branding, storeName: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Store URL Slug</label>
                      <input
                        type="text"
                        className="form-control form-control-sm font-monospace"
                        value={branding.slug}
                        onChange={(e) => setBranding({ ...branding, slug: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Brand Tagline</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={branding.tagline}
                      onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Theme Color</label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="color"
                          className="form-control form-control-color form-control-sm"
                          value={branding.themeColor}
                          onChange={(e) => setBranding({ ...branding, themeColor: e.target.value })}
                        />
                        <span className="font-monospace small">{branding.themeColor}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Accent Color</label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="color"
                          className="form-control form-control-color form-control-sm"
                          value={branding.accentColor}
                          onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                        />
                        <span className="font-monospace small">{branding.accentColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Delivery Fee (₹)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={branding.deliveryFee}
                        onChange={(e) => setBranding({ ...branding, deliveryFee: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Minimum Order (₹)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={branding.minOrder}
                        onChange={(e) => setBranding({ ...branding, minOrder: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Est. Delivery Time (Mins)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={branding.estimatedDeliveryMins}
                        onChange={(e) => setBranding({ ...branding, estimatedDeliveryMins: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Promotional Announcement Bar</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={branding.announcementText || ''}
                      onChange={(e) => setBranding({ ...branding, announcementText: e.target.value })}
                    />
                  </div>

                  <div className="border-top pt-3 mt-3">
                    <h6 className="fw-bold small text-dark mb-3">Active Order Fulfillment Modes</h6>
                    <div className="row g-3">
                      <div className="col-4">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={deliveryEnabled}
                            onChange={(e) => setDeliveryEnabled(e.target.checked)}
                          />
                          <label className="form-check-label small fw-semibold">
                            <BiCycling className="me-1" /> Home Delivery
                          </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={takeawayEnabled}
                            onChange={(e) => setTakeawayEnabled(e.target.checked)}
                          />
                          <label className="form-check-label small fw-semibold">
                            <BiShoppingBag className="me-1" /> Takeaway
                          </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={tableQrEnabled}
                            onChange={(e) => setTableQrEnabled(e.target.checked)}
                          />
                          <label className="form-check-label small fw-semibold">
                            <BiQrScan className="me-1" /> Table QR Dine-In
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <button type="submit" className="btn btn-primary btn-sm d-flex align-items-center gap-2">
                      <BiSave size={18} /> Save Online Storefront Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Quick Table QR Generator */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-3 bg-white h-100">
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 text-dark">Table QR Code Standees</h5>
                <button
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  onClick={() => alert('Downloading printable acrylic QR PDF for all tables...')}
                >
                  <BiDownload /> Download All
                </button>
              </div>
              <div className="card-body p-3">
                <p className="text-muted small mb-3">
                  Each dining table gets a unique QR code. When guests scan it with their camera, it opens the digital menu and tags the order directly to their table number.
                </p>

                <div className="row g-2">
                  {tables.map((table) => {
                    const tableUrl = `${storefrontUrl}?table=${table.number}`;
                    return (
                      <div key={table.number} className="col-6">
                        <div className="border rounded p-2 text-center bg-light">
                          <div className="fw-bold text-dark">{table.number}</div>
                          <div className="text-muted small mb-2">{table.section} ({table.capacity} seats)</div>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(
                              tableUrl
                            )}`}
                            alt={table.number}
                            width={90}
                            height={90}
                            className="rounded mb-2"
                          />
                          <div>
                            <button
                              className="btn btn-sm btn-outline-dark py-0 px-2"
                              style={{ fontSize: '11px' }}
                              onClick={() => {
                                const win = window.open(
                                  `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                                    tableUrl
                                  )}`,
                                  '_blank'
                                );
                                win?.focus();
                              }}
                            >
                              Print QR
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
