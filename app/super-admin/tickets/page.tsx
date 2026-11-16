'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SAMPLE_SUPPORT_TICKETS } from '@/data/saasData';
import { SupportTicket } from '@/types/saas';
import { Modal } from '@/components/common/Modal';
import {
  BiSupport,
  BiSearch,
  BiMessageDetail,
  BiTime,
  BiCheckCircle,
  BiErrorCircle,
  BiSend,
  BiStore,
  BiUser,
} from 'react-icons/bi';

export default function SuperAdminTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(SAMPLE_SUPPORT_TICKETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [modalStatus, setModalStatus] = useState<'Open' | 'In Progress' | 'Resolved'>('Open');

  // Filtering
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Metrics
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  const handleOpenTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setModalStatus(ticket.status);
    setReplyText('');
    setIsReplyModalOpen(true);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'admin' as const,
      senderName: 'Antigravity SaaS Lead Support',
      message: replyText.trim(),
      timestamp: 'Just now',
    };

    const updatedTickets = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: modalStatus,
          updatedAt: 'Just now',
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setSelectedTicket({
      ...selectedTicket,
      status: modalStatus,
      updatedAt: 'Just now',
      messages: [...selectedTicket.messages, newMsg],
    });
    setReplyText('');
  };

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Tenant Support Tickets & SLA</h4>
          <p className="text-muted-custom small mb-0">
            Cross-tenant issue resolution desk, hardware & printer troubleshooting, and escalation tracker
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Open Escalations</span>
              <h3 className="fw-bold text-danger mb-0">{openCount}</h3>
              <span className="text-danger small fw-medium" style={{ fontSize: '11px' }}>
                Requires prompt response
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-danger bg-opacity-10 text-danger"
              style={{ width: '48px', height: '48px' }}
            >
              <BiErrorCircle size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">In Investigation</span>
              <h3 className="fw-bold text-warning mb-0">{inProgressCount}</h3>
              <span className="text-muted-custom small" style={{ fontSize: '11px' }}>
                Assigned to engineers
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-warning bg-opacity-10 text-warning"
              style={{ width: '48px', height: '48px' }}
            >
              <BiTime size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Resolved Tickets</span>
              <h3 className="fw-bold text-success mb-0">{resolvedCount}</h3>
              <span className="text-success small fw-medium" style={{ fontSize: '11px' }}>
                98.4% CSAT Rating
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-success"
              style={{ width: '48px', height: '48px' }}
            >
              <BiCheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="app-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted-custom small d-block">Avg First Response Time</span>
              <h3 className="fw-bold text-navy mb-0">14 Mins</h3>
              <span className="text-success small fw-medium" style={{ fontSize: '11px' }}>
                Under 30 min SLA
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand bg-opacity-10 text-brand"
              style={{ width: '48px', height: '48px' }}
            >
              <BiSupport size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="app-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-subtle text-muted-custom">
                <BiSearch size={16} />
              </span>
              <input
                type="text"
                className="form-control border-subtle shadow-none"
                placeholder="Search ticket #, subject, restaurant or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-4 col-md-2">
            <select
              className="form-select form-select-sm border-subtle shadow-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="col-4 col-md-3">
            <select
              className="form-select form-select-sm border-subtle shadow-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Hardware & Printer">Hardware & Printer</option>
              <option value="POS & Billing">POS & Billing</option>
              <option value="KOT & Kitchen">KOT & Kitchen</option>
              <option value="Account & Billing">Account & Billing</option>
            </select>
          </div>

          <div className="col-4 col-md-2">
            <select
              className="form-select form-select-sm border-subtle shadow-none"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="col-12 col-md-1 text-md-end">
            <span className="badge bg-light text-navy border">
              {filteredTickets.length} Issues
            </span>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-surface border-bottom border-subtle">
              <tr>
                <th className="text-muted-custom small py-3 ps-3">TICKET #</th>
                <th className="text-muted-custom small py-3">SUBJECT</th>
                <th className="text-muted-custom small py-3">TENANT</th>
                <th className="text-muted-custom small py-3">CATEGORY</th>
                <th className="text-muted-custom small py-3 text-center">PRIORITY</th>
                <th className="text-muted-custom small py-3 text-center">STATUS</th>
                <th className="text-muted-custom small py-3">LAST ACTIVITY</th>
                <th className="text-muted-custom small py-3 text-end pe-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t) => (
                <tr key={t.id}>
                  <td className="ps-3 font-monospace small fw-bold text-navy">{t.ticketNumber}</td>
                  <td>
                    <div className="fw-semibold text-navy text-truncate" style={{ maxWidth: '300px' }}>
                      {t.subject}
                    </div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      Opened {t.createdAt}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1 text-navy fw-medium">
                      <BiStore className="text-brand flex-shrink-0" size={15} />
                      <span>{t.restaurantName}</span>
                    </div>
                    <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                      {t.ownerName}
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-navy border" style={{ fontSize: '11px' }}>
                      {t.category}
                    </span>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge rounded-pill ${
                        t.priority === 'High'
                          ? 'bg-danger text-white'
                          : t.priority === 'Medium'
                          ? 'bg-warning text-dark'
                          : 'bg-secondary text-white'
                      }`}
                      style={{ fontSize: '11px' }}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge rounded-pill ${
                        t.status === 'Open'
                          ? 'badge-soft-danger'
                          : t.status === 'In Progress'
                          ? 'badge-soft-warning'
                          : 'badge-soft-success'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="small text-muted-custom">{t.updatedAt}</td>
                  <td className="text-end pe-3">
                    <button
                      type="button"
                      className="btn btn-outline-brand btn-sm d-inline-flex align-items-center gap-1 py-1"
                      onClick={() => handleOpenTicket(t)}
                    >
                      <BiMessageDetail size={15} />
                      <span>Respond</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted-custom">
                    No tickets found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Reply Modal */}
      <Modal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        title="Support Ticket Desk"
        subtitle={selectedTicket ? `${selectedTicket.ticketNumber}: ${selectedTicket.subject}` : ''}
        size="lg"
      >
        {selectedTicket && (
          <div>
            {/* Meta bar */}
            <div className="p-3 bg-surface rounded-3 border border-subtle mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <span className="small text-muted-custom d-block">Tenant & Restaurant:</span>
                <strong className="text-navy">{selectedTicket.restaurantName}</strong> ({selectedTicket.ownerName})
              </div>
              <div>
                <span className="small text-muted-custom d-block">Category:</span>
                <span className="badge bg-light text-navy border">{selectedTicket.category}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div>
                  <span className="small text-muted-custom d-block">Update Status:</span>
                  <select
                    className="form-select form-select-sm border-subtle shadow-none"
                    value={modalStatus}
                    onChange={(e: any) => setModalStatus(e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Conversation Log */}
            <div
              className="p-3 border border-subtle rounded-3 bg-white mb-3 d-flex flex-column gap-3 overflow-y-auto"
              style={{ maxHeight: '320px' }}
            >
              {selectedTicket.messages.map((m) => {
                const isAdmin = m.sender === 'admin';
                return (
                  <div
                    key={m.id}
                    className={`d-flex flex-column ${isAdmin ? 'align-items-end' : 'align-items-start'}`}
                  >
                    <div className="d-flex align-items-center gap-1 mb-1">
                      <span className="fw-semibold small text-navy">{m.senderName}</span>
                      <span className="text-muted-custom" style={{ fontSize: '10px' }}>
                        • {m.timestamp}
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-3 small ${
                        isAdmin
                          ? 'bg-brand text-white'
                          : 'bg-surface text-navy border border-subtle'
                      }`}
                      style={{ maxWidth: '85%' }}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-navy">
                  Post Administrative Response or Solution
                </label>
                <textarea
                  rows={3}
                  className="form-control form-control-sm border-subtle"
                  placeholder="Type troubleshooting advice, configuration fix, or status update..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setIsReplyModalOpen(false)}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-brand btn-sm d-flex align-items-center gap-1">
                  <BiSend size={16} /> Send Reply & Save Status
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
