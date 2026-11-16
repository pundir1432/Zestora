'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_CUSTOMER_FEEDBACK } from '@/data/saasData';
import { CustomerFeedbackRecord } from '@/types/saas';
import {
  BiStar,
  BiMessageSquareDetail,
  BiTrendingUp,
  BiSearch,
  BiReply,
  BiCheckCircle,
  BiPhone,
  BiReceipt,
  BiHeart,
} from 'react-icons/bi';

export default function BusinessOwnerFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<CustomerFeedbackRecord[]>(SAMPLE_CUSTOMER_FEEDBACK);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'All' | 'Positive' | 'Neutral' | 'Negative'>('All');
  const [replyingTo, setReplyingTo] = useState<CustomerFeedbackRecord | null>(null);
  const [replyText, setReplyText] = useState('');
  const [googleSyncEnabled, setGoogleSyncEnabled] = useState(true);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((fb) => {
      const matchSearch =
        fb.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSentiment = sentimentFilter === 'All' || fb.sentiment === sentimentFilter;
      return matchSearch && matchSentiment;
    });
  }, [feedbacks, searchTerm, sentimentFilter]);

  const avgRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, fb) => acc + fb.overallRating, 0);
    return (sum / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  const positivePercent = useMemo(() => {
    const total = feedbacks.length;
    if (total === 0) return 100;
    const pos = feedbacks.filter((fb) => fb.sentiment === 'Positive').length;
    return Math.round((pos / total) * 100);
  }, [feedbacks]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyText.trim()) return;

    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === replyingTo.id ? { ...fb, staffReply: replyText } : fb
      )
    );
    alert(`Reply sent to ${replyingTo.guestName} via WhatsApp/SMS!`);
    setReplyingTo(null);
    setReplyText('');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="d-inline-flex align-items-center text-warning">
        {[1, 2, 3, 4, 5].map((star) => (
          <BiStar
            key={star}
            style={{
              opacity: star <= rating ? 1 : 0.25,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Guest Feedback & Review Ratings</h1>
            <p className="text-muted small mb-0">
              Collect post-meal ratings via digital bill links, monitor dining sentiment, and protect your Google Maps reputation.
            </p>
          </div>
          <div className="d-flex align-items-center gap-3 bg-white p-2 px-3 rounded shadow-sm border">
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                checked={googleSyncEnabled}
                onChange={(e) => setGoogleSyncEnabled(e.target.checked)}
              />
              <label className="form-check-label small fw-semibold">
                Google Review 5★ Booster
              </label>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Overall Guest Rating</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiStar size={20} />
                </span>
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <h2 className="fw-bold mb-0">{avgRating}</h2>
                <span className="text-muted">/ 5.0</span>
                <div className="ms-2">{renderStars(Math.round(Number(avgRating)))}</div>
              </div>
              <span className="text-muted small mt-2 d-block">Based on 148 verified dining receipts</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Positive Dining Sentiment</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiHeart size={20} />
                </span>
              </div>
              <h2 className="fw-bold mb-0 text-success">{positivePercent}%</h2>
              <span className="text-success small fw-medium">+6% increase in guest satisfaction</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Net Promoter Score (NPS)</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiTrendingUp size={20} />
                </span>
              </div>
              <h2 className="fw-bold mb-0 text-primary">+68</h2>
              <span className="text-muted small">World-class hospitality benchmark (&gt;50)</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-6">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <BiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search comments, guest name, or order #..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
                {(['All', 'Positive', 'Neutral', 'Negative'] as const).map((sent) => (
                  <button
                    key={sent}
                    className={`btn btn-sm ${
                      sentimentFilter === sent ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setSentimentFilter(sent)}
                  >
                    {sent}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feedbacks Grid */}
        <div className="row g-3">
          {filteredFeedbacks.map((fb) => (
            <div key={fb.id} className="col-12 col-md-6">
              <div className="card border-0 shadow-sm rounded-3 bg-white h-100 d-flex flex-column">
                <div className="card-body p-4 flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold text-dark mb-0">{fb.guestName}</h5>
                      <div className="text-muted small d-flex align-items-center gap-2 mt-1">
                        <span><BiReceipt /> {fb.orderNumber}</span>
                        <span>•</span>
                        <span><BiPhone /> {fb.phone}</span>
                        <span>•</span>
                        <span>{fb.date}</span>
                      </div>
                    </div>
                    <div className="text-end">
                      {renderStars(fb.overallRating)}
                      <span
                        className={`badge ms-2 ${
                          fb.sentiment === 'Positive'
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : fb.sentiment === 'Neutral'
                            ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                            : 'bg-danger-subtle text-danger border border-danger-subtle'
                        }`}
                      >
                        {fb.sentiment}
                      </span>
                    </div>
                  </div>

                  {/* Rating Breakdown Pill Bar */}
                  <div className="d-flex gap-3 small text-muted my-2 p-2 bg-light rounded">
                    <span>Food: <strong>{fb.foodRating}/5</strong></span>
                    <span>•</span>
                    <span>Service: <strong>{fb.serviceRating}/5</strong></span>
                    <span>•</span>
                    <span>Ambiance: <strong>{fb.ambianceRating}/5</strong></span>
                  </div>

                  <p className="text-dark small my-3 font-italic">
                    &quot;{fb.comment}&quot;
                  </p>

                  {fb.staffReply && (
                    <div className="p-3 bg-light rounded-2 border-start border-3 border-primary small">
                      <div className="fw-bold text-primary mb-1 d-flex align-items-center gap-1">
                        <BiCheckCircle /> Restaurant Response:
                      </div>
                      <div className="text-muted">{fb.staffReply}</div>
                    </div>
                  )}
                </div>

                <div className="card-footer bg-white border-top p-3 text-end">
                  {!fb.staffReply ? (
                    <button
                      className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                      onClick={() => {
                        setReplyingTo(fb);
                        setReplyText('');
                      }}
                    >
                      <BiReply /> Reply to Guest
                    </button>
                  ) : (
                    <span className="text-muted small d-inline-flex align-items-center gap-1">
                      <BiCheckCircle className="text-success" /> Replied to Diner
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Reply to Guest */}
        {replyingTo && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleSendReply}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Reply to {replyingTo.guestName}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setReplyingTo(null)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="p-3 bg-light rounded mb-3 small">
                      <div className="text-muted mb-1">Guest Comment:</div>
                      <div className="fw-medium text-dark">&quot;{replyingTo.comment}&quot;</div>
                    </div>

                    <div className="mb-0">
                      <label className="form-label small fw-semibold">Your Official Response *</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={4}
                        required
                        placeholder="Thank the diner or address their service concern..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      ></textarea>
                      <div className="text-muted small mt-1">
                        This response will be sent directly to {replyingTo.phone} via WhatsApp / SMS.
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Dispatch Reply
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
