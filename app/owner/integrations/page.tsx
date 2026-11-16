'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_INTEGRATIONS } from '@/data/saasData';
import { ThirdPartyIntegrationRecord } from '@/types/saas';
import {
  BiPlug,
  BiCheckCircle,
  BiError,
  BiTimeFive,
  BiSearch,
  BiCog,
  BiRefresh,
  BiCreditCard,
  BiQr,
  BiReceipt,
  BiBookBookmark,
  BiCycling,
  BiMessageRoundedDots,
} from 'react-icons/bi';

export default function BusinessOwnerIntegrationsPage() {
  const [integrations, setIntegrations] = useState<ThirdPartyIntegrationRecord[]>(SAMPLE_INTEGRATIONS);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [configuring, setConfiguring] = useState<ThirdPartyIntegrationRecord | null>(null);

  // Configuration modal fields
  const [apiKey, setApiKey] = useState('sec_live_98124098123abcdef');
  const [merchantId, setMerchantId] = useState('MID-88192');
  const [webhookUrl, setWebhookUrl] = useState('https://api.zestora.app/v1/webhooks/partner');

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((it) => {
      const matchCat = categoryFilter === 'All' || it.category === categoryFilter;
      const matchSearch =
        it.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [integrations, categoryFilter, searchTerm]);

  const connectedCount = useMemo(
    () => integrations.filter((i) => i.isConnected).length,
    [integrations]
  );

  const handleToggleConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              isConnected: !i.isConnected,
              syncStatus: !i.isConnected ? 'Operational' : 'Action Needed',
              lastSyncTime: !i.isConnected ? 'Just now' : undefined,
            }
          : i
      )
    );
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuring) return;

    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === configuring.id
          ? { ...i, isConnected: true, syncStatus: 'Operational', lastSyncTime: 'Just now' }
          : i
      )
    );
    alert(`${configuring.name} API credentials verified & webhook active!`);
    setConfiguring(null);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BiCreditCard':
        return <BiCreditCard size={28} className="text-primary" />;
      case 'BiQr':
        return <BiQr size={28} className="text-info" />;
      case 'BiLogoWhatsapp':
        return <BiMessageRoundedDots size={28} className="text-success" />;
      case 'BiReceipt':
        return <BiReceipt size={28} className="text-warning-emphasis" />;
      case 'BiBookBookmark':
        return <BiBookBookmark size={28} className="text-danger" />;
      case 'BiCycling':
        return <BiCycling size={28} className="text-primary" />;
      default:
        return <BiPlug size={28} className="text-dark" />;
    }
  };

  const categories = [
    'All',
    'Food Aggregator',
    'Payment Gateway',
    'SMS & WhatsApp',
    'Accounting & ERP',
    'Loyalty',
  ];

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Third-Party Ecosystem Integrations</h1>
            <p className="text-muted small mb-0">
              Connect external aggregator APIs, thermal POS soundboxes, WhatsApp cloud gateways, and ERP accounting software.
            </p>
          </div>
          <div>
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
              onClick={() => alert('Triggering instant bidirectional synchronization across all active webhooks...')}
            >
              <BiRefresh size={18} /> Test Sync All
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Connected External APIs</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiCheckCircle size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{connectedCount} Active Connectors</h3>
              <span className="text-success small fw-medium">Live data pipes operational</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Webhook Uptime SLA</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiPlug size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">99.98%</h3>
              <span className="text-muted small">0 failed webhooks in last 24h</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Average Response Latency</span>
                <span className="p-2 rounded bg-info-subtle text-info">
                  <BiTimeFive size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">142 ms</h3>
              <span className="text-muted small">Sub-second KOT print dispatch</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
          <div className="card-body p-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${
                      categoryFilter === cat ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div style={{ maxWidth: '300px' }} className="w-100">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <BiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search integration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="row g-3">
          {filteredIntegrations.map((it) => (
            <div key={it.id} className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-3 bg-white h-100 d-flex flex-column">
                <div className="card-body p-4 flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="p-2 rounded bg-light border">
                      {getIcon(it.iconName)}
                    </div>
                    <div>
                      {it.isConnected ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          <BiCheckCircle className="me-1" /> Connected
                        </span>
                      ) : (
                        <span className="badge bg-secondary-subtle text-dark border">
                          Disconnected
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="badge bg-light text-muted border mb-2" style={{ fontSize: '11px' }}>
                    {it.category}
                  </span>
                  <h6 className="fw-bold text-dark mb-2">{it.name}</h6>
                  <p className="text-muted small mb-3" style={{ minHeight: '40px' }}>
                    {it.description}
                  </p>

                  {it.lastSyncTime && (
                    <div className="text-muted small mt-2">
                      Last Synced: <span className="fw-semibold text-dark">{it.lastSyncTime}</span>
                    </div>
                  )}
                </div>

                <div className="card-footer bg-white border-top p-3 d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                    onClick={() => setConfiguring(it)}
                  >
                    <BiCog /> Configure
                  </button>
                  <button
                    className={`btn btn-sm ${it.isConnected ? 'btn-outline-danger' : 'btn-primary'}`}
                    onClick={() => handleToggleConnection(it.id)}
                  >
                    {it.isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Modal */}
        {configuring && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleSaveConfig}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Configure {configuring.name}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setConfiguring(null)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Merchant / Store ID</label>
                      <input
                        type="text"
                        className="form-control form-control-sm font-monospace"
                        value={merchantId}
                        onChange={(e) => setMerchantId(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">API Key / Access Token</label>
                      <input
                        type="password"
                        className="form-control form-control-sm font-monospace"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-0">
                      <label className="form-label small fw-semibold">Webhook Callback Endpoint</label>
                      <input
                        type="text"
                        className="form-control form-control-sm font-monospace"
                        value={webhookUrl}
                        readOnly
                      />
                      <div className="text-muted small mt-1">
                        Paste this URL into your partner merchant dashboard to receive real-time updates.
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setConfiguring(null)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Validate & Save Connection
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
