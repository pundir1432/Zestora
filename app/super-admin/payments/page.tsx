'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_PAYMENT_TRANSACTIONS } from '@/data/saasData';
import { PaymentTransactionRecord } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiCreditCard,
  BiCheckCircle,
  BiXCircle,
  BiTimeFive,
  BiSearch,
  BiFilterAlt,
  BiDownload,
  BiReceipt,
  BiInfoCircle,
} from 'react-icons/bi';

export default function SuperAdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransactionRecord | null>(null);

  const filteredTxns = useMemo(() => {
    return SAMPLE_PAYMENT_TRANSACTIONS.filter((t) => {
      const matchSearch =
        t.txnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchGateway = gatewayFilter === 'all' || t.gateway === gatewayFilter;
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchSearch && matchGateway && matchStatus;
    });
  }, [searchTerm, gatewayFilter, statusFilter]);

  const totalVolume = useMemo(
    () => SAMPLE_PAYMENT_TRANSACTIONS.filter((t) => t.status === 'Success').reduce((acc, t) => acc + t.amount, 0),
    []
  );

  const totalFees = useMemo(
    () => SAMPLE_PAYMENT_TRANSACTIONS.filter((t) => t.status === 'Success').reduce((acc, t) => acc + t.feeDeducted, 0),
    []
  );

  const totalPayouts = useMemo(
    () => SAMPLE_PAYMENT_TRANSACTIONS.filter((t) => t.status === 'Success').reduce((acc, t) => acc + t.netPayout, 0),
    []
  );

  const successRate = useMemo(() => {
    const total = SAMPLE_PAYMENT_TRANSACTIONS.length;
    if (total === 0) return 100;
    const successes = SAMPLE_PAYMENT_TRANSACTIONS.filter((t) => t.status === 'Success').length;
    return Math.round((successes / total) * 100);
  }, []);

  const getStatusBadge = (status: PaymentTransactionRecord['status']) => {
    switch (status) {
      case 'Success':
        return <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"><BiCheckCircle className="me-1" />Success</span>;
      case 'Failed':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1"><BiXCircle className="me-1" />Failed</span>;
      case 'Refunded':
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1"><BiInfoCircle className="me-1" />Refunded</span>;
      case 'Processing':
        return <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1"><BiTimeFive className="me-1" />Processing</span>;
    }
  };

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Platform Payment Gateways & Settlements</h1>
            <p className="text-muted small mb-0">
              Real-time audit log of SaaS tenant subscription billings, marketplace micro-transactions, and gateway fee reconciliations.
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
              onClick={() => alert('Exporting platform payment transactions as CSV...')}
            >
              <BiDownload /> Export Statement
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Processed Volume</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiCreditCard size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(totalVolume)}</h3>
              <span className="text-success small fw-medium">+18.4% vs last 30 days</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Net Tenant Payouts</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiCheckCircle size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(Math.round(totalPayouts))}</h3>
              <span className="text-muted small">Auto-settled via NEFT / IMPS</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Gateway Tech Fees</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiReceipt size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(Math.round(totalFees))}</h3>
              <span className="text-muted small">Avg. 1.95% + GST commission</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Gateway Success Rate</span>
                <span className="p-2 rounded bg-info-subtle text-info">
                  <BiTimeFive size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{successRate}%</h3>
              <span className="text-success small fw-medium">Razorpay & Stripe SLA Healthy</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-5">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <BiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by Txn ID, Restaurant name, or Owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-6 col-md-3">
                <select
                  className="form-select form-select-sm"
                  value={gatewayFilter}
                  onChange={(e) => setGatewayFilter(e.target.value)}
                >
                  <option value="all">All Gateways</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="Stripe">Stripe</option>
                  <option value="Cashfree">Cashfree</option>
                  <option value="UPI AutoPay">UPI AutoPay</option>
                </select>
              </div>
              <div className="col-6 col-md-3">
                <select
                  className="form-select form-select-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Success">Success</option>
                  <option value="Processing">Processing</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <div className="col-12 col-md-1 d-flex justify-content-end">
                <button
                  className="btn btn-outline-secondary btn-sm w-100"
                  onClick={() => {
                    setSearchTerm('');
                    setGatewayFilter('all');
                    setStatusFilter('all');
                  }}
                  title="Reset Filters"
                >
                  <BiFilterAlt /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th className="ps-3 py-3">Txn Reference</th>
                    <th>Tenant Restaurant</th>
                    <th>Gateway & Method</th>
                    <th>Gross Amount</th>
                    <th>Gateway Fee</th>
                    <th>Net Payout</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                    <th className="text-end pe-3">Action</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {filteredTxns.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-5 text-muted">
                        No transactions found matching your search and filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredTxns.map((txn) => (
                      <tr key={txn.id}>
                        <td className="ps-3 fw-bold text-dark font-monospace">{txn.txnNumber}</td>
                        <td>
                          <div className="fw-semibold text-dark">{txn.restaurantName}</div>
                          <div className="text-muted small">{txn.ownerName}</div>
                        </td>
                        <td>
                          <span className="badge bg-secondary-subtle text-dark border me-1">
                            {txn.gateway}
                          </span>
                          <span className="text-muted d-block small mt-1">{txn.customerMethod}</span>
                        </td>
                        <td className="fw-bold text-dark" suppressHydrationWarning>
                          ₹{formatNumber(txn.amount)}
                        </td>
                        <td className="text-muted" suppressHydrationWarning>
                          ₹{formatCurrency(txn.feeDeducted)}
                        </td>
                        <td className="fw-semibold text-success" suppressHydrationWarning>
                          ₹{formatCurrency(txn.netPayout)}
                        </td>
                        <td>{getStatusBadge(txn.status)}</td>
                        <td>
                          <div>{txn.date}</div>
                          <div className="text-muted small">{txn.time}</div>
                        </td>
                        <td className="text-end pe-3">
                          <button
                            className="btn btn-outline-primary btn-sm px-2 py-1"
                            onClick={() => setSelectedTxn(txn)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Transaction Detail Modal */}
        {selectedTxn && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold">Transaction Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedTxn(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="text-center mb-3">
                    <div className="display-6 fw-bold text-dark mb-1" suppressHydrationWarning>
                      ₹{formatNumber(selectedTxn.amount)}
                    </div>
                    <div>{getStatusBadge(selectedTxn.status)}</div>
                  </div>

                  <div className="list-group list-group-flush border-top border-bottom mb-3 small">
                    <div className="list-group-item d-flex justify-content-between px-0 py-2">
                      <span className="text-muted">Transaction ID</span>
                      <span className="font-monospace fw-semibold">{selectedTxn.txnNumber}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between px-0 py-2">
                      <span className="text-muted">Tenant Restaurant</span>
                      <span className="fw-semibold">{selectedTxn.restaurantName}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between px-0 py-2">
                      <span className="text-muted">Owner Name</span>
                      <span>{selectedTxn.ownerName}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between px-0 py-2">
                      <span className="text-muted">Payment Gateway</span>
                      <span className="badge bg-secondary-subtle text-dark border">{selectedTxn.gateway}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between px-0 py-2">
                      <span className="text-muted">Payment Method</span>
                      <span>{selectedTxn.customerMethod}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between px-0 py-2">
                      <span className="text-muted">Gateway Fee Deducted</span>
                      <span className="text-danger" suppressHydrationWarning>₹{formatCurrency(selectedTxn.feeDeducted)}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between px-0 py-2">
                      <span className="text-muted">Net Settled to Tenant</span>
                      <span className="text-success fw-bold" suppressHydrationWarning>₹{formatCurrency(selectedTxn.netPayout)}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between px-0 py-2">
                      <span className="text-muted">Timestamp</span>
                      <span>{selectedTxn.date} at {selectedTxn.time}</span>
                    </div>
                  </div>

                  <div className="alert alert-light border small text-muted mb-0">
                    <BiInfoCircle className="me-1 text-primary" />
                    Settlement timeline: T+1 business day into the tenant’s registered bank account. Gateway reference token verified on webhook signature.
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedTxn(null)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      alert(`Receipt generated for ${selectedTxn.txnNumber}`);
                      setSelectedTxn(null);
                    }}
                  >
                    <BiDownload className="me-1" /> Download Webhook JSON
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
