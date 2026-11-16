'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_FRAUD_ALERTS } from '@/data/saasData';
import { FraudAlertRecord } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiShieldQuarter,
  BiError,
  BiCheckCircle,
  BiSearch,
  BiReceipt,
  BiUser,
  BiTimeFive,
  BiDollarCircle,
  BiInfoCircle,
} from 'react-icons/bi';

export default function BusinessOwnerFraudDetectionPage() {
  const [alerts, setAlerts] = useState<FraudAlertRecord[]>(SAMPLE_FRAUD_ALERTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [selectedAlert, setSelectedAlert] = useState<FraudAlertRecord | null>(null);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchSearch =
        a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.cashierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.orderNumber && a.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchSev = severityFilter === 'All' || a.severity === severityFilter;
      return matchSearch && matchSev;
    });
  }, [alerts, searchTerm, severityFilter]);

  const criticalCount = useMemo(
    () => alerts.filter((a) => a.severity === 'Critical' && a.status !== 'Cleared').length,
    [alerts]
  );

  const totalAtRisk = useMemo(
    () => alerts.filter((a) => a.status !== 'Cleared').reduce((acc, a) => acc + a.amount, 0),
    [alerts]
  );

  const handleUpdateStatus = (id: string, newStatus: FraudAlertRecord['status']) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    if (selectedAlert?.id === id) {
      setSelectedAlert({ ...selectedAlert, status: newStatus });
    }
  };

  const getSeverityBadge = (s: FraudAlertRecord['severity']) => {
    switch (s) {
      case 'Critical':
        return <span className="badge bg-danger text-white"><BiError className="me-1" />Critical Risk</span>;
      case 'Warning':
        return <span className="badge bg-warning text-dark">Warning</span>;
      case 'Low':
        return <span className="badge bg-secondary-subtle text-dark border">Low Variance</span>;
    }
  };

  const getStatusBadge = (st: FraudAlertRecord['status']) => {
    switch (st) {
      case 'Flagged':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Flagged</span>;
      case 'Investigating':
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"><BiTimeFive className="me-1" />Investigating</span>;
      case 'Cleared':
        return <span className="badge bg-success-subtle text-success border border-success-subtle"><BiCheckCircle className="me-1" />Cleared</span>;
    }
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Loss Prevention & Cashier Fraud Detection</h1>
            <p className="text-muted small mb-0">
              Automated surveillance monitoring voided bills after payment, unapproved manual discounts, cash register shortages, and deleted KOT items.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Active High Risk Incidents</span>
                <span className="p-2 rounded bg-danger-subtle text-danger">
                  <BiError size={20} />
                </span>
              </div>
              <h3 className="fw-bold text-danger mb-1">{criticalCount} Critical Alerts</h3>
              <span className="text-danger small fw-medium">Requires owner / manager review</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Total Financial Exposure</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiDollarCircle size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(totalAtRisk)}</h3>
              <span className="text-muted small">At-risk cashier variance & voided sums</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Surveillance Audit Status</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiCheckCircle size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">100% Audited</h3>
              <span className="text-success small fw-medium">Real-time KOT & register webhook active</span>
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
                    placeholder="Search by cashier, incident description, or order #..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
                {['All', 'Critical', 'Warning', 'Low'].map((sev) => (
                  <button
                    key={sev}
                    className={`btn btn-sm ${
                      severityFilter === sev ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setSeverityFilter(sev)}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th className="ps-3 py-3">Timestamp</th>
                    <th>Anomaly Category</th>
                    <th>Severity</th>
                    <th>Description</th>
                    <th>Staff / Cashier</th>
                    <th>Order Ref</th>
                    <th>Impact Amount</th>
                    <th>Audit Status</th>
                    <th className="text-end pe-3">Action</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {filteredAlerts.map((a) => (
                    <tr key={a.id}>
                      <td className="ps-3 text-muted" style={{ whiteSpace: 'nowrap' }}>
                        {a.timestamp}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {a.type}
                        </span>
                      </td>
                      <td>{getSeverityBadge(a.severity)}</td>
                      <td style={{ maxWidth: '300px' }}>{a.description}</td>
                      <td className="fw-semibold text-dark">{a.cashierName}</td>
                      <td>{a.orderNumber ? <span className="font-monospace text-primary">{a.orderNumber}</span> : '-'}</td>
                      <td className="fw-bold text-dark" suppressHydrationWarning>₹{formatNumber(a.amount)}</td>
                      <td>{getStatusBadge(a.status)}</td>
                      <td className="text-end pe-3">
                        <button
                          className="btn btn-outline-primary btn-sm px-2 py-0"
                          onClick={() => setSelectedAlert(a)}
                        >
                          Audit Log
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedAlert && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header border-bottom">
                  <div>
                    <h5 className="modal-title fw-bold mb-0">Audit Review: {selectedAlert.type}</h5>
                    <div className="text-muted small">{selectedAlert.timestamp}</div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedAlert(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>{getSeverityBadge(selectedAlert.severity)}</div>
                    <div>{getStatusBadge(selectedAlert.status)}</div>
                  </div>

                  <p className="text-dark small mb-3">
                    {selectedAlert.description}
                  </p>

                  <div className="list-group list-group-flush border-top border-bottom mb-3 small">
                    <div className="list-group-item d-flex justify-content-between px-0 py-2">
                      <span className="text-muted">Staff Member</span>
                      <span className="fw-bold">{selectedAlert.cashierName}</span>
                    </div>
                    {selectedAlert.orderNumber && (
                      <div className="list-group-item d-flex justify-content-between px-0 py-2">
                        <span className="text-muted">Associated Bill Number</span>
                        <span className="font-monospace">{selectedAlert.orderNumber}</span>
                      </div>
                    )}
                    <div className="list-group-item d-flex justify-content-between px-0 py-2">
                      <span className="text-muted">Discrepancy Amount</span>
                      <span className="fw-bold text-danger" suppressHydrationWarning>₹{formatNumber(selectedAlert.amount)}</span>
                    </div>
                  </div>

                  <div className="alert alert-light border small text-muted mb-0">
                    <BiInfoCircle className="me-1 text-primary" />
                    Managers can either mark this transaction as Authorized (e.g. valid customer compensation) or escalate for register investigation.
                  </div>
                </div>
                <div className="modal-footer border-top d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedAlert(null)}
                  >
                    Close
                  </button>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() => handleUpdateStatus(selectedAlert.id, 'Investigating')}
                    >
                      Mark Under Investigation
                    </button>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateStatus(selectedAlert.id, 'Cleared')}
                    >
                      Authorize & Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
