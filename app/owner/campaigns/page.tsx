'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_MARKETING_CAMPAIGNS } from '@/data/saasData';
import { MarketingCampaignRecord } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiBroadcast,
  BiPlus,
  BiMessageRoundedDots,
  BiMailSend,
  BiTrendingUp,
  BiCheckCircle,
  BiTimeFive,
  BiSearch,
  BiDollarCircle,
  BiGroup,
} from 'react-icons/bi';

export default function BusinessOwnerCampaignsPage() {
  const [campaigns, setCampaigns] = useState<MarketingCampaignRecord[]>(SAMPLE_MARKETING_CAMPAIGNS);
  const [channelFilter, setChannelFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Campaign Form
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState<MarketingCampaignRecord['channel']>('WhatsApp');
  const [segment, setSegment] = useState<MarketingCampaignRecord['audienceSegment']>('All Customers');
  const [scheduledDate, setScheduledDate] = useState('2026-11-20');
  const [message, setMessage] = useState('Hey Foodie! Craving delicious bites? Order today and get flat 20% off. Use code CELEBRATE20.');

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchChannel = channelFilter === 'All' || c.channel === channelFilter;
      return matchChannel;
    });
  }, [campaigns, channelFilter]);

  const totalRevenue = useMemo(
    () => campaigns.reduce((acc, c) => acc + c.revenueGenerated, 0),
    [campaigns]
  );

  const totalConverted = useMemo(
    () => campaigns.reduce((acc, c) => acc + c.convertedOrders, 0),
    [campaigns]
  );

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCamp: MarketingCampaignRecord = {
      id: `cmp-${Date.now()}`,
      title,
      channel,
      audienceSegment: segment,
      scheduledDate,
      sentCount: 1450,
      deliveredCount: 1420,
      convertedOrders: 0,
      revenueGenerated: 0,
      status: 'Scheduled',
      messagePreview: message,
    };

    setCampaigns([newCamp, ...campaigns]);
    setShowAddModal(false);
    setTitle('');
  };

  const getChannelBadge = (ch: MarketingCampaignRecord['channel']) => {
    switch (ch) {
      case 'WhatsApp':
        return <span className="badge bg-success-subtle text-success border border-success-subtle"><BiMessageRoundedDots className="me-1" />WhatsApp</span>;
      case 'SMS':
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle"><BiBroadcast className="me-1" />SMS Broadcast</span>;
      case 'Email':
        return <span className="badge bg-info-subtle text-info border border-info-subtle"><BiMailSend className="me-1" />Email Newsletter</span>;
    }
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Customer Marketing & Automated Broadcasts</h1>
            <p className="text-muted small mb-0">
              Run targeted WhatsApp, SMS, and Email promotions to dormant diners, high spenders, and festive crowds.
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <BiPlus size={18} /> Launch New Campaign
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Direct Campaign Revenue</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiDollarCircle size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(totalRevenue)}</h3>
              <span className="text-success small fw-medium">Estimated 8.4x return on marketing spend</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Direct Converted Orders</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiTrendingUp size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>{formatNumber(totalConverted)} orders</h3>
              <span className="text-muted small">Via tracked promo discount codes</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Average Delivery Rate</span>
                <span className="p-2 rounded bg-info-subtle text-info">
                  <BiCheckCircle size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">97.8%</h3>
              <span className="text-muted small">Official Meta WhatsApp Cloud API verified</span>
            </div>
          </div>
        </div>

        {/* Channel Filters */}
        <div className="d-flex gap-2 mb-4">
          {['All', 'WhatsApp', 'SMS', 'Email'].map((ch) => (
            <button
              key={ch}
              className={`btn btn-sm ${
                channelFilter === ch ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => setChannelFilter(ch)}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Campaign Cards */}
        <div className="row g-3">
          {filteredCampaigns.map((c) => (
            <div key={c.id} className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm rounded-3 bg-white h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      {getChannelBadge(c.channel)}
                      <span className="badge bg-light text-dark border ms-2">
                        <BiGroup className="me-1" /> {c.audienceSegment}
                      </span>
                      <h5 className="fw-bold text-dark mt-2 mb-1">{c.title}</h5>
                    </div>
                    <span
                      className={`badge ${
                        c.status === 'Sent'
                          ? 'bg-success-subtle text-success'
                          : c.status === 'Scheduled'
                          ? 'bg-warning-subtle text-warning-emphasis'
                          : 'bg-secondary-subtle text-dark'
                      } border`}
                    >
                      {c.status}
                    </span>
                  </div>

                  {/* Message preview bubble */}
                  <div className="p-3 bg-light rounded-2 my-3 small border-start border-3 border-success font-monospace">
                    {c.messagePreview}
                  </div>

                  {/* Performance stats */}
                  <div className="row g-2 text-center small border-top pt-3">
                    <div className="col-3">
                      <div className="text-muted">Delivered</div>
                      <div className="fw-bold text-dark" suppressHydrationWarning>{formatNumber(c.deliveredCount)}</div>
                    </div>
                    <div className="col-3">
                      <div className="text-muted">Orders</div>
                      <div className="fw-bold text-primary" suppressHydrationWarning>{formatNumber(c.convertedOrders)}</div>
                    </div>
                    <div className="col-3">
                      <div className="text-muted">Revenue</div>
                      <div className="fw-bold text-success" suppressHydrationWarning>₹{formatNumber(c.revenueGenerated)}</div>
                    </div>
                    <div className="col-3">
                      <div className="text-muted">Broadcast Date</div>
                      <div className="fw-semibold text-dark">{c.scheduledDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Create Campaign */}
        {showAddModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleCreateCampaign}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Launch Marketing Campaign</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Campaign Title *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Weekend Biryani Feast Flat 20% Off"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Channel</label>
                        <select
                          className="form-select form-select-sm"
                          value={channel}
                          onChange={(e) => setChannel(e.target.value as MarketingCampaignRecord['channel'])}
                        >
                          <option value="WhatsApp">WhatsApp (Official Cloud API)</option>
                          <option value="SMS">SMS Gateway</option>
                          <option value="Email">Email</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Audience Segment</label>
                        <select
                          className="form-select form-select-sm"
                          value={segment}
                          onChange={(e) => setSegment(e.target.value as MarketingCampaignRecord['audienceSegment'])}
                        >
                          <option value="All Customers">All Customers (3,400+)</option>
                          <option value="VIP & High Spenders">VIP & High Spenders (408)</option>
                          <option value="Inactive (30+ Days)">Inactive 30+ Days (940)</option>
                          <option value="Biryani Lovers">Biryani Lovers (1,250)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Broadcast Date</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                    </div>

                    <div className="mb-0">
                      <label className="form-label small fw-semibold">Message Body</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Schedule Broadcast
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
